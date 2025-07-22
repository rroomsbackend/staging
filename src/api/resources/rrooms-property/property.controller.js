import { db } from '../../../models';
import multer from 'multer';
import ExcelJS from 'exceljs';
import bcrypt from 'bcrypt';
import sequelize, { NOW } from 'sequelize';
import moment from 'moment';
import path from 'path';
import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
const { Op, literal } = require('sequelize');
// upload krna hai
import { emailVerifyByOTP, sendPropertyOnBoardProperty, sendContractAcceptanceProperty, sendContractAcceptanceRrooms, sendPropertyOnBoardProcessToProperty, sendPropertyOnBoardProcessToInititor, sendPropertyOnBoardProcessToRRooms, sendPropertyRejectMailToInitiator, sendPropertyApprovedWithAttchmentProperty, sendPropertyApprovedWithAttchmentInitiator } from '../../../config/smpt'
import { parse } from 'path';
import { sendMobileVerifyOtp } from '../sendOtp/sendOtpApis'; // upload krna hai

var fileName = "";
var images = [];
var certificate = { ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "", rentAgreement: "", cancelCheque: "", PropertyPanCertificate: "" };
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __basedir + "/uploads/");
    },
    filename: function (req, file, callback) {
        const fileType = file.originalname.split(".");
        fileName = fileType[0] + '-' + Date.now() + "." + fileType[1];
        if (file.fieldname == 'images') {
            images.push(fileName);
        } else {
            certificate[file.fieldname] = fileName;
        }
        callback(null, fileName);
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: "images", maxCount: 35 },
    { name: "ownerpanCertificate", maxCount: 1 },
    { name: "owneradharCertificate", maxCount: 1 },
    { name: "gstCertificate", maxCount: 1 },
    { name: "tanCertificate", maxCount: 1 },
    { name: "rentAgreement", maxCount: 1 },
    { name: "cancelCheque", maxCount: 1 },
    { name: "PropertyPanCertificate", maxCount: 1 },
]);

const propertyCity = {
    attributes: ['id', 'name'],
    model: db.cities,
    required: false
};

const propertyState = {
    attributes: ['id', 'name'],
    model: db.states,
    required: false
};

// Helper functions
function getApprovalStatus(val) {
    return val === 0 ? 'Pending' : val === 1 ? 'Approved' : 'Rejected';
};

function getPropertyStatus(val) {
    return val === 0 ? 'Pending' : val === 1 ? 'Live' : val == 2 ? 'Sold Out' : 'Block';
};

function getAgreementStatus(val) {
    return val == 1 ? 'Accepted' : 'Pending';
};

function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// debug check which type password created start
// function logPassword() {
//     const pwd = generateRandomPassword();
//     const timestamp = new Date().toLocaleTimeString();
//     console.log(`[${timestamp}] Generated Password: ${pwd}`);
// }
// logPassword();
// setInterval(logPassword, 5000);
// debug check which type password created end

const slugify = (text) => {
    return text
        .toString()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .split('-')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('-');
};

async function fetchLiveOccupancyData(propertyId) {
    const whereProp = propertyId ? { id: parseInt(propertyId) } : {};
    const properties = await db.PropertyMaster.findAll({
        where: whereProp,
        attributes: ['id', 'name', 'propertyCode', 'onboardedRooms'],
        include: [
            {
                model: db.Rooms,
                required: false,
                attributes: ['categoryId'],
                include: [
                    {
                        model: db.RoomDetails,
                        required: false,
                        attributes: ['status']
                    }
                ]
            }
        ],
        // logging: console.log
    });
    const result = [];
    for (const property of properties) {
        const categoryMap = {};
        property.Rooms.forEach(room => {
            const catId = room.categoryId;
            const catName = getCategoryName(catId);
            if (!categoryMap[catId]) {
                categoryMap[catId] = { categoryName: catName, total: 0, available: 0, occupied: 0, blocked: 0 };
            }
            categoryMap[catId].total += 1;
            room.RoomDetails.forEach(detail => {
                if (detail.status === 0 || detail.status === 2) categoryMap[catId].available += 1;
                if (detail.status === 1) categoryMap[catId].occupied += 1;
                if (detail.status === 3) categoryMap[catId].blocked += 1;
            });
        });
        for (const catId in categoryMap) {
            result.push({
                reportDate: moment().format('DD-MM-YYYY'),
                propertyName: property.name,
                categoryName: categoryMap[catId].categoryName,
                totalRooms: property.onboardedRooms,
                availableCount: categoryMap[catId].available,
                occupiedCount: categoryMap[catId].occupied,
                blockedCount: categoryMap[catId].blocked
            });
        }
    }
    return result;
}

export default {
    async create(req, res, next) {
        upload(req, res, async function (err) {
            const {
                propertyCategoryId,
                name,
                gstNumber,
                tanNumber,
                propertyDescription,
                longitude,
                latitude,
                address,
                countryId,
                stateId,
                city,
                pincode,
                bookingPolicy,
                ownerFirstName,
                ownerLastName,
                ownerMobile,
                ownerEmail,
                ownerPan,
                ownerAdhar,
                status,
                amenities,
                partialPayment,
                partialPaymentPercentage,
                partialAmount,
                bookingAmount,
                landmark,
                propertyMobileNumber,
                propertyEmailId,
                firmType,
                PropertyPanNumber,
                noOfRooms,
                remarks,
                bankDetails,
                locaidAccept,
                coupleFriendly,
                locality,
                travellerChoice,
                legalName,
                profileImageID,
                createdBy,
                remarkForCancellation, // added on 08-05-2025 by discussing umesh sir
                approvedBy, // added on 08-05-2025 by discussing umesh sir,
                onboardedRooms, // added on 13-05-2025 by discussing umesh sir
                roomsCommission, // added on 13-05-2025 by discussing umesh sir
                roomSize, // added on 13-05-2025 by discussing umesh sir
                hub,  // added on 13-05-2025 by discussing umesh sir
                zone,  // added on 13-05-2025 by discussing umesh sir
                haveBanquateLawan, // added on 13-05-2025 by discussing umesh sir
                haveRestaurent, // added on 13-05-2025 by discussing umesh sir
                haveBar, // added on 13-05-2025 by discussing umesh sir
                haveRoofTop, // added on 13-05-2025 by discussing umesh sir
                haveConferenceRoom,// added on 13-05-2025 by discussing umesh sir
                place_id, // added on 15-05-2025 by discussing umesh and vijay
                reSubmitted, // added on 15-05-2025 by discussing umesh
                allowHourly, // added on 04-06-2025 by discussing umesh sir
                havelawn, // added on 04-06-2025 by discussing umesh sir
                assigneProperty,
                payAtHotel
            } = req.body;

            const propertyEmailOrMobile = await db.PropertyMaster.findOne({
                where: {
                    [Op.or]: [
                        {
                            propertyEmailId:
                            {
                                [Op.eq]: propertyEmailId
                            }
                        },
                        {
                            propertyMobileNumber:
                            {
                                [Op.eq]: propertyMobileNumber
                            }
                        }
                    ]
                }
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });

            if (propertyEmailOrMobile) {
                return res.status(409).json({ status: false, message: 'Property already exist by property email/mobile number!' });
            }

            await db.PropertyMaster.create({
                propertyCategoryId: propertyCategoryId,
                name: name,
                gstNumber: gstNumber,
                tanNumber: tanNumber,
                propertyDescription: propertyDescription,
                longitude: longitude,
                latitude: latitude,
                address: address,
                countryId: countryId,
                stateId: stateId,
                cityId: city,
                pincode: pincode,
                bookingPolicy: bookingPolicy,
                ownerFirstName: ownerFirstName,
                ownerLastName: ownerLastName,
                ownerMobile: ownerMobile,
                ownerEmail: ownerEmail,
                ownerPan: ownerPan,
                ownerAdhar: ownerAdhar,
                status: status,
                noOfRooms: noOfRooms,
                remarks: remarks,
                partialPayment: partialPayment,
                partialPaymentPercentage: partialPaymentPercentage,
                partialAmount: partialAmount,
                bookingAmount: bookingAmount,
                landmark: landmark,
                propertyMobileNumber: propertyMobileNumber,
                propertyEmailId: propertyEmailId,
                firmType: firmType,
                PropertyPanNumber: PropertyPanNumber,
                PropertyPanCertificate: certificate?.PropertyPanCertificate,
                ownerpanCertificate: certificate?.ownerpanCertificate,
                owneradharCertificate: certificate?.owneradharCertificate,
                gstCertificate: certificate?.gstCertificate,
                tanCertificate: certificate?.tanCertificate,
                rentAgreement: certificate?.rentAgreement,
                cancelCheque: certificate?.cancelCheque,
                bankDetails: bankDetails,
                locaidAccept: locaidAccept,
                coupleFriendly: coupleFriendly,
                locality: locality,
                travellerChoice: travellerChoice,
                legalName: legalName,
                profileImageID: profileImageID,
                createdBy: createdBy,
                remarkForCancellation: remarkForCancellation, // added on 08-05-2025 by discussing umesh sir
                approvedBy: approvedBy, // added on 08-05-2025 by discussing umesh sir
                onboardedRooms: onboardedRooms, // added on 13-05-2025 by discussing umesh sir
                roomsCommission: roomsCommission, // added on 13-05-2025 by discussing umesh sir
                roomSize: roomSize, // added on 13-05-2025 by discussing umesh sir
                hub: hub,  // added on 13-05-2025 by discussing umesh sir
                zone: zone,  // added on 13-05-2025 by discussing umesh sir
                haveBanquateLawan: haveBanquateLawan, // added on 13-05-2025 by discussing umesh sir
                haveRestaurent: haveRestaurent, // added on 13-05-2025 by discussing umesh sir
                haveBar: haveBar, // added on 13-05-2025 by discussing umesh sir
                haveRoofTop: haveRoofTop, // added on 13-05-2025 by discussing umesh sir
                haveConferenceRoom: haveConferenceRoom,// added on 13-05-2025 by discussing umesh sir
                place_id: place_id, // added on 15-05-2025 by discussing umesh and vijay
                reSubmitted: reSubmitted, // added on 15-05-2025 by discussing umesh
                allowHourly: allowHourly, // added on 04-06-2025 by discussing umesh sir
                havelawn: havelawn, // added on 04-06-2025 by discussing umesh sir
                payAtHotel: payAtHotel
            })
                .then(async (result) => {
                    certificate = { ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "", rentAgreement: "", cancelCheque: "", PropertyPanCertificate: "" };
                    const cityDetails = await db.cities.findOne({ where: { id: city }, attributes: ['name'] });
                    let propertyId = result.id;
                    let cityName = "RR";//cityDetails ? "RR" + cityDetails?.name?.toUpperCase() : "RR";
                    const idP = parseInt(propertyId);
                    let pad = '00000';
                    var ctxt = '' + idP;
                    let propertyCode = cityName + (pad.substr(0, pad.length - ctxt.length) + idP).toString()
                    result['propertyCode'] = propertyCode;
                    db.PropertyMaster.update({ propertyCode: propertyCode }, {
                        where: { id: propertyId }
                    });
                    setImmediate(async () => {
                        try {
                            const citySlug = slugify(cityDetails?.name || '');
                            const localitySlug = slugify(locality);
                            const hotelSlug = slugify(name);
                            const fullSlug = `/${citySlug}/${localitySlug}/RROOMS-${hotelSlug}`;
                            await db.PropertyMaster.update({ slug: fullSlug }, {
                                where: { id: propertyId }
                            });
                        } catch (err) {
                            console.error("Error generating slug:", err.message);
                        }
                    });
                    if (amenities && amenities.length > 0) {
                        let itemsParamsAme = [];
                        amenities.forEach(element => {
                            itemsParamsAme.push({ propertyAmenitiesId: element, propertyId: propertyId })
                        });
                        await db.PropertyAmenities.bulkCreate(itemsParamsAme).then().catch(err => {
                            return res.status(400).json({ status: false, message: err.message });
                        });
                    }
                    if (images && images.length > 0) {
                        let itemsParamsImages = [];
                        images.forEach(element => {
                            itemsParamsImages.push({ image: element, propertyId: propertyId })
                        });
                        await db.PropertyImage.bulkCreate(itemsParamsImages).then().catch(error => {
                            return res.status(400).json({ status: false, message: error.message });
                        });
                        images = [];
                    }
                    const ownerEmailOrMobile = await db.PropertyUser.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    email:
                                    {
                                        [Op.eq]: ownerEmail
                                    }
                                },
                                {
                                    mobile:
                                    {
                                        [Op.eq]: ownerMobile
                                    }
                                }
                            ]
                        }
                    }).catch(err => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
                    if (!ownerEmailOrMobile) {
                        const cleanedFirstName = ownerMobile?.trim().replace(/\s+/g, '');
                        const hashedPassword = await bcrypt.hash(cleanedFirstName, 10);
                        await db.PropertyUser.create({
                            firstName: ownerFirstName,
                            lastName: ownerLastName,
                            propertyId: propertyId,
                            email: ownerEmail,
                            mobile: ownerMobile,
                            role: '3',
                            designation: "3",
                            password: hashedPassword,
                            userCode: ownerEmail
                        }).then(async user => {
                            const count = parseInt(user.id);
                            let pad = '00000';
                            var ctxt = '' + count;
                            const userCode = propertyCode + (pad.substr(0, pad.length - ctxt.length) + count).toString();
                            await db.PropertyUser.update({ userCode: userCode }, {
                                where: { id: user.id }
                            });
                            if (assigneProperty && assigneProperty.length > 0) {
                                const userProperty = [];
                                assigneProperty.forEach(element => {
                                    userProperty.push({ propertyUserId: user.id, propertyId: element, status: 1, createdBy: createdBy });
                                });
                                await db.UserProperty.bulkCreate(userProperty);
                            } else {
                                await db.UserProperty.create({ propertyUserId: user.id, propertyId: propertyId, status: 1, createdBy: createdBy });
                            }
                        }).catch(err => {
                            return res.status(400).json({ status: false, message: err.message });
                        });
                    }
                    let propertyOwner = ownerFirstName + " " + ownerLastName;
                    let propertyAddress = address + ", " + landmark + ', ' + pincode;
                    let property_Email = propertyEmailId;
                    let property_Mobile = propertyMobileNumber;
                    let lat = latitude;
                    let long = longitude
                    let rroomsAdmin = 'rrooms.in@gmail.com';
                    setImmediate(async () => {
                        let getInitiater = await db.RroomsUser.findOne({
                            where: { id: createdBy },
                            attributes: ['firstName', 'lastName', 'email']
                        });
                        let InitiatorName = getInitiater?.firstName + " " + getInitiater?.lastName;
                        let InitiatorEmail = getInitiater?.email || 'initiator@yopmail.com';
                        let OwnerEmail = ownerEmail || 'property@yopmail.com';
                        await Promise.allSettled([
                            sendPropertyOnBoardProcessToInititor(InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long),
                            sendPropertyOnBoardProcessToProperty(OwnerEmail, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long),
                            sendPropertyOnBoardProcessToRRooms(rroomsAdmin, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long),
                        ]).then(() => {
                            console.log("All emails processed");
                        });
                    });
                    return res.status(400).json({ status: true, data: result, message: "Property created successfully" });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        });
    },

    async update(req, res, next) {
        const propertyId = req.params.id
        let approve = 0
        upload(req, res, async function (err) {
            const {
                propertyCategoryId,
                name,
                gstNumber,
                tanNumber,
                propertyDescription,
                longitude,
                latitude,
                address,
                countryId,
                stateId,
                city,
                pincode,
                bookingPolicy,
                ownerFirstName,
                ownerLastName,
                ownerMobile,
                ownerEmail,
                ownerPan,
                ownerAdhar,
                status,
                amenities,
                partialPayment,
                partialPaymentPercentage,
                partialAmount,
                bookingAmount,
                landmark,
                propertyMobileNumber,
                propertyEmailId,
                firmType,
                PropertyPanNumber,
                imageTitle,
                noOfRooms,
                remarks,
                bankDetails,
                locaidAccept,
                coupleFriendly,
                locality,
                travellerChoice,
                legalName,
                profileImageID,
                updatedBy,
                remarkForCancellation, // added on 08-05-2025 by discussing umesh sir
                approvedBy, // added on 08-05-2025 by discussing umesh sir
                onboardedRooms, // added on 13-05-2025 by discussing umesh sir
                roomsCommission, // added on 13-05-2025 by discussing umesh sir
                roomSize, // added on 13-05-2025 by discussing umesh sir
                hub,  // added on 13-05-2025 by discussing umesh sir
                zone,  // added on 13-05-2025 by discussing umesh sir
                haveBanquateLawan, // added on 13-05-2025 by discussing umesh sir
                haveRestaurent, // added on 13-05-2025 by discussing umesh sir
                haveBar, // added on 13-05-2025 by discussing umesh sir
                haveRoofTop, // added on 13-05-2025 by discussing umesh sir
                haveConferenceRoom,// added on 13-05-2025 by discussing umesh sir
                place_id, // added on 15-05-2025 by discussing umesh and vijay
                reSubmitted, // added on 15-05-2025 by discussing umesh
                allowHourly, // added on 04-06-2025 by discussing umesh sir
                havelawn, // added on 04-06-2025 by discussing umesh sir
                payAtHotel
            } = req.body;
            const data2 = {
                propertyCategoryId: propertyCategoryId,
                name: name, gstNumber: gstNumber,
                tanNumber: tanNumber,
                propertyDescription: propertyDescription,
                longitude: longitude,
                latitude: latitude,
                address: address,
                countryId: countryId,
                stateId: stateId,
                cityId: city,
                pincode: pincode,
                bookingPolicy: bookingPolicy,
                ownerFirstName: ownerFirstName,
                ownerLastName: ownerLastName,
                ownerMobile: ownerMobile,
                ownerEmail: ownerEmail,
                ownerPan: ownerPan,
                ownerAdhar: ownerAdhar,
                // status: status == 'Active' ? 0 : 1,
                status: status,
                approved: approve,
                noOfRooms: noOfRooms,
                remarks: remarks,
                partialPayment: partialPayment,
                partialPaymentPercentage: partialPaymentPercentage,
                partialAmount: partialAmount,
                bookingAmount: bookingAmount,
                landmark: landmark,
                propertyMobileNumber: propertyMobileNumber,
                propertyEmailId: propertyEmailId,
                firmType: firmType,
                PropertyPanNumber: PropertyPanNumber,
                PropertyPanCertificate: certificate?.PropertyPanCertificate,
                ownerpanCertificate: certificate?.ownerpanCertificate,
                owneradharCertificate: certificate?.owneradharCertificate,
                gstCertificate: certificate?.gstCertificate,
                tanCertificate: certificate?.tanCertificate,
                rentAgreement: certificate?.rentAgreement,
                cancelCheque: certificate?.cancelCheque,
                bankDetails: bankDetails,
                locaidAccept: locaidAccept,
                coupleFriendly: coupleFriendly,
                locality: locality,
                travellerChoice: travellerChoice,
                legalName: legalName,
                profileImageID: profileImageID,
                updatedBy: updatedBy,
                remarkForCancellation: remarkForCancellation, // added on 08-05-2025 by discussing umesh sir
                approvedBy: approvedBy, // added on 08-05-2025 by discussing umesh sir
                onboardedRooms: onboardedRooms, // added on 13-05-2025 by discussing umesh sir
                roomsCommission: roomsCommission, // added on 13-05-2025 by discussing umesh sir
                roomSize: roomSize, // added on 13-05-2025 by discussing umesh sir
                hub: hub,  // added on 13-05-2025 by discussing umesh sir
                zone: zone,  // added on 13-05-2025 by discussing umesh sir
                haveBanquateLawan: haveBanquateLawan, // added on 13-05-2025 by discussing umesh sir
                haveRestaurent: haveRestaurent, // added on 13-05-2025 by discussing umesh sir
                haveBar: haveBar, // added on 13-05-2025 by discussing umesh sir
                haveRoofTop: haveRoofTop, // added on 13-05-2025 by discussing umesh sir
                haveConferenceRoom: haveConferenceRoom,// added on 13-05-2025 by discussing umesh sir
                place_id: place_id, // added on 15-05-2025 by discussing umesh and vijay
                reSubmitted: reSubmitted, // added on 15-05-2025 by discussing umesh
                allowHourly: allowHourly, // added on 04-06-2025 by discussing umesh sir
                havelawn: havelawn, // added on 04-06-2025 by discussing umesh sir
                payAtHotel: payAtHotel
            }
            const data = {}
            Object.keys(data2).forEach((key) => {
                if (data2[key] && data2[key] != '' && data2[key] != undefined) {
                    data[key] = data2[key]
                }
            })
            data.approved = approve;
            db.PropertyMaster.update(data, { where: { id: req.params.id }, individualHooks: true })
                .then(async (updated) => {
                    certificate = { ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "", rentAgreement: "", cancelCheque: "", PropertyPanCertificate: "" };
                    // admin onboard property send mail login and password to property owner
                    if (updated[0] > 0 && bankDetails) {
                        try {
                            const getPropertyDetail = await db.PropertyMaster.findOne({ where: { id: req.params.id }, attributes: ['propertyCode', 'name', 'ownerEmail', 'address', 'bookingPolicy', 'noOfRooms', 'ownerFirstName', 'ownerLastName', 'ownerMobile', 'ownerEmail'], raw: true });
                            const propertyEmailOrMobile = await db.PropertyUser.findOne({
                                where: {
                                    [Op.or]: [
                                        {
                                            email:
                                            {
                                                [Op.eq]: getPropertyDetail?.ownerEmail
                                            }
                                        },
                                        {
                                            mobile:
                                            {
                                                [Op.eq]: getPropertyDetail?.ownerMobile
                                            }
                                        }
                                    ]
                                }
                            }).catch(err => {
                                return res.status(400).json({ status: false, message: err.message });
                            });
                            if (propertyEmailOrMobile) {
                                const hashedPassword = await bcrypt.hash(getPropertyDetail?.ownerMobile, 10);
                                await db.PropertyUser.update(
                                    { password: hashedPassword },
                                    { where: { id: propertyEmailOrMobile.id } }
                                );
                            }
                            let PropertyOwner = `${getPropertyDetail?.ownerFirstName} ${getPropertyDetail?.ownerLastName}`;
                            let PropertyName = getPropertyDetail?.name;
                            let PropertyAddres = getPropertyDetail?.address;
                            let OwnerEmail = getPropertyDetail?.ownerEmail;
                            // let Password = propertyEmailOrMobile ? "Use Your Current Password" : getPropertyDetail?.ownerMobile;
                            let Password = getPropertyDetail?.ownerMobile;
                            let noOfRooms = getPropertyDetail?.noOfRooms;
                            setImmediate(async () => {
                                await Promise.allSettled([
                                    sendPropertyOnBoardProperty(OwnerEmail, PropertyOwner, PropertyName, PropertyAddres, Password, noOfRooms),
                                    // sendContractAcceptanceProperty(getPropertyDetail?.ownerEmail || 'property@yopmail.com', getPropertyDetail),
                                    // sendContractAcceptanceRrooms('rrooms.in@gmail.com', getPropertyDetail)
                                ]).then(() => {
                                    console.log("All emails processed");
                                });
                            });
                        } catch (err) {
                            console.error("Email sending error:- rrooms-property/property.controller.js", err);
                        }
                    }
                    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
                        let itemsParamsAme = [];
                        amenities.forEach(element => {
                            itemsParamsAme.push({ propertyAmenitiesId: element, propertyId: req.params.id })
                        });
                        await db.PropertyAmenities.destroy({ where: { propertyId: req.params.id } });
                        await db.PropertyAmenities.bulkCreate(itemsParamsAme).then().catch(err => {
                            return res.status(500).json({ status: false, message: err.message });
                        });
                    }
                    if (images && images.length > 0) {
                        let itemsParamsImages = [];
                        images.forEach((element, index) => {
                            const title = imageTitle[index] != undefined ? imageTitle[index] : "Rroom Property Image"
                            itemsParamsImages.push({ propertyId: req.params.id, title: title, image: element })
                        });
                        await db.PropertyImage.bulkCreate(itemsParamsImages).then().catch(err => {
                            return res.status(500).json({ status: false, message: err.message });
                        });
                        images = [];
                    }
                    return res.status(200).json({ status: true, msg: "Property updated successfully" });
                })
                .catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                });
        });
    },

    async assignUnassignProperty(req, res, next) {
        const { assigneProperty, status, createdBy, propertyUserId } = req.body;
        if (assigneProperty && assigneProperty.length > 0 && propertyUserId) {
            const userProperty = [];
            assigneProperty.forEach(element => {
                userProperty.push({ propertyUserId: propertyUserId, propertyId: element, status: status, createdBy: createdBy });
            });
            if (status == true) {
                await db.UserProperty.bulkCreate(userProperty).then(result => {
                    return res.status(200).json({ status: true, message: 'Property assigned successfully' });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            } else if (status == false) {
                await db.UserProperty.destroy({ where: { propertyUserId: propertyUserId, propertyId: assigneProperty } }).then(result => {
                    return res.status(200).json({ status: true, message: 'Property unassigned successfully' });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            }
        } else {
            return res.status(400).json({ status: false, message: 'Property ids required' });
        }
    },

    async removeAssignProperty(req, res, next) {
        const { id, propertyId } = req.body;

        if (!id || !propertyId) {
            return res.status(400).json({ status: false, message: 'ID is required' });
        }

        const record = await db.UserProperty.findOne({ where: { id, propertyId } });

        if (!record) {
            return res.status(404).json({ status: false, message: 'Record not found' });
        }

        const deletedCount = await db.UserProperty.destroy({ where: { id, propertyId } });

        if (deletedCount > 0) {
            return res.status(200).json({ status: true, message: 'Property unassigned successfully' });
        } else {
            return res.status(400).json({ status: false, message: 'Failed to unassign property' });
        }

        // if (id && propertyId && propertyUserId) {
        //     await db.UserProperty.destroy({ where: { id: id, propertyUserId: propertyUserId, propertyId: propertyId } }).then(result => {
        //         return res.status(200).json({ status: true, message: 'Property unassigned successfully' });
        //     }).catch(err => {
        //         return res.status(400).json({ status: false, message: err.message });
        //     });
        // } else {
        //     return res.status(400).json({ status: false, message: 'Property ids required' });
        // }
    },

    // commented on 13-05-2025
    // async updateProfileImage(req, res, next) {
    //     const id = req.params.id;
    //     const { profileImageID } = req.body;
    //     if (id && profileImageID) {
    //         await db.PropertyMaster.findOne({ where: { id: id } }).then(result => {
    //             if (result) {
    //                 result.update({ profileImageID: profileImageID });
    //                 return res.status(200).json({ status: true, message: 'Profile image updated successfully.' });
    //             } else {
    //                 return res.status(400).json({ status: false, message: 'Property does not exist by submitted id' });
    //             }
    //         }).catch(err => {
    //             return res.status(400).json({ status: false, message: err.message });
    //         });
    //     } else {
    //         return res.status(400).json({ status: false, message: 'Property id and profileImageID is required' });
    //     }
    // },
    async updateProfileImage(req, res, next) {
        const id = req.params.id;
        const { profileImageID } = req.body;
        if (!id || !profileImageID) {
            return res.status(400).json({
                status: false,
                message: 'Property id and profileImageID is required',
            });
        }
        try {
            const [updatedCount] = await db.PropertyMaster.update(
                { profileImageID },
                {
                    where: { id },
                    individualHooks: true
                }
            );
            if (updatedCount === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Property does not exist by submitted id',
                });
            }
            return res.status(200).json({
                status: true,
                message: 'Profile image updated successfully.',
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
            });
        }
    },

    async get(req, res) {
        const showDetails = req?.query?.showDetails
        const { ownerEmail } = req.query;
        let propertySelection = {}
        if (showDetails == 'true') {
            propertySelection = {
                //attributes: ['id', 'propertyCode', 'name', 'createdAt', 'landmark', 'approved', 'status', 'updatedAt'],
                through: { attributes: [] },
                include: [
                    {
                        model: db.PropertyAmenities, attributes: ['id', 'propertyId', 'propertyAmenitiesId'], required: false, where: [
                            { deletedAt: null }
                        ]
                    },
                    {
                        model: db.PropertyImage, attributes: ['id', 'propertyId', 'title', 'image'], required: false, where: [
                            { deletedAt: null }
                        ]
                    },
                    {
                        model: db.Rooms, required: false,
                        /*include: [
                            { model: db.RoomImages, attributes: ['id'], required: false},
                            { model: db.RoomAmenities, attributes: ['id'], required: false},
                            { model: db.RoomDetails, attributes: ['id'], required: false}
                        ]*/
                    },
                    {
                        model: db.PropertyCategory,
                        required: false,
                        as: 'PropertyCategory',
                        attributes: ['name']
                    },
                    propertyCity,
                    { model: db.PropertyUser, required: false, attributes: ['agreement'] }
                ],
                order: [
                    ['id', 'DESC'],
                    ['updatedAt', 'DESC']
                ],
                where: { deletedAt: null, ...(ownerEmail ? { ownerEmail: ownerEmail } : {}) }
            }
        } else {
            propertySelection = {
                attributes: ['id', 'propertyCode', 'name', 'ownerEmail', 'propertyEmailId', 'createdAt', 'noOfRooms', 'approved', 'status', 'locality', 'createdBy', 'updatedBy', 'approvedBy', 'place_id', 'remarkForCancellation', 'onboardedRooms', 'roomsCommission', 'roomSize', 'hub', 'zone', 'haveBanquateLawan', 'haveRestaurent', 'haveBar', 'haveRoofTop', 'haveConferenceRoom', 'allowHourly', 'havelawn', 'reSubmitted', 'stateId', 'cityId', 'hub', 'onboarded_date', 'propertyCategoryId', 'agreement', 'ownerFirstName', 'ownerLastName', 'ownerMobile', 'propertyMobileNumber', 'remarks'], through: { attributes: [] },
                include: [
                    {
                        model: db.PropertyUser, required: false, attributes: ['agreement'],
                        where: { email: { [Op.col]: 'PropertyMaster.ownerEmail' } },
                    },
                    {
                        model: db.RroomsUser,
                        as: 'creator',
                        required: false,
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: db.RroomsUser,
                        as: 'updater',
                        required: false,
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: db.RroomsUser,
                        as: 'approver',
                        required: false,
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: db.PropertyCategory,
                        required: false,
                        as: 'PropertyCategory',
                        attributes: ['name']
                    },
                    {
                        model: db.states,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: db.cities,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: db.Hub,
                        required: false,
                        attributes: ['hubname']
                    }
                ],
                order: [
                    ['id', 'DESC'],
                    ['updatedAt', 'DESC']
                ],
                where: { deletedAt: null, ...(ownerEmail ? { ownerEmail: ownerEmail } : {}) }
            }
        }
        const selector = Object.assign({}, propertySelection);
        await db.PropertyMaster.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        }).catch((err) => {
            return res.status(500).json({ status: true, message: err.message });
        });
    },

    async checkOwnerExist(req, res) {
        try {
            const { ownerEmail, ownerMobile } = req.body;
            const propertyEmailOrMobile = await db.PropertyUser.findOne({
                where: {
                    [Op.or]: [
                        {
                            email:
                            {
                                [Op.eq]: ownerEmail
                            }
                        },
                        {
                            mobile:
                            {
                                [Op.eq]: ownerMobile
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: db.PropertyMaster,
                        as: 'PropertyMaster',
                        attributes: ['ownerPan', 'ownerAdhar']
                    }
                ],
                attributes: ['firstName', 'lastName', 'email', 'mobile']
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
            if (propertyEmailOrMobile) {
                const simplified = {
                    firstName: propertyEmailOrMobile?.firstName,
                    lastName: propertyEmailOrMobile?.lastName,
                    email: propertyEmailOrMobile?.email,
                    mobile: propertyEmailOrMobile?.mobile,
                    ownerPan: propertyEmailOrMobile?.PropertyMaster?.ownerPan,
                    ownerAdhar: propertyEmailOrMobile?.PropertyMaster?.ownerAdhar
                };
                return res.status(200).json({ status: true, message: 'Property already exist by owner email/mobile number!', data: simplified });
            }
            return res.status(200).json({ message: 'Owner not exist!', status: false });
        } catch (err) {
            return res.status(500).json({ status: true, message: err.message });
        }
    },

    // upload krna hai
    async exportPropertiesToExcel(req, res, next) {
        try {
            // const { approved, status, zone, stateId, hub, cityId, startDate, endDate } = req.query;
            // const whereClause = {
            //     deletedAt: null,
            //     ...(approved !== undefined ? { approved: Number(approved) } : {}),
            //     ...(approved === '1' && status === undefined ? {} : (status !== undefined ? { status: Number(status) } : {})),
            //     ...(zone !== undefined && zone !== '' ? { zone: zone } : {}),
            //     ...(stateId !== undefined ? { stateId: Number(stateId) } : {}),
            //     ...(hub !== undefined ? { hub: Number(hub) } : {}),
            //     ...(cityId !== undefined ? { cityId: Number(cityId) } : {}),
            //     ...(startDate || endDate
            //         ? {
            //             createdAt: {
            //                 ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
            //                 ...(endDate ? { [Op.lte]: new Date(endDate) } : {})
            //             }
            //         }
            //         : {})
            // };
            const { approved, status, zone, stateId, hub, cityId, startDate, endDate } = req.query;
            const whereClause = {
                deletedAt: null,
                ...(approved !== undefined ? { approved: Number(approved) } : {}),
                ...((approved === '1' && status === undefined) ? {} : (status !== undefined ? { status: Number(status) } : {})),
                ...(zone ? { zone: zone } : {}),
                ...(stateId ? { stateId: Number(stateId) } : {}),
                ...(hub ? { hub: Number(hub) } : {}),
                ...(cityId ? { cityId: Number(cityId) } : {}),
                ...(startDate || endDate
                    ? {
                        createdAt: {
                            ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                            ...(endDate ? { [Op.lte]: new Date(endDate) } : {})
                        }
                    }
                    : {})
            };
            const properties = await db.PropertyMaster.findAll({
                attributes: [
                    'propertyCode', 'name', 'ownerEmail', 'ownerFirstName', 'ownerLastName', 'ownerMobile', 'propertyEmailId', 'propertyMobileNumber', 'createdAt',
                    'noOfRooms', 'approved', 'status', 'locality', 'cityId', 'stateId', 'hub', 'zone', 'onboardedRooms', 'roomsCommission', 'approvedBy', 'createdBy', 'reSubmitted', 'onboarded_date', 'remarks', 'remarkForCancellation', 'agreement'
                ],
                include: [
                    {
                        model: db.PropertyUser,
                        required: false,
                        attributes: ['agreement'],
                        where: {
                            email: { [Op.col]: 'PropertyMaster.ownerEmail' }
                        }
                    },
                    {
                        model: db.RroomsUser,
                        required: false,
                        as: 'creator',
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: db.RroomsUser,
                        required: false,
                        as: 'approver',
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: db.states,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: db.PropertyCategory,
                        required: false,
                        as: 'PropertyCategory',
                        attributes: ['name']
                    },
                    {
                        model: db.cities,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: db.Hub,
                        required: false,
                        attributes: ['hubname']
                    }
                ],
                where: whereClause,
                order: [['id', 'DESC'], ['updatedAt', 'DESC']]
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Properties');
            // Set default zoom to 90%
            worksheet.views = [{ state: 'normal', zoomScale: 80 }];
            const includePropertyType =
                (approved != undefined && status != undefined) &&
                (approved == '0' && status == '0');

            // ? Define columns separately
            const columns = [
                // { header: 'SR No.', key: 'srNo', width: 10 },
                { header: 'Zone', key: 'zone', width: 20 },
                { header: 'State', key: 'stateName', width: 15 },
                { header: 'Hub', key: 'hub', width: 20 },
                { header: 'City', key: 'cityName', width: 15 },
                { header: 'Locality', key: 'locality', width: 25 },
                { header: 'Property Code', key: 'propertyCode', width: 20 },
                { header: 'Property Name', key: 'name', width: 25 },
                { header: 'Property Category', key: 'PropertyCategory', width: 25 },
                ...(includePropertyType
                    ? [{ header: 'Property Type', key: 'propertyType', width: 20 }]
                    : []),
                { header: 'Owner Name', key: 'ownerName', width: 25 },
                { header: 'Owner Mobile', key: 'ownerMobile', width: 20 },
                { header: 'Owner Email', key: 'ownerEmail', width: 35 },
                { header: 'Property Email', key: 'propertyEmailId', width: 35 },
                { header: 'Property Mobile', key: 'propertyMobile', width: 20 },
                { header: 'Start date', key: 'createdAt', width: 20 },
                { header: 'End Date', key: 'onboarded_date', width: 20 },
                { header: 'TRC', key: 'noOfRooms', width: 20 },
                { header: 'SRC', key: 'onboardedRooms', width: 20 },
                { header: 'Take Rate %', key: 'roomsCommission', width: 20 },
                { header: 'Agreement', key: 'agreement', width: 20 },
                { header: 'RRooms Status', key: 'approved', width: 20 },
                { header: 'Property Status', key: 'status', width: 20 },
                { header: 'Initiator', key: 'createdBy', width: 20 },
                { header: 'Approved By', key: 'approvedBy', width: 20 },
                { header: 'Rejection Reason', key: 'rejection_reason', width: 30 },
                { header: 'Special Comments', key: '', width: 30 }
            ];
            worksheet.columns = columns;
            // ?? Add autoFilter for column headers
            worksheet.autoFilter = {
                from: 'A1',
                to: includePropertyType ? 'Y1' : "X1"
            };
            // ? Style the header row
            const headerRow = worksheet.getRow(1);
            headerRow.height = 28;
            headerRow.eachCell((cell, colNumber) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10.5 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF000000' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                // Apply column width again just to be sure
                if (columns[colNumber - 1]) {
                    worksheet.getColumn(colNumber).width = columns[colNumber - 1].width;
                }
            });
            // ? Add data
            properties.forEach((property, index) => {
                console.log(typeof (property.onboarded_date));
                const rowData = {
                    srNo: index + 1,
                    ...(includePropertyType
                        ? { propertyType: property.reSubmitted == 1 ? "Re-Submitted" : "New" }
                        : {}),
                    propertyCode: property.propertyCode,
                    name: property.name,
                    PropertyCategory: property?.PropertyCategory.name,
                    ownerName: property.ownerFirstName + " " + property.ownerLastName,
                    ownerMobile: property.ownerMobile,
                    ownerEmail: property.ownerEmail,
                    propertyEmailId: property.propertyEmailId,
                    propertyMobile: property.propertyMobileNumber,
                    createdAt: property.createdAt.toISOString().split('T')[0],
                    onboarded_date: property.onboarded_date ? new Date(property.onboarded_date).toISOString().split('T')[0] : "N/A",
                    noOfRooms: property.noOfRooms,
                    onboardedRooms: property.onboardedRooms ? property.onboardedRooms : "N/A",
                    roomsCommission: property.roomsCommission ? property.roomsCommission : "N/A",
                    locality: property.locality ? property.locality : "N/A",
                    cityName: property?.city?.name,
                    stateName: property?.state?.name,
                    hub: property?.Hub ? property?.Hub?.hubname : "N/A",
                    zone: property.zone ? property.zone : "N/A",
                    approved: getApprovalStatus(property?.approved),
                    status: getPropertyStatus(property?.status),
                    agreement: getAgreementStatus(property?.agreement),
                    createdBy: property?.creator == null ? "N/A" : property?.creator?.firstName + " " + property?.creator?.lastName,
                    approvedBy: property?.approver == null ? "N/A" : property?.approver?.firstName + " " + property?.approver?.lastName,
                    rejection_reason: property.remarkForCancellation ? property.remarkForCancellation : property.remarks
                };
                const row = worksheet.addRow(rowData);
                row.height = 28
                row.alignment = { vertical: 'middle' };
                row.eachCell((cell) => {
                    cell.font = { size: 12 };
                });
                // Wrap text for Rejection Reason column
                const rejectionReasonColIndex = worksheet.columns.findIndex(col => col.key === 'rejection_reason') + 1;
                const rejectionReasonCell = row.getCell(rejectionReasonColIndex);
                rejectionReasonCell.alignment = { wrapText: true, vertical: 'middle' };
                // Apply conditional formatting
                const conditionKeys = ['approved', 'status', 'agreement'];
                if (includePropertyType) conditionKeys.push('propertyType');
                conditionKeys.forEach((key) => {
                    const colIndex = columns.findIndex(c => c.key === key) + 1;
                    const cell = row.getCell(colIndex);
                    const value = cell.value;
                    if (value === 'Pending') {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFFCC' } // Yellow
                        };
                    } else if (value === 'Rejected' || value === 'Sold Out') {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFCCCC' } // Red
                        };
                    } else if (['Approved', 'Live', 'Accepted', 'New'].includes(value)) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFCCFFCC' } // Green
                        };
                    } else if (value === 'Re-Submitted') { // Blue
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCE5FF' } };
                    }
                });
            });
            // Leave a blank row before footer
            worksheet.addRow([]);
            // Footer rows start here
            // const footerStart = worksheet.rowCount + 1;
            // worksheet.addRow([]);
            // worksheet.addRow([]);
            // worksheet.addRow([]);
            // const logoPath = path.resolve(__dirname, '../../../../logo.png');
            // const imageId = workbook.addImage({
            //     filename: logoPath,
            //     extension: 'png'
            // });
            // worksheet.addImage(imageId, {
            //     tl: { col: 0, row: footerStart - 0.5 },
            //     ext: { width: 80, height: 40 }
            // });
            // const footerMessages = [
            //     'Generated by RRooms System',
            //     'Date: ' + new Date().toLocaleDateString(),
            //     { text: 'info@rrooms.in', hyperlink: 'mailto:info@rrooms.in' }
            // ];
            // footerMessages.forEach((message, index) => {
            //     const rowNum = footerStart + index;
            //     includePropertyType ? worksheet.mergeCells(`A${rowNum}:Y${rowNum}`) : worksheet.mergeCells(`A${rowNum}:X${rowNum}`)
            //     const cell = worksheet.getCell(`A${rowNum}`);
            //     cell.value = message;
            //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
            //     cell.font = { italic: true, color: { argb: 'FF666666' }, size: 10, underline: message.hyperlink ? true : false };
            //     cell.fill = {
            //         type: 'pattern',
            //         pattern: 'solid',
            //         fgColor: { argb: 'FF000000' }
            //     };
            //     let x = includePropertyType ? 25 : 24
            //     for (let col = 1; col <= x; col++) {
            //         const borderCell = worksheet.getRow(rowNum).getCell(col);
            //         borderCell.border = {
            //             top: { style: 'thin' },
            //             left: { style: 'thin' },
            //             bottom: { style: 'thin' },
            //             right: { style: 'thin' }
            //         };
            //     }
            // });
            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=properties.xlsx');
            return res.send(buffer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    // filter properties by zone,state,hub,city
    async filterSearchProperties(req, res, next) {
        try {
            const { countryId, zone, stateId, hub, cityId } = req.query;
            const whereClause = {
                ...(countryId ? { countryId } : {}),
                ...(zone ? { zone } : {}),
                ...(stateId ? { stateId } : {}),
                ...(hub ? { hub } : {}),
                ...(cityId ? { cityId } : {}),
                status: 1
            };
            const properties = await db.PropertyMaster.findAll({
                where: whereClause,
                attributes: [
                    "id",
                    "name",
                    "propertyCode",
                    "propertyCategoryId",
                    "address",
                    "pincode",
                    "latitude",
                    "longitude"
                ],
                raw: true
            });
            if (!properties.length) {
                return res.status(200).json({ status: true, data: [] });
            }
            const propertyIds = properties.map(p => p.id);
            const rooms = await db.Rooms.findAll({
                where: { propertyId: propertyIds },
                attributes: [
                    'id', 'propertyId', 'categoryId', 'minPrice', 'maxPrice',
                    'regularPrice', 'offerPrice', 'roomDescription', 'occupancy',
                    'breakFastPrice', 'ap', 'map', 'heroImage', 'status',
                    'fromDate', 'toDate', 'createdBy'
                ],
                raw: true
            });
            const roomIds = rooms.map(r => r.id);
            const roomDetails = await db.RoomDetails.findAll({
                where: { roomId: roomIds },
                attributes: [
                    'id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber',
                    'occupancy', 'adult', 'child', 'status', 'fromDate', 'toDate'
                ],
                raw: true
            });
            const roomDetailsMap = {};
            for (const detail of roomDetails) {
                if (!roomDetailsMap[detail.roomId]) roomDetailsMap[detail.roomId] = [];
                roomDetailsMap[detail.roomId].push(detail);
            }
            const roomsMap = {};
            for (const room of rooms) {
                room.RoomDetails = roomDetailsMap[room.id] || [];
                if (!roomsMap[room.propertyId]) roomsMap[room.propertyId] = [];
                roomsMap[room.propertyId].push(room);
            }
            const result = properties.map(property => ({
                ...property,
                Rooms: roomsMap[property.id] || []
            }));
            return res.status(200).json({ status: true, data: result });
        } catch (error) {
            console.error("❌ Error in filterSearchProperties:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },

    // property room occupancy by admin and property
    async exportPropertyOccupancyReport(req, res) {
        try {
            const { propertyId, fromdate, todate, filter } = req.query;
            let records = [];
            if (filter === 'today') {
                console.log("today");
                records = await fetchLiveOccupancyData(propertyId);
            } else {
                const whereClause = {};
                if (propertyId) whereClause.propertyId = propertyId;
                if (filter === 'yesterday') {
                    const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY');
                    whereClause.reportDate = yesterday;
                } else if (filter === 'mtd') {
                    const monthStart = moment().startOf('month').format('DD-MM-YYYY');
                    const today = moment().format('DD-MM-YYYY');
                    whereClause.reportDate = { [Op.between]: [monthStart, today] };
                } else if (fromdate && todate) {
                    const from = moment(fromdate).format('YYYY-MM-DD');
                    const to = moment(todate).format('YYYY-MM-DD');
                    whereClause[Op.and] = [
                        sequelize.where(
                            sequelize.fn("STR_TO_DATE", sequelize.col("reportDate"), "%d-%m-%Y"),
                            { [Op.between]: [from, to] }
                        )
                    ];
                }

                records = await db.PropertyOccupancySummary.findAll({
                    where: whereClause,
                    order: [['propertyName'], ['categoryName']]
                });
            }
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Property Occupancy');
            worksheet.columns = [
                { header: 'Report Date', key: 'reportDate', width: 15 },
                { header: 'Property Name', key: 'propertyName', width: 20 },
                { header: 'Room Type', key: 'categoryName', width: 20 },
                { header: 'Total Rooms', key: 'totalRooms', width: 15 },
                { header: 'Booked/Occupied Rooms', key: 'occupiedCount', width: 20 },
                { header: 'Blocked Rooms', key: 'blockedCount', width: 15 },
                { header: 'Available Rooms', key: 'availableCount', width: 18 },
                { header: 'Available %', key: 'availablePercent', width: 15 },
                { header: 'Booked/Occupied %', key: 'occupiedPercent', width: 18 },
                { header: 'Blocked Rooms %', key: 'blockedPercent', width: 18 },
            ];
            for (let rec of records) {
                const total = rec.totalRooms || 0;
                const occupied = rec.occupiedCount || 0;
                const blocked = rec.blockedCount || 0;
                const dirty = rec.dirtyCount || 0;
                const available = (rec.availableCount || 0) + dirty;
                worksheet.addRow({
                    reportDate: rec.reportDate || '',
                    propertyName: rec.propertyName,
                    categoryName: rec.categoryName,
                    totalRooms: total,
                    occupiedCount: occupied,
                    blockedCount: blocked,
                    availableCount: available,
                    availablePercent: total ? `${Math.round((available / total) * 100)}%` : '-',
                    occupiedPercent: total ? `${Math.round((occupied / total) * 100)}%` : '-',
                    blockedPercent: total ? `${Math.round((blocked / total) * 100)}%` : '-',
                });
            }
            worksheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=property-occupancy-report.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting occupancy report:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    async getApprovedProperty(req, res) {
        const propertySelection = {
            include: [
                { model: db.PropertyAmenities, required: false },
                { model: db.PropertyImage, required: false },
                {
                    model: db.Rooms, required: false,
                    include: [
                        { model: db.RoomImages, required: false },
                        { model: db.RoomAmenities, required: false },
                        //{ model: db.RoomDetails, required: false}
                    ]
                },
                propertyCity,
                propertyState
            ],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { approved: 1, deletedAt: null }
            ],
        }
        const selector = Object.assign({}, propertySelection);
        await db.PropertyMaster.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        }).catch((err) => {
            res.send(err);
        });
    },

    async updatePropertyStatus(req, res) {
        const {
            id,
            status,
            approved,
            remarks,
            updatedBy,
            onboarded_date,
            approvedBy
        } = req.body;
        const updatePayload = {
            status,
            approved,
            remarks,
            updatedBy,
            onboarded_date,
            approvedBy
        };

        if (status == 1) {
            const getProperty = await db.PropertyMaster.findOne({ where: { id } });
            if (getProperty && getProperty.propertyLiveAt == null) {
                const currentDate = new Date().toISOString().slice(0, 10);
                updatePayload.propertyLiveAt = currentDate;
            }
        }

        // Calculate agreementEndDate: onboarded_date + 1 year - 1 day
        if (onboarded_date) {
            const onboardDate = new Date(onboarded_date); // Original date
            const agreementEndDate = new Date(onboardDate);
            agreementEndDate.setFullYear(agreementEndDate.getFullYear() + 1);
            agreementEndDate.setDate(agreementEndDate.getDate() - 1); // Subtract 1 day
            updatePayload.agreementEndDate = agreementEndDate.toISOString(); // Save in ISO format
        }
        if (approved == 2) {
            updatePayload.remarkForCancellation = remarks
        }
        db.PropertyMaster.update(updatePayload, { where: { id: id }, individualHooks: true })
            .then(async updated => {
                if (updated) {
                    let propertyDetail = await db.PropertyMaster.findOne({
                        where: { id: id },
                        include: [
                            {
                                model: db.RroomsUser,
                                required: false,
                                as: 'creator',
                                attributes: ['firstName', 'lastName', 'email']
                            },
                            {
                                model: db.RroomsUser,
                                required: false,
                                as: 'approver',
                                attributes: ['firstName', 'lastName', 'email']
                            }
                        ]
                    });
                    if (approved == 2) {
                        setImmediate(async () => {
                            let propertyOwner = propertyDetail?.ownerFirstName + " " + propertyDetail?.ownerLastName;
                            let propertyName = propertyDetail?.name;
                            let propertyCode = propertyDetail?.propertyCode;
                            let initiatorEmail = propertyDetail?.creator?.email || 'initiator@yopmail.com';
                            let rejectedByName = propertyDetail?.approver?.firstName + " " + propertyDetail?.approver?.lastName;
                            let rejectedByEmail = propertyDetail?.approver?.email || 'rejectedby@yopmail.com';
                            let rejectionReason = remarks
                            await Promise.allSettled([
                                sendPropertyRejectMailToInitiator(initiatorEmail, propertyOwner, propertyName, propertyCode, rejectedByName, rejectedByEmail, rejectionReason)
                            ]).then(() => {
                                console.log("All emails processed");
                            });
                        });
                    }
                    if (approved == 1 && onboarded_date) {
                        setImmediate(async () => {
                            let propertyOwnerEmail = propertyDetail?.ownerEmail || 'propertyowner@yopmail.com';
                            let propertyOwner = propertyDetail?.ownerFirstName + " " + propertyDetail?.ownerLastName;
                            let propertyAddress = propertyDetail?.address;
                            let propertyName = propertyDetail?.name;
                            let propertyCode = propertyDetail?.propertyCode;
                            let initiatorEmail = propertyDetail?.creator?.email || 'initiator@yopmail.com';
                            let initiatorName = propertyDetail?.creator?.firstName + " " + propertyDetail?.creator?.lastName;

                            let bankDetails = propertyDetail?.bankDetails;
                            const details = bankDetails.split('~');
                            let bankName = details[0];
                            let branch = details[1];
                            let accountHolderName = details[2];
                            let accountNumber = details[3];
                            let ifscCode = details[4];
                            let onBoardedDate = moment(propertyDetail?.onboarded_date).format('DD/MM/YYYY');
                            let rroomsRegisterAddress = 'B2-1409, DLF My Pad, VIBHUTI KHAND GOMTI NAGAR, Gomti Nagar, Lucknow, Uttar Pradesh, 226010';
                            let PropertyPanNumber = propertyDetail?.PropertyPanNumber;
                            let ownerAdhar = propertyDetail?.ownerAdhar;
                            let gstNumber = propertyDetail?.gstNumber;
                            let propertyMobileNumber = propertyDetail?.propertyMobileNumber;
                            let legalName = propertyDetail?.legalName;
                            let totalRooms = propertyDetail?.noOfRooms;
                            let signedRooms = propertyDetail?.onboardedRooms;
                            let takeRate = propertyDetail?.roomsCommission;
                            let designation = 'Growth Manager'
                            let createdDate = moment(propertyDetail?.createdAt).format('DD/MM/YYYY')

                            // comment for pupteer not working on new server
                            const htmlContent = generateHtmlContent(propertyOwner, propertyAddress, propertyName, initiatorName, bankName, branch, accountHolderName, accountNumber, ifscCode, onBoardedDate, rroomsRegisterAddress, PropertyPanNumber, ownerAdhar, gstNumber, propertyMobileNumber, legalName, totalRooms, signedRooms, takeRate, designation, createdDate);
                            const agreementAttach = await generatePDF(htmlContent);
                            await Promise.allSettled([
                                sendPropertyApprovedWithAttchmentInitiator(initiatorEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress, agreementAttach),
                                sendPropertyApprovedWithAttchmentProperty(propertyOwnerEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress, agreementAttach)
                            ]).then(() => {
                                console.log("All emails processed");
                            });

                            // await Promise.allSettled([
                            //     sendPropertyApprovedWithAttchmentInitiator(initiatorEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress),
                            //     sendPropertyApprovedWithAttchmentProperty(propertyOwnerEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress)
                            // ]).then(() => {
                            //     console.log("All emails processed");
                            // });
                        });
                    }
                    res.status(200).json({ status: true, msg: "Propert status updated successfully" });
                } else
                    return res.status(200).json({ status: false, msg: "Propert status updating failed" });
            })
            .catch(err => {
                return res.status(500).json({ status: false, 'errors': err });
            })
    },

    async getById(req, res) {
        const id = req.params.id
        const showDetails = req?.query?.showDetails === 'true' ? true : false;
        const fromDate = req?.query?.fromDate ? moment(new Date(req?.query?.fromDate)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
        const toDate = req?.query?.toDate ? moment(new Date(req?.query?.toDate)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
        const today = moment(new Date()).format('YYYY-MM-DD')
        let specialApplyPrice = false;
        if (fromDate == moment(new Date('2024-03-30')).format('YYYY-MM-DD') || toDate == moment(new Date('2024-03-30')).format('YYYY-MM-DD')) {
            specialApplyPrice = true;
        }
        const where = {
            [Op.or]: [{
                fromDate: {
                    [Op.between]: [fromDate, toDate]
                }
            }, {
                toDate: {
                    [Op.between]: [fromDate, toDate]
                }
            }],
            propertyId: id,
            bookingStatus: [1, 2]
        };
        const roomDetailsWhereCluase = {
            [Op.or]: [{
                fromDate: {
                    [Op.notBetween]: [fromDate, toDate]
                }
            }, {
                fromDate: {
                    [Op.is]: null
                }
            },
            {
                fromDate: {
                    [Op.is]: null
                }
            }],
            [Op.or]: [{
                toDate: {
                    [Op.notBetween]: [fromDate, toDate]
                }
            }, {
                toDate: {
                    [Op.is]: null
                }
            },
            {
                toDate: {
                    [Op.is]: null
                }
            }]
        }

        /*return await db.RoomDetails.findAll({ attributes: ['id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber', 'occupancy', 'adult', 'child', 'status', 'fromDate', 'toDate'], where: roomDetailsWhereCluase}).then(ress=>{
            return res.status(200).json({ data: ress, status: true});
        }).catch(err=>{
            return res.status(200).json({ data: '', status: true, message: err.message});
        })*/
        const attributes = ['propertyRoomsCategoryId', [sequelize.fn('sum', sequelize.col('noOfRooms')), 'totalRooms']]
        const groupBy = ['propertyRoomsCategoryId']
        let existBooking = await db.BookingHotel.findAll({ where, attributes: attributes, group: groupBy });
        //return res.status(200).json({ data: existBooking, status: true})
        try {
            let attributesList = [];
            if (!showDetails) {
                attributesList = [
                    'id', 'name', 'propertyCategoryId', 'address', 'partialPayment', 'partialPaymentPercentage', 'propertyDescription', 'stateId',
                    'partialAmount', 'bookingAmount', 'status', 'noOfRooms', 'landmark', 'locaidAccept', 'locality', 'pincode', 'place_id', 'cityId',
                    'coupleFriendly', 'profileImageID', 'travellerChoice', 'longitude', 'latitude', 'bookingPolicy', 'approved', 'latitude', 'longitude', 'propertyCode', 'hub', 'zone'
                ];
            }
            const queryOptions = {
                where: { id: id }
            };
            if (!showDetails) {
                queryOptions.attributes = attributesList;
            }
            const propertyDetails = await db.PropertyMaster.findOne(queryOptions);
            if (propertyDetails) {
                const propertiesAmenities = await db.PropertyAmenities.findAll({ attributes: ['id', 'propertyId', 'propertyAmenitiesId'], where: { propertyId: id } })
                const propertyImages = await db.PropertyImage.findAll({ attributes: ['id', 'propertyId', 'title', 'image'], where: { propertyId: id } })
                const city = await db.cities.findAll({ attributes: ['id', 'name'], where: { id: propertyDetails?.get('cityId') } })
                const states = await db.states.findAll({ attributes: ['id', 'name'], where: { id: propertyDetails?.get('stateId') } })
                const hub = await db.Hub.findOne({ attributes: ['id', 'hubname'], where: { id: propertyDetails?.get('hub') } })
                const selectorRoomDetails = {
                    include: [
                        { model: db.RoomImages, required: false, attributes: ['id', 'roomId', 'imageName'] },
                        { model: db.RoomAmenities, required: false, attributes: ['id', 'roomId', 'amenitiesId'] },
                        { model: db.RoomDetails, required: false, attributes: ['id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber', 'occupancy', 'adult', 'child', 'status', 'fromDate', 'toDate'], where: roomDetailsWhereCluase },
                    ],
                    attributes: ['id', 'propertyId', 'categoryId', 'minPrice', 'maxPrice', 'regularPrice', 'offerPrice', 'roomDescription', 'occupancy', 'breakFastPrice', 'ap', 'map', 'heroImage', 'status', 'fromDate', 'toDate', 'createdBy'],
                    where: { propertyId: id }
                }
                const roomDetails = await db.Rooms.findAll(selectorRoomDetails);
                let rows = JSON.stringify(propertyDetails);
                rows = JSON.parse(rows);
                rows['city'] = JSON.parse(JSON.stringify(city));
                rows['state'] = JSON.parse(JSON.stringify(states));
                // rows['zone'] = JSON.parse(JSON.stringify(zone));
                rows['hub'] = JSON.parse(JSON.stringify(hub));
                rows['PropertyAmenities'] = JSON.parse(JSON.stringify(propertiesAmenities));
                rows['PropertyImage'] = JSON.parse(JSON.stringify(propertyImages));
                let rooms = JSON.parse(JSON.stringify(roomDetails));
                if (existBooking && existBooking.length > 0) {
                    existBooking = JSON.parse(JSON.stringify(existBooking));
                }
                rooms = rooms.map(element => {
                    let totalAvaiableRooms = 0
                    if (existBooking && existBooking.length > 0) {
                        const totalRoomAllotedCategoryWise = existBooking.filter(obj => {
                            return obj.propertyRoomsCategoryId == element?.categoryId
                        });
                        const totalRooms = element.RoomDetails ? element.RoomDetails.length : 0;
                        if (totalRoomAllotedCategoryWise && totalRoomAllotedCategoryWise.length > 0) {
                            totalAvaiableRooms = totalRooms > parseInt(totalRoomAllotedCategoryWise[0]?.totalRooms) ? totalRooms - parseInt(totalRoomAllotedCategoryWise[0]?.totalRooms) : 0
                        } else {
                            totalAvaiableRooms = element.RoomDetails ? element.RoomDetails.length : 0;
                        }
                    } else {
                        totalAvaiableRooms = element.RoomDetails ? element.RoomDetails.length : 0;
                    }
                    element['avaiableRooms'] = totalAvaiableRooms;
                    //Special price update
                    // commented on 31-05-2025
                    // if (element?.fromDate && element?.toDate) {
                    //     let from = moment(new Date(element?.fromDate)).format('YYYY-MM-DD')
                    //     let to = moment(new Date(element?.toDate)).format('YYYY-MM-DD')
                    //     if ((fromDate >= from && fromDate <= to) || (toDate >= from && toDate <= to) && element?.offerPrice > 0) {
                    //         element['regularPrice'] = element['offerPrice']
                    //     }
                    // }
                    return element;
                })
                rows['Rooms'] = rooms;
                return res.status(200).json({ data: rows, status: true });
            } else {
                return res.status(400).json({ data: [], status: false, message: 'No data found' });
            }
        } catch (err) {
            return res.status(500).json({ data: [], status: false, message: err.message });
        }
    },

    async delete(req, res, next) {
        await db.PropertyAmenities.destroy({ where: { propertyId: req.params.id } });
        await db.PropertyImage.destroy({ where: { propertyId: req.params.id } });
        await db.Rooms.destroy({ where: { propertyId: req.params.id } });
        await db.PropertyMaster.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(500).json({ status: false, errors: err });
        })
    },

    async inactiveCouponProperty(req, res, next) {
        const { propertyId, status, createdBy, couponId } = req.body;
        if (propertyId && propertyId.length > 0 && couponId) {
            const couponProperty = [];
            propertyId.forEach(element => {
                couponProperty.push({ couponId: couponId, propertyId: element, createdBy: createdBy });
            });
            if (status == true) {
                await db.InactiveCoupanProperties.bulkCreate(couponProperty).then(result => {
                    return res.status(200).json({ status: true, message: 'Coupon deactive successfully' });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            } else if (status == false) {
                await db.InactiveCoupanProperties.destroy({ where: { couponId: couponId, propertyId: propertyId } }).then(result => {
                    return res.status(200).json({ status: true, message: 'Coupon deactive deleted successfully' });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            }
        } else {
            return res.status(400).json({ status: false, message: 'Property ids required' });
        }
    },

    // Create log
    async createLog(req, res) {
        try {
            const { propertyId, action, remark, actionBy, data } = req.body;
            if (!propertyId || !action || !action) {
                return res.status(400).json({ status: false, message: 'propertyId and action are required.' });
            }
            const newLog = await db.property_logs.create({
                propertyId,
                action,
                remark,
                actionBy,
                data
            });
            return res.status(201).json({ status: true, message: 'Log created successfully.', data: newLog });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    // Get logs
    async getLogs(req, res) {
        try {
            const { propertyId } = req.query;
            const whereClause = {};
            if (propertyId) {
                whereClause.propertyId = propertyId;
            }
            const logs = await db.property_logs.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: db.PropertyMaster,
                        attributes: ['id', 'name', 'propertyCode']
                    }
                ]
            });
            return res.status(200).json({ status: true, data: logs });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    // start Administration Logs
    async createAdministrationLog(req, res) {
        try {
            const { propertyId, action, operation, actionBy } = req.body;
            if (!propertyId || !action || !actionBy) {
                return res.status(400).json({ status: false, message: 'propertyId and action are required' });
            }
            const newLog = await db.AdministrationLogs.create({
                action,
                actionBy,
                operation,
                propertyId
            });
            return res.status(201).json({ status: true, message: 'Administration Log created successfully.', data: newLog });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    async updateAdministrationLog(req, res) {
        const id = req.params.id
        const { propertyId, action, operation, actionBy } = req.body;
        if (!propertyId || !action || !actionBy) {
            return res.status(400).json({ status: false, message: 'propertyId and action are required.' });
        }
        db.AdministrationLogs.update({ propertyId, action, operation, actionBy }, { where: { id: id } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Administration Log updated successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async getAdministrationLogs(req, res) {
        const propertyId = req.params.propertyId
        db.AdministrationLogs.findAll({ where: { propertyId: propertyId } }).then(result => {
            return res.status(200).json({ data: result, status: true, message: "Fetch Administration Logs successfully" });
        }).catch(error => {
            res.status(400).json({ status: false, message: error.message });
        })
    },

    async generateAdministrationAuditTrailPDF(req, res) {
        try {
            const { propertyId, fromDate, toDate } = req.query;
            if (!fromDate || !toDate) {
                return res.status(400).json({ message: 'fromDate and toDate are required' });
            }
            const whereClause = {
                createdAt: {
                    [Op.between]: [new Date(fromDate), new Date(toDate)],
                },
            };
            if (propertyId) {
                whereClause.propertyId = propertyId;
            }
            const logs = await db.AdministrationLogs.findAll({
                where: whereClause,
                order: [['createdAt', 'ASC']],
            });
            let propertyName = 'All Properties';
            let propertyMap = {};
            if (propertyId) {
                const propertyDetails = await db.PropertyMaster.findOne({
                    where: { id: propertyId },
                    attributes: ['name'],
                });
                propertyName = propertyDetails?.name || 'N/A';
            } else {
                const allProperties = await db.PropertyMaster.findAll({
                    attributes: ['id', 'name'],
                });
                propertyMap = allProperties.reduce((map, prop) => {
                    map[prop.id] = prop.name;
                    return map;
                }, {});
            }
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 50, right: 50 },
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="AdministrationAuditTrail_${propertyName.replace(/\s+/g, '_')}.pdf"`
            );
            doc.pipe(res);
            doc.fontSize(14)
                .fillColor('#000080')
                .text(propertyName, { align: 'left', continued: true })
                .fillColor('red')
                .text('Administration Audit Trail', { align: 'right' });
            doc.moveDown(0.5);
            doc.fillColor('black').fontSize(10)
                .text(`Date From: ${fromDate}`, { continued: true })
                .text(`   To: ${toDate}`, { align: 'right' });
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            if (!logs.length) {
                doc.moveDown().text('No Administration Log found for the selected date range.');
            } else {
                let resCounter = 1;
                if (propertyId) {
                    for (const log of logs) {
                        const logDate = new Date(log.createdAt);
                        const dateStr = logDate.toLocaleDateString();
                        const timeStr = logDate.toLocaleTimeString();
                        doc.moveDown(1)
                            .fontSize(11)
                            .font('Helvetica-Bold')
                            .fillColor('#000')
                            .text(`Entry No: ${resCounter++}`, doc.page.margins.left);
                        doc.moveDown(0.3);
                        doc.fontSize(10).font('Helvetica-Bold')
                            .text(`Operation : ${log.operation || 'N/A'}`, doc.page.margins.left);
                        doc.font('Helvetica');
                        let entryLine = `Action By: ${log.actionBy || 'N/A'}   Date: ${dateStr}   Time: ${timeStr}`;
                        doc.text(entryLine);
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
                } else {
                    const logsByProperty = {};
                    for (const log of logs) {
                        if (!logsByProperty[log.propertyId]) {
                            logsByProperty[log.propertyId] = [];
                        }
                        logsByProperty[log.propertyId].push(log);
                    }
                    for (const propId in logsByProperty) {
                        const propertyLogs = logsByProperty[propId];
                        const propertyTitle = propertyMap[propId] || `Unknown (ID: ${propId})`;
                        doc.moveDown(1);
                        doc.fontSize(12)
                            .fillColor('#000080')
                            .font('Helvetica-Bold')
                            .text(`Property: ${propertyTitle}`, { align: 'left' });
                        doc.moveDown(0.3);
                        doc.moveTo(doc.page.margins.left, doc.y)
                            .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                            .stroke();
                        doc.moveDown(0.5);
                        for (const log of propertyLogs) {
                            const logDate = new Date(log.createdAt);
                            const dateStr = logDate.toLocaleDateString();
                            const timeStr = logDate.toLocaleTimeString();
                            doc.moveDown(0.7)
                                .fontSize(11)
                                .font('Helvetica-Bold')
                                .fillColor('#000')
                                .text(`Entry No: ${resCounter++}`, doc.page.margins.left);
                            doc.moveDown(0.3);
                            doc.fontSize(10).font('Helvetica-Bold')
                                .text(`Operation : ${log.operation || 'N/A'}`, doc.page.margins.left);
                            doc.font('Helvetica');
                            let entryLine = `Action By: ${log.actionBy || 'N/A'}   Date: ${dateStr}   Time: ${timeStr}`;
                            doc.text(entryLine);
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
                }
            }
            doc.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to generate administration audit trail report' });
        }
    },

    async generateAdministrationAuditTrailPDF1(req, res) {
        try {
            const { propertyId, fromDate, toDate } = req.query;

            if (!fromDate || !toDate) {
                return res.status(400).json({ message: 'fromDate and toDate are required' });
            }

            const whereClause = {
                createdAt: {
                    [Op.between]: [new Date(fromDate), new Date(toDate)],
                },
            };
            if (propertyId) {
                whereClause.propertyId = propertyId;
            }

            const logs = await db.AdministrationLogs.findAll({
                where: whereClause,
                order: [['createdAt', 'ASC']],
            });
            console.log("Fetched logs:", logs.length);
            let propertyName = 'All Properties';
            let propertyMap = {};
            if (propertyId) {
                const propertyDetails = await db.PropertyMaster.findOne({
                    where: { id: propertyId },
                    attributes: ['name'],
                });
                propertyName = propertyDetails?.name || 'N/A';
            } else {
                const allProperties = await db.PropertyMaster.findAll({
                    attributes: ['id', 'name'],
                });
                propertyMap = allProperties.reduce((map, prop) => {
                    map[prop.id] = prop.name;
                    return map;
                }, {});
            }
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 50, right: 50 },
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="AdministrationAuditTrail_${propertyName.replace(/\s+/g, '_')}.pdf"`
            );
            doc.pipe(res);
            doc.fontSize(14)
                .fillColor('#000080')
                .text(propertyName, { align: 'left', continued: true })
                .fillColor('red')
                .text('Administration Audit Trail', { align: 'right' });
            doc.moveDown(0.5);
            doc.fillColor('black').fontSize(10)
                .text(`Date From: ${fromDate}`, { continued: true })
                .text(`   To: ${toDate}`, { align: 'right' });
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();
            console.log("logs - ", logs);
            if (!logs.length) {
                doc.moveDown().text('No Administration Log found for the selected date range.');
            } else {
                let resCounter = 1;
                for (const log of logs) {
                    const logDate = new Date(log.createdAt);
                    const dateStr = logDate.toLocaleDateString();
                    const timeStr = logDate.toLocaleTimeString();
                    const propertyTitle = propertyId
                        ? propertyName
                        : propertyMap[log.propertyId] || `Unknown (ID: ${log.propertyId})`;
                    doc.moveDown(1)
                        .fontSize(11)
                        .font('Helvetica-Bold')
                        .fillColor('#000')
                        .text(`Entry No: ${resCounter++}`, doc.page.margins.left);
                    doc.fontSize(10)
                        .fillColor('#000080')
                        .text(`Property: ${propertyTitle}`, { align: 'left' });
                    doc.moveDown(0.2);
                    doc.font('Helvetica-Bold').fillColor('#000')
                        .text(`Operation : ${log.operation || 'N/A'}`, doc.page.margins.left);
                    doc.font('Helvetica');
                    doc.text(`Action By: ${log.actionBy || 'N/A'}   Date: ${dateStr}   Time: ${timeStr}`);

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
                    doc.moveDown(0.3);
                }
            }

            doc.end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to generate administration audit trail report' });
        }
    },

    // end Administration Logs

    async roomOccupancy(req, res) {
        try {
            const { propertyId, createdAt } = req.query;
            // Always filter by status, filter by ID only if propertyId is passed
            const propertyWhereClause = {
                ...(propertyId && { id: propertyId })  // 'id' is correct here
            };
            const properties = await db.PropertyMaster.findAll({
                where: {
                    ...propertyWhereClause,
                    status: 1,
                    deletedAt: null, // Check PropertyMaster not soft-deleted
                },
                attributes: ['id', 'name', 'propertyCode', 'noOfRooms', 'onboardedRooms'],
                include: [
                    {
                        model: db.Rooms,
                        required: false,
                        where: {
                            deletedAt: null, // Check Rooms not soft-deleted
                        },
                        attributes: ['id', 'categoryId', 'propertyId', 'regularPrice', 'roomDescription', 'breakFastPrice', 'ap', 'map', 'heroImage'],
                        include: [
                            {
                                model: db.RoomDetails,
                                required: false,
                                where: {
                                    deletedAt: null, // Check RoomDetails not soft-deleted
                                    categoryId: {
                                        [Op.in]: [1, 2, 3, 5, 6, 7]
                                    }
                                },
                                attributes: ['id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber', 'occupancy', 'status', 'fromDate', 'toDate']
                            }
                        ]
                    }
                ],
                logging: console.log
            });
            const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
            const filteredProperties = properties.map(property => {
                const plainProperty = property.get({ plain: true });
                plainProperty.Rooms = plainProperty.Rooms.map(room => {
                    room.RoomDetails = room.RoomDetails.filter(detail => {
                        // return (
                        //     detail.fromDate <= today &&
                        //     detail.toDate >= today
                        // );
                        return [1, 2, 3, 5, 6, 7].includes(detail.categoryId);
                    });
                    return room;
                });
                return plainProperty;
            });

            const summaryResults = [];
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
                    const data = {
                        propertyId: property.id,
                        propertyCode: property.propertyCode,
                        propertyName: property.name,
                        categoryId: parseInt(categoryId, 10),
                        categoryName: summary.name,
                        totalRooms: property.noOfRooms,
                        catTotalRooms: summary[0].length + summary[1].length + summary[2].length + summary[3].length,
                        availableCount: summary[0].length,
                        occupiedCount: summary[1].length,
                        dirtyCount: summary[2].length,
                        blockedCount: summary[3].length,
                        roomNumbersAvailable: summary[0].join(', '),
                        roomNumbersOccupied: summary[1].join(', '),
                        roomNumbersDirty: summary[2].join(', '),
                        roomNumbersBlocked: summary[3].join(', '),
                        reportDate: moment(today).format('DD-MM-YYYY')
                    };
                    summaryResults.push(data);
                }
            }
            return res.status(200).json({
                status: true,
                message: 'Occupancy summary fetched successfully.',
                data: summaryResults
            });
        } catch (err) {
            console.error('API Error - Occupancy Summary:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    async roomOccupancyFilter(req, res) {
        try {
            const { propertyId, reportDate, startDate, endDate } = req.query;
            if (!reportDate && (!startDate || !endDate)) {
                return res.status(400).json({
                    message: 'Either reportDate or both startDate and endDate are required'
                });
            }
            const whereCondition = {};
            // // Date filtering
            // if (reportDate) {
            //     whereCondition.reportDate = moment(reportDate).format('DD-MM-YYYY');
            // } else if (startDate && endDate) {
            //     whereCondition.reportDate = {
            //         [Op.between]: [
            //             moment(startDate).format('DD-MM-YYYY'),
            //             moment(endDate).format('DD-MM-YYYY')
            //         ]
            //     };
            // }

            if (reportDate) {
                whereCondition[Op.and] = literal(`STR_TO_DATE(reportDate, '%d-%m-%Y') = '${moment(reportDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}'`);
            } else if (startDate && endDate) {
                whereCondition[Op.and] = literal(`STR_TO_DATE(reportDate, '%d-%m-%Y') BETWEEN '${moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}' AND '${moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}'`);
            }
            // Property filtering
            if (propertyId) {
                whereCondition.propertyId = propertyId;
            }
            const result = await db.PropertyOccupancySummary.findAll({
                where: whereCondition,
                order: [['reportDate', 'DESC'], ['propertyName', 'ASC']]
            });
            // Add CatRoomCount to each entry
            const updatedResult = result.map(item => {
                const data = item.toJSON(); // Convert Sequelize model to plain object
                data.CatTotalRooms =
                    (data.blockedCount || 0) +
                    (data.dirtyCount || 0) +
                    (data.occupiedCount || 0) +
                    (data.availableCount || 0);
                return data;
            });
            return res.status(200).json({
                status: true,
                message: 'Occupancy summary fetched successfully.',
                data: updatedResult
            });
        } catch (error) {
            console.error('Error fetching property occupancy summary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // upload krna hai
    async sendOtpEmailVerification(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required.' });
            }
            await emailVerifyByOTP(email, otp);
            res.status(200).json({ message: 'OTP email sent successfully.' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to send OTP email.', error: error.message });
        }
    },

    // upload krna hai
    async sendOtpPhoneVerification(req, res) {
        try {
            const { mobile, otp } = req.body;
            if (!mobile || !otp) {
                return res.status(400).json({ message: 'Phone Number and OTP are required.' });
            }
            await sendMobileVerifyOtp(mobile, otp);
            res.status(200).json({ message: 'OTP email sent successfully.' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to send OTP email.', error: error.message });
        }
    },
};

// Generate PDF using Puppeteer
async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
        // executablePath: '/var/www/html/rrooms/.cache/puppeteer/chrome/linux-132.0.6834.110/chrome-linux64/chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    // Generate the PDF with margins
    const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
            top: '20mm',    // Top margin
            right: '10mm',  // Right margin
            bottom: '20mm', // Bottom margin
            left: '10mm'    // Left margin
        }
    });
    await browser.close();
    return pdfBuffer;
}

// Separate function for generating HTML content
function generateHtmlContent(propertyOwner, propertyAddress, propertyName, initiatorName, bankName, branch, accountHolderName, accountNumber, ifscCode, onBoardedDate, rroomsRegisterAddress, PropertyPanNumber, ownerAdhar, gstNumber, propertyMobileNumber, legalName, totalRooms, signedRooms, takeRate, designation, createdDate) {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RROOMS Property Agreement</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; font-size: 14px;">

  <h2 style="text-align: center; color: #2a2a2a;">RROOMS Property Agreement</h2>
  <h3 style="text-align: center; color: #2a2a2a;">PROPERTY ONBOARDING & SERVICE AGREEMENT</h3>

  <p>This Property Onboarding & Service Agreement ("Agreement") is entered into on
    <span style="font-style: italic; color: gray;">${onBoardedDate}</span> by and between:
  </p>

  <p><strong>RROOMS Hospitality India Private Limited</strong>, a company incorporated under the Companies Act, 2013,
    having its principal place of business at
    <span style="font-style: italic; color: gray;">${rroomsRegisterAddress}</span>.
  </p>

  <p><strong>AND</strong></p>

  <p><strong><span style="font-style: italic;">${propertyName}</span></strong>, located at
    <span style="font-style: italic;">${propertyAddress}</span>, represented by
    <span style="font-style: italic;">${propertyOwner}</span>, holding PAN No.
    <span style="font-style: italic;">${PropertyPanNumber}</span>, Aadhar No.
    <span style="font-style: italic;">${ownerAdhar}</span>, GST No.
    <span style="font-style: italic;">${gstNumber}</span>, contact number
    <span style="font-style: italic;">${propertyMobileNumber}</span>, legally owned by
    <span style="font-style: italic;">${legalName}</span>, with its bank details as follows:
  </p>

  <ul>
    <li><strong>Bank Name:</strong> ${bankName}</li>
    <li><strong>Branch:</strong> ${branch}</li>
    <li><strong>IFSC Code:</strong> ${ifscCode}</li>
    <li><strong>Account Number:</strong> ${accountNumber}</li>
    <li><strong>Account Holder's Name:</strong> ${accountHolderName}</li>
  </ul>
  </p>

  <p>(hereinafter referred to as the "PROPERTY OWNER", which expression shall, unless repugnant to the
    context or meaning thereof, be deemed to include its successors and permitted assigns).</p>

  <ul>
    <li><strong>Total Rooms:</strong> ${totalRooms}</li>
    <li><strong>Rooms Signed with RROOMS:</strong> ${signedRooms}</li>
    <li><strong>Take Rate (Commission):</strong> ${takeRate}</li>
  </ul>

  <hr style="margin: 30px 0;">

  <h3>1. PURPOSE</h3>
  <p> The PROPERTY OWNER hereby appoints RROOMS to onboard, market, and facilitate room bookings for
    the Property through RROOMS’ proprietary online travel agency platform (hereinafter “RROOMS OTA”)
    and affiliated channels, including but not limited to:</p>
  <ul>
    <li>RROOMS website and mobile app</li>
    <li>Partner OTA platforms managed by RROOMS</li>
    <li>RROOMS Partner App and distribution network</li>
  </ul>

  <h3>2. CATEGORY CLASSIFICATION & SERVICES</h3>
  <p>The PROPERTY OWNER agrees to list their Property under one or more of the following categories, as
    selected during onboarding: - <strong>Eco</strong> – Economy accommodations; - <strong>Elite</strong> – Semi-premium
    accommodations; - <strong>Luxe</strong> – Ultra-premium accommodations; - <strong>Home Stay</strong> – Residential
    stay
    arrangements with home-like experiences; - <strong>Studios</strong> – Fully serviced studio apartments ensuring
    complete privacy and comfort; - <strong>Hourly Stay</strong> – Short-stay rooms available in blocks of 3, 6, and 9
    hours
    (available only if opted by the PROPERTY OWNER during onboarding).</p>


  <h3>3. PROPERTY MANAGEMENT SYSTEM (PMS)</h3>
  <p> RROOMS shall provide the PROPERTY OWNER with access to its proprietary Property Management
    System (RROOMS Partner) free of cost until <strong>31st December 2025</strong>. Extension of this benefit beyond the
    specified period shall be contingent on the Property's performance metrics and guest ratings, at the
    sole discretion of RROOMS.</p>

  <h3>4. ONBOARDING FEES AND BENEFITS</h3>
  <p>The PROPERTY OWNER shall remit a one-time onboarding fee of INR 1,999 (inclusive of applicable taxes)
    towards onboarding services, which shall include: - One branded flex signboard featuring the RROOMS
    identity; - A comprehensive onboarding kit comprising physical and digital assets for listing
    enablement.</p>

  <h3>5. BOOKINGS AND RECONCILIATION</h3>
  <p>RROOMS shall enable and manage the following payment methods for guest bookings: - <strong>Pay at Hotel;
      Partial Payment; - Prepaid (RROOMS Paid).</strong></p>
  <p> Bookings shall be monetized based on actual realized bookings (excluding no-shows, cancellations, or
    unutilized reservations). RROOMS shall charge the agreed <strong>take rate percentage</strong> as commission on
    each realized booking.</p>
  <p> RROOMS shall generate and share a booking reconciliation statement with the PROPERTY OWNER on
    the <strong>3rd day of each calendar month</strong>, listing all bookings, payment modes, and dues payable to the
    PROPERTY OWNER.</p>

  <h3>6. RIGHTS AND OBLIGATIONS</h3>
  <ul>
    <li>RROOMS shall be responsible for onboarding, listing, marketing, and software support.</li>
    <li>PROPERTY OWNER shall be responsible for service quality, staff conduct, accurate inventory
      maintenance, and honoring confirmed bookings.</li>
    <li>RROOMS shall not be liable for any service delivery issues arising from the PROPERTY OWNER's
      end.</li>
  </ul>

  <h3>7. TERM AND TERMINATION</h3>
  <p>This Agreement shall be valid from the Effective Date and shall remain in force until terminated by
    either Party by providing a <strong>thirty (30) day prior written notice</strong>. RROOMS may, without limitation,
    terminate this Agreement with immediate effect upon detection of consistent guest complaints, service
    deficiencies, or brand misconduct by the PROPERTY OWNER.</p>

  <h3>8. CONFIDENTIALITY</h3>
  <p>All documents, software access, and transactional data provided under this Agreement shall be treated
    as confidential. The PROPERTY OWNER shall not share or disclose such data without the express written
    consent of RROOMS.</p>

  <h3>9. JURISDICTION AND GOVERNING LAW</h3>
  <p>This Agreement shall be governed by and construed in accordance with the laws of India. The courts
    situated in <strong>Lucknow, Uttar Pradesh</strong> shall have exclusive jurisdiction over all matters arising from
    this
    Agreement.</p>

  <h3>10. ENTIRE AGREEMENT</h3>
  <p> This Agreement constitutes the entire understanding between the Parties and supersedes all prior
    discussions, negotiations, and understandings in respect thereof. Any amendments or modifications to
    this Agreement shall be in writing and duly executed by both Parties.</p>

  <h3>11. EXECUTION</h3>
  <p> IN WITNESS WHEREOF, the Parties hereto have executed this Agreement on the day and year first above
    written.</p>

  <div class="signature" style="margin-top: 40px;">
    <p><strong>FOR RROOMS Hospitality India Pvt. Ltd.</strong><br>
      Name: <span style="font-style: italic;">${initiatorName}</span><br>
      Designation: <span style="font-style: italic;">${designation}</span><br>
      Signature: ____________________<br>
      Date: ${createdDate}
    </p>

    <p><strong>FOR <span style="font-style: italic;">${propertyName}</span></strong><br>
      Name: <span style="font-style: italic;">${propertyOwner}</span><br>
      Signature: ____________________<br>
      Date: ${onBoardedDate}
    </p>
  </div>
</body>
</html>
    `;
}

function getCategoryName(categoryId) {
    const categoryMap = {
        1: 'Executive',
        2: 'Deluxe',
        3: 'Suite',
        5: 'Executive Single',
        7: 'Twin Bed Deluxe'
    };
    return categoryMap[categoryId] || `Category ${categoryId}`;
}
