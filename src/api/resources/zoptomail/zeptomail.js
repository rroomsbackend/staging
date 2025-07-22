// https://www.npmjs.com/package/zeptomail
//   {
//       "address": emailDetails.userEmail,
//       "name": emailDetails.userName
//   },
// For ES6
import { SendMailClient } from "zeptomail";

const url = "api.zeptomail.in/v1.1/email/template/batch";
const token = "Zoho-enczapikey PHtE6r0NQe3oimQu8RNW4/K6QsTwYY4u9OI2eQETtY4UWfYHGE1Wr9sulDfirh17AfBFFPKfyYlp4LyUsb3QJzy5MWlKWWqyqK3sx/VYSPOZsbq6x00YsFUfdULUU4Tset9o1CLUst3bNA==";

let client = new SendMailClient({ url, token });
export const sendMail = (emailDetails) => {
  client.sendMail({
    "mail_template_key": "2518b.16c3125e3da1c636.k1.37c90ad1-1f28-11ef-8504-525400ab18e6.18fcdc6c3f8",
    "bounce_address": "info@email.rrooms.in",
    "from":
    {
      "address": "noreply@rrooms.in",
      "name": "noreply"
    },
    "to":
      [
        {
          "email_address":
          {
            "address": 'bookings@rrooms.in',
            "name": 'RRooms Booking'
          },
          "merge_info":
          {
            "totalBookingAmount": emailDetails.totalBookingAmount,
            "roomPrice": emailDetails.roomPrice,
            "guest_name": emailDetails.userName,
            "numberOfAdult": emailDetails.numberOfAdult,
            "guest_email": emailDetails.userEmail,
            "toDate": emailDetails.toDate,
            "discountAmount": emailDetails.discountAmount,
            "numberOfRooms": emailDetails.numberOfRooms,
            "property_name": emailDetails.hotelName,
            "fromDate": emailDetails.fromDate,
            "guest_mobile": emailDetails.userMobile,
            "totalCollectedAmount": emailDetails.totalCollectedAmount,
            "dateDifference": emailDetails.dateDifference,
            "totalDueAmount": emailDetails.totalDueAmount,
            "roomCategoryName": emailDetails.roomCategoryName,
            "bookingCode": emailDetails.bookingId,
            "useWalletAmount": emailDetails.useWalletAmount,
            "mealPlanName": emailDetails.mealPlanName
          },
        },
        {
          "email_address":
          {
            "address": emailDetails.propertyUserEmail,
            "name": emailDetails.propertyUserName
          },
          "merge_info":
          {
            "totalBookingAmount": emailDetails.totalBookingAmount,
            "roomPrice": emailDetails.roomPrice,
            "guest_name": emailDetails.userName,
            "numberOfAdult": emailDetails.numberOfAdult,
            "guest_email": emailDetails.userEmail,
            "toDate": emailDetails.toDate,
            "discountAmount": emailDetails.discountAmount,
            "numberOfRooms": emailDetails.numberOfRooms,
            "property_name": emailDetails.hotelName,
            "fromDate": emailDetails.fromDate,
            "guest_mobile": emailDetails.userMobile,
            "totalCollectedAmount": emailDetails.totalCollectedAmount,
            "dateDifference": emailDetails.dateDifference,
            "totalDueAmount": emailDetails.totalDueAmount,
            "roomCategoryName": emailDetails.roomCategoryName,
            "bookingCode": emailDetails.bookingId,
            "useWalletAmount": emailDetails.useWalletAmount,
            "mealPlanName": emailDetails.mealPlanName
          },
        }
      ],
    "subject": "Guest Booking Confirmation"
  }).then((resp) => console.log("success")).catch((error) => console.log(error, "error"));

  client.sendMail({
    "mail_template_key": "2518b.16c3125e3da1c636.k1.6bddbdd0-10f9-11ef-823e-525400674725.18f70d3fa2d",
    "bounce_address": "info@email.rrooms.in",
    "from":
    {
      "address": "noreply@rrooms.in",
      "name": "noreply"
    },
    "to":
      [
        {
          "email_address":
          {
            "address": emailDetails.userEmail,
            "name": emailDetails.userName
          },
          "merge_info":
          {
            "totalBookingAmount": emailDetails.totalBookingAmount,
            "roomPrice": emailDetails.roomPrice,
            "guest_name": emailDetails.userName,
            "numberOfAdult": emailDetails.numberOfAdult,
            "guest_email": emailDetails.userEmail,
            "toDate": emailDetails.toDate,
            "discountAmount": emailDetails.discountAmount,
            "numberOfRooms": emailDetails.numberOfRooms,
            "property_name": emailDetails.hotelName,
            "fromDate": emailDetails.fromDate,
            "guest_mobile": emailDetails.userMobile,
            "totalCollectedAmount": emailDetails.totalCollectedAmount,
            "dateDifference": emailDetails.dateDifference,
            "totalDueAmount": emailDetails.totalDueAmount,
            "roomCategoryName": emailDetails.roomCategoryName,
            "bookingCode": emailDetails.bookingId,
            "useWalletAmount": emailDetails.useWalletAmount,
            "mealPlanName": emailDetails.mealPlanName
          },
        },
      ],
    "subject": "Booking Confirmation"
  }).then((resp) => console.log("success")).catch((error) => console.log(error, "error"));
}
