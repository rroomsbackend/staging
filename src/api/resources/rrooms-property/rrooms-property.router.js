import express from "express";
import propertyCategoryController from "./property-category.controller";
import rroomCategoryController from "./rroom-category.controller";
import amenitiesController from "./amenities.controller";
import propertyAmenitiesController from "./property-amenities.controller";
import propertyImageController from "./property-image.controller";
import propertyController from "./property.controller";
import propertyRroomCategoryController from "./property-room-category.controller";
import roomsController from "./rooms.controller";
import propertyRroomCategoryAmenitiesController from "./property-room-category-amenities.controller";
import propertyRroomCategoryImageController from "./property-room-category-image.controller";
import { sanitize } from "../../../middleware/sanitizer";
import { validateBody } from "../../../middleware/validator";
import propertyRatingController from "./rating/property-rating.controller";
import propertyRatingValidation from "./rating/property-rating.validation";
import propertyCouponController from "./coupon/property-coupon.controller";
import propertyCouponValidation from "./coupon/property-coupon.validation";
import serviceTaxController from "./service-tax/service-tax.controller";
import serviceTaxValidation from "./service-tax/service-tax.validation";
import roomPriceSettingController from "./room-price-setting/room-price-setting.controller";
import roomPriceSettingValidation from "./room-price-setting/room-price-setting.validation";
import menuCardController from "./menu-card/menu-card.controller";
import laundaryServiceController from "./laundary/laundary-service/laundary-service.controller";
import laundaryServiceValidation from "./laundary/laundary-service/laundary-service.validation";
import laundaryProviderController from "./laundary/laundary-provider/laundary-provider.controller";
import laundaryProviderValidation from "./laundary/laundary-provider/laundary-provider.validation";
import laundaryRequestController from "./laundary/laundary-request/laundary-request.controller";
import laundaryRequestValidation from "./laundary/laundary-request/laundary-request.validation";
import searchPropertyController from "./search-property/search-property.controller";
import invoiceSiteSettingsController from "../invoice-site-settings/invoice-site-settings.controller";
import itemCategoryController from "../food-order/item-category.controller";
import menuItemController from "../food-order/menu-item.controller";
import menuItemValidation from "../food-order/menu-item.validation";
import orderController from "../food-order/order.controller";
import orderValidation from "../food-order/order.validation";
import orderPaymentController from "../food-order/order-payment.controller";
import orderPaymentValidation from "../food-order/order-payment.validation";
import paymentController from "../payment/payment.controller";
import razorpayPaymentController from "../payment/razorpay.payment.controller";
import ncTypeSettingController from "../nc-type-setting/nc-type-setting.controller";
import ncTypeSettingValidation from "../nc-type-setting/nc-type-setting.validation";
import propertySalesController from "./hotel-finance/property-sales.controller";
import propertyInvoiceController from "./hotel-finance/property-invoice.controller";
import invoiceOfflinePaymentValidation from "./hotel-finance/invoice.validation";
import propertyCommissionController from "./hotel-finance/property-commission.controller";
import moduleConfigController from "./../module-config/module-config.controller";
import moduleConfigValidation from "./../module-config/module-config.validation";
import { verifyJWTToken } from "../../../middleware/Authentication";

export const rroomsProperty = express.Router();
//Property Category
rroomsProperty
  .route("/property-category")
  .post(
    sanitize(),
    verifyJWTToken,
    propertyCategoryController.createPropertyCategory
  );
rroomsProperty
  .route("/property-category/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    propertyCategoryController.updatePropertyCategory
  );
rroomsProperty
  .route("/property-category/:id")
  .delete(
    sanitize(),
    verifyJWTToken,
    propertyCategoryController.deletePropertyCategory
  );
rroomsProperty
  .route("/property-category")
  .get(sanitize(), propertyCategoryController.getPropertyCategory);
rroomsProperty
  .route("/property-category/:id")
  .get(
    sanitize(),
    verifyJWTToken,
    propertyCategoryController.getPropertyCategoryById
  );

//Rroom Category
rroomsProperty
  .route("/rroom-category")
  .post(
    sanitize(),
    verifyJWTToken,
    rroomCategoryController.createRroomCategory
  );
rroomsProperty
  .route("/rroom-category/:id")
  .put(sanitize(), verifyJWTToken, rroomCategoryController.updateRroomCategory);
rroomsProperty
  .route("/rroom-category/:id")
  .delete(
    sanitize(),
    verifyJWTToken,
    rroomCategoryController.deleteRroomCategory
  );
rroomsProperty
  .route("/rroom-category")
  .get(sanitize(), rroomCategoryController.getRroomCategory);
rroomsProperty
  .route("/rroom-category/:id")
  .get(
    sanitize(),
    verifyJWTToken,
    rroomCategoryController.getRroomCategoryById
  );

//Amenities
rroomsProperty
  .route("/amenities")
  .post(sanitize(), verifyJWTToken, amenitiesController.create);
rroomsProperty
  .route("/amenities/:id")
  .put(sanitize(), verifyJWTToken, amenitiesController.update);
rroomsProperty
  .route("/amenities/:id")
  .delete(sanitize(), verifyJWTToken, amenitiesController.delete);
rroomsProperty.route("/amenities").get(sanitize(), amenitiesController.get);
rroomsProperty
  .route("/amenities/:id")
  .get(sanitize(), verifyJWTToken, amenitiesController.getById);

//Property Amenities
rroomsProperty
  .route("/property-amenities")
  .post(sanitize(), verifyJWTToken, propertyAmenitiesController.create);
rroomsProperty
  .route("/property-amenities/:id")
  .put(sanitize(), verifyJWTToken, propertyAmenitiesController.update);
rroomsProperty
  .route("/property-amenities/:id")
  .delete(sanitize(), verifyJWTToken, propertyAmenitiesController.delete);
rroomsProperty
  .route("/property-amenities")
  .get(sanitize(), propertyAmenitiesController.get);
rroomsProperty
  .route("/property-amenities/:id")
  .get(sanitize(), propertyAmenitiesController.getById);

//Property Images
rroomsProperty
  .route("/property-image")
  .post(sanitize(), verifyJWTToken, propertyImageController.create);
rroomsProperty
  .route("/property-image/:id")
  .put(sanitize(), verifyJWTToken, propertyImageController.update);
rroomsProperty
  .route("/property-image/:id")
  .delete(sanitize(), verifyJWTToken, propertyImageController.delete);
rroomsProperty
  .route("/property-image")
  .get(sanitize(), propertyImageController.get);
rroomsProperty
  .route("/property-image/:id")
  .get(sanitize(), propertyImageController.getById);

//Property
rroomsProperty
  .route("/verify-otp-email")
  .post(propertyController.sendOtpEmailVerification);
rroomsProperty
  .route("/verify-otp-mobile")
  .post(propertyController.sendOtpPhoneVerification);

rroomsProperty
  .route("/properties-by-filter")
  .get(propertyController.filterSearchProperties);  // filter property by zone,state,hub,city

rroomsProperty
  .route("/report/property-occupancy-export")
  .get(propertyController.exportPropertyOccupancyReport);  // property room occupancy by admin and property

rroomsProperty
  .route("/property")
  .post(sanitize(), verifyJWTToken, propertyController.create);
rroomsProperty
  .route("/property/:id")
  .put(sanitize(), verifyJWTToken, propertyController.update);
rroomsProperty
  .route("/property/:id")
  .delete(sanitize(), verifyJWTToken, propertyController.delete);
rroomsProperty.route("/property").get(sanitize(), propertyController.get);

// start download excel for all properties by admin
rroomsProperty.route("/property-data-in-excel").get(sanitize(), propertyController.exportPropertiesToExcel);
// end download excel for all properties by admin

// start check owner exist by admin
rroomsProperty.route("/check-owner-exist").post(sanitize(), propertyController.checkOwnerExist);
// end check owner exist by admin

rroomsProperty
  .route("/property/:id")
  .get(sanitize(), propertyController.getById);
rroomsProperty
  .route("/inactive-coupon-property")
  .post(sanitize(), verifyJWTToken, propertyController.inactiveCouponProperty);
//rroomsProperty.route('/property/search').post(sanitize(),verifyJWTToken,propertyController.serachProperty);
rroomsProperty
  .route("/approved-property")
  .get(sanitize(), propertyController.getApprovedProperty);
rroomsProperty
  .route("/property-status")
  .put(sanitize(), verifyJWTToken, propertyController.updatePropertyStatus);
rroomsProperty
  .route("/property-image-profile/:id")
  .put(sanitize(), verifyJWTToken, propertyController.updateProfileImage);
rroomsProperty
  .route("/assign-unassign-property")
  .post(sanitize(), verifyJWTToken, propertyController.assignUnassignProperty);
rroomsProperty
  .route("/remove-assign-property")
  .delete(sanitize(), verifyJWTToken, propertyController.removeAssignProperty);
//Property Rroom Category
rroomsProperty
  .route("/property-rroom-category")
  .post(sanitize(), verifyJWTToken, propertyRroomCategoryController.create);
rroomsProperty
  .route("/property-rroom-category/:id")
  .put(sanitize(), verifyJWTToken, propertyRroomCategoryController.update);
rroomsProperty
  .route("/property-rroom-category/:id")
  .delete(sanitize(), verifyJWTToken, propertyRroomCategoryController.delete);
rroomsProperty
  .route("/property-rroom-category")
  .get(sanitize(), propertyRroomCategoryController.get);
rroomsProperty
  .route("/property-rroom-category/:id")
  .get(sanitize(), propertyRroomCategoryController.getById);
rroomsProperty
  .route("/property-log-create")
  .post(sanitize(), propertyController.createLog);
rroomsProperty
  .route("/property-log-get")
  .get(sanitize(), propertyController.getLogs);


// start Administration Log
rroomsProperty
  .route("/administration-log-create")
  .post(sanitize(), propertyController.createAdministrationLog);
rroomsProperty
  .route("/administration-log-update/:id")
  .post(sanitize(), propertyController.updateAdministrationLog);
rroomsProperty
  .route("/administration-logs/:propertyId")
  .get(sanitize(), verifyJWTToken, propertyController.getAdministrationLogs);
rroomsProperty
  .route("/administration-audit-pdf")
  .get(sanitize(), propertyController.generateAdministrationAuditTrailPDF);
// end Administration Log

rroomsProperty
  .route("/room-occupancy-today")
  .get(sanitize(), propertyController.roomOccupancy);

rroomsProperty
  .route("/room-occupancy-filter")
  .get(sanitize(), propertyController.roomOccupancyFilter);

//Property Rroom Category Amenities
rroomsProperty
  .route("/property-rroom-category-amenities")
  .post(
    sanitize(),
    verifyJWTToken,
    propertyRroomCategoryAmenitiesController.create
  );
rroomsProperty
  .route("/property-rroom-category-amenities/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    propertyRroomCategoryAmenitiesController.update
  );
rroomsProperty
  .route("/property-rroom-category-amenities/:id")
  .delete(
    sanitize(),
    verifyJWTToken,
    propertyRroomCategoryAmenitiesController.delete
  );
rroomsProperty
  .route("/property-rroom-category-amenities")
  .get(sanitize(), propertyRroomCategoryAmenitiesController.get);
rroomsProperty
  .route("/property-rroom-category-amenities/:id")
  .get(sanitize(), propertyRroomCategoryAmenitiesController.getById);

//Property Rroom Category Images
rroomsProperty
  .route("/property-rroom-category-image")
  .post(
    sanitize(),
    verifyJWTToken,
    propertyRroomCategoryImageController.create
  );
rroomsProperty
  .route("/property-rroom-category-image/:id")
  .put(sanitize(), verifyJWTToken, propertyRroomCategoryImageController.update);
rroomsProperty
  .route("/property-rroom-category-image/:id")
  .delete(
    sanitize(),
    verifyJWTToken,
    propertyRroomCategoryImageController.delete
  );
rroomsProperty
  .route("/property-rroom-category-image")
  .get(sanitize(), propertyRroomCategoryImageController.get);
rroomsProperty
  .route("/property-rroom-category-image/:id")
  .get(sanitize(), propertyRroomCategoryImageController.getById);

//Create rooms
rroomsProperty
  .route("/room")
  .post(sanitize(), verifyJWTToken, roomsController.create);
rroomsProperty
  .route("/room/:id")
  .put(sanitize(), verifyJWTToken, roomsController.update);
rroomsProperty
  .route("/room-status")
  .put(sanitize(), verifyJWTToken, roomsController.updateRoomStatus);
rroomsProperty
  .route("/room-detail-status")
  .put(sanitize(), verifyJWTToken, roomsController.updateRoomDetailsStatus);
rroomsProperty
  .route("/block-unblock-rooms")
  .put(sanitize(), roomsController.blockUnblockRoom);
rroomsProperty
  .route("/room/:id")
  .delete(sanitize(), verifyJWTToken, roomsController.delete);
rroomsProperty.route("/room").get(sanitize(), roomsController.get);
rroomsProperty
  .route("/room-image/:id")
  .delete(sanitize(), verifyJWTToken, roomsController.deleteRoomImage);
rroomsProperty.route("/room/:id").get(sanitize(), roomsController.getById);
rroomsProperty
  .route("/room/property/:id")
  .get(sanitize(), roomsController.getRoomByPropertyId);
rroomsProperty
  .route("/apply-offers")
  .put(sanitize(), verifyJWTToken, roomsController.applyOffers);
rroomsProperty
  .route("/room/property/:id/:propertyId")
  .get(sanitize(), roomsController.getRoomByRoomIdPropertyId);
rroomsProperty
  .route("/room-hero-image/:id")
  .put(sanitize(), verifyJWTToken, roomsController.updateRoomHeroImage);

// Property Ratings
rroomsProperty
  .route("/ratings")
  .get(
    sanitize(),
    validateBody(propertyRatingValidation.index),
    propertyRatingController.list
  );
rroomsProperty
  .route("/ratings")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(propertyRatingValidation.store),
    propertyRatingController.create
  );
rroomsProperty
  .route("/ratings/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(propertyRatingValidation.store),
    propertyRatingController.update
  );

// Property Coupon
rroomsProperty.route("/coupon").get(sanitize(), propertyCouponController.list);
rroomsProperty
  .route("/coupon-userid/:id")
  .get(sanitize(), propertyCouponController.listByUserId);
rroomsProperty
  .route("/coupon/validate/:property_id/:code")
  .get(sanitize(), propertyCouponController.validateCoupon);

// start new api coupon validation
rroomsProperty
  .route("/coupon/validates/:code/:userId/:propertyId")
  .get(sanitize(), propertyCouponController.validateCouponByUserId);
// end new api coupon validation

rroomsProperty
  .route("/coupon")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(propertyCouponValidation.store),
    propertyCouponController.create
  );
rroomsProperty
  .route("/coupon/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(propertyCouponValidation.store),
    propertyCouponController.update
  );
rroomsProperty
  .route("/coupon/:id")
  .delete(sanitize(), verifyJWTToken, propertyCouponController.destroy);

// Service Tax
rroomsProperty
  .route("/service-tax/:id")
  .get(sanitize(), serviceTaxController.get);
rroomsProperty
  .route("/service-tax/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(serviceTaxValidation.update),
    serviceTaxController.update
  );

// Room Price Percent
rroomsProperty
  .route("/room-price-setting/:id")
  .get(sanitize(), roomPriceSettingController.get);
rroomsProperty
  .route("/room-price-setting/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(roomPriceSettingValidation.update),
    roomPriceSettingController.update
  );

// Property Menu Card Upload
rroomsProperty
  .route("/menu-card/:property_id")
  .get(sanitize(), menuCardController.get);
rroomsProperty
  .route("/menu-card")
  .post(sanitize(), verifyJWTToken, menuCardController.create);
rroomsProperty
  .route("/menu-card")
  .put(sanitize(), verifyJWTToken, menuCardController.update);
rroomsProperty
  .route("/menu-card/:id")
  .delete(sanitize(), verifyJWTToken, menuCardController.destroy);

// Laundary Service
rroomsProperty
  .route("/laundary-service")
  .get(
    sanitize(),
    validateBody(laundaryServiceValidation.index),
    laundaryServiceController.list
  );
rroomsProperty
  .route("/laundary-service")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryServiceValidation.store),
    laundaryServiceController.create
  );
rroomsProperty
  .route("/laundary-service/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryServiceValidation.store),
    laundaryServiceController.update
  );
rroomsProperty
  .route("/laundary-service/:id")
  .delete(sanitize(), verifyJWTToken, laundaryServiceController.destroy);

// Laundary Provider
rroomsProperty
  .route("/laundary-provider")
  .get(
    sanitize(),
    validateBody(laundaryProviderValidation.index),
    laundaryProviderController.list
  );
rroomsProperty
  .route("/laundary-provider")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryProviderValidation.store),
    laundaryProviderController.create
  );
rroomsProperty
  .route("/laundary-provider/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryProviderValidation.store),
    laundaryProviderController.update
  );
rroomsProperty
  .route("/laundary-provider/:id")
  .delete(sanitize(), verifyJWTToken, laundaryProviderController.destroy);

// Laundary Request
rroomsProperty
  .route("/laundary-request")
  .get(sanitize(), laundaryRequestController.list);
rroomsProperty
  .route("/laundary-request/change-status/:id")
  .put(sanitize(), verifyJWTToken, laundaryRequestController.changeStatus);
rroomsProperty
  .route("/laundary-request")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryRequestValidation.store),
    laundaryRequestController.create
  );
rroomsProperty
  .route("/laundary-request/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(laundaryRequestValidation.update),
    laundaryRequestController.update
  );
rroomsProperty
  .route("/laundary-request/:id")
  .delete(sanitize(), verifyJWTToken, laundaryRequestController.destroy);

// Search Property
rroomsProperty.route("/search").get(searchPropertyController.index);
rroomsProperty
  .route("/suggestion")
  .get(sanitize(), searchPropertyController.suggestion);
rroomsProperty
  .route("/search-logs")
  .get(sanitize(), searchPropertyController.getSearchLogs);

// Invoice Site Settings
rroomsProperty
  .route("/invoice-site-setting")
  .post(sanitize(), verifyJWTToken, invoiceSiteSettingsController.create);
rroomsProperty
  .route("/invoice-site-setting/:id")
  .put(sanitize(), verifyJWTToken, invoiceSiteSettingsController.update);
rroomsProperty
  .route("/invoice-site-setting/:id")
  .delete(sanitize(), verifyJWTToken, invoiceSiteSettingsController.delete);
rroomsProperty
  .route("/invoice-site-setting")
  .get(sanitize(), invoiceSiteSettingsController.get);
rroomsProperty
  .route("/invoice-site-setting/:id")
  .get(sanitize(), invoiceSiteSettingsController.getById);

// Food Item Category
rroomsProperty
  .route("/food-item-category")
  .get(sanitize(), itemCategoryController.get);
rroomsProperty
  .route("/food-item-category")
  .post(sanitize(), verifyJWTToken, itemCategoryController.create);
rroomsProperty
  .route("/food-item-category/:id")
  .put(sanitize(), verifyJWTToken, itemCategoryController.update);
rroomsProperty
  .route("/food-item-category/:id")
  .get(sanitize(), itemCategoryController.getById);
rroomsProperty
  .route("/food-item-category/:id")
  .delete(sanitize(), verifyJWTToken, itemCategoryController.delete);

// Food Menu Item :
rroomsProperty.route("/food-menu-item").get(sanitize(), menuItemController.get);
rroomsProperty
  .route("/food-menu-item")
  .post(
    sanitize(),
    // verifyJWTToken,
    validateBody(menuItemValidation.store),
    menuItemController.create
  );
rroomsProperty
  .route("/food-menu-item/:id")
  .put(sanitize(), verifyJWTToken, menuItemController.update);
rroomsProperty
  .route("/food-menu-item/:id")
  .get(sanitize(), menuItemController.getById);
rroomsProperty
  .route("/food-menu-item/:id")
  .delete(sanitize(), verifyJWTToken, menuItemController.delete);

// Food Order
// /food-order and /food-order/booking-id/:id same API when i pass only booking-id in query in /food-order api
rroomsProperty.route("/food-order").get(sanitize(), orderController.get);
rroomsProperty
  .route("/food-order")
  .post(
    sanitize(),
    verifyJWTToken,
    // validateBody(orderValidation.store),
    orderController.create
  );
rroomsProperty
  .route("/food-order/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    // validateBody(orderValidation.store),
    orderController.update
  );
rroomsProperty
  .route("/food-order/:id")
  .get(sanitize(), orderController.getById);
rroomsProperty
  .route("/food-order/booking-id/:id")
  .get(sanitize(), orderController.getByBookingId);
rroomsProperty
  .route("/food-order/property-id/:id")
  .get(sanitize(), orderController.getByPropertyId);
rroomsProperty
  .route("/food-order/:id")
  .delete(sanitize(), verifyJWTToken, orderController.delete);
rroomsProperty
  .route("/food-order/status/:id")
  .patch(
    sanitize(),
    // validateBody(orderValidation.updateStatus),
    orderController.updateStatus
  );

// Food Order Payment
rroomsProperty
  .route("/food-order-payment")
  .get(sanitize(), orderPaymentController.get);
rroomsProperty
  .route("/food-order-payment")
  .post(
    sanitize(),
    // validateBody(orderPaymentValidation.store),
    orderPaymentController.create
  );
rroomsProperty
  .route("/food-order-payment/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(orderPaymentValidation.store),
    orderPaymentController.update
  );
rroomsProperty
  .route("/food-order-payment/:id")
  .get(sanitize(), orderPaymentController.getById);

rroomsProperty
  .route("/food-order-report-export")
  .post(sanitize(), verifyJWTToken, orderPaymentController.foodOrderReportExport); // food order report export
rroomsProperty
  .route("/food-order-report-view")
  .post(sanitize(), verifyJWTToken, orderPaymentController.foodOrderReportData); // food order report view

rroomsProperty
  .route("/food-payment-report-export")
  .post(sanitize(), verifyJWTToken, orderPaymentController.foodPaymentReportExport); // food payment report export
rroomsProperty
  .route("/food-payment-report-view")
  .post(sanitize(), verifyJWTToken, orderPaymentController.foodPaymentReportData); // food payment report view

rroomsProperty
  .route("/transaction-report-view")
  .post(sanitize(), orderPaymentController.transactionReportData); // transaction report view - 08-07-2025
rroomsProperty
  .route("/transaction-report-export")
  .post(sanitize(), verifyJWTToken, orderPaymentController.transactionReportExport); // transaction report export - 08-07-2025

rroomsProperty
  .route("/food-order-payment/:id")
  .delete(sanitize(), verifyJWTToken, orderPaymentController.delete);
rroomsProperty
  .route("/food-order/apply-discount/:id")
  .post(sanitize(), orderPaymentController.applyfoodOrderDiscount); //

// Payment
rroomsProperty
  .route("/initiate-payment")
  .get(sanitize(), paymentController.initPayment);
rroomsProperty
  .route("/status-update")
  .post(sanitize(), paymentController.statusUpdate);
rroomsProperty
  .route("/check-status")
  .get(sanitize(), paymentController.checkStatus);

// Razorpay Payment
rroomsProperty
  .route("/initiate-payment-razorpay")
  .get(sanitize(), razorpayPaymentController.razorpayInitPayment);
rroomsProperty
  .route("/razorpay-status-update")
  .post(sanitize(), razorpayPaymentController.razorpayStatusUpdate);
rroomsProperty
  .route("/check-status-razorpay")
  .get(sanitize(), razorpayPaymentController.checkRazorpayStatus);

// Razorpay invoice payment online
rroomsProperty
  .route("/initiate-invoice-payment-razorpay")
  .get(sanitize(), razorpayPaymentController.razorpayInitInvoicePayment);
rroomsProperty
  .route("/invoice-payment-status-update-razorpay")
  .post(sanitize(), razorpayPaymentController.razorpayVerifyInvoicePayment
  );
rroomsProperty
  .route("/invoice-payment-check-status-razorpay")
  .get(sanitize(), razorpayPaymentController.razorpayCheckStatusForInvoicePayment);

// Invoice Site Settings
rroomsProperty
  .route("/nc-type-setting")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(ncTypeSettingValidation.store),
    ncTypeSettingController.create
  );
rroomsProperty
  .route("/nc-type-setting/:id")
  .put(
    sanitize(),
    verifyJWTToken,
    validateBody(ncTypeSettingValidation.store),
    ncTypeSettingController.update
  );
rroomsProperty
  .route("/nc-type-setting")
  .get(sanitize(), ncTypeSettingController.get);
rroomsProperty
  .route("/nc-type-setting/:id")
  .get(sanitize(), ncTypeSettingController.getById);

// hotel finance
rroomsProperty
  .route("/property-sale-summary/:id")
  .get(sanitize(), propertySalesController.getById);
rroomsProperty
  .route("/property-sale-by-month")
  .get(sanitize(), propertySalesController.getSaleByMonth);
rroomsProperty
  .route("/property-sale-download/:id")
  .get(sanitize(), propertySalesController.saleExportToExcel);

//commission
rroomsProperty
  .route("/property-commission")
  .post(sanitize(), verifyJWTToken, propertyCommissionController.create);
rroomsProperty
  .route("/property-commission/:id")
  .put(sanitize(), verifyJWTToken, propertyCommissionController.update);
rroomsProperty
  .route("/property-commission/:id")
  .delete(sanitize(), verifyJWTToken, propertyCommissionController.delete);
rroomsProperty
  .route("/property-commission")
  .get(sanitize(), verifyJWTToken, propertyCommissionController.get);
rroomsProperty
  .route("/property-commission/:id")
  .get(sanitize(), verifyJWTToken, propertyCommissionController.getById);

//invoice generation
rroomsProperty
  .route("/generate-invoice-by-month")
  .get(sanitize(), verifyJWTToken, propertyInvoiceController.getInvoiceByMonth);
rroomsProperty
  .route("/property-invoices/:id")
  .get(sanitize(), propertyInvoiceController.getAllInvoices);
rroomsProperty
  .route("/property-invoice/:id")
  .get(sanitize(), propertyInvoiceController.getInvoiceById);
rroomsProperty
  .route("/generate-all-invoices")
  .post(
    sanitize(),
    propertyInvoiceController.generateInvoicesForAllPropertiesByMonth
  );
rroomsProperty
  .route("/invoices-transaction-detail")
  .get(sanitize(), propertyInvoiceController.getInvoiceTransactionsDetail);

rroomsProperty
  .route("/expenses/report")
  .get(sanitize(), propertyInvoiceController.expensesReport); // 17-07-2025 expense report

rroomsProperty
  .route("/ota-commission-report")
  .get(sanitize(), propertyInvoiceController.getRoomCommissionReport); // 17-07-2025 OTA commission report

//invoice payment online
rroomsProperty
  .route("/initiate-invoice-payment")
  .get(sanitize(), paymentController.initInvoicePayment);
rroomsProperty
  .route("/invoice-payment-status-update")
  .post(
    sanitize(),
    verifyJWTToken,
    paymentController.statusUpdateForInvoicePayment
  );
rroomsProperty
  .route("/invoice-payment-check-status")
  .get(sanitize(), paymentController.checkStatusForInvoicePayment);

//invoice payment offline
rroomsProperty
  .route("/invoice-offline-payment")
  .post(
    sanitize(),
    verifyJWTToken,
    propertyInvoiceController.initInvoiceOfflinePayment
  );
rroomsProperty
  .route("/invoice-offline-payment")
  .put(
    sanitize(),
    verifyJWTToken,
    propertyInvoiceController.updateInvoiceOfflinePayment
  );
// rroomsProperty.route('/status-update-invoice-offline-payment/:id').put(sanitize(),verifyJWTToken, propertyInvoiceController.statusUpdateInvoiceOfflinePayment);

//Module Config Setting
rroomsProperty
  .route("/get-module-config")
  .get(sanitize(), verifyJWTToken, moduleConfigController.get);
rroomsProperty
  .route("/add-update-module-config")
  .post(
    sanitize(),
    verifyJWTToken,
    validateBody(moduleConfigValidation.moduleConfig),
    moduleConfigController.save
  );
rroomsProperty
  .route("/delete-module-config/:id")
  .delete(sanitize(), verifyJWTToken, moduleConfigController.delete);
