import express from "express";
import bookingController from "./booking.controller";
import downloadreportController from "./downloadreport.controller";
import { sanitize } from "../../../middleware/sanitizer";
import { validateBody } from "../../../middleware/validator";
import focController from "./foc/foc.controller";
import focValidation from "./foc/foc.validation";
import bookingValidation from "./booking.validation";
import { verifyJWTToken } from "../../../middleware/Authentication";

export const roomBooking = express.Router();
//Property Category
roomBooking
  .route("/room-booking")
  .post(sanitize(), verifyJWTToken, bookingController.create);

roomBooking
  .route("/ezee-room-booking")
  .post(sanitize(), bookingController.createByEzee); // 08-07-2025

roomBooking
  .route("/rrooms-bookings")
  .get(bookingController.getRRoomsBookings); // 14-07-2025

roomBooking
  .route("/:id/update-payment-status")
  .put(verifyJWTToken, bookingController.updateBookingPaymentStatus); // 14-07-2025

roomBooking
  .route("/room-booking-confirm/:id")
  .put(sanitize(), verifyJWTToken, bookingController.confirmBooking);
roomBooking
  .route("/room-booking/:id")
  .put(sanitize(), verifyJWTToken, bookingController.update);

roomBooking
  .route("/room-booking/apply-discount/:id")
  .post(sanitize(), bookingController.applyfoodOrderDiscount); //
roomBooking
  .route("/room-booking/apply-discount-other-kot/:id")
  .post(sanitize(), bookingController.applyDiscountOnOtherKOT); //

roomBooking
  .route("/room-booking/:id")
  .patch(sanitize(), bookingController.updateBookingStatus);
roomBooking
  .route("/room-booking/:id")
  .delete(sanitize(), verifyJWTToken, bookingController.delete);
roomBooking
  .route("/room-booking")
  .get(sanitize(), verifyJWTToken, bookingController.get); //
roomBooking
  .route("/room-booking/:id")
  .get(sanitize(), bookingController.getById);
roomBooking
  .route("/room-booking/by-booking-code/:id")
  .get(sanitize(), verifyJWTToken, bookingController.getByBookingCode); //
roomBooking
  .route("/room-booking/booking-details/:id")
  .get(sanitize(), bookingController.getBookingDetailsByCode); //
roomBooking
  .route("/room-booking/by-property/:id")
  .get(sanitize(), verifyJWTToken, bookingController.getByPropertyId);

roomBooking
  .route("/room-booking/remove-extra-charge/:id")
  .put(sanitize(), bookingController.removeExtraCharges);

roomBooking
  .route("/booking-transfer")
  .post(sanitize(), bookingController.bookingTranfered);

roomBooking
  .route("/nearest-property/:propertyId")
  .get(sanitize(), bookingController.getNearestPropertyForTransfer);

roomBooking
  .route("/delete-room")
  .post(sanitize(), bookingController.deleteAddedRoom); //

// start new api for search booking by guest name, mobile number, booking id, email
roomBooking
  .route("/search-booking")
  .get(sanitize(), bookingController.getBooking);
// end new api for search booking by guest name, mobile number, booking id, email

roomBooking
  .route("/room-booking/by-user/:id")
  .get(sanitize(), bookingController.getByUserId);
roomBooking
  .route("/room-booking/filter")
  .post(sanitize(), verifyJWTToken, bookingController.filterBooking);
roomBooking
  .route("/assign-rooms")
  .post(sanitize(), verifyJWTToken, bookingController.assignRoomByBookingId);
roomBooking
  .route("/room-booking/add-guest-user")
  .post(
    sanitize(),
    verifyJWTToken,
    bookingController.addGuestDetailsByBookingId
  );
roomBooking
  .route("/room-booking/delete-guest-user/:id")
  .delete(sanitize(), verifyJWTToken, bookingController.deleteGuestDetailById);
roomBooking
  .route("/rooms-aviability")
  .post(sanitize(), verifyJWTToken, bookingController.getRoomsAviability);
//Payment Details:
roomBooking
  .route("/payment")
  .post(sanitize(), verifyJWTToken, bookingController.payAmout);
roomBooking
  .route("/payment/:id")
  .put(sanitize(), verifyJWTToken, bookingController.updatePaymentDetails);
roomBooking
  .route("/payment-details")
  .post(sanitize(), bookingController.getPaymentList); //
roomBooking
  .route("/booking-payment-report")
  .get(sanitize(), bookingController.downloadPaymentCollectionReport); // payment report
roomBooking
  .route("/booking-revenue-report")
  .get(sanitize(), bookingController.downloadRevenueReport); // revenue report

//FOC Request
roomBooking
  .route("/foc-request")
  .get(sanitize(), verifyJWTToken, focController.list);
roomBooking
  .route("/foc-request")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(focValidation.store),
    focController.create
  );
roomBooking
  .route("/foc-request/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(focValidation.update),
    focController.update
  );

// start Booking Logs
roomBooking
  .route("/booking-logs")
  .post(sanitize(), verifyJWTToken, bookingController.createLog);
roomBooking
  .route("/booking-logs/:id")
  .put(sanitize(), verifyJWTToken, bookingController.updateLog);
roomBooking
  .route("/booking-logs")
  .get(sanitize(), verifyJWTToken, bookingController.getBookingLogs);
roomBooking
  .route("/booking-logs/:id")
  .get(sanitize(), verifyJWTToken, bookingController.getBookingLogById);
roomBooking
  .route("/booking-logs-bookingid/:id")
  .get(sanitize(), verifyJWTToken, bookingController.getBookingLogByBookingId);
roomBooking
  .route("/booking-logs/:id")
  .delete(sanitize(), verifyJWTToken, bookingController.deleteLog);
roomBooking
  .route("/booking-logs-bookingid/:id")
  .delete(sanitize(), verifyJWTToken, bookingController.deleteLogByBookingId);
roomBooking
  .route("/booking-audit-pdf")
  .get(sanitize(), bookingController.generateBookingAuditTrailPDF);
// end Booking Logs

// start Kitchen Logs
roomBooking
  .route("/kitchen-logs")
  .post(sanitize(), verifyJWTToken, bookingController.createKitchenLog);
roomBooking
  .route("/kitchen-logs/:id")
  .put(sanitize(), verifyJWTToken, bookingController.updateKitchenLog);
roomBooking
  .route("/kitchen-logs/:propertyId")
  .get(sanitize(), verifyJWTToken, bookingController.getKitchenLogs);
roomBooking
  .route("/kitchen-audit-pdf")
  .get(sanitize(), bookingController.generateKitchenAuditTrailPDF);
// end Kitchen Logs

//Download booking report
roomBooking
  .route("/download-report")
  .get(sanitize(), verifyJWTToken, downloadreportController.downloadReport);
//Fetch Guest List
roomBooking
  .route("/guest-list")
  .post(sanitize(), verifyJWTToken, bookingController.getWalkInGuestList);
roomBooking
  .route("/export-walkin-users/:propertyId")
  .get(sanitize(), bookingController.exportUniqueWalkInGuests); // export guest from booking
roomBooking
  .route("/user-booking-list")
  .post(
    sanitize(),
    verifyJWTToken,
    bookingController.getBookingListByUserMobile
  );
roomBooking
  .route("/checkout-guest")
  .post(
    sanitize(),
    verifyJWTToken,
    bookingController.updateBookingAmountOnMidCheckout
  );
