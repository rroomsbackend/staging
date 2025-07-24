import { db } from '../../../models';
import sequelize, { NOW } from 'sequelize';
import { bookingConfirmed, cancelBooking, paymentDeclinedSms } from '../sendOtp/sendOtpApis';
import { sendMail } from '../zoptomail/zeptomail';
import { getPagination, getPagingData } from '../pagination';
import { createAtDateFormat } from '../../../utils/date-query'
import { sendBookingConfirmationGuest, sendBookingConfirmationProperty, sendBookingConfirmationRrooms, sendBookingCancelGuest, sendBookingCancelProperty, sendBookingCancelRrooms, sendBookingCompleteRrooms, sendBookingCompleteProperty, sendBookingCompleteGuest, sendBookingNoShowRrooms, sendBookingNoShowProperty, sendBookingNoShowGuest } from '../../../config/smpt'
import PDFDocument from 'pdfkit';
import { Table } from 'pdfkit-table';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
const puppeteer = require('puppeteer');
import converter from 'number-to-words'
import axios from "axios";
import ExcelJS from 'exceljs';
const { Sequelize } = db;
const Op = sequelize.Op

const generateInvoicePdf1 = async (bookingDetail, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 20 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const getValue = (val, fallback = '-') => (val !== undefined && val !== null && val !== '') ? val : fallback;

        // Header
        doc.fontSize(14).font('Helvetica-Bold').text('Invoice', { align: 'center' });
        doc.fontSize(10).font('Helvetica-Bold').text(getValue(bookingDetail.hotelName), { align: 'center' });
        doc.fontSize(9).font('Helvetica')
            .text(getValue(bookingDetail.hotelAddress), { align: 'center' })
            .text(getValue(bookingDetail.hotelEmail), { align: 'center' })
            .text(`Phone: ${getValue(bookingDetail.hotelPhone)}`, { align: 'center' });

        doc.moveDown();
        doc.moveTo(20, doc.y).lineTo(575, doc.y).stroke();

        // Basic Details Table
        doc.moveDown(0.5);
        const boxStartY = doc.y;
        const sectionHeight = 100;
        const leftX = 25;
        const rightX = 305;
        const boxWidth = 270;

        const drawBox = (x, y, w, h) => {
            doc.rect(x, y, w, h).stroke();
        };

        drawBox(leftX, boxStartY, boxWidth, sectionHeight);
        drawBox(rightX, boxStartY, boxWidth, sectionHeight);

        doc.fontSize(9).font('Helvetica');

        const leftFields = [
            `Folio No.: ${getValue(bookingDetail.folioNo)}`,
            `Invoice No.: ${getValue(bookingDetail.invoiceNo)}`,
            `Guest Name: ${getValue(bookingDetail.guestName)}`,
            `Bill To: ${getValue(bookingDetail.guestName)}`,
            `GSTIN: ${getValue(bookingDetail.gstin)}`,
            `Source of Supply: ${getValue(bookingDetail.supplySource)}`
        ];

        const rightFields = [
            `G.R. Card No.: ${getValue(bookingDetail.grCardNo)}`,
            `Date of Invoice: ${getValue(bookingDetail.bookingDate)}`,
            `Room No.: ${getValue(bookingDetail.roomNo)}`,
            `No. of Person: ${getValue(bookingDetail.adults)}`,
            `Date of Arrival: ${getValue(bookingDetail.checkInDateTime)}`,
            `Date of Departure: ${getValue(bookingDetail.checkOutDateTime)}`
        ];

        let offset = 0;
        leftFields.forEach((text, i) => {
            doc.text(text, leftX + 5, boxStartY + 5 + offset);
            doc.text(rightFields[i], rightX + 5, boxStartY + 5 + offset);
            offset += 14;
        });

        doc.moveDown(6);

        // Room Charges Table
        const tableTop = doc.y + 5;
        const rowHeight = 20;

        const tableHeaders = ['S.No', 'Particular', 'HSN/SAC', 'Qty', 'Rate', 'Total', 'Discount', 'Taxable', 'CGST', 'SGST', 'IGST'];
        const tableColWidths = [30, 100, 60, 30, 50, 50, 50, 50, 30, 30, 30];

        let colX = 25;
        tableHeaders.forEach((header, i) => {
            doc.rect(colX, tableTop, tableColWidths[i], rowHeight).fillAndStroke('#f0f0f0', '#000');
            doc.fillColor('black').font('Helvetica-Bold').fontSize(8).text(header, colX + 2, tableTop + 5, { width: tableColWidths[i] - 4, align: 'center' });
            colX += tableColWidths[i];
        }

        );

        const rowData = [
            {
                sn: '1',
                particular: 'Room Charges',
                hsn: getValue(bookingDetail.hsn, '996311'),
                qty: getValue(bookingDetail.noOfRooms, '1'),
                rate: getValue(bookingDetail.roomRate, '0'),
                total: getValue(bookingDetail.roomCharges, '0'),
                discount: getValue(bookingDetail.discount, '0'),
                taxable: getValue(bookingDetail.taxableAmount, '0'),
                cgst: getValue(bookingDetail.cgst, '0'),
                sgst: getValue(bookingDetail.sgst, '0'),
                igst: getValue(bookingDetail.igst, '0')
            }
        ];

        let dataY = tableTop + rowHeight;
        rowData.forEach(row => {
            colX = 25;
            const values = [row.sn, row.particular, row.hsn, row.qty, row.rate, row.total, row.discount, row.taxable, row.cgst, row.sgst, row.igst];
            values.forEach((val, i) => {
                doc.rect(colX, dataY, tableColWidths[i], rowHeight).stroke();
                doc.font('Helvetica').fontSize(8).fillColor('black').text(val, colX + 2, dataY + 5, { width: tableColWidths[i] - 4, align: 'center' });
                colX += tableColWidths[i];
            });
        });

        // Total Payable & Payment Details
        const payY = dataY + rowHeight + 10;
        doc.rect(25, payY, 270, 50).stroke();
        doc.font('Helvetica-Bold').text('Total Payable Amount', 30, payY + 5);
        doc.font('Helvetica').text(getValue(bookingDetail.amountInWords), 30, payY + 20);

        doc.rect(305, payY, 270, 50).stroke();
        doc.font('Helvetica-Bold').text('Total Charges(Rs):', 310, payY + 5);
        doc.font('Helvetica').text(`? ${getValue(bookingDetail.grandTotal, '0')}`, 450, payY + 5);

        doc.font('Helvetica-Bold').text('Total Payment(Rs):', 310, payY + 25);
        doc.font('Helvetica').text(`? ${getValue(bookingDetail.bookingAmount, '0')}`, 450, payY + 25);

        // Payment Box
        const paymentY = payY + 60;
        doc.rect(25, paymentY, 270, 40).stroke();
        doc.font('Helvetica-Bold').text('Payment Date', 30, paymentY + 5);
        doc.font('Helvetica').text(`${getValue(bookingDetail.paymentDate)} - ${getValue(bookingDetail.paymentMode)}`, 30, paymentY + 20);

        // Tax Table (small box)
        const taxY = paymentY + 50;
        doc.rect(25, taxY, 270, 40).stroke();
        doc.font('Helvetica-Bold').text('Tax Details', 30, taxY + 5);
        doc.font('Helvetica').text(`SGST: ?${getValue(bookingDetail.cgst, '0')} | CGST: ?${getValue(bookingDetail.sgst, '0')}`, 30, taxY + 20);

        // Footer
        const footerY = taxY + 60;
        doc.text('Remark: ', 25, footerY);
        doc.moveDown(2);
        doc.fontSize(9).text(`This Folio is in: ?`, 25);
        doc.text(`Reception: ${getValue(bookingDetail.receptionBy)}`, 25);
        doc.text(`Cashier: ${getValue(bookingDetail.cashierBy)}`, 25);
        doc.text(`Date: ${new Date().toLocaleString()}`, 25);
        doc.text(`Page: 1 of 1`, 25);
        doc.moveDown();
        doc.text('(Guest Signature)', 25);

        doc.end();

        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });
};

const generateInvoicePdfNoPupteer = async (bookingDetail, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 20 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const getValue = (val, fallback = '-') => (val !== undefined && val !== null && val !== '') ? val : fallback;

        // Calculate tax rates based on room rate
        const rate = parseFloat(getValue(bookingDetail.bookingAmout, '0'));
        let cgstRate = 0;
        let sgstRate = 0;
        let gstPercent = 0;

        if (rate > 1000 && rate <= 7500) {
            cgstRate = 6;
            sgstRate = 6;
            gstPercent = 12;
        } else if (rate > 7500) {
            cgstRate = 9;
            sgstRate = 9;
            gstPercent = 18;
        }

        const taxableAmount = rate * (bookingDetail.noOfRooms || 1);
        const cgst = taxableAmount * (cgstRate / 100);
        const sgst = taxableAmount * (sgstRate / 100);
        const totalTax = cgst + sgst;
        const grandTotal = taxableAmount + totalTax;

        // Header
        doc.fontSize(14).font('Helvetica-Bold').text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica-Bold').text(getValue(bookingDetail.hotelName), { align: 'center' });
        doc.fontSize(9).font('Helvetica')
            .text(getValue(bookingDetail.hotelAddress), { align: 'center' })
            .text(getValue(bookingDetail.hotelEmail), { align: 'center' })
            .text(`Phone: ${getValue(bookingDetail.hotelPhone)}`, { align: 'center' });
        doc.moveDown();
        doc.moveTo(20, doc.y).lineTo(575, doc.y).stroke();

        // Basic Details Table
        doc.moveDown(0.5);
        const boxStartY = doc.y;
        const sectionHeight = 100;
        const leftX = 25;
        const rightX = 305;
        const boxWidth = 270;

        const drawBox = (x, y, w, h) => {
            doc.rect(x, y, w, h).stroke();
        };

        drawBox(leftX, boxStartY, boxWidth, sectionHeight);
        drawBox(rightX, boxStartY, boxWidth, sectionHeight);

        doc.fontSize(9).font('Helvetica');

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const datePart = `${day}${month}${year}`;
        const bookingId = getValue(bookingDetail.bookingId);
        const last6 = bookingId.slice(-6);
        const folioNo = `FOLIO${datePart}${last6}`;
        const invoiceNo = `INV${datePart}${last6}`;

        const leftFields = [
            // `Folio No.: ${getValue(bookingDetail.bookingId)}`,
            // `Invoice No.: ${getValue(bookingDetail.bookingId)}`,
            `Folio No.: ${folioNo}`,
            `Invoice No.: ${invoiceNo}`,
            `Guest Name: ${getValue(bookingDetail.guestName)}`,
            `Bill To: ${getValue(bookingDetail.guestName)}`,
            `GSTIN: ${getValue(bookingDetail.gstin)}`,
            `Source of Supply: ${getValue(bookingDetail.hotelLocality)}`
        ];

        const rightFields = [
            `G.R. Card No.: GRC${getValue(bookingDetail.bookingId)}`,
            `Booking Code: ${getValue(bookingDetail.bookingId)}`,
            `Date of Invoice: ${getValue(bookingDetail.checkInDate)}`,
            `Room No.: ${getValue(bookingDetail.roomNo)}`,
            `No. of Person: ${getValue(bookingDetail.adults)}`,
            `Date of Arrival: ${getValue(bookingDetail.checkInDateTime)}`,
            `Date of Departure: ${getValue(bookingDetail.checkOutDateTime)}`
        ];

        let offset = 0;
        leftFields.forEach((text, i) => {
            doc.text(text, leftX + 5, boxStartY + 5 + offset);
            doc.text(rightFields[i], rightX + 5, boxStartY + 5 + offset);
            offset += 14;
        });

        doc.moveDown(6);

        // Room Charges Table
        const tableTop = doc.y + 5;
        const rowHeight = 20;
        const tableHeaders = ['S.No', 'Particular', 'HSN/SAC', 'Qty', 'Rate', 'Total', 'Discount', 'Taxable', 'CGST', 'SGST', 'IGST'];
        const tableColWidths = [30, 100, 60, 30, 50, 50, 50, 50, 30, 30, 30];
        let colX = 25;

        tableHeaders.forEach((header, i) => {
            doc.rect(colX, tableTop, tableColWidths[i], rowHeight).fillAndStroke('#f0f0f0', '#000');
            doc.fillColor('black').font('Helvetica-Bold').fontSize(8).text(header, colX + 2, tableTop + 5, { width: tableColWidths[i] - 4, align: 'center' });
            colX += tableColWidths[i];
        });

        const dataY = tableTop + rowHeight;
        const values = ['1', 'Room Charges', '996311', `${getValue(bookingDetail.noOfRooms, '1')}`, `${rate}`, `${taxableAmount}`, '0', `${taxableAmount}`, `${cgst.toFixed(2)}`, `${sgst.toFixed(2)}`, '0'];
        colX = 25;
        values.forEach((val, i) => {
            doc.rect(colX, dataY, tableColWidths[i], rowHeight).stroke();
            doc.font('Helvetica').fontSize(8).fillColor('black').text(val, colX + 2, dataY + 5, { width: tableColWidths[i] - 4, align: 'center' });
            colX += tableColWidths[i];
        });

        const payY = dataY + rowHeight + 10;
        doc.rect(25, payY, 270, 50).stroke();
        doc.font('Helvetica-Bold').text('Total Payable Amount', 30, payY + 5);
        doc.font('Helvetica').text(`? ${grandTotal.toFixed(2)} (Inclusive of ${gstPercent}% GST)`, 30, payY + 20);

        doc.rect(305, payY, 270, 50).stroke();
        doc.font('Helvetica-Bold').text('Total Charges(Rs):', 310, payY + 5);
        doc.font('Helvetica').text(`? ${grandTotal.toFixed(2)}`, 450, payY + 5);

        doc.font('Helvetica-Bold').text('Total Payment(Rs):', 310, payY + 25);
        doc.font('Helvetica').text(`? ${grandTotal.toFixed(2)}`, 450, payY + 25);

        const paymentY = payY + 60;
        doc.rect(25, paymentY, 270, 40).stroke();
        doc.font('Helvetica-Bold').text('Payment Date', 30, paymentY + 5);
        doc.font('Helvetica').text(`${getValue(bookingDetail.paymentDate)} - ${getValue(bookingDetail.paymentMode)}`, 30, paymentY + 20);

        const taxY = paymentY + 50;
        doc.rect(25, taxY, 270, 40).stroke();
        doc.font('Helvetica-Bold').text('Tax Details', 30, taxY + 5);
        doc.font('Helvetica').text(`SGST: ?${sgst.toFixed(2)} | CGST: ?${cgst.toFixed(2)} (${gstPercent}% GST)`, 30, taxY + 20);

        const footerY = taxY + 60;
        doc.text('Remark: ', 25, footerY);
        doc.moveDown(2);
        doc.fontSize(9).text(`This Folio is in: ?${grandTotal.toFixed(2)}`, 25);
        doc.text(`Reception: ${getValue(bookingDetail.receptionBy)}`, 25);
        doc.text(`Cashier: ${getValue(bookingDetail.cashierBy)}`, 25);
        doc.text(`Date: ${new Date().toLocaleString()}`, 25);
        doc.text(`Page: 1 of 1`, 25);
        doc.moveDown();
        doc.text('(Guest Signature)', 25);

        doc.end();

        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });
};

const generateInvoicePdf = async (bookingDetail, filePath) => {
    try {
        const PAYMENT_MODES = {
            1: 'PREPAID',
            2: 'CASH',
            3: 'CARD',
            4: 'FOC',
            5: 'UPI',
            6: 'PAYLATER',
            7: 'PREPAID_DUPLICATE'
        };
        let payments = bookingDetail?.paymentsJson;
        const filteredPayments = payments?.filter(p => p.paymentMode !== 1 && p.paymentMode !== 7);

        // Generate HTML rows
        const paymentRows = filteredPayments?.map(payment => {
            const formattedDate = new Date(payment?.paymentDate).toLocaleDateString();
            const description = PAYMENT_MODES[payment?.paymentMode] || 'Other';
            return `
    <tr>
      <td style="border: 1px solid #000; text-align: center;">${formattedDate}</td>
      <td style="border: 1px solid #000;">${description}${payment?.transactionID ? ' - ' + payment.transactionID : ''}</td>
      <td style="border: 1px solid #000; text-align: right;">${parseFloat(payment?.paymentAmount).toFixed(2)}</td>
    </tr>`;
        }).join("");

        // Calculate total collected
        const totalCollected = filteredPayments?.reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0);

        // Final table HTML
        const finalTable = `
<table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;">
  <thead>
    <tr>
      <th style="border: 1px solid #000; padding: 4px;">Payment Date</th>
      <th style="border: 1px solid #000; padding: 4px;">Description</th>
      <th style="border: 1px solid #000; padding: 4px;">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${paymentRows}
    <tr>
      <td colspan="2" style="border: 1px solid #000; text-align: right; font-weight: bold;">Total</td>
      <td style="border: 1px solid #000; text-align: right;">${totalCollected?.toFixed(2)}</td>
    </tr>
  </tbody>
</table>`;

        const browser = await puppeteer.launch({
            headless: "new", // Use "new" for puppeteer v20+ or remove if it gives error
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        const htmlContent = `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px;">
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
      <tbody>
        <tr>
          <td colspan="2" style="text-align: center; padding: 10px;">
            <h3 style="margin: 0;">Invoice</h3>
            <h4 style="margin: 5px 0; font-size: 18px;">${bookingDetail?.hotelName}</h4>
            <p style="margin: 3px 0;">GSTIN No : ${bookingDetail?.propertyGSTNO}</p>
            <p style="margin: 3px 0;">${bookingDetail?.hotelAddress}</p>
            <p style="margin: 3px 0;">Phone: ${bookingDetail?.hotelPhone}, Email: ${bookingDetail?.hotelEmail}</p>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 5px; border-top: 1px solid #000;">
            <table style="width: 100%;">
              <tr><th align="left">Invoice No</th><td>: ${bookingDetail?.invoiceID}</td></tr>
              <tr><th align="left">Guest Name</th><td>: ${bookingDetail?.guestName}</td></tr>
              <tr><th align="left">Date of Arrival</th><td>: ${bookingDetail?.checkInDate}</td></tr>
              <tr><th align="left">Date of Departure</th><td>: ${bookingDetail?.checkOutDate}</td></tr>
            </table>
          </td>
          <td style="width: 50%; vertical-align: top; padding: 5px; border-top: 1px solid #000;">
            <table style="width: 100%;">
              <tr><th align="left">Date of Invoice</th><td>: ${bookingDetail?.checkOutTime}</td></tr>
              <tr><th align="left">Room</th><td>: ${bookingDetail?.roomCategory} / ${bookingDetail?.noOfRooms}</td></tr>
              <tr><th align="left">No of Person</th><td>: ${bookingDetail?.adults} (A) / ${bookingDetail?.children ? bookingDetail?.children : "0"} (C)</td></tr>
              <tr><th align="left">No of Nights</th><td>: ${bookingDetail?.roomNights}</td></tr>              
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px;">
            <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #000; padding: 4px;">Sr No</th>
                  <th style="border: 1px solid #000; padding: 4px;">Particular</th>
                  <th style="border: 1px solid #000; padding: 4px;">HSN/SAC</th>
                  <th style="border: 1px solid #000; padding: 4px;">Rooms</th>
                  <th style="border: 1px solid #000; padding: 4px;">Rate</th>
                  <th style="border: 1px solid #000; padding: 4px;">Total</th>
                  <th style="border: 1px solid #000; padding: 4px;">Discount</th>
                  <th style="border: 1px solid #000; padding: 4px;">Taxable</th>
                  <th style="border: 1px solid #000; padding: 4px;">SGST</th>
                  <th style="border: 1px solid #000; padding: 4px;">CGST</th>
                  <th style="border: 1px solid #000; padding: 4px;">IGST</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; text-align: center;">1</td>
                  <td style="border: 1px solid #000;">Room Charges</td>
                  <td style="border: 1px solid #000;">996311</td>
                  <td style="border: 1px solid #000; text-align: center;">${bookingDetail?.noOfRooms}</td>
                  <td style="border: 1px solid #000; text-align: right;">${bookingDetail?.roomrateWithoutTax}</td>
                  <td style="border: 1px solid #000; text-align: right;">${bookingDetail?.bookingAmount}</td>
                  <td style="border: 1px solid #000; text-align: right;">${parseFloat(bookingDetail?.discountAmount || "0").toFixed(2)}</td>
                  <td style="border: 1px solid #000; text-align: right;">${bookingDetail?.baseAmount}</td>
                  <td style="border: 1px solid #000; text-align: right;">${bookingDetail?.sgst}</td>
                  <td style="border: 1px solid #000; text-align: right;">${bookingDetail?.cgst}</td>
                  <td style="border: 1px solid #000; text-align: right;">0.00</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 5px;">
            <h4>Total Payable Amount</h4>
            <p style="text-transform: capitalize;">${bookingDetail?.inWords}</p>
            ${finalTable}
            <div style="height: 80px;"></div>
            <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #000; padding: 4px;">Tax Details</th>
                  <th style="border: 1px solid #000; padding: 4px;">Taxable Amount</th>
                  <th style="border: 1px solid #000; padding: 4px;">Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000;">SGST @ 6%</td>
                  <td style="border: 1px solid #000; text-align: right;">${parseFloat(bookingDetail?.baseAmount).toFixed(2)}</td>
                  <td style="border: 1px solid #000; text-align: right;">${parseFloat(bookingDetail?.sgst).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;">CGST @ 6%</td>
                  <td style="border: 1px solid #000; text-align: right;">${parseFloat(bookingDetail?.baseAmount).toFixed(2)}</td>
                  <td style="border: 1px solid #000; text-align: right;">${parseFloat(bookingDetail?.cgst).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <table style="width: 80%; float:right;margin-top: 5px;border: 1px solid #000; border-collapse: collapse;">            
              <tr><th style="border: 1px solid #000;" align="left">Total Charges(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.totalExtraCharges || "0").toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total Discount(Rs)</th><td style="border: 1px solid #000;"${parseFloat(bookingDetail?.discountAmount || "0").toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total SGST(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.sgst).toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total CGST(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.cgst).toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total IGST(Rs)</th><td style="border: 1px solid #000;">0.00</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total Other Tax(Rs)</th><td style="border: 1px solid #000;">0.00</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total Balance Transfer(Rs)</th><td style="border: 1px solid #000;">0.00</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.bookingAmount).toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Flat Discount(Rs)</th><td style="border: 1px solid #000;">0.00</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Adjustment(Rs)</th><td style="border: 1px solid #000;">0.00</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total Payable(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.bookingAmount).toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Total Payment(Rs)</th><td style="border: 1px solid #000;">${parseFloat(bookingDetail?.totalPayment).toFixed(2)}</td></tr>
              <tr><th style="border: 1px solid #000; padding: 4px;" align="left">Balance(Rs)</th><td style="border: 1px solid #000;">${bookingDetail?.balanceAmount == "" ? "0.00" : parseFloat(bookingDetail?.balanceAmount).toFixed(2)}</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px;">
            <div style="font-weight: bold; height: 60px;">Remark :</div>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; border-top: 1px solid #000; padding: 5px;">
            <table style="width: 100%;">
              <tr><th align="left">This Folio is in</th><td>: ${bookingDetail?.bookingId}</td></tr>
              <tr><th align="left">Reception (C/I)</th><td>: admin</td></tr>
              <tr><th align="left">Cashier (C/O)</th><td>: admin</td></tr>
              <tr><th align="left">Date</th><td>: ${bookingDetail?.checkOutDate}</td></tr>
              <tr><th align="left">Guest Signature</th><td>: ________________</td></tr>
            </table>
          </td>
          <td style="border-top: 1px solid #000; padding: 5px;">
            <!--<p style="font-weight: bold;">Folio NOTICE</p>-->
            <!--<p style="font-weight: bold;">Folio NOTICE</p>-->
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; border-top: 1px solid #000; padding: 10px;">
            Page 1 of 1
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
      `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        await browser.close();
        return Promise.resolve();
    } catch (error) {
        console.error('Error generating PDF:', error);
        return Promise.reject(error);
    }
};

function datediff(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0)
        return diffDays
    else
        return 1
}

function arr_diff(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;
}

const getModeText = (mode) => {
    const modes = {
        2: 'Cash',
        3: 'Card',
        5: 'UPI',
        7: 'Prepaid',
    };
    return modes[mode] || 'Other';
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const mealPlanMap = {
    0: 'EP',
    1: 'CP',
    2: 'AP',
    3: 'MAP'
};

const toUpperCase = (value) => (value || "").toUpperCase();

const notifyEzee = async (property, bookingId, status) => {
    try {
        const body = {
            RES_Request: {
                Request_Type: "BookingRecdNotification",
                Authentication: {
                    HotelCode: property.locationId,
                    AuthCode: property.AuthCode,
                },
                Bookings: {
                    Booking: [
                        {
                            BookingId: bookingId,
                            PMS_BookingId: "1",
                            Status: status,
                        },
                    ],
                },
            },
        };
        const response = await axios.post("https://live.ipms247.com/pmsinterface/pms_connectivity.php", body, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("✅ Ezee notified");
    } catch (err) {
        console.error("❌ Ezee notify failed:", err.response?.data || err.message);
    }
};

export default {
    async create(req, res, next) {
        const {
            propertyId,
            propertyRoomsCategoryId,
            userId,
            fromDate,
            toDate,
            noOfRooms,
            adults,
            children,
            paymentMode,
            PaymentStatus,
            bookingStatus,
            bookingAmout,
            checkInDateTime,
            checkOutDateTime,
            bookForOther,
            otherPersonName,
            otherPersonNumber,
            source,
            collectedPayment,
            dueAmount,
            payAtHotelAmount,
            otaBookingId,
            referenceName,
            guestDetails,
            breakFast,
            extraCharge1,
            extraCharge2,
            bookingHours,
            totalFoodAmount,
            collectedFoodAmout,
            useWalletAmount,
            cuponCode,
            discountAmount,
            platform
        } = req.body;

        const start = moment(new Date(fromDate)).format('YYYY-MM-DD')
        const end = moment(new Date(toDate)).format('YYYY-MM-DD')
        if (!(fromDate && toDate)) {
            return res.status(400).json({ status: false, message: "From date and to date are required!" });
        }
        if (start > end) {
            return res.status(400).json({ status: false, message: "toDate must be greator than or equal from fromDate" });
        }
        if (!(userId || otherPersonName)) {
            return res.status(400).json({ status: false, message: "User id or person any one is required" });
        }
        if (!(bookingAmout && bookingAmout > 0 && source && source != '')) {
            return res.status(400).json({ status: false, message: "Booking amount and source are required!" });
        }
        await db.BookingHotel.create({
            propertyId: propertyId,
            propertyRoomsCategoryId: propertyRoomsCategoryId,
            userId: userId,
            fromDate: fromDate,
            toDate: toDate,
            noOfRooms: noOfRooms,
            adults: adults,
            children: children,
            paymentMode: paymentMode,
            PaymentStatus: PaymentStatus,
            bookingStatus: bookingStatus,
            bookingAmout: bookingAmout,
            checkInDateTime: checkInDateTime,
            checkOutDateTime: checkOutDateTime,
            bookForOther: bookForOther,
            otherPersonName: otherPersonName,
            otherPersonNumber: otherPersonNumber,
            source: source,
            collectedPayment: collectedPayment,
            dueAmount: dueAmount,
            payAtHotelAmount: payAtHotelAmount,
            otaBookingId: otaBookingId,
            referenceName: referenceName,
            breakFast: breakFast,
            extraCharge1: extraCharge1,
            extraCharge2: extraCharge2,
            bookingHours: bookingHours,
            totalFoodAmount: totalFoodAmount,
            collectedFoodAmout: collectedFoodAmout,
            useWalletAmount: useWalletAmount,
            cuponCode: cuponCode,
            discountAmount: discountAmount,
            platform: platform ? platform : 1
        })
            .then(async (result) => {
                if (result) {
                    const count = parseInt(result.id);
                    let pad = '000000';
                    var ctxt = '' + count;
                    let bookingCode = '';
                    if (platform && platform == 2) {
                        bookingCode = "RRU" + Math.floor(100000 + Math.random() * 900000).toString();
                    } else {
                        bookingCode = "RRP" + Math.floor(100000 + Math.random() * 900000).toString();
                    }
                    result['bookingCode'] = bookingCode;
                    await db.BookingHotel.update({ bookingCode: bookingCode }, {
                        where: { id: result.id }
                    });
                    if (guestDetails && guestDetails.length > 0) {
                        let itemsParams = [];
                        guestDetails.forEach(element => {
                            itemsParams.push({ name: element.name, age: element.age, gender: element.gender, document_number: element.document_number, document_type: element.document_type, roomNo: element.roomNo, bookedId: result.id })
                        });
                        await db.GuestDetails.bulkCreate(itemsParams).then().catch(err => {
                            return res.status(500).json({ 'error': JSON.stringify(err) });
                        });
                    }
                    /////////////////////////////////////////////////////////////////////////
                    if (result.source?.toUpperCase() == "RROOMS" &&
                        result.referenceName != "" &&
                        result.referenceName != null) {
                        setImmediate(async () => {
                            try {
                                const [getUser, getProperty] = await Promise.all([
                                    db.User.findOne({ where: { id: userId } }),
                                    db.PropertyMaster.findOne({ where: { id: propertyId } })
                                ]);
                                const getInitiator = await db.RroomsUser.findOne({ where: { id: getProperty.createdBy } })
                                let getTax = parseInt(bookingAmout) - parseInt(discountAmount) ?? 0;
                                let paymentModesForPayAtHotel = [0, 2, 3, 4, 5, 6, 7];
                                let paymentModeName = (PaymentStatus == 0 && paymentMode == 0) || paymentModesForPayAtHotel.includes(paymentMode)
                                    ? 'Pay at Hotel'
                                    : PaymentStatus == 1 && paymentMode == 1
                                        ? "Prepaid"
                                        : PaymentStatus == 0 && paymentMode == 1
                                            ? "Partial Pay"
                                            : 'Unknown Payment Mode';
                                const bookingDetails = {
                                    guestName: otherPersonName || getUser?.name,
                                    guestMobile: otherPersonNumber || getUser?.mobile,
                                    bookingId: bookingCode,
                                    hotelCode: getProperty?.propertyCode,
                                    hotelName: getProperty?.name,
                                    hotelOwner: getProperty?.ownerFirstName + " " + getProperty?.ownerLastName,
                                    hotelAddress: getProperty?.address,
                                    hotelLandmark: getProperty?.landmark,
                                    hotelEmail: getProperty?.propertyEmailId,
                                    hotelPhone: getProperty?.propertyMobileNumber,
                                    hotelLocality: getProperty?.locality,
                                    checkInDate: fromDate,
                                    checkOutDate: toDate,
                                    roomNights: noOfRooms,
                                    checkInTime: moment(fromDate).format('DD-MM-YYYY'),
                                    checkOutTime: moment(toDate).format('DD-MM-YYYY'),
                                    bookingAmout, amountBreakup: `Total: ${bookingAmout}, Collected: ${collectedPayment}, Due: ${dueAmount}`,
                                    balanceAmount: dueAmount, paymentLink: 'Payment Link',
                                    checkInDateTime: moment(checkInDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                                    checkOutDateTime: moment(checkOutDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                                    commissionBreakup: 'Commission Details',
                                    paymentMode, noOfRooms, adults, children,
                                    PaymentStatus, bookingStatus, otherPersonName, otherPersonNumber,
                                    otaBookingId, tax: getTax, cuponCode, discountAmount,
                                    bookingPolicy: getProperty?.bookingPolicy,
                                    RoomsCategoryId: propertyRoomsCategoryId,
                                    paymentModeName,
                                    collectedPayment: collectedPayment
                                };
                                await Promise.allSettled([
                                    // sendBookingConfirmationGuest(getUser?.email || 'guest@yopmail.com', bookingDetails),
                                    // sendBookingConfirmationProperty(getInitiator?.email || 'initiator@yopmail.com', bookingDetails),
                                    sendBookingConfirmationProperty(getProperty?.propertyEmailId || 'property@yopmail.com', bookingDetails),
                                    sendBookingConfirmationRrooms('rrooms.in@gmail.com', bookingDetails)
                                ]).then(() => {
                                    console.log("All emails processed");
                                });
                            } catch (err) {
                                console.error("Email sending error:", err);
                            }
                        });
                    }
                    ////////////////////////////////////////////////////////////////////////
                    return res.status(200).json({ status: true, message: "Booked successfully", data: result });
                }
                else
                    return res.status(200).json({ status: false, message: "Booking failed!" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    async createByEzee(req, res, next) {
        try {
            const data = req.body;
            const booking = data?.Reservations?.Reservation[0]?.BookingTran[0];
            const status = booking?.Status;
            const guestEmail = booking?.Email
            console.log(guestEmail);
            if (!booking || !data?.Reservations?.Reservation[0]) {
                return res.status(400).json({ success: false, message: "Invalid response structure." });
            }
            const property = await db.PropertyMaster.findOne({
                where: { locationId: data?.Reservations?.Reservation[0]?.LocationId },
            });
            if (!property) return res.status(404).json({ success: false, message: "Property not found." });
            if (status == "New") {
                const bookingCode = "RRO" + Math.floor(100000 + Math.random() * 900000).toString();
                const payload = {
                    bookingCode: bookingCode,
                    propertyId: property?.id,
                    locationId: data?.Reservations?.Reservation[0]?.LocationId,
                    propertyRoomsCategoryId:
                        toUpperCase(booking?.RoomTypeName) === "STANDARD DOUBLE BED"
                            ? 1
                            : toUpperCase(booking?.RoomTypeName) === "DELUXE DOUBLE BED"
                                ? 2
                                : toUpperCase(booking?.RoomTypeName) === "SUITE ROOM"
                                    ? 3
                                    : toUpperCase(booking?.RoomTypeName) === "STANDARD SINGLE BED"
                                        ? 5
                                        : toUpperCase(booking?.RoomTypeName) === "STANDARD TWIN BED"
                                            ? 6
                                            : toUpperCase(booking?.RoomTypeName) === "DELUXE TWIN BED"
                                                ? 7
                                                : 1,
                    fromDate: booking?.Start,
                    toDate: booking?.End,
                    noOfRooms: booking?.RentalInfo.length,
                    adults: booking?.RentalInfo[0].Adult,
                    childrens: booking?.RentalInfo[0].Child,
                    paymentMode: booking?.TotalPayment == "" || booking?.TotalPayment != "0.00" ? 1 : 0,
                    PaymentStatus: booking?.TotalPayment == "" || booking?.TotalPayment != "0.00" ? 1 : 0,
                    bookingStatus: 1,
                    bookingAmout: Math.round(booking?.TotalAmountAfterTax),
                    dueAmount: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? Math.round(booking?.TotalAmountAfterTax) : "0",
                    collectedPayment: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? "0" : Math.round(booking?.TotalPayment),
                    partialPayAmount: 0,
                    fullPayAmount: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? "0" : Math.round(booking?.TotalPayment),
                    otherPersonName: data?.Reservations?.Reservation[0]?.FirstName + " " + data?.Reservations?.Reservation[0]?.LastName,
                    otherPersonNumber: data?.Reservations?.Reservation[0]?.Mobile,
                    source: "RRooms",
                    breakFast:
                        toUpperCase(booking?.PackageName) === "EP"
                            ? "0"
                            : toUpperCase(booking?.PackageName) === "CP"
                                ? "1"
                                : toUpperCase(booking?.PackageName) === "AP"
                                    ? "2"
                                    : toUpperCase(booking?.PackageName) === "MAP"
                                        ? "3"
                                        : "0",
                    otaBookingId: data?.Reservations?.Reservation[0]?.UniqueID,
                    referenceName: data?.Reservations?.Reservation[0]?.Source,
                };
                await db.BookingHotel.create(payload);
                setImmediate(async () => {
                    try {
                        const [getProperty] = await Promise.all([
                            db.PropertyMaster.findOne({ where: { id: payload.propertyId } })
                        ]);
                        const getInitiator = await db.RroomsUser.findOne({ where: { id: getProperty?.createdBy } })
                        let getTax = parseInt(payload.bookingAmout) ?? 0;
                        let paymentModesForPayAtHotel = [0, 2, 3, 4, 5, 6, 7];
                        let paymentModeName = (payload.PaymentStatus == 0 && payload.paymentMode == 0) || paymentModesForPayAtHotel.includes(payload.paymentMode)
                            ? 'Pay at Hotel'
                            : payload.PaymentStatus == 1 && payload.paymentMode == 1
                                ? "Prepaid"
                                : payload.PaymentStatus == 0 && payload.paymentMode == 1
                                    ? "Partial Pay"
                                    : 'Unknown Payment Mode';
                        const bookingDetails = {
                            guestName: payload?.otherPersonName || "",
                            guestMobile: payload.otherPersonNumber || "",
                            bookingId: bookingCode,
                            hotelCode: getProperty?.propertyCode,
                            hotelName: getProperty?.name,
                            hotelOwner: getProperty?.ownerFirstName + " " + getProperty?.ownerLastName,
                            hotelAddress: getProperty?.address,
                            hotelLandmark: getProperty?.landmark,
                            hotelEmail: getProperty?.propertyEmailId,
                            hotelPhone: getProperty?.propertyMobileNumber,
                            hotelLocality: getProperty?.locality,
                            checkInDate: payload.fromDate,
                            checkOutDate: payload.toDate,
                            roomNights: payload.noOfRooms,
                            checkInTime: moment(payload.fromDate).format('DD-MM-YYYY'),
                            checkOutTime: moment(payload.toDate).format('DD-MM-YYYY'),
                            bookingAmout: payload.bookingAmout, amountBreakup: `Total: ${payload.bookingAmout}, Collected: ${payload.collectedPayment}, Due: ${payload.dueAmount}`,
                            balanceAmount: payload.dueAmount, paymentLink: 'Payment Link',
                            checkInDateTime: "12:00 PM",
                            checkOutDateTime: "11:00 AM",
                            commissionBreakup: 'Commission Details',
                            paymentMode: payload.paymentMode, noOfRooms: payload.noOfRooms, adults: payload.adults, children: payload.childrens,
                            PaymentStatus: payload.PaymentStatus, bookingStatus: payload.bookingStatus, otherPersonName: payload.otherPersonName, otherPersonNumber: payload.otherPersonNumber,
                            otaBookingId: payload.otaBookingId, tax: getTax, cuponCode: null, discountAmount: null,
                            bookingPolicy: getProperty?.bookingPolicy,
                            RoomsCategoryId: payload.propertyRoomsCategoryId,
                            paymentModeName,
                            collectedPayment: payload.collectedPayment
                        };
                        const specialHotelIds = [9, 11, 5, 40, 12, 8, 42, 41];
                        const rroomsEmail = specialHotelIds?.includes(property?.id)
                            ? 'bookinggroup@rrooms.in'
                            : 'rrooms.in@gmail.com';
                        await Promise.allSettled([
                            sendBookingConfirmationGuest(guestEmail || 'guest@yopmail.com', bookingDetails),
                            sendBookingConfirmationProperty(getProperty?.propertyEmailId || 'property@yopmail.com', bookingDetails),
                            sendBookingConfirmationRrooms(rroomsEmail || 'rrooms.admin@yopmail.com', bookingDetails)
                        ]).then(() => {
                            console.log("All emails processed");
                        });
                    } catch (err) {
                        console.error("Email sending error:", err);
                    }
                });
                await notifyEzee(property, data?.Reservations?.Reservation[0]?.UniqueID, "New");
                return res.status(200).json({ success: true, message: "New booking created." });
            } else if (status == "Modify") {
                const record = await db.BookingHotel.findOne({
                    where: {
                        otaBookingId: data?.Reservations?.Reservation[0]?.UniqueID,
                        // locationId: data.Reservations.Reservation[0].LocationId,
                        propertyId: property?.id
                    },
                });
                if (!record) return res.status(404).json({ success: false, message: "Booking not found to modify." });
                await record.update({
                    propertyRoomsCategoryId:
                        toUpperCase(booking?.RoomTypeName) === "STANDARD DOUBLE BED"
                            ? 1
                            : toUpperCase(booking?.RoomTypeName) === "DELUXE DOUBLE BED"
                                ? 2
                                : toUpperCase(booking?.RoomTypeName) === "SUITE ROOM"
                                    ? 3
                                    : toUpperCase(booking?.RoomTypeName) === "STANDARD SINGLE BED"
                                        ? 5
                                        : toUpperCase(booking?.RoomTypeName) === "STANDARD TWIN BED"
                                            ? 6
                                            : toUpperCase(booking?.RoomTypeName) === "DELUXE TWIN BED"
                                                ? 7
                                                : 1,
                    fromDate: booking?.Start,
                    toDate: booking?.End,
                    noOfRooms: booking?.RentalInfo.length,
                    adults: booking?.RentalInfo[0].Adult,
                    childrens: booking?.RentalInfo[0].Child,
                    bookingAmout: Math.round(booking?.TotalAmountAfterTax),
                    dueAmount: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? Math.round(booking?.TotalAmountAfterTax) : "0",
                    collectedPayment: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? "0" : Math.round(booking?.TotalPayment),
                    fullPayAmount: booking?.TotalPayment == "" || booking?.TotalPayment == "0.00" ? "0" : Math.round(booking?.TotalPayment),
                    otherPersonName: data?.Reservations?.Reservation[0]?.FirstName + " " + data?.Reservations?.Reservation[0]?.LastName,
                    otherPersonNumber: data?.Reservations?.Reservation[0]?.Mobile,
                    breakFast:
                        toUpperCase(booking?.PackageName) == "EP"
                            ? "0"
                            : toUpperCase(booking?.PackageName) == "CP"
                                ? "1"
                                : toUpperCase(booking?.PackageName) == "AP"
                                    ? "2"
                                    : toUpperCase(booking?.PackageName) == "MAP"
                                        ? "3"
                                        : "0",
                }).then(async result => {
                    await notifyEzee(property, data?.Reservations?.Reservation[0]?.UniqueID, "Modify");
                    res.status(200).json({ success: true, message: "Booking modified." })
                }).catch(err => { console.log(err); return res.status(500).json({ success: false, message: err.message }); })
            } else if (status == "Cancel") {
                const record = await db.BookingHotel.findOne({
                    where: {
                        otaBookingId: data?.Reservations?.Reservation[0]?.UniqueID,
                        // locationId: data.Reservations.Reservation[0].LocationId,
                        propertyId: property?.id
                    },
                });
                if (!record) return res.status(404).json({ success: false, message: "Booking not found to cancel." });
                await record.update({ bookingStatus: 4 });
                await notifyEzee(property, data?.Reservations?.Reservation[0]?.UniqueID, "Cancel")
                return res.status(200).json({ success: true, message: "Booking cancelled." });
            } else {
                return res.status(200).json({ success: false, message: "Unknown status." });
            }
        } catch (error) {
            console.error("Reservation Sync Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    },

    async getRRoomsBookings(req, res, next) {
        try {
            const { bookingCode, propertyId, page = 1, limit = 20 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const whereClause = {
                source: 'RRooms',
                referenceName: {
                    [Op.not]: null
                },
                bookingStatus: {
                    [Op.ne]: 0
                },
                ...(bookingCode ? { bookingCode } : {}),
                ...(propertyId ? { propertyId } : {})
            };
            const { count, rows: bookings } = await db.BookingHotel.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset,
                include: [
                    {
                        model: db.PropertyMaster,
                        attributes: ['id', 'name', 'propertyCode', 'address', 'cityId', 'stateId', 'zone'],
                        required: false
                    }
                ]
            });
            res.status(200).json({
                status: true,
                data: bookings,
                pagination: {
                    totalRecords: count,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            console.error("❌ Error fetching RRooms bookings:", error);
            res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
    },

    async updateBookingPaymentStatus(req, res, next) {
        try {
            const { id } = req.params;
            const {
                // paymentMode,
                paymentStatus,
                bookingStatus,
                collectedPayment,
                dueAmount
            } = req.body;
            const booking = await db.BookingHotel.findOne({ where: { id } });
            if (!booking) {
                return res.status(404).json({ status: false, message: "Booking not found" });
            }
            // booking.paymentMode = paymentMode ?? booking.paymentMode;
            booking.PaymentStatus = paymentStatus ?? booking.PaymentStatus;
            booking.bookingStatus = bookingStatus ?? booking.bookingStatus;
            booking.collectedPayment = collectedPayment ?? booking.collectedPayment;
            booking.dueAmount = dueAmount ?? booking.dueAmount;
            await booking.save();
            return res.status(200).json({
                status: true,
                message: "Booking updated successfully",
                // data: booking
            });
        } catch (error) {
            console.error("❌ Error updating booking:", error);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
    },

    // async confirmBooking(req, res, next) {
    //     const id = req.params.id;
    //     const { status, paymentMode, cancelledBy } = req.body
    //     const bookingSelection = {
    //         include: [
    //             { model: db.PropertyMaster, required: true },
    //             {
    //                 model: db.RroomCategory, required: true,
    //                 include: [
    //                     { model: db.Rooms, required: true }
    //                 ]
    //             }
    //         ],
    //         where: { id: id }
    //     }
    //     const selector = Object.assign({}, bookingSelection);
    //     db.BookingHotel.findOne(selector).then(async (result) => {
    //         if (result) {
    //             result.update({ bookingStatus: status == 7 ? 1 : status, paymentMode: paymentMode, cancelledBy: cancelledBy });
    //             if (status == 1) {
    //                 const propertyDetails = result.PropertyMaster
    //                 await db.User.findOne({ where: { id: result.get('userId') } }).then(res => {
    //                     bookingConfirmed(res.mobile, propertyDetails.propertyMobileNumber, result.get('bookingCode'), propertyDetails ? propertyDetails?.name : "Rrooms Hotel");
    //                     const mailDetails = {
    //                         userEmail: res.email,
    //                         userName: res.name,
    //                         userMobile: res.mobile,
    //                         totalBookingAmount: result.bookingAmout,
    //                         roomPrice: result.RroomCategory.Rooms.regularPrice,
    //                         useWalletAmount: result.useWalletAmount,
    //                         roomCategoryName: result.RroomCategory.name,
    //                         mealPlanName: result.breakFast == 0 ? 'NILL' : result.breakFast == 1 ? 'CP' : result.breakFast == 2 ? 'AP' : result.breakFast == 3 ? 'AMP' : 'NILL',
    //                         numberOfAdult: result.adults,
    //                         bookingId: result.bookingCode,
    //                         fromDate: result.fromDate,
    //                         toDate: result.toDate,
    //                         dateDifference: moment(result.toDate).diff(moment(result.fromDate), 'days', false),
    //                         discountAmount: result.discountAmount,
    //                         numberOfRooms: result.noOfRooms,
    //                         totalCollectedAmount: result.collectedPayment,
    //                         totalDueAmount: result.dueAmount,
    //                         hotelName: propertyDetails.name,
    //                         hotelMobileNumber: propertyDetails.propertyMobileNumber,
    //                         propertyUserEmail: propertyDetails.propertyEmailId,
    //                         propertyUserName: propertyDetails.propertyEmailId,
    //                         hotelAddressOne: propertyDetails.address,
    //                         hotelAddressTwo: propertyDetails.locality,
    //                         mapUrl: `https://www.google.com/maps/place/${propertyDetails.latitude},${propertyDetails.longitude}`,
    //                     }
    //                     sendMail(mailDetails);
    //                 }).catch(error => { });
    //             }
    //             return res.status(200).json({ status: true, msg: "Booking status updated successfully" });
    //         } else {
    //             return res.status(200).json({ status: false, msg: "Booking status updating failed" });
    //         }
    //     }).catch(error => {
    //         return res.status(400).json({ status: false, msg: error.message });
    //     })
    // },

    async confirmBooking(req, res, next) {
        const id = req.params.id;
        const { status, paymentMode, cancelledBy, partialPayAmount, fullPayAmount, payAtHotelAmount } = req.body
        const bookingSelection = {
            include: [
                { model: db.PropertyMaster, required: true },
                {
                    model: db.RroomCategory, required: true,
                    include: [
                        { model: db.Rooms, required: true }
                    ]
                }
            ],
            where: { id: id }
        }
        const selector = Object.assign({}, bookingSelection);
        db.BookingHotel.findOne(selector).then(async (result) => {
            if (result) {
                result.update({ bookingStatus: status == 7 ? 1 : status, paymentMode: paymentMode, cancelledBy: cancelledBy, partialPayAmount: partialPayAmount, fullPayAmount: fullPayAmount, payAtHotelAmount: payAtHotelAmount });
                if (status == 1) {
                    const propertyDetails = result.PropertyMaster
                    await db.User.findOne({ where: { id: result.get('userId') } }).then(async res => {
                        bookingConfirmed(res.mobile, propertyDetails.propertyMobileNumber, result.get('bookingCode'), propertyDetails ? propertyDetails?.name : "Rrooms Hotel");
                        if (res && result.useWalletAmount > 0) {
                            const wallet = await db.UserWallet.findOne({
                                where: { userId: res.id },
                                order: [
                                    ['id', 'DESC'],
                                    ['updatedAt', 'DESC']
                                ]
                            });
                            console.log("wallet - ", wallet);
                            if (wallet) {
                                await db.UserWallet.create({
                                    userId: res.id,
                                    amount: result.useWalletAmount,
                                    balance: wallet.balance < result.useWalletAmount ? 0 : wallet.balance - result.useWalletAmount,
                                    transactionType: false
                                });
                            }
                        }
                        // const mailDetails = {
                        //     userEmail: res.email,
                        //     userName: res.name,
                        //     userMobile: res.mobile,
                        //     totalBookingAmount: result.bookingAmout,
                        //     roomPrice: result.RroomCategory.Rooms.regularPrice,
                        //     useWalletAmount: result.useWalletAmount,
                        //     roomCategoryName: result.RroomCategory.name,
                        //     mealPlanName: result.breakFast == 0 ? 'NILL' : result.breakFast == 1 ? 'CP' : result.breakFast == 2 ? 'AP' : result.breakFast == 3 ? 'AMP' : 'NILL',
                        //     numberOfAdult: result.adults,
                        //     bookingId: result.bookingCode,
                        //     fromDate: result.fromDate,
                        //     toDate: result.toDate,
                        //     dateDifference: moment(result.toDate).diff(moment(result.fromDate), 'days', false),
                        //     discountAmount: result.discountAmount,
                        //     numberOfRooms: result.noOfRooms,
                        //     totalCollectedAmount: result.collectedPayment,
                        //     totalDueAmount: result.dueAmount,
                        //     hotelName: propertyDetails.name,
                        //     hotelMobileNumber: propertyDetails.propertyMobileNumber,
                        //     propertyUserEmail: propertyDetails.propertyEmailId,
                        //     propertyUserName: propertyDetails.propertyEmailId,
                        //     hotelAddressOne: propertyDetails.address,
                        //     hotelAddressTwo: propertyDetails.locality,
                        //     mapUrl: `https://www.google.com/maps/place/${propertyDetails.latitude},${propertyDetails.longitude}`,
                        // }
                        // sendMail(mailDetails);
                        /////////////////////////////////////////////////////////////////////////
                        if (result?.source == 'RRooms') {
                            setImmediate(async () => {
                                try {
                                    const [getUser, getProperty] = await Promise.all([
                                        db.User.findOne({ where: { id: result?.userId } }),
                                        db.PropertyMaster.findOne({ where: { id: result?.propertyId } })
                                    ]);
                                    const getInitiator = await db.RroomsUser.findOne({ where: { id: getProperty.createdBy } })
                                    let getTax = parseInt(result.bookingAmout) - parseInt(result.discountAmount);
                                    let paymentModesForPayAtHotel = [0, 2, 3, 4, 5, 6, 7];
                                    let paymentModeName = (result.PaymentStatus == 0 && paymentMode == 0) || paymentModesForPayAtHotel.includes(paymentMode)
                                        ? 'Pay at Hotel'
                                        : result.PaymentStatus == 1 && paymentMode == 1
                                            ? "Prepaid"
                                            : result.PaymentStatus == 0 && paymentMode == 1
                                                ? "Partial Pay"
                                                : 'Unknown Payment Mode';
                                    const bookingDetails = {
                                        guestName: result.otherPersonName || getUser?.name,
                                        guestMobile: result.otherPersonNumber || getUser?.mobile,
                                        bookingId: result.bookingCode,
                                        hotelCode: getProperty?.propertyCode,
                                        hotelName: getProperty?.name,
                                        hotelOwner: getProperty?.ownerFirstName + " " + getProperty?.ownerLastName,
                                        hotelAddress: getProperty?.address,
                                        hotelLandmark: getProperty?.landmark,
                                        hotelEmail: getProperty?.propertyEmailId,
                                        hotelPhone: getProperty?.propertyMobileNumber,
                                        hotelLocality: getProperty?.locality,
                                        checkInDate: result.fromDate,
                                        checkOutDate: result.toDate,
                                        roomNights: result.noOfRooms,
                                        checkInTime: moment(result.fromDate).format('DD-MM-YYYY'),
                                        checkOutTime: moment(result.toDate).format('DD-MM-YYYY'),
                                        bookingAmout: result.bookingAmout,
                                        amountBreakup: `Total: ${result.bookingAmout}, Collected: ${result.collectedPayment}, Due: ${result.dueAmount}`,
                                        balanceAmount: result.dueAmount, paymentLink: 'Payment Link',
                                        checkInDateTime: moment(result.checkInDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                                        checkOutDateTime: moment(result.checkOutDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                                        commissionBreakup: 'Commission Details',
                                        paymentMode: result.paymentMode,
                                        noOfRooms: result.noOfRooms,
                                        adults: result.adults,
                                        children: result.children,
                                        PaymentStatus: result.PaymentStatus,
                                        bookingStatus: result.bookingStatus,
                                        otherPersonName: result.otherPersonName,
                                        otherPersonNumber: result.otherPersonNumber,
                                        otaBookingId: result.otaBookingId,
                                        tax: getTax,
                                        cuponCode: result.cuponCode,
                                        discountAmount: result.discountAmount,
                                        bookingPolicy: getProperty?.bookingPolicy,
                                        RoomsCategoryId: result.propertyRoomsCategoryId,
                                        paymentModeName: paymentModeName,
                                        collectedPayment: result.collectedPayment
                                    };
                                    await Promise.allSettled([
                                        sendBookingConfirmationGuest(getUser?.email || 'guest@yopmail.com', bookingDetails),
                                        sendBookingConfirmationProperty(getProperty?.propertyEmailId || 'property@yopmail.com', bookingDetails),
                                        sendBookingConfirmationProperty(getInitiator?.email || 'initiator@yopmail.com', bookingDetails),
                                        sendBookingConfirmationRrooms('rrooms.in@gmail.com', bookingDetails)
                                    ]).then(() => {
                                        console.log("All emails processed");
                                    });
                                } catch (err) {
                                    console.error("Email sending error:", err);
                                }
                            });
                        }
                        ////////////////////////////////////////////////////////////////////////
                    }).catch(error => { });
                }
                return res.status(200).json({ status: true, msg: "Booking status updated successfully" });
            } else {
                return res.status(200).json({ status: false, msg: "Booking status updating failed" });
            }
        }).catch(error => {
            return res.status(400).json({ status: false, msg: error.message });
        })
    },

    async updateBookingStatus(req, res, next) {
        const id = req.params.id
        const {
            bookingStatus,
            checkInDateTime,
            checkOutDateTime,
            reason,
            paymentMode,
            PaymentStatus,
            cancelledBy
        } = req.body;
        const updateFields = {};
        if (cancelledBy) {
            updateFields['cancelledBy'] = cancelledBy;
        }
        if (bookingStatus !== undefined && bookingStatus !== null)
            updateFields['bookingStatus'] = bookingStatus == 7 ? 1 : bookingStatus;
        if (bookingStatus == 2)
            updateFields['checkInDateTime'] = sequelize.fn('NOW');
        if (bookingStatus == 3)
            updateFields['checkOutDateTime'] = sequelize.fn('NOW');
        if (reason)
            updateFields['reason'] = reason;
        if (paymentMode)
            updateFields['paymentMode'] = paymentMode;
        if (PaymentStatus)
            updateFields['PaymentStatus'] = PaymentStatus;
        if (bookingStatus == 4) {
            const booking = await db.BookingHotel.findOne({ where: { id: id } });
            if (booking && booking.bookingStatus == 2) {
                return res.status(200).json({
                    status: false,
                    msg: "Booking already in check-in",
                });
            }
        }
        await db.BookingHotel.update(updateFields, { where: { id: id } }).then(async (result) => {
            if (result) {
                const bookingDetailss = await db.BookingHotel.findOne({ where: { id: id } });
                let bookingDetails = bookingDetailss ? bookingDetailss.toJSON() : null;
                if (bookingDetails) {
                    const roomDetailsIds = bookingDetails?.assignRoomDetailsId ? bookingDetails?.assignRoomDetailsId.split(',') : [];
                    let getUser = await db.User.findOne({ where: { id: bookingDetailss?.get('userId') } });
                    let guestName = getUser?.name || 'Guest';
                    let guestEmail = getUser?.email || 'guest@yopmail.com';
                    if (!bookingDetails?.bookingStatus == 2 || bookingDetails?.bookingStatus == 4 || req.body.bookingStatus == 4) { // 4 cancel booking
                        if (bookingDetailss?.get('useWalletAmount') && bookingDetailss?.get('useWalletAmount') > 0) {
                            const wallet = await db.UserWallet.findOne({
                                where: { userId: bookingDetailss?.get('userId') },
                                order: [
                                    ['id', 'DESC'],
                                    ['updatedAt', 'DESC']
                                ]
                            });
                            if (wallet) {
                                await db.UserWallet.create({
                                    userId: bookingDetailss?.get('userId'),
                                    amount: bookingDetailss?.get('useWalletAmount'),
                                    balance: wallet?.balance + bookingDetailss?.get('useWalletAmount'),
                                    transactionType: 1
                                }).catch(err => {
                                    return res.status(400).json({ status: false, message: err.message });
                                });
                            }
                        }
                        const propertyDetails = await db.PropertyMaster.findOne({ where: { id: bookingDetailss?.get('propertyId') } });
                        await db.User.findOne({ where: { id: bookingDetailss?.get('userId') } }).then(res => {
                            cancelBooking(res.mobile, propertyDetails?.propertyMobileNumber, bookingDetailss?.get('bookingCode'), propertyDetails ? propertyDetails?.name : 'Rrooms');
                        }).catch(error => {
                            console.log(error);
                        });
                        /////////////////////////////////////////////////////////////////////////
                        // let getUser = await db.User.findOne({ where: { id: bookingDetailss?.get('userId') } });
                        // let guestName = 'Guest';
                        // let guestEmail = 'guest@yopmail.com';

                        if (getUser) {
                            if (getUser?.name && getUser?.name.trim() !== '') {
                                guestName = getUser.name;
                            }
                            if (getUser?.email && getUser?.email.trim() !== '') {
                                guestEmail = getUser.email;
                            }
                        }
                        const bookingDetail = {
                            guestName: guestName,
                            bookingId: bookingDetailss?.get('bookingCode') || '',
                            hotelCode: propertyDetails?.propertyCode || '',
                            hotelName: propertyDetails?.name || '',
                            hotelAddress: propertyDetails?.address || '',
                            hotelOwner: `${propertyDetails?.ownerFirstName || ''} ${propertyDetails?.ownerLastName || ''}`,
                            hotelLandmark: propertyDetails?.landmark || '',
                            hotelEmail: propertyDetails?.propertyEmailId || '',
                            hotelPhone: propertyDetails?.propertyMobileNumber || '',
                            cancelReason: bookingDetailss.get('reason') || '',
                            hotelLocality: propertyDetails?.locality || '',
                            checkInDate: bookingDetailss?.get('fromDate') || '',
                            checkOutDate: bookingDetailss?.get('toDate') || '',
                            roomNights: bookingDetailss?.get('noOfRooms') || '',
                            checkInTime: moment(bookingDetailss?.get('checkInDateTime')).format('DD-MM-YYYY'),
                            checkOutTime: moment(bookingDetailss?.get('checkOutDateTime')).format('DD-MM-YYYY'),
                            bookingAmout: bookingDetailss?.get('bookingAmout') || '',
                            amountBreakup: `Total: ${bookingDetailss?.get('bookingAmout')}, Collected: ${bookingDetailss?.get('collectedPayment')}, Due: ${bookingDetailss?.get('dueAmount')}`,
                            balanceAmount: bookingDetailss?.get('dueAmount') || '',
                            checkInDateTime: moment(bookingDetailss?.get('checkInDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            checkOutDateTime: moment(bookingDetailss?.get('checkOutDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            paymentMode: bookingDetailss?.get('paymentMode') || '',
                            noOfRooms: bookingDetailss?.get('noOfRooms') || '',
                            adults: bookingDetailss?.get('adults') || '',
                            children: bookingDetailss?.get('children') || '',
                            PaymentStatus: bookingDetailss?.get('PaymentStatus') || '',
                            bookingStatus: bookingDetailss?.get('bookingStatus') || '',
                            otherPersonName: bookingDetailss?.get('otherPersonName') || '',
                            otherPersonNumber: bookingDetailss?.get('otherPersonNumber') || '',
                            otaBookingId: bookingDetailss?.get('otaBookingId') || '',
                            collectedPayment: bookingDetailss?.get('collectedPayment') || '',
                            cuponCode: bookingDetailss?.get('cuponCode') || '',
                            discountAmount: bookingDetailss?.get('discountAmount') || '',
                            bookingPolicy: propertyDetails?.bookingPolicy || ''
                        };
                        if (bookingDetails?.source == 'RRooms') {
                            const specialHotelIds = [9, 11, 5, 40, 12, 8, 42, 41];
                            const rroomsEmail = specialHotelIds.includes(propertyDetails?.id)
                                ? 'bookinggroup@rrooms.in'
                                : 'rrooms.in@gmail.com';
                            setImmediate(async () => {
                                await Promise.allSettled([
                                    sendBookingCancelGuest(guestEmail, bookingDetail),
                                    sendBookingCancelProperty(propertyDetails?.propertyEmailId || 'property@yopmail.com', bookingDetail),
                                    sendBookingCancelRrooms(rroomsEmail, bookingDetail)
                                ]).then(() => {
                                    console.log("All emails processed");
                                });
                            });
                        }
                        ////////////////////////////////////////////////////////////////////////
                    } else if (bookingStatus == 3) { // 3 Checkout/Complete booking , 2 dirty room
                        const bookingSource = bookingDetails?.source;
                        const propertyDetails = await db.PropertyMaster.findOne({ where: { id: bookingDetailss?.get('propertyId') } });
                        if (!propertyDetails) {
                            console.error(`Property not found for ID ${bookingDetailss?.get('propertyId')}`);
                            return res.status(404).json({ status: false, message: "Property not found" });
                        }
                        let getUser = await db.User.findOne({ where: { id: bookingDetailss?.get('userId') } });
                        let roomcategory = await db.RroomCategory.findOne({ where: { id: bookingDetailss?.get('propertyRoomsCategoryId') } })
                        const daysDiffernce = (dateString1, dateString2) => {
                            if (!dateString1 || !dateString2) return 0;
                            const date1 = new Date(dateString1);
                            const date2 = new Date(dateString2);
                            const dateOnly1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
                            const dateOnly2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
                            const timeDiff = Math.abs(dateOnly1 - dateOnly2);
                            const daysDiff = timeDiff / (1000 * 3600 * 24);
                            return daysDiff;
                        };
                        const totalDays = daysDiffernce(
                            bookingDetailss?.get('fromDate'),
                            bookingDetailss?.get('toDate')
                        );
                        const totalNights = bookingDetailss?.get('fromDate') == bookingDetailss?.get('toDate') ? 1 : totalDays
                        let baseAmount = bookingDetailss?.get('bookingAmout') / 1.12;
                        const cgst = (bookingDetailss?.get('bookingAmout') - baseAmount) / 2;
                        const sgst = (bookingDetailss?.get('bookingAmout') - baseAmount) / 2;
                        let calTotalNightsAndnoOfRooms = totalNights * bookingDetailss?.get('noOfRooms')
                        let roomrateWithTax = bookingDetailss?.get('bookingAmout') / calTotalNightsAndnoOfRooms;
                        let roomrateWithoutTax = roomrateWithTax / 1.12;
                        const extras = [];
                        for (let i = 1; i <= 5; i++) {
                            try {
                                const key = `extraCharge${i}`;
                                const value = bookingDetailss?.get(key) || '[]';
                                const parsed = JSON.parse(value);
                                if (Array.isArray(parsed)) {
                                    extras.push(...parsed);
                                } else {
                                    console.warn(`Warning: ${key} is not an array`);
                                }
                            } catch (err) {
                                console.error(`Failed to parse extraCharge${i}:`, err);
                            }
                        }
                        const totalExtraCharges = extras.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
                        /////////////////////////////////////////////////////////////////////////////////////////////////
                        // let extra1Array = [];
                        // let extra2Array = [];
                        // try {
                        //     extra1Array = JSON.parse(bookingDetailss?.get('extraCharge1') || '[]');
                        // } catch (err) {
                        //     console.error('Failed to parse extra1:', err);
                        // }
                        // try {
                        //     extra2Array = JSON.parse(bookingDetailss?.get('extraCharge2') || '[]');
                        // } catch (err) {
                        //     console.error('Failed to parse extra2:', err);
                        // }
                        // const extra1Total = extra1Array.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
                        // const extra2Total = extra2Array.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
                        // const totalExtraCharges = extra1Total + extra2Total;
                        /////////////////////////////////////////////////////////////////////////////////////////////////
                        const paymentsData = await db.Payment.findAll({
                            where: { bookedId: bookingDetailss?.get('id') }, attributes: ['id', 'bookedId', 'paymentAmount', 'paymentDate', 'transactionID', 'paymentMode']
                        });
                        const paymentsJson = paymentsData.map(payment => payment.get({ plain: true }));
                        let amount = parseFloat(bookingDetailss?.get('bookingAmout')) + totalExtraCharges
                        let inWords = converter.toWords(amount);
                        const roomCategory = await db.RroomCategory.findOne({ where: { id: bookingDetailss?.get('propertyRoomsCategoryId') }, attributes: ['id', 'name'], raw: true })
                        const bookingDetail = {
                            guestName: guestName,
                            bookingId: bookingDetailss?.get('bookingCode') || '',
                            hotelCode: propertyDetails?.propertyCode || '',
                            hotelName: propertyDetails?.name || '',
                            hotelAddress: propertyDetails?.address || '',
                            hotelOwner: `${propertyDetails?.ownerFirstName || ''} ${propertyDetails?.ownerLastName || ''}`,
                            hotelLandmark: propertyDetails?.landmark || '',
                            hotelEmail: propertyDetails?.propertyEmailId || '',
                            hotelPhone: propertyDetails?.propertyMobileNumber || '',
                            cancelReason: bookingDetailss?.get('reason') || '',
                            hotelLocality: propertyDetails?.locality || '',
                            checkInDate: moment(bookingDetailss?.get('fromDate')).format('DD-MM-YYYY') || '',
                            checkOutDate: moment(bookingDetailss?.get('toDate')).format('DD-MM-YYYY') || '',
                            roomNights: totalNights,
                            checkInTime: moment(bookingDetailss?.get('checkInDateTime')).format('DD-MM-YYYY'),
                            checkOutTime: moment(bookingDetailss?.get('checkOutDateTime')).format('DD-MM-YYYY'),
                            bookingAmount: bookingDetailss?.get('bookingAmout') || '',
                            amountBreakup: `Total: ${bookingDetailss?.get('bookingAmout')}, Collected: ${bookingDetailss?.get('collectedPayment')}, Due: ${bookingDetailss?.get('dueAmount')}`,
                            balanceAmount: bookingDetailss?.get('dueAmount') || '',
                            checkInDateTime: moment(bookingDetailss?.get('checkInDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            checkOutDateTime: moment(bookingDetailss?.get('checkOutDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            paymentMode: bookingDetailss?.get('paymentMode') || '',
                            noOfRooms: bookingDetailss?.get('noOfRooms') || '',
                            adults: bookingDetailss?.get('adults') || '',
                            children: bookingDetailss?.get('children') || '',
                            PaymentStatus: bookingDetailss?.get('PaymentStatus') || '',
                            bookingStatus: bookingDetailss?.get('bookingStatus') || '',
                            otherPersonName: bookingDetailss?.get('otherPersonName') || '',
                            otherPersonNumber: bookingDetailss?.get('otherPersonNumber') || '',
                            otaBookingId: bookingDetailss?.get('otaBookingId') || '',
                            collectedPayment: bookingDetailss?.get('collectedPayment') || '',
                            cuponCode: bookingDetailss?.get('cuponCode') || '',
                            discountAmount: bookingDetailss?.get('discountAmount') || '',
                            bookingPolicy: propertyDetails?.bookingPolicy || '',
                            invoiceID: bookingDetailss?.get('id'),
                            propertyGSTNO: propertyDetails?.gstNumber,
                            roomCategoryName: roomcategory?.name,
                            roomrateWithoutTax: Math.round(roomrateWithoutTax),
                            roomrateWithTax: Math.round(roomrateWithTax),
                            inWords: inWords,
                            cgst: Math.round(cgst),
                            sgst: Math.round(sgst),
                            baseAmount: Math.round(baseAmount),
                            totalPayment: bookingDetailss?.get('collectedPayment'),
                            totalExtraCharges: totalExtraCharges,
                            paymentsJson: paymentsJson,
                            roomCategory: roomCategory?.name || "Other"
                        };
                        const invoicePath = path.join(__dirname, `../../../uploads/invoices/invoice-${bookingDetail?.bookingId}.pdf`);
                        /* await generateInvoicePdf(bookingDetail, invoicePath)
                        setImmediate(async () => {
                            await Promise.allSettled([
                                sendBookingCompleteGuest(getUser?.email || 'guest@yopmail.com', bookingDetail, invoicePath),
                                sendBookingCompleteProperty(propertyDetails?.propertyEmailId || 'property@yopmail.com', bookingDetail),
                                sendBookingCompleteRrooms('rrooms.in@gmail.com', bookingDetail)
                            ]).then(() => {
                                console.log("All emails processed");
                            });
                        }); */

                        // commented on 21-07-2025
                        // setImmediate(async () => {
                        //     try {
                        //         await generateInvoicePdf(bookingDetail, invoicePath);
                        //         await Promise.allSettled([
                        //             sendBookingCompleteGuest(guestEmail, bookingDetail, invoicePath),
                        //             sendBookingCompleteGuest(guestEmail, bookingDetail),
                        //             sendBookingCompleteProperty(propertyDetails?.propertyEmailId || 'property@yopmail.com', bookingDetail),
                        //             sendBookingCompleteRrooms('rrooms.in@gmail.com', bookingDetail)
                        //         ]);
                        //     } catch (err) {
                        //         console.error("Error in background processing:", err);
                        //     }
                        // });

                        if (Array.isArray(roomDetailsIds) && roomDetailsIds?.length > 0) {
                            const roomIds = roomDetailsIds?.map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
                            if (roomIds.length > 0) {
                                await Promise.allSettled(roomIds?.map(roomId =>
                                    db.RoomDetails.update({ status: 2 }, { where: { id: roomId }, logging: console.log }).then(res => {
                                        console.log("Room status updated successfully.");
                                    })
                                ));
                            }
                        }
                        //Adding RRooms provinding percentage to users between - 10 to 25 percentage
                        if (bookingSource == 'RRooms') {
                            const bookingAmount = bookingDetails?.bookingAmout;
                            if (bookingAmount && bookingAmount > 0) {
                                const randomPercent = Math.floor(Math.random() * 24) + 10;
                                const bookingAmountOfPercent = Math.floor(randomPercent * bookingAmount / 100)
                                const wallet = await db.UserWallet.findOne({
                                    where: { userId: bookingDetails?.userId },
                                    order: [
                                        ['id', 'DESC'],
                                        ['updatedAt', 'DESC']
                                    ]
                                });
                                if (wallet) {
                                    await db.UserWallet.create({
                                        userId: bookingDetails?.userId,
                                        amount: bookingAmountOfPercent,
                                        balance: wallet?.balance + bookingAmountOfPercent,
                                        transactionType: 1
                                    }).catch(err => {
                                        console.log(err)
                                        return res.status(400).json({ status: false, message: err.message });
                                    });
                                }
                            }
                        }
                    }
                    if (bookingStatus == 7) {
                        await db.User.findOne({ where: { id: bookingDetails?.userId } }).then(user => {
                            if (user) {
                                paymentDeclinedSms(user?.get('mobile'), bookingDetails?.get('bookingCode'))
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                    if (bookingStatus == 5) { // No Show Booking
                        const propertyDetails = await db.PropertyMaster.findOne({ where: { id: bookingDetailss?.get('propertyId') } });
                        let getUser = await db.User.findOne({ where: { id: bookingDetailss?.get('userId') } });
                        const bookingDetail = {
                            guestName: guestName,
                            bookingId: bookingDetailss?.get('bookingCode') || '',
                            hotelCode: propertyDetails?.propertyCode || '',
                            hotelName: propertyDetails?.name || '',
                            hotelAddress: propertyDetails?.address || '',
                            hotelOwner: `${propertyDetails?.ownerFirstName || ''} ${propertyDetails?.ownerLastName || ''}`,
                            hotelLandmark: propertyDetails?.landmark || '',
                            hotelEmail: propertyDetails?.propertyEmailId || '',
                            hotelPhone: propertyDetails?.propertyMobileNumber || '',
                            cancelReason: bookingDetailss?.get('reason') || '',
                            hotelLocality: propertyDetails?.locality || '',
                            checkInDate: bookingDetailss?.get('fromDate') || '',
                            checkOutDate: bookingDetailss?.get('toDate') || '',
                            roomNights: bookingDetailss?.get('noOfRooms') || '',
                            checkInTime: moment(bookingDetailss?.get('checkInDateTime')).format('DD-MM-YYYY'),
                            checkOutTime: moment(bookingDetailss?.get('checkOutDateTime')).format('DD-MM-YYYY'),
                            bookingAmout: bookingDetailss?.get('bookingAmout') || '',
                            amountBreakup: `Total: ${bookingDetailss?.get('bookingAmout')}, Collected: ${bookingDetailss?.get('collectedPayment')}, Due: ${bookingDetailss?.get('dueAmount')}`,
                            balanceAmount: bookingDetailss?.get('dueAmount') || '',
                            checkInDateTime: moment(bookingDetailss?.get('checkInDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            checkOutDateTime: moment(bookingDetailss?.get('checkOutDateTime')).tz('Asia/Kolkata').format('hh:mm A'),
                            paymentMode: bookingDetailss?.get('paymentMode') || '',
                            noOfRooms: bookingDetailss?.get('noOfRooms') || '',
                            adults: bookingDetailss?.get('adults') || '',
                            children: bookingDetailss?.get('children') || '',
                            PaymentStatus: bookingDetailss?.get('PaymentStatus') || '',
                            bookingStatus: bookingDetailss?.get('bookingStatus') || '',
                            otherPersonName: bookingDetailss?.get('otherPersonName') || '',
                            otherPersonNumber: bookingDetailss?.get('otherPersonNumber') || '',
                            otaBookingId: bookingDetailss?.get('otaBookingId') || '',
                            collectedPayment: bookingDetailss?.get('collectedPayment') || '',
                            cuponCode: bookingDetailss?.get('cuponCode') || '',
                            discountAmount: bookingDetailss?.get('discountAmount') || '',
                            bookingPolicy: propertyDetails?.bookingPolicy || ''
                        };
                        if (bookingDetailss?.get('source')?.toUpperCase() == "RROOMS") {
                            const specialHotelIds = [9, 11, 5, 40, 12, 8, 42, 41];
                            const rroomsEmail = specialHotelIds.includes(propertyDetails?.id)
                                ? 'bookinggroup@rrooms.in'
                                : 'rrooms.in@gmail.com';
                            setImmediate(async () => {
                                await Promise.allSettled([
                                    sendBookingNoShowGuest(guestEmail, bookingDetail),
                                    sendBookingNoShowProperty(propertyDetails?.propertyEmailId || 'property@yopmail.com', bookingDetail),
                                    sendBookingNoShowRrooms(rroomsEmail, bookingDetail)
                                ]).then(() => {
                                    console.log("All emails processed");
                                });
                            });
                        }
                    }
                }
                return res.status(200).json({ status: true, msg: "Booking status updated successfully" });
            }
            else
                return res.status(200).json({ status: true, msg: "Booking status updating failed" });
        }).catch(error => {
            console.log(error)
            return res.status(500).json({ status: false, message: error.message });
        })
    },

    async update(req, res, next) {
        try {
            const {
                propertyId,
                propertyRoomsCategoryId,
                userId,
                fromDate,
                toDate,
                noOfRooms,
                adults,
                children,
                paymentMode,
                PaymentStatus,
                bookingStatus,
                bookingAmout,
                checkInDateTime,
                checkOutDateTime,
                bookForOther,
                otherPersonName,
                otherPersonNumber,
                source,
                assignRoomNo,
                collectedPayment,
                guestDetails,
                dueAmount,
                otaBookingId,
                breakFast,
                extraCharge1,
                extraCharge2,
                extraCharge3,
                extraCharge4,
                extraCharge5,
                room1,
                room2,
                room3,
                room4,
                room5,
                bookingHours,
                totalFoodAmount,
                collectedFoodAmout,
                useWalletAmount,
                cuponCode,
                cancelledBy
            } = req.body;
            let getFoodRelatedAmt = await db.BookingHotel.findOne({ where: { id: req.params.id } })
            db.BookingHotel.update({
                propertyId: propertyId,
                propertyRoomsCategoryId: propertyRoomsCategoryId,
                userId: userId,
                fromDate: fromDate,
                toDate: toDate,
                noOfRooms: noOfRooms,
                adults: adults,
                children: children,
                paymentMode: paymentMode,
                PaymentStatus: PaymentStatus,
                bookingStatus: bookingStatus == 7 ? 1 : bookingStatus,
                bookingAmout: bookingAmout,
                //checkInDateTime:checkInDateTime,
                //checkOutDateTime:checkOutDateTime,
                bookForOther: bookForOther,
                otherPersonName: otherPersonName,
                otherPersonNumber: otherPersonNumber,
                source: source,
                assignRoomNo: assignRoomNo,
                collectedPayment: collectedPayment,
                dueAmount: dueAmount,
                otaBookingId: otaBookingId,
                breakFast: breakFast,
                extraCharge1: extraCharge1,
                extraCharge2: extraCharge2,
                extraCharge3: extraCharge3,
                extraCharge4: extraCharge4,
                extraCharge5: extraCharge5,
                room1: room1,
                room2: room2,
                room3: room3,
                room4: room4,
                room5: room5,
                bookingHours: bookingHours,
                totalFoodAmount: totalFoodAmount,
                collectedFoodAmout: collectedFoodAmout,
                useWalletAmount: useWalletAmount,
                cuponCode: cuponCode,
                cancelledBy: cancelledBy
            }, { where: { id: req.params.id } })
                .then(async (updated) => {
                    if (guestDetails && guestDetails.length > 0) {
                        let itemsParams = [];
                        guestDetails.forEach(element => {
                            itemsParams.push({ name: element.name, age: element.age, gender: element.gender, document_number: document_number, document_type: document_type, bookedId: req.params.id, roomNo: element.roomNo })
                        });
                        db.GuestDetails.bulkCreate(itemsParams);
                    }
                    await db.BookingHotel.findOne({ where: { id: req.params.id } }).then(async result => {
                        let dueA = result.dueFoodAmount - (collectedFoodAmout ?? 0);
                        let getCollectAmt = getFoodRelatedAmt.collectedFoodAmout || 0
                        let addColletAmt = getCollectAmt + (collectedFoodAmout ?? 0)
                        if (result.dueFoodAmount) {
                            const percentage = result.foodDiscountPercentage;
                            let getOrdersOfBooking = await db.FoodOrder.findAll({ where: { bookingId: result.id, paymentStatus: 0 } });
                            for (const order of getOrdersOfBooking) {
                                const discount = (order.orderAmount * percentage) / 100;
                                const afterDiscount = order.orderAmount - discount;
                                await order.update({
                                    discountPercentage: percentage,
                                    // afterDiscount: afterDiscount,
                                    // paymentStatus: 1
                                });
                            }
                        }
                        await result.update({
                            dueFoodAmount: dueA,
                            collectedFoodAmout: addColletAmt
                        });
                        return res.status(200).json({ data: result, status: true, msg: "Booking details updated successfully", });
                    })
                        .catch((err) => {
                            console.log(err);
                            return res.status(400).json({ status: false, message: err.message });
                        });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async applyfoodOrderDiscount(req, res, next) {
        const { foodDiscountPercentage, dueFoodAmount, totalFoodDiscountAmount, discountOnFood } = req.body;
        const bookingId = req.params.id;
        try {
            const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
            if (!booking) {
                return res.status(404).json({ status: false, message: 'Booking not found' });
            }
            await booking.update({
                foodDiscountPercentage: foodDiscountPercentage,
                dueFoodAmount: Math.round(dueFoodAmount),
                totalFoodDiscountAmount: Math.round(totalFoodDiscountAmount),
                discountOnFood: discountOnFood
            });
            return res.status(200).json({
                status: true,
                message: 'Food discount removed successfully',
            });
            // running code when discount calculate from backend in room KOT
            // const { totalFoodAmount, collectedFoodAmout = 0 } = booking;
            // let updatedDueAmount = 0;
            // let discountAmount = 0;
            // if (!foodDiscountPercentage || Number(foodDiscountPercentage) === 0) {
            //     updatedDueAmount = totalFoodAmount - collectedFoodAmout;
            //     await booking.update({
            //         foodDiscountPercentage: 0,
            //         dueFoodAmount: Math.round(updatedDueAmount)
            //     });
            //     return res.status(200).json({
            //         status: true,
            //         message: 'Food discount removed successfully',
            //         updatedDueAmount: updatedDueAmount.toFixed(2),
            //         discountAmount: "0.00"
            //     });
            // } else {
            //     discountAmount = (totalFoodAmount * foodDiscountPercentage) / 100;
            //     updatedDueAmount = totalFoodAmount - discountAmount - collectedFoodAmout;
            //     await booking.update({
            //         foodDiscountPercentage: foodDiscountPercentage,
            //         dueFoodAmount: Math.round(updatedDueAmount)
            //     });
            //     return res.status(200).json({
            //         status: true,
            //         message: 'Food discount applied successfully',
            //         updatedDueAmount: updatedDueAmount.toFixed(2),
            //         discountAmount: discountAmount.toFixed(2)
            //     });
            // }
        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    async applyDiscountOnOtherKOT(req, res, next) {
        const { discountPercentage, dueAmount, afterDiscount } = req.body;
        const foodOrderId = req.params.id;
        try {
            const foodOrder = await db.FoodOrder.findOne({ where: { id: foodOrderId } });
            if (!foodOrder) {
                return res.status(404).json({ status: false, message: 'foodOrder not found' });
            }
            await foodOrder.update({
                discountPercentage: discountPercentage,
                dueAmount: Math.round(dueAmount),
                afterDiscount: afterDiscount
            });
            return res.status(200).json({
                status: true,
                message: 'Food discount removed successfully',
            });
            // const foodOrder = await db.FoodOrder.findOne({ where: { id: foodOrderId, paymentStatus: 0 } });
            // if (!foodOrder) {
            //     return res.status(404).json({ status: false, message: 'Food Order not found' });
            // }
            // const { orderAmount = 0, paidAmount = 0 } = foodOrder;
            // let updatedDueAmount = 0;
            // let discountAmount = 0;
            // if (!discountPercentage || Number(discountPercentage) === 0) {
            //     updatedDueAmount = orderAmount - paidAmount;
            //     await foodOrder.update({
            //         discountPercentage: 0,
            //         afterDiscount: Math.round(orderAmount),
            //     });
            //     return res.status(200).json({
            //         status: true,
            //         message: 'Discount removed successfully',
            //         afterDiscount: Math.round(orderAmount),
            //         discountAmount: "0.00"
            //     });
            // } else {
            //     discountAmount = (orderAmount * discountPercentage) / 100;
            //     const discountedTotal = orderAmount - discountAmount;
            //     updatedDueAmount = discountedTotal - paidAmount;
            //     await foodOrder.update({
            //         discountPercentage: discountPercentage,
            //         afterDiscount: Math.round(discountedTotal),
            //     });
            //     return res.status(200).json({
            //         status: true,
            //         message: 'Discount applied successfully',
            //         discountPercentage: discountPercentage,
            //         afterDiscount: Math.round(discountedTotal),
            //         discountAmount: discountAmount.toFixed(2)
            //     });
            // }
        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    // async applyfoodOrderDiscount(req, res, next) {
    //     const { foodDiscountPercentage } = req.body;
    //     const bookingId = req.params.id;
    //     try {
    //         const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
    //         if (!booking) {
    //             return res.status(404).json({ status: false, message: 'Booking not found' });
    //         }
    //         const { totalFoodAmount, collectedFoodAmout = 0 } = booking;
    //         let updatedDueAmount = 0;
    //         let discountAmount = 0;
    //         if (!foodDiscountPercentage || Number(foodDiscountPercentage) === 0) {
    //             updatedDueAmount = totalFoodAmount - collectedFoodAmout;
    //             await booking.update({
    //                 foodDiscountPercentage: 0,
    //                 dueFoodAmount: updatedDueAmount
    //             });
    //             return res.status(200).json({
    //                 status: true,
    //                 message: 'Food discount removed successfully',
    //                 updatedDueAmount: updatedDueAmount.toFixed(2),
    //                 discountAmount: "0.00"
    //             });
    //         } else {
    //             discountAmount = (totalFoodAmount * foodDiscountPercentage) / 100;
    //             updatedDueAmount = totalFoodAmount - discountAmount - collectedFoodAmout;
    //             await booking.update({
    //                 foodDiscountPercentage: foodDiscountPercentage,
    //                 dueFoodAmount: updatedDueAmount
    //             });
    //             return res.status(200).json({
    //                 status: true,
    //                 message: 'Food discount applied successfully',
    //                 updatedDueAmount: updatedDueAmount.toFixed(2),
    //                 discountAmount: discountAmount.toFixed(2)
    //             });
    //         }
    //     } catch (error) {
    //         return res.status(400).json({ status: false, message: error.message });
    //     }
    // },

    // async applyfoodOrderDiscount(req, res, next) {
    //     const { foodDiscountPercentage } = req.body;
    //     try {
    //         const bookingId = req.params.id;
    //         const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
    //         if (!booking) {
    //             return res.status(404).json({ status: false, message: 'Booking not found' });
    //         }
    //         const discountAmount = (booking.totalFoodAmount * foodDiscountPercentage) / 100;
    //         const updatedDueAmount = booking.totalFoodAmount - discountAmount - booking?.collectedFoodAmout;
    //         await booking.update({
    //             foodDiscountPercentage: foodDiscountPercentage,
    //             dueFoodAmount: updatedDueAmount
    //         });
    //         return res.status(200).json({
    //             status: true,
    //             message: 'Food discount applied successfully',
    //             updatedDueAmount: updatedDueAmount.toFixed(2),
    //             discountAmount: discountAmount.toFixed(2)
    //         });
    //     } catch (error) {
    //         return res.status(400).json({ status: false, message: error.message });
    //     }
    // },

    // async removeFoodDiscount(req, res) {
    //     const bookingId = req.params.id;
    //     try {
    //         const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
    //         if (!booking) {
    //             return res.status(404).json({ status: false, message: "Booking not found" });
    //         }
    //         const { totalFoodAmount, collectedFoodAmout } = booking;
    //         let finalizeDueAmount = totalFoodAmount - collectedFoodAmout
    //         const updated = await db.BookingHotel.update(
    //             {
    //                 foodDiscountPercentage: 0,
    //                 dueFoodAmount: finalizeDueAmount
    //             },
    //             { where: { id: bookingId } }
    //         );
    //         return res.status(200).json({ status: true, message: "Food discount removed successfully.", data: updated });
    //     } catch (error) {
    //         return res.status(500).json({ status: false, message: error.message });
    //     }
    // },

    async get(req, res) {
        const { fromDate, toDate, bookingStatus, page, size, order, propertyId } = req.query;
        const { limit, offset } = getPagination(page, size);
        const filter = { source: 'RRooms' };
        if (fromDate && toDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['createdAt'] = {
                [Op.gte]: moment(fromDate).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['createdAt'] = {
                [Op.lte]: moment(toDate).format('YYYY-MM-DD')
            }
        }
        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        }
        // else {
        //     filter['bookingStatus'] = { [Op.not]: 0 }
        // }

        if (propertyId) {
            filter['propertyId'] = parseInt(propertyId)
        } else {
            filter['propertyId'] = { [Op.not]: 0 }
        }

        const selection = {
            include: [
                { model: db.PropertyMaster, attributes: ['id', 'name', 'propertyCode'] },
                { model: db.RroomCategory, attributes: ['id', 'name'] },
                { model: db.User },
                // { model: db.GuestDetails, attributes}
            ],
            where: [filter],
            attributes: ['id', 'bookingCode', 'otaBookingId', 'adults', 'children', 'source', 'checkInDateTime',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedFoodAmout', 'updatedAt',
                'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate', 'totalFoodDiscountAmount', 'discountOnFood'
            ],
            // where: [filter],
            order: [
                ['id', order ? order : 'desc'],
                ['updatedAt', order ? order : 'desc']
            ],
            offset: offset,
            limit: limit,
            distinct: true,
            col: 'id'
        }

        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async getById(req, res) {
        const id = req.params.id;
        const propertySelection = {
            include: [
                {
                    model: db.PropertyMaster, required: false,
                    attributes: ['id', 'propertyCode', 'name', 'locality', 'longitude', 'latitude', 'stateId', 'cityId', 'address', 'pincode', 'gstNumber', 'legalName', 'ownerMobile', 'ownerEmail', 'propertyEmailId', 'propertyMobileNumber'],
                    include: [
                        { model: db.PropertyImage, required: false, attributes: ['title', 'image'] },
                        { model: db.cities, required: false, attributes: ['id', 'name'] },
                        { model: db.states, required: false, attributes: ['id', 'name'] },
                    ]
                },
                //{ model: db.RroomCategory, required: false, attributes: []},
                { model: db.User, required: false },
                {
                    model: db.Payment, required: false, attributes: ["id", "bookedId", "paymentAmount", "paymentMode", "propertyId", "paymentDate", "transactionID"]
                },
                // { model: db.GuestDetails, required: false, attributes: ["id", "bookedId", "name", "age", "gender", "document_number", "document_type"]}
            ],
            attributes: ['id', 'propertyId', 'bookingCode', 'userId', 'propertyRoomsCategoryId', 'fromDate', 'toDate', 'noOfRooms', 'adults', 'children', 'paymentMode', 'paymentStatus', 'bookingStatus', 'bookingAmout', 'bookForOther', 'otherPersonName', 'otherPersonNumber', 'source', 'assignRoomNo', 'assignRoomDetailsId', 'reason', 'collectedPayment', 'dueAmount', 'otaBookingId', 'checkInDateTime', 'checkOutDateTime', 'breakFast', 'extraCharge1', 'extraCharge2', 'extraCharge3', 'extraCharge4', 'extraCharge5', 'room1', 'room2', 'room3', 'room4', 'room5', 'remark', 'totalFoodAmount', 'foodDiscountPercentage', 'dueFoodAmount', 'collectedFoodAmout', 'useWalletAmount', 'discountAmount', 'cancelledBy', 'platform', 'totalFoodDiscountAmount', 'discountOnFood', 'totalFoodAmountBeforeGST', 'bookingTransfered', 'createdAt', 'referenceName'],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: { id: id }
        }
        const selector = Object.assign({}, propertySelection);
        const guests = await db.GuestDetails.findAll({ where: { bookedId: id }, attributes: ["id", "bookedId", "name", "age", "gender", "document_number", "document_type", "roomNo"] })
        db.BookingHotel.findOne(selector)
            .then(result => {
                const booking = result?.toJSON?.() || result;
                if (booking?.PropertyMaster) {
                    if (booking.PropertyMaster.city) {
                        booking.PropertyMaster.cityName = booking.PropertyMaster.city.name;
                        delete booking.PropertyMaster.city;
                    }
                    if (booking.PropertyMaster.state) {
                        booking.PropertyMaster.stateName = booking.PropertyMaster.state.name;
                        delete booking.PropertyMaster.state;
                    }
                }
                return res.status(200).json({
                    data: booking,
                    guest: guests,
                    status: true
                });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async getByBookingCode(req, res) {
        const bookingCode = req.params.id;
        const propertySelection = {
            include: [
                {
                    model: db.PropertyMaster, required: false,
                    include: [
                        { model: db.PropertyImage, required: false },
                    ]
                },
                { model: db.RroomCategory, required: false },
                { model: db.User, required: false },
                { model: db.GuestDetails, required: false }
            ],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: { bookingCode: bookingCode }
        }
        const selector = Object.assign({}, propertySelection);
        db.BookingHotel.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async getBookingDetailsByCode(req, res) {
        const bookingCode = req.params.id;
        const propertySelection = {
            include: [
                {
                    model: db.PropertyMaster, required: false,
                    // include: [
                    //     { model: db.PropertyImage, required: false},
                    // ]
                },
                { model: db.RroomCategory, required: false },
                { model: db.User, required: false },
                { model: db.GuestDetails, required: false },
                { model: db.BookingLogs, required: false },
                { model: db.Payment, required: false },
                { model: db.Transaction, required: false }
            ],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: { bookingCode: bookingCode }
        }
        const selector = Object.assign({}, propertySelection);
        db.BookingHotel.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    /* async getByPropertyId(req, res) {
        const id = req.params.id;
        const { fromDate, toDate, bookingStatus, page, size, order } = req.query;
        const { limit, offset } = getPagination(page, size);
        const filter = {
            propertyId: id
        }
        if (fromDate && toDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['createdAt'] = {
                [Op.gte]: moment(fromDate).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['createdAt'] = {
                [Op.lte]: moment(toDate).format('YYYY-MM-DD')
            }
        }
        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }
        const selection = {
            include: [
                { model: db.PropertyMaster, attributes: ['name', 'propertyCode'] },
                { model: db.RroomCategory, attributes: ['name'] },
                { model: db.User, attributes: ['name', 'email', 'mobile'] },
            ],
            where: [filter],
            attributes: ['id', 'bookingCode', 'adults', 'children', 'source', 'otaBookingId', 'checkInDateTime',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedFoodAmout', 'updatedAt',
                'dueAmount', 'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate', 'referenceName'
            ],
            where: [filter],
            order: [
                ['id', order ? order : 'desc'],
                ['updatedAt', order ? order : 'desc']
            ],
            offset: offset,
            limit: limit,
            distinct: true,
            col: 'id'
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    }, */

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const { fromDate, toDate, bookingStatus, page = 1, limit = 10, order } = req.query;
        const size = parseInt(limit);
        const offset = (parseInt(page) - 1) * size;
        const filter = {
            propertyId: id
        }
        if (fromDate && toDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            filter['createdAt'] = {
                [Op.gte]: moment(fromDate).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            filter['createdAt'] = {
                [Op.lte]: moment(toDate).format('YYYY-MM-DD')
            }
        }
        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }

        const selection = {
            include: [
                { model: db.PropertyMaster, attributes: ['name', 'propertyCode'] },
                { model: db.RroomCategory, attributes: ['name'] },
                { model: db.User, attributes: ['name', 'email', 'mobile'] },
            ],
            where: [filter],
            attributes: ['id', 'bookingCode', 'adults', 'children', 'source', 'otaBookingId', 'checkInDateTime',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedFoodAmout', 'updatedAt',
                'dueAmount', 'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate', 'referenceName', 'foodDiscountPercentage', 'dueFoodAmount', 'discountOnFood', 'totalFoodAmountBeforeGST'
            ],
            where: [filter],
            order: [
                ['id', order ? order : 'desc'],
                ['updatedAt', order ? order : 'desc']
            ],
            offset,
            limit: size,
            distinct: true,
            col: 'id'
        }
        const selector = Object.assign({}, selection);
        await db.BookingHotel.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    // async getBooking(req, res) {
    //     const id = req.params.id;
    //     const {
    //         page = 1,
    //         limit = 10,
    //         order,
    //         guestName,
    //         mobileNumber,
    //         bookingId,
    //         email
    //     } = req.query;
    //     // Manual pagination calculation
    //     const size = parseInt(limit);
    //     const offset = (parseInt(page) - 1) * size;
    //     const filter = {
    //         propertyId: id
    //     };
    //     // Guest/User filters
    //     const userSearch = {};
    //     if (guestName) {
    //         userSearch['name'] = { [Op.like]: `%${guestName}%` };
    //     }
    //     if (mobileNumber) {
    //         userSearch['mobile'] = { [Op.like]: `%${mobileNumber}%` };
    //     }
    //     if (email) {
    //         userSearch['email'] = { [Op.like]: `%${email}%` };
    //     }
    //     // Booking filter
    //     const bookingSearch = {};
    //     if (bookingId) {
    //         bookingSearch['bookingCode'] = { [Op.like]: `%${bookingId}%` };
    //     }
    //     const selection = {
    //         include: [
    //             {
    //                 model: db.PropertyMaster,
    //                 attributes: ['name', 'propertyCode']
    //             },
    //             {
    //                 model: db.RroomCategory,
    //                 attributes: ['name']
    //             },
    //             {
    //                 model: db.User,
    //                 attributes: ['name', 'email', 'mobile'],
    //                 where: Object.keys(userSearch).length ? userSearch : undefined
    //             }
    //         ],
    //         where: {
    //             ...filter,
    //             ...bookingSearch
    //         },
    //         attributes: [
    //             'id', 'bookingCode', 'adults', 'children', 'source', 'otaBookingId', 'checkInDateTime',
    //             'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount',
    //             'collectedFoodAmout', 'updatedAt', 'dueAmount', 'breakFast', 'paymentMode', 'bookingStatus',
    //             'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate',
    //             'referenceName'
    //         ],
    //         order: [
    //             ['id', order || 'desc'],
    //             ['updatedAt', order || 'desc']
    //         ],
    //         offset: offset,
    //         limit: size,
    //         distinct: true,
    //         col: 'id'
    //     };
    //     try {
    //         const result = await db.BookingHotel.findAndCountAll(selection);
    //         const totalPages = Math.ceil(result.count / limit);
    //         return res.status(200).json({
    //             status: true,
    //             data: result.rows,
    //             totalItems: result.count,
    //             totalPages: totalPages,
    //             currentPage: parseInt(page)
    //         });
    //     } catch (err) {
    //         return res.status(400).json({ status: false, message: err.message });
    //     }
    // },

    async getBooking(req, res) {
        const {
            page = 1,
            limit = 10,
            order,
            search, propertyId
        } = req.query;
        const size = parseInt(limit);
        const offset = (parseInt(page) - 1) * size;
        const filter = {};
        if (propertyId) {
            filter.propertyId = propertyId;
        }
        const bookingWhere = { ...filter };
        let userWhere = undefined;
        // 1. If search is present, find matching user IDs and add other booking filters
        if (search) {
            const likeQuery = { [Op.like]: `%${search}%` };
            // Fetch matching users
            const matchedUsers = await db.User.findAll({
                attributes: ['id'],
                where: {
                    [Op.or]: [
                        { name: likeQuery },
                        { email: likeQuery },
                        { mobile: likeQuery }
                    ]
                }
            });
            const userIds = matchedUsers.map(user => user.id);
            // Add condition to match users OR booking fields
            bookingWhere[Op.or] = [
                { bookingCode: likeQuery },
                { otaBookingId: likeQuery },
                userIds.length ? { userId: { [Op.in]: userIds } } : null
            ].filter(Boolean); // remove nulls
        }
        const selection = {
            include: [
                {
                    model: db.PropertyMaster,
                    attributes: ['name', 'propertyCode']
                },
                {
                    model: db.RroomCategory,
                    attributes: ['name']
                },
                {
                    model: db.User,
                    attributes: ['name', 'email', 'mobile']
                }
            ],
            where: bookingWhere,
            attributes: [
                'id', 'bookingCode', 'adults', 'children', 'source', 'otaBookingId', 'checkInDateTime',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount',
                'collectedFoodAmout', 'updatedAt', 'dueAmount', 'breakFast', 'paymentMode', 'bookingStatus',
                'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate',
                'referenceName'
            ],
            order: [
                ['id', order || 'desc'],
                ['updatedAt', order || 'desc']
            ],
            offset,
            limit: size,
            distinct: true,
            col: 'id'
        };
        try {
            const result = await db.BookingHotel.findAndCountAll(selection);
            const totalPages = Math.ceil(result.count / size);
            return res.status(200).json({
                status: true,
                data: result.rows,
                totalItems: result.count,
                totalPages,
                currentPage: parseInt(page)
            });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },

    async getByUserId(req, res) {
        const id = req.params.id;
        // const { page = 1, limit = 10 } = req.query;
        if (!id) {
            return res.status(400).json({ status: false, message: 'User id is required!' });
        }
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        page = isNaN(page) || page < 1 ? 1 : page;
        limit = isNaN(limit) || limit < 1 ? 10 : limit;
        const offset = (page - 1) * limit;
        // const offset = (page - 1) * limit;
        const selection = {
            attributes: ['id', 'bookingCode', 'propertyId', 'propertyRoomsCategoryId', 'adults', 'children', 'noOfRooms', 'fromDate', 'toDate', 'bookingAmout', 'assignRoomNo', 'assignRoomDetailsId', 'breakFast', 'userId', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'source', 'paymentMode', 'PaymentStatus', 'collectedPayment', 'dueAmount'],
            include: [
                {
                    model: db.PropertyMaster, required: false, attributes: ["name", 'longitude', 'latitude', 'id', 'locality', 'cityId', 'address'],
                    include: [
                        { model: db.PropertyImage, required: false, attributes: ['id', 'propertyId', 'title', 'image'] },
                        { model: db.cities, required: false, attributes: ['id', 'name'] }
                    ]
                },
                { model: db.User, required: false, attributes: ['id', 'name', 'email', 'mobile'] },
                { model: db.GuestDetails, required: false },
                {
                    model: db.FoodOrder, required: false, attributes: ["id", 'bookingId', 'roomNumber', 'orderAmount', 'orderStatus', 'orderNote', 'orderItems', 'remark'],
                },
                {
                    model: db.RroomCategory, required: false, attributes: ['id', 'name']
                }
            ],
            order: [
                ['id', 'DESC'],
                ['createdAt', 'DESC']
            ],
            where: { userId: id, bookingStatus: { [Op.not]: 0 } },
            limit: limit,
            offset: offset,
        };
        const selector = Object.assign({}, selection);
        const count = await db.BookingHotel.count({
            where: { userId: id, bookingStatus: { [Op.not]: 0 } }
        });
        const rows = await db.BookingHotel.findAll(selector);
        const updatedResult = rows?.map(booking => {
            const bookingJson = booking.toJSON();
            const { RroomCategory, ...rest } = bookingJson;  // <-- omit RroomCategory
            if (rest.PropertyMaster) {
                const propMaster = rest.PropertyMaster;
                if (propMaster.city && typeof propMaster.city === 'object' && propMaster.city.name) {
                    propMaster.city = propMaster.city.name;
                }
            }
            return {
                ...rest,  // <-- spread everything except RroomCategory
                roomCategoryName: RroomCategory ? RroomCategory.name : null,
            };
        });
        return res.status(200).json({
            data: updatedResult,
            status: true,
            pagination: {
                totalRecords: count,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            },
        });
    },

    // async getByUserId(req, res) {
    //     const id = req.params.id;
    //     const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    //     if (!id) {
    //         return res.status(400).json({ status: false, message: 'User id is required!' });
    //     }
    //     const offset = (page - 1) * limit; // Calculate offset for pagination
    //     const selection = {
    //         attributes: ['id', 'bookingCode', 'propertyId', 'propertyRoomsCategoryId', 'adults', 'children', 'noOfRooms', 'fromDate', 'toDate', 'bookingAmout', 'assignRoomNo', 'assignRoomDetailsId', 'breakFast', 'userId', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'source'],
    //         include: [
    //             {
    //                 model: db.PropertyMaster, required: false, attributes: ["name", 'longitude', 'latitude', 'id', 'locality',],
    //                 include: [
    //                     { model: db.PropertyImage, required: false },
    //                 ]
    //             },
    //             //{ model: db.RroomCategory, required: false},
    //             { model: db.User, required: false, attributes: ['id', 'name', 'email', 'mobile'] },
    //             { model: db.GuestDetails, required: false },
    //             {
    //                 model: db.FoodOrder, required: false, attributes: ["id", 'bookingId', 'roomNumber', 'orderAmount', 'orderStatus', 'orderNote', 'orderItems', 'remark'],
    //             },
    //         ],
    //         order: [
    //             ['id', 'DESC'],
    //             ['createdAt', 'DESC']
    //         ],
    //         where: { userId: id, bookingStatus: { [Op.not]: 0 } },
    //         limit: parseInt(limit),
    //         offset: parseInt(offset),
    //     }
    //     const selector = Object.assign({}, selection);
    //     db.BookingHotel.findAll(selector)
    //         .then(result => {
    //             return res.status(200).json({ data: result, status: true });
    //         })
    //         .catch((err) => {
    //             res.send(err);
    //         });
    // },

    async filterBooking(req, res) {
        const { fromDate, toDate, noOfRooms, paymentMode, PaymentStatus, bookingStatus, order, page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        const filter = await createAtDateFormat(fromDate, toDate)

        if (bookingStatus) {
            filter['bookingStatus'] = parseInt(bookingStatus)
        } else {
            filter['bookingStatus'] = { [Op.not]: 0 }
        }

        if (noOfRooms)
            filter['noOfRooms'] = noOfRooms

        if (paymentMode)
            filter['paymentMode'] = paymentMode

        if (PaymentStatus)
            filter['PaymentStatus'] = PaymentStatus


        const selection = {
            include: [
                { model: db.PropertyMaster, attributes: ['name', 'propertyCode'] },
                { model: db.RroomCategory, attributes: ['name'] },
                { model: db.User, attributes: ['name', 'email'] }
            ],
            where: [filter],
            attributes: ['id', 'bookingCode', 'adults', 'source', 'checkInDateTime',
                'checkOutDateTime', 'noOfRooms', 'bookingHours', 'bookingAmout', 'totalFoodAmount', 'collectedFoodAmout', 'updatedAt',
                'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName', 'assignRoomNo', 'fromDate', 'toDate'
            ],
            order: [
                ['id', order ? order : 'desc'],
                ['updatedAt', order ? order : 'desc']
            ],
            offset: offset,
            limit: limit,
            distinct: true,
            col: 'id'
        }
        const selector = Object.assign({}, selection);

        await db.BookingHotel.findAndCountAll(selector).then(result => {
            return res.status(200).json({ ...getPagingData(result, page, limit), status: true });
        }).catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async delete(req, res, next) {
        await db.BookingHotel.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },

    async addGuestDetailsByBookingId(req, res, next) {
        const {
            name,
            age,
            gender,
            bookedId,
            document_number,
            roomNo,
            document_type
        } = req.body;
        let itemsParams = [];
        itemsParams.push({ name: name, age: age, gender: gender, bookedId: bookedId, document_number: document_number, document_type: document_type, roomNo: roomNo })
        db.GuestDetails.bulkCreate(itemsParams).then(result => {
            if (result) {
                return res.status(200).json({ status: true, msg: 'Guest added successfully' });
            } else {
                return res.status(200).json({ status: false, msg: 'Guest adding failed!' });
            }

        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },

    async deleteGuestDetailById(req, res, next) {
        await db.GuestDetails.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },

    async payAmout(req, res, next) {
        const { bookedId, paymentAmount, paymentMode, propertyId, transactionID } = req.body;
        console.log(bookedId, paymentAmount, paymentMode, propertyId, transactionID);
        await db.Payment.create({
            bookedId: bookedId,
            paymentAmount: paymentAmount,
            paymentMode: paymentMode,
            propertyId: propertyId,
            paymentDate: new Date(),
            transactionID: transactionID
        }).then(result => {
            if (result) {
                db.BookingHotel.findOne({ where: { id: bookedId } })
                    .then(booking => {
                        if (booking) {
                            const boookingAmount = booking?.dataValues?.bookingAmout;
                            console.log("boookingAmount - ", boookingAmount);

                            const collectedPayment = booking?.dataValues?.collectedPayment + paymentAmount;
                            console.log("collectedPayment - ", collectedPayment);

                            const dueAmount = booking?.dataValues?.dueAmount - paymentAmount;
                            console.log("dueAmount - ", dueAmount);

                            result['dataValues']['totalPayment'] = collectedPayment;
                            console.log("collectedPayment - ", collectedPayment);
                            result['dataValues']['dueAmount'] = dueAmount > 0 ? dueAmount : 0;
                            booking.update({ collectedPayment: collectedPayment, dueAmount: dueAmount > 0 ? dueAmount : 0, PaymentStatus: dueAmount == 0 ? 1 : 0 });
                            return res.status(200).json({ status: true, data: result, message: "Payment done successfully" });
                        } else {
                            return res.status(200).json({ status: false, data: result, message: "Payment failed due to missing booking id" });
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({ status: false, message: err.message });
                    });
            }
            else {
                return res.status(500).json({ status: false, message: 'Payment failed' });
            }
        }).catch(error => {
            return res.status(500).json({ status: false, message: error.message });
        })
    },

    async updatePaymentDetails(req, res, next) {
        const { bookedId, paymentAmount, paymentMode, propertyId, transactionID } = req.body;
        await db.Payment.update(
            {
                bookedId: bookedId,
                paymentAmount: paymentAmount,
                paymentMode: paymentMode,
                propertyId: propertyId,
                transactionID: transactionID
            },
            { where: { id: req.params.id } }
        ).then(result => {
            if (result)
                return res.status(200).json({ status: true, message: "Payment updated successfully" });
            else
                return res.status(500).json({ status: false, message: "Payment updating failed" });
        }).catch(error => {
            return res.status(500).json({ status: false, message: error.message });
        })
    },

    async getPaymentList(req, res) {
        const { id, bookedId, propertyId, paymentDate, fromDate, toDate, paymentMode, type, page, limit } = req.body;

        const filter = await createAtDateFormat(fromDate, toDate)
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 20;
        const offset = (pageNumber - 1) * limitNumber;
        if (id) {
            filter['id'] = id;
        }
        if (bookedId) {
            filter['bookedId'] = bookedId
        }
        if (propertyId) {
            filter['propertyId'] = propertyId
        }
        if (paymentMode) {
            filter['paymentMode'] = paymentMode
        }
        let paymentSelection;
        if (type == 'room-payment') {
            paymentSelection = {
                where: [filter]
            }
        } else {
            paymentSelection = {
                include: [
                    { model: db.PropertyMaster, required: false },
                    { model: db.BookingHotel, required: false }
                ],
                where: [filter],
                limit: limitNumber,  // Set limit for pagination
                offset: offset       // Set offset for pagination
            }
        }
        const selector = Object.assign({}, paymentSelection);
        await db.Payment.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        }).catch((err) => {
            return res.status(500).json({ status: false, message: err.message });
        });
    },

    // async downloadPaymentCollectionReport(req, res) {
    //     try {
    //         const { fromdate, todate } = req.query;
    //         const whereClause = { deletedAt: null };
    //         if (fromdate && todate) {
    //             whereClause.createdAt = {
    //                 [Op.between]: [new Date(fromdate), new Date(todate)],
    //             };
    //         }
    //         const data = await db.Payment.findAll({
    //             where: whereClause,
    //             include: [
    //                 {
    //                     model: db.BookingHotel,
    //                     attributes: ['bookingCode', 'assignRoomNo', 'otherPersonName', 'otherPersonNumber','source'],
    //                 }
    //             ],
    //             order: [['createdAt', 'DESC']],
    //         });
    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet('Payment Collection Report');
    //         worksheet.columns = [
    //             { header: 'Source', key: 'source', width: 15 },
    //             { header: 'Room Number', key: 'roomNumber', width: 15 },
    //             { header: 'Booking ID', key: 'bookingCode', width: 20 },
    //             { header: 'Guest Name', key: 'guestName', width: 20 },
    //             { header: 'Payment Amount', key: 'paymentAmount', width: 20 },
    //             { header: 'Payment Mode', key: 'paymentMode', width: 15 },
    //             { header: 'Transaction ID', key: 'transactionID', width: 25 },
    //             { header: 'Payment Date', key: 'paymentDate', width: 20 },
    //         ];
    //         let totalAmount = 0;
    //         data.forEach(item => {
    //             totalAmount += parseFloat(item.paymentAmount || 0);
    //             worksheet.addRow({
    //                 source: item.booking?.source || '',
    //                 roomNumber: item.booking?.assignRoomNo || '',
    //                 bookingCode: item.booking ? `#${item.booking.bookingCode}` : '',
    //                 guestName: item.booking?.otherPersonName || '',
    //                 paymentAmount: item.paymentAmount,
    //                 paymentMode: getModeText(item.paymentMode),
    //                 transactionID: item.transactionID || '',
    //                 paymentDate: formatDate(item.paymentDate),
    //             });
    //         });
    //         worksheet.addRow({});
    //         worksheet.addRow({ paymentAmount: 'Total', transactionID: totalAmount });
    //         res.setHeader(
    //             'Content-Type',
    //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //         );
    //         res.setHeader(
    //             'Content-Disposition',
    //             'attachment; filename=payment-collection-report.xlsx'
    //         );
    //         await workbook.xlsx.write(res);
    //         res.end();
    //     } catch (error) {
    //         console.error('Excel export error:', error);
    //         res.status(500).json({ status: false, message: 'Internal server error' });
    //     }
    // },

    async downloadPaymentCollectionReport(req, res) {
        try {
            const { fromdate, todate } = req.query;
            const whereClause = { deletedAt: null };
            if (fromdate && todate) {
                // whereClause.createdAt = {
                //     [Op.between]: [new Date(fromdate), new Date(todate)],
                // };
                const from = new Date(fromdate);
                const to = new Date(todate);
                to.setDate(to.getDate() + 1);
                whereClause.createdAt = {
                    [Op.gte]: from,
                    [Op.lt]: to
                };
            }
            const data = await db.Payment.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.BookingHotel,
                        attributes: [
                            'id', 'bookingCode', 'assignRoomNo', 'userId',
                            'otherPersonName', 'otherPersonNumber', 'source'
                        ],
                        include: [
                            {
                                model: db.User,
                                attributes: ['name'],
                                required: false
                            }
                        ]
                    },
                    {
                        model: db.PropertyMaster,
                        attributes: ['name'],
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Payment Collection Report');
            worksheet.columns = [
                { header: 'Property Name', key: 'propertyName', width: 25 },
                { header: 'Booking Code', key: 'bookingCode', width: 15 },
                { header: 'Source', key: 'source', width: 12 },
                { header: 'Room Number', key: 'roomNumber', width: 16 },
                { header: 'Guest Name', key: 'guestName', width: 20 },
                { header: 'Payment Amount', key: 'paymentAmount', width: 19 },
                { header: 'Payment Mode', key: 'paymentMode', width: 18 },
                { header: 'Transaction ID', key: 'transactionID', width: 20 },
                { header: 'Payment Date', key: 'paymentDate', width: 18 },
            ];
            let totalAmount = 0;
            data.forEach(item => {
                const booking = item.BookingHotel;
                const user = booking?.User;
                const property = item?.PropertyMaster;
                const guestName = booking?.userId && booking?.userId != 0 && user?.name
                    ? user.name
                    : booking?.otherPersonName || '';
                totalAmount += parseFloat(item.paymentAmount || 0);
                worksheet.addRow({
                    propertyName: property?.name || '',
                    source: booking?.source || '',
                    roomNumber: booking?.assignRoomNo || '',
                    bookedId: item.bookedId,
                    bookingCode: booking ? `#${booking.bookingCode}` : '',
                    guestName: guestName,
                    paymentAmount: Number(item.paymentAmount),
                    paymentMode: getModeText(item.paymentMode),
                    transactionID: item.transactionID || '',
                    paymentDate: formatDate(item.paymentDate),
                });
            });
            worksheet.addRow({});
            worksheet.addRow({});
            const totalRowNumber = worksheet.lastRow.number + 1;
            worksheet.mergeCells(`A${totalRowNumber}:E${totalRowNumber}`); // Merge A to E
            worksheet.getCell(`A${totalRowNumber}`).value = 'Total';
            worksheet.getCell(`A${totalRowNumber}`).font = { bold: true };
            worksheet.getCell(`A${totalRowNumber}`).alignment = { horizontal: 'center' };
            worksheet.getCell(`F${totalRowNumber}`).value = totalAmount;
            worksheet.getCell(`F${totalRowNumber}`).font = { bold: true };
            worksheet.getRow(1).eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' },
                };
                cell.font = {
                    color: { argb: 'FFFFFF' },
                    bold: true,
                };
            });
            worksheet.autoFilter = {
                from: 'A1',
                to: 'I1',
            };
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=payment-collection-report.xlsx'
            );
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Excel export error:', error);
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    },

    async downloadRevenueReport(req, res) {
        try {
            const { fromdate, todate, filter, userType } = req.query;
            const whereClause = { deletedAt: null, bookingStatus: 3 };
            const startOfDay = (date) => new Date(new Date(date).setHours(0, 0, 0, 0));
            const endOfDay = (date) => new Date(new Date(date).setHours(23, 59, 59, 999));
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            if (filter === 'today') {
                whereClause.createdAt = {
                    [Op.between]: [startOfDay(today), endOfDay(today)],
                };
            } else if (filter === 'yesterday') {
                whereClause.createdAt = {
                    [Op.between]: [startOfDay(yesterday), endOfDay(yesterday)],
                };
            } else if (filter === 'mtd') {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                whereClause.createdAt = {
                    [Op.between]: [startOfDay(firstDay), endOfDay(today)],
                };
            } else if (fromdate && todate) {
                whereClause.createdAt = {
                    [Op.between]: [startOfDay(fromdate), endOfDay(todate)],
                };
            }
            if (userType == 'RROOMS') {
                whereClause.source = 'RRooms';
            }
            const bookings = await db.BookingHotel.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.PropertyMaster,
                        attributes: ['name', 'propertyCode'],
                        required: false
                    },
                    {
                        model: db.User,
                        attributes: ['name', 'mobile'],
                        required: false
                    },
                    {
                        model: db.RroomCategory,
                        attributes: ['name'],
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Booking Report');
            worksheet.columns = [
                { header: 'Property Code', key: 'propertyCode', width: 20 },
                { header: 'Property Name', key: 'propertyName', width: 20 },
                { header: 'Booking ID', key: 'bookingCode', width: 15 },
                { header: 'Name', key: 'guestName', width: 20 },
                { header: 'Guest Mobile', key: 'guestMobile', width: 20 },
                { header: 'Source', key: 'source', width: 15 },
                { header: 'Reference Name', key: 'referenceName', width: 18 },
                { header: 'Room Type', key: 'roomType', width: 22 },
                { header: 'No. Rooms', key: 'noOfRooms', width: 12 },
                { header: 'No. Nights', key: 'noOfNights', width: 12 },
                { header: 'No. Adults', key: 'adults', width: 12 },
                { header: 'Room Nos', key: 'assignRoomNo', width: 15 },
                { header: 'Mealplan', key: 'mealPlan', width: 10 },
                { header: 'Local/Outstation', key: 'localOutstation', width: 20 },
                { header: 'Check In Date', key: 'checkIn', width: 18 },
                { header: 'Check Out Date', key: 'checkOut', width: 18 },
                { header: 'Room Tariff Total', key: 'tariff', width: 18 },
                { header: 'Extra Charges', key: 'extraCharges', width: 15 },
                { header: 'POS Order Amount', key: 'posOrder', width: 18 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
            ];
            for (let booking of bookings) {
                const extraCharges = [1, 2, 3, 4, 5].reduce((sum, i) => {
                    const chargeStr = booking[`extraCharge${i}`];
                    if (chargeStr) {
                        try {
                            const chargeObj = JSON.parse(chargeStr);
                            return sum + (parseFloat(chargeObj.price) || 0);
                        } catch (err) {
                            console.warn(`Invalid JSON in extraCharge${i}:`, chargeStr);
                        }
                    }
                    return sum;
                }, 0);
                const extraRooms = [1, 2, 3, 4, 5].reduce((sum, i) => {
                    const chargeStr = booking[`room${i}`];
                    if (chargeStr) {
                        try {
                            const chargeObj = JSON.parse(chargeStr);
                            return sum + (parseFloat(chargeObj.amount) || 0);
                        } catch (err) {
                            console.warn(`Invalid JSON in rooms${i}:`, chargeStr);
                        }
                    }
                    return sum;
                }, 0);
                const posAmount = (booking.FoodOrders || []).reduce((sum, order) => {
                    return sum + (parseFloat(order.totalAmount) || 0);
                }, 0);
                const total = parseInt(booking.bookingAmout || 0) + extraCharges + extraRooms + parseInt(booking?.totalFoodAmount);
                worksheet.addRow({
                    propertyCode: booking.PropertyMaster?.propertyCode || '-',
                    propertyName: booking.PropertyMaster?.name || '-',
                    bookingCode: `#${booking.bookingCode}`,
                    guestName: booking?.userId && booking?.userId != 0
                        ? booking?.User?.name || '-'
                        : booking?.otherPersonName || '-',
                    // guestMobile: booking?.userId && booking?.userId != 0
                    //     ? booking?.User?.mobile
                    //     : booking?.otherPersonNumber || '',
                    guestMobile:
                        userType !== 'RROOMS' && booking?.source === 'RRooms'
                            ? '-'
                            : booking?.userId && booking?.userId != 0
                                ? booking?.User?.mobile
                                : booking?.otherPersonNumber || '-',
                    source: booking.source,
                    referenceName: booking.referenceName || '-',
                    roomType: booking.RroomCategory?.name || '-',
                    noOfRooms: booking.noOfRooms,
                    noOfNights: (() => {
                        const from = new Date(booking.fromDate);
                        const to = new Date(booking.toDate);
                        const diff = to.getTime() - from.getTime();
                        return Math.ceil(diff / (1000 * 60 * 60 * 24));
                    })(),
                    adults: booking.adults,
                    assignRoomNo: booking.assignRoomNo,
                    mealPlan: mealPlanMap[booking.breakFast] || '-',
                    localOutstation: booking.localOutstation || '-',
                    checkIn: formatDate(booking.fromDate),
                    checkOut: formatDate(booking.toDate),
                    tariff: booking.bookingAmout,
                    extraCharges: extraCharges + extraRooms,
                    posOrder: booking.totalFoodAmount,
                    totalAmount: total
                });
            }
            worksheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' },
                };
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=booking-report.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Download Booking Report Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    async getRoomsAviability(req, res, next) {
        const {
            propertyId,
            categoryId
        } = req.body;
        const conditions = []
        if (propertyId) {
            conditions.push({ propertyId: propertyId })
        }

        if (categoryId) {
            conditions.push({ categoryId: categoryId })
        }

        const roomSelection = {
            include: [
                {
                    model: db.RroomCategory, required: true,
                    include: [
                        { model: db.RoomDetails, required: false },
                    ]
                }
            ],
            where: conditions
        }

        const selector = Object.assign({}, roomSelection);
        await db.Rooms.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.status(500).json({ status: false, message: err.message });
            });
    },

    async assignRoomByBookingId(req, res, next) {
        const {
            bookedId,
            roomDetailsId,
            room1, room2, room3, room4, room5
        } = req.body;
        db.BookingHotel.findOne({ where: { id: bookedId } }).then(async (booking) => {
            if (booking) {
                let roomNumber = []
                if (roomDetailsId && roomDetailsId.length > 0) {
                    roomNumber = await db.RoomDetails.findAll({ attributes: ["roomNumber"], where: { id: roomDetailsId } }).map(u => u.get("roomNumber"));
                }
                //Release pervious assigned rooms
                const assignedRoomDetailsIds = booking.get('assignRoomDetailsId') ? booking.get('assignRoomDetailsId')?.split(',') : null;
                if (assignedRoomDetailsIds && assignedRoomDetailsIds.length > 0) {
                    await db.RoomDetails.update({ status: 0 }, { where: { id: assignedRoomDetailsIds } });
                }
                //Reassign rooms
                // booking.update({ assignRoomNo: roomNumber.join(","), assignRoomDetailsId: roomDetailsId.join(',') })

                // Prepare update object
                const updateData = {
                    assignRoomNo: roomNumber.join(","),
                    assignRoomDetailsId: roomDetailsId.join(',')
                };
                if (room1) updateData.room1 = room1;
                if (room2) updateData.room2 = room2;
                if (room3) updateData.room3 = room3;
                if (room4) updateData.room4 = room4;
                if (room5) updateData.room5 = room5;
                await booking.update(updateData);
                await db.RoomDetails.update({ status: 1 }, { where: { id: roomDetailsId } });
                return res.status(200).json({ status: true, msg: "Room assigned successfully" });
            } else {
                return res.status(200).json({ status: false, msg: "No details found by this booked id" });
            }
        }).catch(err => {
            res.status(500).json({ status: false, message: err.message });
        })
    },

    // async removeExtraCharges(req, res) {
    //     const id = req.params.id;
    //     const { extraCharge1, extraCharge2, extraCharge3, extraCharge4, extraCharge5, removePrice } = req.body;
    //     try {
    //         if (extraCharge1) updateData.extraCharge1 = null;
    //         if (extraCharge2) updateData.extraCharge2 = null;
    //         if (extraCharge3) updateData.extraCharge3 = null;
    //         if (extraCharge4) updateData.extraCharge4 = null;
    //         if (extraCharge5) updateData.extraCharge5 = null;
    //         if (Object.keys(updateData).length === 0) {
    //             return res.status(400).json({
    //                 status: false,
    //                 message: "No extraCharge fields provided to remove.",
    //             });
    //         }
    //         const result = await db.BookingHotel.update(updateData, {
    //             where: { id },
    //         });
    //         return res.status(200).json({
    //             data: result,
    //             status: true,
    //             message: "Extra charges removed successfully.",
    //         });
    //     } catch (error) {
    //         return res.status(400).json({
    //             status: false,
    //             message: error.message,
    //         });
    //     }
    // },

    async removeExtraCharges(req, res) {
        const id = req.params.id;
        const {
            extraCharge1,
            extraCharge2,
            extraCharge3,
            extraCharge4,
            extraCharge5,
            removePrice
        } = req.body;
        try {
            // Fetch current booking to get dueAmount
            const booking = await db.BookingHotel.findByPk(id);
            if (!booking) {
                return res.status(404).json({
                    status: false,
                    message: "Booking not found.",
                });
            }
            // Prepare update data
            const updateData = {};
            // Only subtract removePrice if it's a valid number
            const priceToRemove = Number(removePrice);
            if (!isNaN(priceToRemove) && priceToRemove > 0) {
                updateData.dueAmount = booking.dueAmount - priceToRemove;
            }
            // Nullify only the extraCharge fields passed
            if (extraCharge1) updateData.extraCharge1 = null;
            if (extraCharge2) updateData.extraCharge2 = null;
            if (extraCharge3) updateData.extraCharge3 = null;
            if (extraCharge4) updateData.extraCharge4 = null;
            if (extraCharge5) updateData.extraCharge5 = null;
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "No valid fields provided to update.",
                });
            }
            await db.BookingHotel.update(updateData, { where: { id } });
            return res.status(200).json({
                status: true,
                message: "Extra charges removed successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    async createLog(req, res) {
        const { bookingId, action, paymentMode, activityType, actionBy, userType, remark, propertyId } = req.body;
        db.BookingLogs.create({ bookingId, action, paymentMode, activityType, actionBy, userType, remark, propertyId }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Log created successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async updateLog(req, res) {
        const id = req.params.id
        const { bookingId, action, actionBy, userType, remark, propertyId } = req.body;
        db.BookingLogs.update({ bookingId, action, actionBy, userType, remark, propertyId }, { where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Log updated successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async getBookingLogById(req, res) {
        const id = req.params.id;
        const fieldDetails = {
            include: [
                { model: db.BookingHotel, required: false }
            ],
            where: { id: id }
        }
        db.BookingLogs.findOne(fieldDetails).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Room assigned successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async getBookingLogByBookingId(req, res) {
        const id = req.params.id;
        const fieldDetails = {
            // include: [
            //     { model: db.BookingHotel, required: false, attributes: ['']}
            // ],
            where: { bookingId: id },
            attributes: ['bookingId', 'action', 'paymentMode', 'activityType', 'actionBy', 'userType', 'remark', 'propertyId', 'createdAt']
        }
        db.BookingLogs.findAll(fieldDetails).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Room assigned successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async getBookingLogs(req, res) {
        const fieldDetails = {
            include: [
                { model: db.BookingHotel, required: false }
            ]
        }
        db.BookingLogs.findAll(fieldDetails).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Room assigned successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async deleteLog(req, res) {
        const id = req.params.id;
        db.BookingLogs.destroy({ where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Log deleted" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async deleteLogByBookingId(req, res) {
        const id = req.params.id;
        db.BookingLogs.destroy({ where: { bookingId: id } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Log deleted" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async generateBookingAuditTrailPDF(req, res) {
        try {
            const { propertyId, fromDate, toDate } = req.query;
            if (!propertyId || !fromDate || !toDate) {
                return res.status(400).json({ message: 'propertyId, fromDate, and toDate are required' });
            }
            const logs = await db.BookingLogs.findAll({
                where: {
                    propertyId,
                    createdAt: {
                        [Op.between]: [new Date(fromDate), new Date(toDate)],
                    },
                },
                include: [{
                    model: db.PropertyMaster,
                    as: 'property',
                    attributes: ['id', 'propertyCode', 'name'],
                }],
                order: [['bookingId', 'ASC'], ['createdAt', 'ASC']],
            });
            const propertyName = logs[0]?.property?.name || 'N/A';
            const groupedLogs = logs.reduce((acc, log) => {
                if (!acc[log.bookingId]) {
                    acc[log.bookingId] = [];
                }
                acc[log.bookingId].push(log);
                return acc;
            }, {});
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 50, right: 50 }
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="BookingAuditTrail_${propertyName.replace(/\s+/g, '_')}.pdf"`
            );
            doc.pipe(res);
            doc
                .fontSize(14)
                .fillColor('#000080')
                .text(propertyName, doc.page.margins.left, doc.y, { align: 'left', continued: true })
                .fillColor('red')
                .text('Audit Trails', { align: 'right' });
            doc.moveDown(0.5);
            doc.fillColor('black').fontSize(10)
                .text(`Date From: ${fromDate}`, doc.page.margins.left, doc.y, { continued: true })
                .text(`   To: ${toDate}`, { align: 'right' });
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            if (!logs.length) {
                doc.moveDown().text('No booking logs found for the selected date range.');
            } else {
                let resCounter = 1;
                for (const bookingId in groupedLogs) {
                    const logsPerBooking = groupedLogs[bookingId];
                    doc.moveDown(1)
                        .fontSize(11)
                        .fillColor('#000')
                        .font('Helvetica-Bold')
                        .text(`Res. No: ${resCounter++}   Booking ID: ${bookingId}`, doc.page.margins.left);
                    doc.moveDown(0.3);
                    logsPerBooking.forEach((log) => {
                        const logDate = new Date(log.createdAt);
                        const dateStr = logDate.toLocaleDateString();
                        const timeStr = logDate.toLocaleTimeString();
                        doc
                            .fontSize(10)
                            .font('Helvetica-Bold')
                            .text(`Operation : ${log.activityType || 'N/A'}`, doc.page.margins.left);
                        doc
                            .font('Helvetica')
                            .text(`Guest: ${log.actionBy || 'N/A'}`, { continued: true })
                            .text(`   User: ${log.userType || 'N/A'}`, { continued: true })
                            .text(`   Date: ${dateStr}`, { continued: true })
                            .text(`   Time: ${timeStr}`);
                        if (log.action) {
                            doc.font('Helvetica-Bold').text('Particular : ', { continued: true });
                            doc.font('Helvetica').text(log.action);
                        }
                        if (log.paymentMode) {
                            doc.font('Helvetica-Bold').text('Payment Mode : ', { continued: true });
                            doc.font('Helvetica').text(log.paymentMode);
                        }
                        if (log.remark) {
                            doc.font('Helvetica-Bold').text('Remark : ', { continued: true });
                            doc.font('Helvetica').text(log.remark);
                        }
                        doc.moveDown(0.3);
                        const separatorY = doc.y;
                        doc
                            .moveTo(doc.page.margins.left, separatorY)
                            .lineTo(doc.page.width - doc.page.margins.right, separatorY)
                            .dash(2, { space: 2 })
                            .stroke()
                            .undash();
                        doc.moveDown(0.5);
                    });
                }
            }
            doc.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to generate report' });
        }
    },

    async generateKitchenAuditTrailPDF(req, res) {
        try {
            const { propertyId, fromDate, toDate } = req.query;
            if (!propertyId || !fromDate || !toDate) {
                return res.status(400).json({ message: 'propertyId, fromDate, and toDate are required' });
            }
            const start = new Date(fromDate.split(' ')[0]);
            start.setHours(5, 30, 0, 0); // IST start of day
            const end = new Date(toDate.split(' ')[0]);
            end.setHours(29, 59, 59, 999); // IST end of day
            const logs = await db.KitchenLogs.findAll({
                where: {
                    propertyId: Number(propertyId),
                    createdAt: {
                        [Op.between]: [start, end],
                    },
                },
                order: [['createdAt', 'ASC']],
            });
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 50, right: 50 },
            });
            const propertyDetails = await db.PropertyMaster.findOne({
                where: { id: propertyId },
                attributes: ['name'],
            });
            const propertyName = propertyDetails?.name || 'N/A';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="KitchenAuditTrail_${propertyName.replace(/\s+/g, '_')}.pdf"`
            );
            doc.pipe(res);
            doc
                .fontSize(14)
                .fillColor('#000080')
                .text(propertyName, doc.page.margins.left, doc.y, { align: 'left', continued: true })
                .fillColor('red')
                .text('Kitchen Audit Trail', { align: 'right' });
            doc.moveDown(0.5);
            doc.fillColor('black').fontSize(10)
                .text(`Date From: ${fromDate}`, doc.page.margins.left, doc.y, { continued: true })
                .text(`   To: ${toDate}`, { align: 'right' });
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            if (!logs.length) {
                doc.moveDown().text('No kitchen logs found for the selected date range.');
            } else {
                let resCounter = 1;
                for (const log of logs) {
                    const logDate = new Date(log.createdAt);
                    const dateStr = logDate.toLocaleDateString();
                    const timeStr = logDate.toLocaleTimeString();
                    doc.moveDown(1)
                        .fontSize(11)
                        .font('Helvetica-Bold')
                        .fillColor('#000')
                        .text(`Res. No: ${resCounter++}   Order ID: ${log.bookingCode || 'N/A'}`, doc.page.margins.left);
                    doc.moveDown(0.3);
                    doc.fontSize(10).font('Helvetica-Bold')
                        .text(`Operation : ${log.operation || 'N/A'}`, doc.page.margins.left);
                    doc.font('Helvetica')
                        .text(`Guest: ${log.actionBy || 'N/A'}`, { continued: true })
                        .text(`   User: propertyUser`, { continued: true })
                        .text(`   Date: ${dateStr}`, { continued: true })
                        .text(`   Time: ${timeStr}`);
                    if (log.action) {
                        doc.font('Helvetica-Bold').text('Particular : ', { continued: true });
                        doc.font('Helvetica').text(log.action);
                    }
                    doc.moveDown(0.5);
                    const separatorY = doc.y;
                    doc.moveTo(doc.page.margins.left, separatorY)
                        .lineTo(doc.page.width - doc.page.margins.right, separatorY)
                        .dash(2, { space: 2 })
                        .stroke()
                        .undash();
                    doc.moveDown(0.5);
                }
            }
            doc.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to generate kitchen audit report' });
        }
    },

    // start kitchen log
    async createKitchenLog(req, res) {
        const { bookingCode, action, actionBy, operation, propertyId } = req.body;
        db.KitchenLogs.create({ bookingCode, action, actionBy, operation, propertyId }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Kitchen Log created successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async updateKitchenLog(req, res) {
        const id = req.params.id
        const { bookingCode, action, actionBy, operation, propertyId } = req.body;
        db.KitchenLogs.update({ bookingCode, action, actionBy, operation, propertyId }, { where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Kitchen Log updated successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async getKitchenLogs(req, res) {
        const propertyId = req.params.propertyId
        db.KitchenLogs.findAll({ where: { propertyId: propertyId } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Fetch Kitchen Logs successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },
    // end kitchen log

    async getWalkInGuestList(req, res) {
        const { mobile, name, bookingCode, propertyId, fromDate, toDate, page = 1, pageSize = 10 } = req.body;
        const pageNumber = parseInt(page, 10);
        const limit = parseInt(pageSize, 10);
        const offset = (pageNumber - 1) * limit;
        console.log("pageSize- ", pageSize);
        const startDate = moment(new Date(fromDate)).format('YYYY-MM-DD')
        const endDate = moment(new Date(toDate)).format('YYYY-MM-DD')
        let where = {}
        const orCondition = []
        if (mobile) {
            orCondition.push({
                otherPersonNumber: {
                    [Op.eq]: mobile
                }
            })
        }
        if (name) {
            orCondition.push({
                otherPersonName: {
                    [Op.eq]: name
                }
            })
        }
        if (bookingCode) {
            orCondition.push({
                bookingCode: {
                    [Op.eq]: bookingCode
                }
            })
        }
        if (propertyId) {
            where = {
                propertyId: propertyId,
            }
        }
        if (fromDate && toDate) {
            where['fromDate'] = {
                [Op.between]: [moment(new Date(startDate)).format('YYYY-MM-DD'), moment(new Date(endDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            where['fromDate'] = {
                [Op.gte]: moment(new Date(startDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            where['fromDate'] = {
                [Op.lte]: moment(new Date(endDate)).format('YYYY-MM-DD')
            }
        }
        if (orCondition?.length > 0) {
            where[Op.or] = orCondition
        }
        const selection = {
            attributes: ['id', 'bookingCode', 'adults', 'source', 'checkInDateTime', 'checkOutDateTime', 'noOfRooms', 'bookingAmout', 'totalFoodAmount', 'collectedFoodAmout', 'dueAmount', 'breakFast', 'paymentMode', 'bookingStatus', 'createdAt', 'otherPersonName', 'otherPersonNumber', 'assignRoomNo', 'fromDate', 'toDate', 'propertyId', 'userId'],
            where: [where],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'name', 'email', 'mobile']
                },
                { model: db.GuestDetails, attributes: ["id", "bookedId", "name", "age", "gender", "document_number", "document_type", "roomNo"] }
            ]
        }
        const { count, rows } = await db.BookingHotel.findAndCountAll(selection);
        return res.status(200).json({
            data: rows, status: true, message: "Guest list fetched successfully",
            pagination: {
                currentPage: pageNumber,
                pageSize: limit,
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
            }
        })
    },

    // release room old logic
    // async updateBookingAmountOnMidCheckout(req, res) {
    //     const { bookingId, roomDetailId } = req.body
    //     db.BookingHotel.findOne({ where: { id: bookingId } }).then(async resp => {
    //         if (resp) {
    //             const bookingAmount = resp.get('bookingAmout')
    //             const roomDetailsIds = resp.get('assignRoomDetailsId')?.split(',')
    //             const totalRooms = roomDetailsIds?.length;
    //             const reamingRoomDetailsIds = arr_diff(roomDetailId, roomDetailsIds)
    //             const checkInDate = moment(new Date(resp.get('checkInDateTime'))).format('YYYY-MM-DD')
    //             const checkoutDate = moment(new Date(resp.get('checkOutDateTime'))).format('YYYY-MM-DD')
    //             const totalBookingDays = datediff(checkInDate, checkoutDate)
    //             const totalStayDays = datediff(checkInDate, moment(new Date()).format('YYYY-MM-DD'))
    //             console.log('totalStayDays - ', totalStayDays)                
    //             if (totalRooms > 1 && (totalBookingDays - totalStayDays) > 1) {
    //                 const perDayAmount = bookingAmount / totalBookingDays;
    //                 const perDayRoomAmount = perDayAmount / totalRooms;
    //                 const leavingRooms = roomDetailId?.length;
    //                 const totalAm = totalStayDays * perDayRoomAmount * leavingRooms;
    //                 const updatedBookingAmount = bookingAmount - totalAm;
    //                 resp.update({ bookingAmout: updatedBookingAmount, assignRoomDetailsId: reamingRoomDetailsIds?.join(',') })
    //                 await db.RoomDetails.update({ status: 2 }, { where: { id: roomDetailId } })
    //                 res.status(200).json({ status: true, message: 'Booking amount and room status updated.' });
    //             } else {
    //                 res.status(400).json({ status: false, message: 'This room cannot be released due to 1 room being booked and releasing days not being less than booking days.' });
    //             }
    //         } else {
    //             res.status(400).json({ status: false, message: 'Booking not found!' });
    //         }
    //     }).catch(error => {
    //         res.status(400).json({ status: false, message: error.message });
    //     })
    // },

    // release room new logic updated on 19-06-2025
    async updateBookingAmountOnMidCheckout(req, res) {
        const { bookingId, roomDetailId } = req.body;
        try {
            const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
            if (!booking) {
                return res.status(400).json({ status: false, message: 'Booking not found!' });
            }
            const assignedRoomIds = booking.get('assignRoomDetailsId')?.split(',').map(id => id.trim());
            const releasingRooms = roomDetailId.map(id => id.toString());
            const remainingRoomIds = assignedRoomIds.filter(id => !releasingRooms.includes(id));
            if (remainingRoomIds.length === 0) {
                return res.status(400).json({ status: false, message: 'At least one room must remain assigned to the booking.' });
            }
            await booking.update({ assignRoomDetailsId: remainingRoomIds.join(',') });
            await db.RoomDetails.update(
                { status: 2 },
                { where: { id: roomDetailId } }
            );
            return res.status(200).json({ status: true, message: 'Rooms released successfully.' });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async getBookingListByUserMobile(req, res) {
        const { mobile, propertyId, fromDate, toDate } = req.body
        const startDate = moment(new Date(fromDate)).format('YYYY-MM-DD')
        const endDate = moment(new Date(toDate)).format('YYYY-MM-DD')
        let where = { source: 'RRooms' }
        let user_id = 0;
        if (mobile) {
            const userId = await db.User.findOne({ where: { mobile: mobile }, attributes: ['id'] });
            if (userId) {
                user_id = userId.get('id');
            } else {
                res.status(400).json({ status: false, message: 'No user found by this mobile number' });
            }
        }

        if (propertyId) {
            where = {
                propertyId: propertyId
            }
        }

        if (user_id && user_id > 0) {

            where['userId'] = user_id
        }

        if (fromDate && toDate) {
            where['fromDate'] = {
                [Op.between]: [moment(new Date(startDate)).format('YYYY-MM-DD'), moment(new Date(endDate)).format('YYYY-MM-DD')]
            }
        } else if (fromDate) {
            where['fromDate'] = {
                [Op.gte]: moment(new Date(startDate)).format('YYYY-MM-DD')
            }
        } else if (toDate) {
            where['fromDate'] = {
                [Op.lte]: moment(new Date(endDate)).format('YYYY-MM-DD')
            }
        }
        const selection = {
            where: [where],
            include: [{ model: db.User, attributes: ['id', 'name', 'email', 'mobile'] }, {
                model: db.PropertyMaster,
                attributes: ['name', 'propertyCode']
            }]
        }

        db.BookingHotel.findAll(selection).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Guest list fetched successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async bookingTranfered(req, res) {
        const {
            propertyId,
            propertyRoomsCategoryId,
            guestDetails,
            platform,
            remark,
            bookingTransfered,
            cidAmount,
            reasonForShifting
        } = req.body;
        try {
            const oldBooking = await db.BookingHotel.findOne({
                where: { id: bookingTransfered },
            });
            await db.BookingHotel.update(
                { remark, shiftedTo: propertyId, bookingStatus: 6, cidAmount: cidAmount, reasonForShifting: reasonForShifting },
                { where: { id: bookingTransfered } }
            );
            const newBooking = await db.BookingHotel.create({
                propertyId,
                propertyRoomsCategoryId,
                userId: oldBooking.userId,
                fromDate: oldBooking.fromDate,
                toDate: oldBooking.toDate,
                noOfRooms: oldBooking.noOfRooms,
                adults: oldBooking.adults,
                children: oldBooking.children,
                paymentMode: oldBooking.paymentMode,
                PaymentStatus: oldBooking.PaymentStatus,
                bookingStatus: 1,
                bookingAmout: oldBooking.bookingAmout,
                checkInDateTime: oldBooking.checkInDateTime,
                checkOutDateTime: oldBooking.checkOutDateTime,
                bookForOther: oldBooking.bookForOther,
                otherPersonName: oldBooking.otherPersonName,
                otherPersonNumber: oldBooking.otherPersonNumber,
                source: oldBooking.source,
                collectedPayment: oldBooking.collectedPayment,
                dueAmount: oldBooking.dueAmount,
                otaBookingId: oldBooking.otaBookingId,
                referenceName: oldBooking.referenceName,
                breakFast: oldBooking.breakFast,
                extraCharge1: oldBooking.extraCharge1,
                extraCharge2: oldBooking.extraCharge2,
                bookingHours: oldBooking.bookingHours,
                totalFoodAmount: oldBooking.totalFoodAmount,
                collectedFoodAmout: oldBooking.collectedFoodAmout,
                useWalletAmount: oldBooking.useWalletAmount,
                cuponCode: oldBooking.cuponCode,
                discountAmount: oldBooking.discountAmount,
                platform: platform,
                bookingTransfered: bookingTransfered
            });
            if (newBooking) {
                const count = parseInt(newBooking.id);
                const bookingCode = (platform === 2 ? "RRU" : "RRP") + Math.floor(100000 + Math.random() * 900000);
                await db.BookingHotel.update({ bookingCode }, { where: { id: newBooking.id } });
                newBooking.bookingCode = bookingCode;
                if (guestDetails && guestDetails.length > 0) {
                    const guestParams = guestDetails.map(g => ({
                        name: g.name,
                        age: g.age,
                        gender: g.gender,
                        document_number: g.document_number,
                        document_type: g.document_type,
                        roomNo: g.roomNo,
                        bookedId: newBooking.id
                    }));
                    await db.GuestDetails.bulkCreate(guestParams);
                }
                const newProperty = await db.PropertyMaster.findOne({ where: { id: propertyId } });
                const getUser = oldBooking.userId ? await db.User.findOne({ where: { id: oldBooking.userId } }) : null;
                const getInitiator = newProperty?.createdBy
                    ? await db.RroomsUser.findOne({ where: { id: newProperty.createdBy } })
                    : null;
                const getTax = parseInt(oldBooking.bookingAmout) - parseInt(oldBooking.discountAmount || 0);
                const paymentModesForPayAtHotel = [0, 2, 3, 4, 5, 6, 7];
                const paymentModeName =
                    (oldBooking.PaymentStatus == 0 && oldBooking.paymentMode == 0) || paymentModesForPayAtHotel.includes(oldBooking.paymentMode)
                        ? 'Pay at Hotel'
                        : oldBooking.PaymentStatus == 1 && oldBooking.paymentMode == 1
                            ? "Prepaid"
                            : oldBooking.PaymentStatus == 0 && oldBooking.paymentMode == 1
                                ? "Partial Pay"
                                : 'Unknown Payment Mode';
                setImmediate(async () => {
                    const bookingDetails = {
                        guestName: oldBooking.otherPersonName || getUser?.name,
                        guestMobile: oldBooking.otherPersonNumber || getUser?.mobile,
                        bookingId: bookingCode,
                        hotelCode: newProperty?.propertyCode,
                        hotelName: newProperty?.name,
                        hotelOwner: `${newProperty?.ownerFirstName || ''} ${newProperty?.ownerLastName || ''}`,
                        hotelAddress: newProperty?.address,
                        hotelLandmark: newProperty?.landmark,
                        hotelEmail: newProperty?.propertyEmailId,
                        hotelPhone: newProperty?.propertyMobileNumber,
                        hotelLocality: newProperty?.locality,
                        checkInDate: oldBooking.fromDate,
                        checkOutDate: oldBooking.toDate,
                        roomNights: oldBooking.noOfRooms,
                        checkInTime: moment(oldBooking.checkInDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                        checkOutTime: moment(oldBooking.checkOutDateTime).tz('Asia/Kolkata').format('hh:mm A'),
                        bookingAmout: oldBooking.bookingAmout,
                        amountBreakup: `Total: ${oldBooking.bookingAmout}, Collected: ${oldBooking.collectedPayment}, Due: ${oldBooking.dueAmount}`,
                        balanceAmount: oldBooking.dueAmount,
                        paymentLink: 'Payment Link',
                        commissionBreakup: 'Commission Details',
                        paymentMode: oldBooking.paymentMode,
                        noOfRooms: oldBooking.noOfRooms,
                        adults: oldBooking.adults,
                        children: oldBooking.children,
                        PaymentStatus: oldBooking.PaymentStatus,
                        bookingStatus: oldBooking.bookingStatus,
                        otherPersonName: oldBooking.otherPersonName,
                        otherPersonNumber: oldBooking.otherPersonNumber,
                        otaBookingId: oldBooking.otaBookingId,
                        tax: getTax,
                        cuponCode: oldBooking.cuponCode,
                        discountAmount: oldBooking.discountAmount,
                        bookingPolicy: newProperty?.bookingPolicy,
                        RoomsCategoryId: propertyRoomsCategoryId,
                        paymentModeName,
                        oldBookingId: oldBooking?.id,
                        oldPropertyName: oldBooking?.PropertyMaster?.name,
                        cidAmount: cidAmount,
                        reasonForShifting: reasonForShifting,
                        collectedPayment: oldBooking.collectedPayment
                    };
                    await Promise.allSettled([
                        // sendBookingConfirmationGuest(getUser?.email || 'guest@yopmail.com', bookingDetails),
                        sendBookingConfirmationProperty(newProperty?.propertyEmailId || 'property@yopmail.com', bookingDetails),
                    ]);
                })
                return res.status(200).json({ status: true, message: "Booked successfully", data: newBooking });
            } else {
                return res.status(500).json({ status: false, message: "Booking creation failed!" });
            }
        } catch (error) {
            console.error("bookingTranfered Error:", error);
            return res.status(500).json({ status: false, message: error.message || "Something went wrong!" });
        }
    },

    async deleteAddedRoom(req, res) {
        const { bookingId, roomPrice, room1, room2, room3, room4, room5 } = req.body;
        try {
            const booking = await db.BookingHotel.findOne({ where: { id: bookingId } });
            if (!booking) {
                return res.status(404).json({ status: false, message: "Booking not found." });
            }
            const dueAmount = booking.dueAmount || 0;
            const changedPrice = dueAmount - Number(roomPrice || 0);
            const updateData = { dueAmount: changedPrice };
            if (room1) updateData.room1 = null;
            if (room2) updateData.room2 = null;
            if (room3) updateData.room3 = null;
            if (room4) updateData.room4 = null;
            if (room5) updateData.room5 = null;
            if (Object.keys(updateData).length === 1) { // only dueAmount present
                return res.status(400).json({
                    status: false,
                    message: "No room fields provided to remove.",
                });
            }
            await db.BookingHotel.update(updateData, {
                where: { id: bookingId },
            });
            return res.status(200).json({
                status: true,
                message: "Room removed successfully.",
                updatedFields: updateData,
            });
        } catch (error) {
            console.error("deleteAddedRoom Error:", error);
            return res.status(500).json({ status: false, message: error.message || "Something went wrong!" });
        }
        // {
        //   "bookingId": 123,
        //   "roomPrice": 500,
        //   "room1": true
        // }
    },

    async getNearestPropertyForTransfer(req, res) {
        const { propertyId } = req.params;
        try {
            const currentProperty = await db.PropertyMaster.findOne({ where: { id: propertyId } });
            if (!currentProperty) {
                return res.status(404).json({ status: false, message: "Property not found" });
            }
            const lat = parseFloat(currentProperty.latitude);
            const lon = parseFloat(currentProperty.longitude);
            // Step 1: Fetch nearest 10 properties            
            const nearestProperties = await db.sequelize.query(
                `
                    SELECT 
                        PM.id,
                        PM.name,
                        PM.address,
                        PM.propertyCode,
                        CAST(PM.latitude AS DECIMAL(10,6)) AS latitude,
                        CAST(PM.longitude AS DECIMAL(10,6)) AS longitude,
                        PM.stateId,
                        PM.cityId,
                        PM.pincode,
                        PM.landmark,
                        PM.hub,
                        PM.zone,
                        ROUND(6371 * acos(
                            cos(radians(:lat)) *
                            cos(radians(CAST(PM.latitude AS DECIMAL(10,6)))) *
                            cos(radians(CAST(PM.longitude AS DECIMAL(10,6))) - radians(:lon)) +
                            sin(radians(:lat)) *
                            sin(radians(CAST(PM.latitude AS DECIMAL(10,6))))
                        ), 2) AS distance
                    FROM PropertyMasters PM
                    WHERE PM.id != :propertyId AND PM.status = 1
                    ORDER BY distance ASC
                    LIMIT 10;
                `,
                {
                    replacements: { lat, lon, propertyId },
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
            const nearestPropertyIds = nearestProperties.map(p => p.id);
            // Step 2: Fetch all active rooms for those properties
            const rooms = await db.Rooms.findAll({
                where: {
                    propertyId: nearestPropertyIds
                },
                attributes: [
                    'id', 'propertyId', 'categoryId', 'regularPrice', 'offerPrice',
                    'roomDescription', 'fromDate', 'toDate'
                ],
                raw: true
            });
            // Step 3: Group rooms by propertyId
            const roomsByProperty = {};
            rooms.forEach(room => {
                if (!roomsByProperty[room.propertyId]) {
                    roomsByProperty[room.propertyId] = [];
                }
                roomsByProperty[room.propertyId].push({
                    id: room.id,
                    categoryId: room.categoryId,
                    regularPrice: room.regularPrice,
                    offerPrice: room.offerPrice,
                    // roomDescription: room.roomDescription,
                    fromDate: room.fromDate,
                    toDate: room.toDate
                });
            });
            // Step 4: Attach rooms to their respective property
            const finalResult = nearestProperties.map(property => ({
                ...property,
                Rooms: roomsByProperty[property.id] || []
            }));
            return res.status(200).json({ status: true, data: finalResult });
        } catch (error) {
            console.error("getNearestPropertyForTransfer Error:", error);
            return res.status(500).json({ status: false, message: error.message || "Something went wrong!" });
        }
    },

    async exportUniqueWalkInGuests(req, res) {
        try {
            const propertyId = Number(req.params.propertyId);
            if (!propertyId) {
                return res.status(400).json({ error: 'propertyId is required and must be a number' });
            }
            // Step 1: Get unique otherPersonNumbers that appear exactly once
            const uniqueNumbers = await db.BookingHotel.findAll({
                attributes: ['otherPersonNumber'],
                where: {
                    propertyId,
                    otherPersonName: { [Op.ne]: null },
                    otherPersonNumber: { [Op.ne]: null },
                    source: { [Op.ne]: 'RRooms' },
                },
                group: ['otherPersonNumber'],
                having: Sequelize.literal('COUNT(*) = 1'),
                raw: true,
            });

            const numberList = uniqueNumbers.map(row => row.otherPersonNumber);
            if (numberList.length === 0) {
                return res.status(404).json({ message: 'No unique walk-in guests found.' });
            }

            // Step 2: Fetch booking records using those unique numbers
            const records = await db.BookingHotel.findAll({
                attributes: ['referenceName', 'otherPersonName', 'otherPersonNumber', 'source', 'createdAt'],
                where: {
                    propertyId,
                    otherPersonName: { [Op.ne]: null },
                    otherPersonNumber: { [Op.in]: numberList },
                    source: { [Op.ne]: 'RRooms' },
                },
                include: [{
                    model: db.PropertyMaster,
                    attributes: ['name'],
                }],
                order: [
                    ['id', 'DESC'],
                    ['fromDate', 'DESC'],
                    ['toDate', 'DESC'],
                    ['userId', 'DESC'],
                    ['propertyId', 'DESC'],
                    ['bookingStatus', 'DESC'],
                    ['createdAt', 'DESC'],
                    ['useWalletAmount', 'DESC'],
                ],
                raw: true,
                nest: true,
            });

            // Step 3: Create Excel workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Walk-In Guests');

            worksheet.columns = [
                { header: 'Property Name', key: 'propertyName', width: 30 },
                { header: 'Guest Name', key: 'otherPersonName', width: 30 },
                { header: 'Guest Number', key: 'otherPersonNumber', width: 20 },
                { header: 'Source', key: 'source', width: 25 },
                { header: 'Created At', key: 'createdAt', width: 25 },
            ];

            // Apply header styling (black bg, white bold font)
            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' },
                };
                cell.font = {
                    color: { argb: 'FFFFFF' },
                    bold: true,
                };
            });

            // Step 4: Populate rows with modified source
            records.forEach(row => {
                const finalSource = row.source === 'TA-' && row.referenceName
                    ? `TA-${row.referenceName}`
                    : row.source;

                worksheet.addRow({
                    propertyName: row.PropertyMaster.name,
                    otherPersonName: row.otherPersonName,
                    otherPersonNumber: row.otherPersonNumber,
                    source: finalSource,
                    createdAt: row.createdAt,
                });
            });

            // Step 5: Stream the Excel file directly to the response
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=walkin_guests_${propertyId}.xlsx`
            );
            await workbook.xlsx.write(res);
            res.end();
        } catch (err) {
            console.error('Error exporting walk-in guests:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};