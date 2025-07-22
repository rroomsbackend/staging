import cron from 'node-cron';
import fs from 'fs';
import moment from 'moment';
import { db } from './models';
import puppeteer from 'puppeteer';

const OUTPUT_FOLDER = './pdf_reports';

async function fetchAllPropertyRoomsOccupancy() {
    try {
        const properties = await db.PropertyMaster.findAll({
            // where: { status: 1 },
            attributes: ['id', 'name', 'propertyCode', 'noOfRooms'],
            include: [
                {
                    model: db.Rooms,
                    required: false,
                    attributes: [
                        'id', 'categoryId', 'propertyId', 'regularPrice',
                        'roomDescription', 'breakFastPrice', 'ap', 'map', 'heroImage'
                    ],
                    include: [
                        {
                            model: db.RoomDetails,
                            required: false,
                            attributes: [
                                'id', 'roomId', 'categoryId', 'floorNumber',
                                'roomNumber', 'occupancy', 'status', 'fromDate', 'toDate'
                            ]
                        }
                    ]
                }
            ]
        });

        const reportDate = moment().format('DD-MM-YYYY');  // '05-05-2025'

        for (const property of properties) {
            const categorySummary = {};
            property.Rooms.forEach(room => {
                const categoryId = room.categoryId;
                const categoryName = getCategoryName(categoryId);
                if (!categorySummary[categoryId]) {
                    categorySummary[categoryId] = { name: categoryName, 0: [], 1: [], 2: [], 3: [] };
                }
                room.RoomDetails.forEach(detail => {
                    if ([0, 1, 2, 3].includes(detail.status)) {
                        categorySummary[categoryId][detail.status].push(detail.roomNumber);
                    }
                });
            });

            for (const [categoryId, summary] of Object.entries(categorySummary)) {
                await db.PropertyOccupancySummary.create({
                    propertyId: property.id,
                    propertyCode: property.propertyCode,
                    propertyName: property.name,
                    categoryId: parseInt(categoryId),
                    categoryName: summary.name,
                    totalRooms: property.noOfRooms,
                    availableCount: summary[0].length,
                    occupiedCount: summary[1].length,
                    dirtyCount: summary[2].length,
                    blockedCount: summary[3].length,
                    roomNumbersAvailable: summary[0].join(', '),
                    roomNumbersOccupied: summary[1].join(', '),
                    roomNumbersDirty: summary[2].join(', '),
                    roomNumbersBlocked: summary[3].join(', '),
                    reportDate: reportDate
                });
            }
        }

        console.log("Summary data saved to database.");

        if (!fs.existsSync(OUTPUT_FOLDER)) {
            fs.mkdirSync(OUTPUT_FOLDER);
        }

        const htmlContent = buildHtmlTable(properties);
        const pdfPath = `${OUTPUT_FOLDER}/property_report_${Date.now()}.pdf`;
        await generatePdf(htmlContent, pdfPath);

        console.log(`PDF saved to ${pdfPath}`);
    } catch (err) {
        console.error('Error in cron fetching and saving occupancy summary:', err);
    }
}

function buildHtmlTable(properties) {
    let html = `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 12pt;
                    line-height: 1.6;
                    margin: 40px;
                    color: #333;
                }
                h2, h3 {
                    font-family: 'Times New Roman', Times, serif;
                    margin-bottom: 10px;
                }
                h2 {
                    font-size: 18pt;
                    text-align: center;
                    margin-bottom: 30px;
                }
                h3 {
                    font-size: 14pt;
                    margin-top: 20px;
                }
                p {
                    margin: 5px 0 15px 0;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 30px;
                }
                th, td {
                    border: 1px solid #444;
                    padding: 6px 10px;
                    text-align: left;
                    font-size: 11pt;
                }
                th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
        <h2>Property Occupancy Report</h2>
    `;

    properties.forEach(property => {
        html += `<h3>${property.name} (#${property.propertyCode})</h3>`;
        html += `<p>Total Rooms: ${property.noOfRooms}</p>`;
        html += `
            <table>
                <tr>
                    <th>Room Type</th>
                    <th>Status 0 (Available)</th>
                    <th>Status 1 (Occupied)</th>
                    <th>Status 2 (Dirty)</th>
                    <th>Status 3 (Blocked)</th>
                </tr>
        `;

        const categorySummary = {};

        property.Rooms.forEach(room => {
            const categoryId = room.categoryId;
            const categoryName = `Category ${categoryId} (${getCategoryName(categoryId)})`;

            if (!categorySummary[categoryName]) {
                categorySummary[categoryName] = { 0: [], 1: [], 2: [], 3: [] };
            }
            room.RoomDetails.forEach(detail => {
                if ([0, 1, 2, 3].includes(detail.status)) {
                    categorySummary[categoryName][detail.status].push(detail.roomNumber);
                }
            });
        });

        Object.entries(categorySummary).forEach(([category, statusMap]) => {
            html += `
                <tr>
                    <td>${category}</td>
                    <td>${statusMap[0].length} (${statusMap[0].length > 0 ? statusMap[0].join(', ') : '-'})</td>
                    <td>${statusMap[1].length} (${statusMap[1].length > 0 ? statusMap[1].join(', ') : '-'})</td>
                    <td>${statusMap[2].length} (${statusMap[2].length > 0 ? statusMap[2].join(', ') : '-'})</td>
                    <td>${statusMap[3].length} (${statusMap[3].length > 0 ? statusMap[3].join(', ') : '-'})</td>
                </tr>
            `;
        });

        html += `</table>`;
    });

    html += `</body></html>`;
    return html;
}

function getCategoryName(categoryId) {
    const categoryMap = {
        1: 'Executive',
        2: 'Deluxe',
        3: 'Suite'
        // Add more mappings if you have additional categories
    };
    return categoryMap[categoryId] || `Category ${categoryId}`;
}

async function generatePdf(htmlContent, outputPath) {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
            top: '25mm',
            bottom: '25mm',
            left: '20mm',
            right: '20mm'
        },
        printBackground: true
    });
    await browser.close();
}

// Schedule to run at 23:59 daily
cron.schedule('59 23 * * *', async () => {
    //cron.schedule('* * * * *', async () => {
    console.log('Cron job started: fetchAllPropertyRoomsOccupancy');
    await fetchAllPropertyRoomsOccupancy();
});
