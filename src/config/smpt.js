import nodemailer from 'nodemailer';
import welcomeEmailTemplate from '../mail-template/welcomeEmail.js';
import rroomsUserCreate from '../mail-template/rroomsUserCreate.js';
import propertyUserCreate from '../mail-template/propertyUserCreate.js';
import bookingConfirmationGuest from '../mail-template/bookingConfirmationGuest.js';
import bookingConfirmationProperty from '../mail-template/bookingConfirmationProperty.js';
import bookingConfirmationRrooms from '../mail-template/bookingConfirmationRrooms.js';
import bookingCancelGuest from '../mail-template/bookingCancelGuest.js';
import bookingCancelProperty from '../mail-template/bookingCancelProperty.js';
import bookingCancelRrooms from '../mail-template/bookingCancelRrooms.js';
import bookingConfirmGuest from '../mail-template/bookingCompleteGuest.js';
import bookingCompleteProperty from '../mail-template/bookingCompleteProperty.js';
import bookingCompleteRrooms from '../mail-template/bookingCompleteRrooms.js';
import bookingCompleteGuest from '../mail-template/bookingCompleteGuest.js';
import bookingNoShowGuest from '../mail-template/bookingNoShowGuest.js';
import bookingNoShowProperty from '../mail-template/bookingNoShowProperty.js';
import bookingNoShowRrooms from '../mail-template/bookingNoShowRrooms.js';
import propertyOnBoardProperty from '../mail-template/propertyOnBoardProperty.js';
import enquiryForPropertyOnboard from '../mail-template/enquiryForPropertyOnboard.js';
import contractAcceptanceProperty from '../mail-template/contractAcceptanceProperty.js';
import contractAcceptanceRrooms from '../mail-template/contractAcceptanceRrooms.js';
import propertyOnBoardProcess from '../mail-template/propertyOnBoardProcess.js'
import propertyRejectMailToInitiator from '../mail-template/propertyRejectMailToInitiator.js'
import propertyApproveMailToCreatorAndProperty from '../mail-template/propertyApproveMailToCreatorAndProperty.js'
import otpVerifyEmail from '../mail-template/otpVerifyEmail.js'; // upload krna hai

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false otherwise
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    // logger: true,  // optional: enable to see SMTP logs
    // debug: true    // optional: enable to see full communication logs
});

const sendMail = async (to, subject, html) => {
    try {
        let info = await transporter.sendMail({
            from: `"RRooms Hospitality" <${process.env.SMTP_FROM}>`,
            to,
            subject,
            html,
            replyTo: 'info@rrooms.in'
        });
        console.log(`Email sent:- ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email:- ${error}`);
    }
};

// upload krna hai
const emailVerifyByOTP = async (email, otp) => {
    try {
        const subject = 'Verify Your Email Address for RROOMS Property Registration';
        const html = otpVerifyEmail(otp);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
};

const sendMailWithAttachment = async (to, subject, html, attachments = []) => {
    try {
        let info = await transporter.sendMail({
            from: `"RRooms Hospitality" <${process.env.SMTP_FROM}>`,
            to,
            subject,
            html,
            attachments
        });
        console.log(`Email sent:- ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email:- ${error}`);
    }
};

// Function to send welcome email
const sendWelcomeEmail = async (email, name) => {
    try {
        const subject = "Welcome to RROOMS – Your Seamless Stay Awaits!";
        const html = welcomeEmailTemplate(name);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
};

// Function to send email rrroms user create
const sendNewRRoomsUser = async (employeeName, userCode, username, designation, role, password) => {
    try {
        const subject = "Welcome to RRooms Hospitality India Pvt. Ltd. – Your Account is Ready!";
        const html = rroomsUserCreate(employeeName, userCode, username, designation, role, password);
        await sendMail(username, subject, html);
    } catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
};

// Function to send email property user create
const sendNewPropertyUser = async (propertyName, email, password, firstName, lastName, role, designation) => {
    try {
        const subject = "Welcome to RRooms Hospitality India Pvt. Ltd. – Your Account is Ready!";
        const html = propertyUserCreate(propertyName, email, password, firstName, lastName, role, designation);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
};

// Function to send booking confirmation email to guest
const sendBookingConfirmationGuest = async (email, bookingDetails) => {
    try {
        const subject = `New ${bookingDetails?.paymentModeName} Booking is created – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingConfirmationGuest(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking confirmation email to property
const sendBookingConfirmationProperty = async (email, bookingDetails) => {
    try {
        console.log("sendBookingConfirmationProperty - ", email);
        const subject = `New ${bookingDetails?.paymentModeName} Booking is created – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingConfirmationProperty(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking confirmation email to RROOMS
const sendBookingConfirmationRrooms = async (email, bookingDetails) => {
    try {
        const subject = `New ${bookingDetails?.paymentModeName} Booking is created – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingConfirmationRrooms(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking cancel email to RROOMS
const sendBookingCancelRrooms = async (email, bookingDetails) => {
    try {
        console.log("sendBookingCancelRrooms - ", email);
        const subject = `Booking Cancellation Alert – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingCancelRrooms(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking cancel email to Property
const sendBookingCancelProperty = async (email, bookingDetails) => {
    try {
        console.log("sendBookingCancelProperty - ", email);
        const subject = `Booking Cancelled – ${bookingDetails.bookingId}`;
        const html = bookingCancelProperty(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking Cancel email to Guest
const sendBookingCancelGuest = async (email, bookingDetails) => {
    try {
        console.log("sendBookingCancelGuest - ", email);
        const subject = `Your Booking Has Been Cancelled – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingCancelGuest(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking Complete email to RRooms
const sendBookingCompleteRrooms = async (email, bookingDetails) => {
    try {
        console.log("sendBookingCompleteRrooms - ", email);
        const subject = `Guest Checked Out – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingCompleteRrooms(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking Complete email to Property
const sendBookingCompleteProperty = async (email, bookingDetails) => {
    try {
        console.log("sendBookingCompleteProperty - ", email);
        const subject = `Guest Checked Out – ${bookingDetails.bookingId}`;
        const html = bookingCompleteProperty(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking Complete email to Guest
// const sendBookingCompleteGuest = async (email, bookingDetails, invoicePath = null) => {
//     try {
//         console.log("sendBookingCompleteGuest - ", email);
//         const subject = `Thank You for Staying at ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
//         const html = bookingCompleteGuest(bookingDetails);
//         const attachments = invoicePath
//             ? [{
//                 filename: `Invoice-${bookingDetails.bookingId}.pdf`,
//                 path: invoicePath
//             }]
//             : [];
//         await sendMailWithAttachment(email, subject, html, attachments);
//     } catch (error) {
//         console.error(`Error sending booking confirmation email to ${email}:`, error);
//     }
// };
const sendBookingCompleteGuest = async (email, bookingDetails) => {
    try {
        const subject = `Thank You for Staying at ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingCompleteGuest(bookingDetails);
        await sendMailWithAttachment(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking No Show email to RRooms
const sendBookingNoShowRrooms = async (email, bookingDetails) => {
    try {
        console.log("sendBookingNoShowRrooms - ", email);
        const subject = `No-Show Recorded – ${bookingDetails.hotelName} - ${bookingDetails.bookingId}`;
        const html = bookingNoShowRrooms(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking No Show email to Property
const sendBookingNoShowProperty = async (email, bookingDetails) => {
    try {
        console.log("sendBookingNoShowProperty - ", email);
        const subject = `Guest No-Show Alert – ${bookingDetails.bookingId}`;
        const html = bookingNoShowProperty(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

// Function to send booking No Show email to Guest
const sendBookingNoShowGuest = async (email, bookingDetails) => {
    try {
        console.log("sendBookingNoShowGuest - ", email);
        // const subject = `Your Booking at ${bookingDetails.hotelName} - ${bookingDetails.bookingId} – No-Show Recorded`;
        const subject = `We Missed Hosting You – Kindly Confirm Your Stay Status`;
        const html = bookingNoShowGuest(bookingDetails);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
};

const sendPropertyOnBoardProperty = async (OwnerEmail, PropertyOwner, PropertyName, PropertyAddres, Password, noOfRooms) => {
    try {
        console.log("sendPropertyOnBoardProperty - ", OwnerEmail);
        const subject = `Congratulations! Your Property is Now Onboarded on RRooms Hospitality India Pvt. Ltd.`;
        const html = propertyOnBoardProperty(OwnerEmail, PropertyOwner, PropertyName, PropertyAddres, Password, noOfRooms);
        await sendMail(OwnerEmail, subject, html);
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
    }
}

const sendEnquiryForPropertyOnboard = async (email, name, mobile, property_name,
    address, state, cityName, pincode
) => {
    let rroomsAdmin = 'rrooms.in@gmail.com'
    try {
        console.log("sendEnquiryForPropertyOnboard - ", rroomsAdmin);
        const subject = `Enquiry for Property Onboard from -${name}`;
        const html = enquiryForPropertyOnboard(email, name, mobile, property_name,
            address, state, cityName, pincode);
        await sendMail(rroomsAdmin, subject, html);
    } catch (error) {
        console.error(`sendEnquiryForPropertyOnboard ${rroomsAdmin}:`, error);
    }
}

const sendContractAcceptanceProperty = async (email, getPropertyDetail) => {
    try {
        console.log("sendContractAcceptanceProperty - ", email);
        const subject = `Contract Agreement -${getPropertyDetail?.name} & RROOMS Hospitality India Pvt. Ltd.`;
        const html = contractAcceptanceProperty(getPropertyDetail);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`sendContractAcceptanceProperty:`, error);
    }
}

const sendContractAcceptanceRrooms = async (email, getPropertyDetail) => {
    try {
        console.log("sendContractAcceptanceRrooms - ", email);
        const subject = `${getPropertyDetail?.name} | Contract has been acceptance`;
        const html = contractAcceptanceRrooms(getPropertyDetail);
        await sendMail(email, subject, html);
    } catch (error) {
        console.error(`sendContractAcceptanceRrooms:`, error);
    }
}

const sendPropertyOnBoardProcessToInititor = async (InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long) => {
    try {
        console.log("Initiator - ", InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        const subject = `${name} | onboarding process is initiated`;
        const html = propertyOnBoardProcess(InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        await sendMail(InitiatorEmail, subject, html);
    } catch (error) {
        console.error(`sendPropertyOnBoardProcessToInititor:`, error);
    }
}

const sendPropertyOnBoardProcessToRRooms = async (rroomsAdmin, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long) => {
    try {
        console.log("RRooms - ", rroomsAdmin, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        const subject = `${name} | onboarding process is initiated`;
        const html = propertyOnBoardProcess(InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        await sendMail(rroomsAdmin, subject, html);
    } catch (error) {
        console.error(`sendPropertyOnBoardProcessToInititor:`, error);
    }
}

const sendPropertyOnBoardProcessToProperty = async (OwnerEmail, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long) => {
    try {
        console.log("property - ", OwnerEmail, InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        const subject = `${name} | onboarding process is initiated`;
        const html = propertyOnBoardProcess(InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long);
        await sendMail(OwnerEmail, subject, html);
    } catch (error) {
        console.error(`sendPropertyOnBoardProcessToProperty:`, error);
    }
}

const sendPropertyRejectMailToInitiator = async (initiatorEmail, propertyOwner, propertyName, propertyCode, rejectedByName, rejectedByEmail, rejectionReason) => {
    try {
        const subject = `${propertyName} | Onboarding Update – Property Has Been Rejected`;
        const html = propertyRejectMailToInitiator(propertyOwner, propertyName, propertyCode, rejectedByName, rejectedByEmail, rejectionReason);
        await sendMail(initiatorEmail, subject, html);
    } catch (error) {
        console.error(`sendPropertyRejectMailToInitiator:`, error);
    }
}

// comment for pupteer not working on new server
const sendPropertyApprovedWithAttchmentProperty = async (propertyOwnerEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress, agreementAttach) => {
    try {
        const subject = `${propertyName} | Property has been Approved on RROOMS`;
        const html = propertyApproveMailToCreatorAndProperty(propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress);
        const attachments = [{
            filename: `Agreement.pdf`,
            content: agreementAttach
        }];
        await sendMailWithAttachment(propertyOwnerEmail, subject, html, attachments);
    } catch (error) {
        console.error(`Error email to ${propertyOwnerEmail}:`, error);
    }
};
// const sendPropertyApprovedWithAttchmentProperty = async (propertyOwnerEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress) => {
//     try {
//         const subject = `${propertyName} | Property has been Approved on RROOMS`;
//         const html = propertyApproveMailToCreatorAndProperty(propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress);
//         await sendMail(propertyOwnerEmail, subject, html);
//     } catch (error) {
//         console.error(`Error email to ${propertyOwnerEmail}:`, error);
//     }
// };

// comment for pupteer not working on new server
const sendPropertyApprovedWithAttchmentInitiator = async (initiatorEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress, agreementAttach) => {
    try {
        const subject = `${propertyName} | Property has been Approved on RROOMS`;
        const html = propertyApproveMailToCreatorAndProperty(propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress);
        const attachments = [{
            filename: `Agreement.pdf`,
            content: agreementAttach
        }];
        await sendMailWithAttachment(initiatorEmail, subject, html, attachments);
    } catch (error) {
        console.error(`Error sending email to ${initiatorEmail}:`, error);
    }
};
// const sendPropertyApprovedWithAttchmentInitiator = async (initiatorEmail, propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress) => {
//     try {
//         const subject = `${propertyName} | Property has been Approved on RROOMS`;
//         const html = propertyApproveMailToCreatorAndProperty(propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress);
//         await sendMail(initiatorEmail, subject, html);
//     } catch (error) {
//         console.error(`Error sending email to ${initiatorEmail}:`, error);
//     }
// };

// upload krna hai
module.exports = { emailVerifyByOTP, sendWelcomeEmail, sendNewRRoomsUser, sendNewPropertyUser, sendBookingConfirmationGuest, sendBookingConfirmationProperty, sendBookingConfirmationRrooms, sendBookingCancelRrooms, sendBookingCancelProperty, sendBookingCancelGuest, sendBookingCompleteRrooms, sendBookingCompleteProperty, sendBookingCompleteGuest, sendBookingNoShowGuest, sendBookingNoShowProperty, sendBookingNoShowRrooms, sendPropertyOnBoardProperty, sendEnquiryForPropertyOnboard, sendContractAcceptanceProperty, sendContractAcceptanceRrooms, sendPropertyOnBoardProcessToInititor, sendPropertyOnBoardProcessToProperty, sendPropertyRejectMailToInitiator, sendPropertyApprovedWithAttchmentProperty, sendPropertyApprovedWithAttchmentInitiator, sendPropertyOnBoardProcessToRRooms };