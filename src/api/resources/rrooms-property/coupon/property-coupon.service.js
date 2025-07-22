import { db } from "../../../../models";
import sequelize from 'sequelize';
const Op = sequelize.Op;

const list = async (
    property_id,
    search,
    mode,
) => {
    let offerMode = [];
    if (mode == 0) {
        offerMode = [0, 1, 2]
    } else {
        offerMode = [0, mode]
    }

    const couponSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        include: [
            { model: db.InactiveCoupanProperties, required: false, attributes: ['propertyId', 'createdBy', 'couponId'] },
        ],
        where: [{ deletedAt: null }],
    }
    if (property_id) {
        const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
        if (!property) {
            validationResponse("Invalid property_id");
        }
        couponSelection.where = [{ propertyId: property_id, deletedAt: null }]
    }

    let filter = {}
    if (search) {
        filter = {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    code: {
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        }
    }
    filter['offerMode'] = offerMode;
    couponSelection.where = [filter, { deletedAt: null }]

    if (property_id && search) {
        couponSelection.where = [filter, { propertyId: property_id, deletedAt: null }]
    }
    const selector = Object.assign({}, couponSelection);
    return await db.Coupon.findAll(selector);
}

const listByUserId = async (userId, mode) => {
    let offerMode = [];
    if (mode == 0) {
        offerMode = [0, 1, 2]
    } else {
        offerMode = [0, mode]
    }

    const oneTimeCupon = await db.Coupon.findOne({ where: { isOneTimePerUser: 1, offerMode: offerMode } });
    if (oneTimeCupon) {
        const bookingDetails = await db.BookingHotel.findOne({ where: { userId: userId, cuponCode: oneTimeCupon.code } });
        if (bookingDetails) {
            return await db.Coupon.findAll({ where: { isOneTimePerUser: 0, offerMode: offerMode } });
        } else {
            return await db.Coupon.findAll({ where: { offerMode: offerMode } });
        }
    } else {
        return await db.Coupon.findAll({ where: { offerMode: offerMode } });
    }
}

const create = async (
    property_id,
    title,
    code,
    amount,
    expireAt,
    status,
    allowChange,
    updatedPrice,
    start_at,
    booking_from,
    booking_to,
    isOneTimePerUser,
    offerMode
) => {
    await validateCreate(property_id, code);
    return await db.Coupon.create({
        propertyId: property_id,
        title: title,
        code: code.toLowerCase(),
        amount: amount,
        expireAt: expireAt,
        status: status,
        allowChange: allowChange ? allowChange : 0,
        updatedPrice: updatedPrice,
        startAt: start_at,
        bookingFrom: booking_from,
        bookingTo: booking_to,
        isOneTimePerUser: isOneTimePerUser,
        offerMode: offerMode
    });
}

const validateCreate = async (
    property_id,
    code
) => {
    if (property_id && property_id > 0) {
        const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
        if (!property) {
            validationResponse("Invalid property_id");
        }
    }
    await db.Coupon.findOne({ where: { propertyId: property_id, code: code.toLowerCase() } }).then((data) => {
        if (data) {
            validationResponse("Coupon code already exists");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const update = async (
    id,
    property_id,
    title,
    code,
    amount,
    expireAt,
    status,
    allowChange,
    updatedPrice,
    start_at,
    booking_from,
    booking_to,
    isOneTimePerUser,
    offerMode
) => {
    await db.Coupon.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Coupon not found");
        }
        /*if (data.propertyId != property_id) {
            validationResponse("Invalid property_id");
        }*/
    }).catch((error) => {
        validationResponse(error?.message);
    });

    return await db.Coupon.update({
        propertyId: property_id,
        title: title,
        code: code.toLowerCase(),
        amount: amount,
        expireAt: expireAt,
        status: status,
        allowChange: allowChange ? allowChange : 0,
        updatedPrice: updatedPrice,
        startAt: start_at,
        bookingFrom: booking_from,
        bookingTo: booking_to,
        isOneTimePerUser: isOneTimePerUser,
        offerMode: offerMode
    }, { where: { id: id } })
}

// const validateCoupon = async (
//     code,
//     property_id
// ) => {
//     const coupon = await db.Coupon.findOne({ where: { code: code.toLowerCase() } }).then( async (data) => {
//         if (!data) {
//             validationResponse("Coupon not found");
//         }
//         const currentDate = new Date();
//         if (currentDate > data.expireAt) {
//             validationResponse("Coupon has been expired");
//         }
//         if (currentDate < data.startAt) {
//             validationResponse("Coupon startAt invalid");
//         }
//         if (currentDate < data.bookingFrom) {
//             validationResponse("Coupon bookingFrom invalid");
//         }
//         if (currentDate > data.bookingTo) {
//             validationResponse("Coupon bookingTo invalid");
//         }
//         console.log("data- ",data);
//         return data;
//     }).catch((error) => {
//         validationResponse(error?.message);
//     });
//     return coupon;
// }

const validateCoupon = async (code, property_id) => {
    try {
        const data = await db.Coupon.findOne({ where: { code: code.toLowerCase() } });
        if (!data) {
            return validationResponse("Coupon not found");
        }
        const currentDate = new Date();
        if (currentDate > data.expireAt) {
            return validationResponse("Coupon has expired");
        }
        if (currentDate < data.startAt) {
            return validationResponse("Coupon not yet active (startAt)");
        }
        if (currentDate < data.bookingFrom) {
            return validationResponse("Coupon not valid for booking yet (bookingFrom)");
        }
        if (currentDate > data.bookingTo) {
            return validationResponse("Coupon no longer valid for booking (bookingTo)");
        }
        let updatedPrices = [];
        try {
            updatedPrices = JSON.parse(data.updatedPrice || "[]");
        } catch (e) {
            console.warn("Invalid updatedPrice JSON", e);
        }
        console.log("updatedPrices - ", updatedPrices);
        const matchedPrice = updatedPrices.find(item => item.property_id == property_id);
        if (matchedPrice) {
            data.amount = Number(matchedPrice.price);
            data.propertyId = Number(property_id);
        }
        return data
    } catch (error) {
        return validationResponse(error?.message || "Coupon validation error");
    }
};

const validateCouponByUserId = async (
    code,
    userId, propertyId
) => {
    const coupon = await db.Coupon.findOne({
        where: { code: code.toLowerCase() }
    }).then(async (data) => {
        if (!data) {
            validationResponse("Coupon not found");
        }
        const currentDate = new Date();
        if (currentDate > data.expireAt) {
            validationResponse("Coupon has been expired");
        }
        if (currentDate < data.startAt) {
            validationResponse("Coupon startAt invalid");
        }
        if (currentDate < data.bookingFrom) {
            validationResponse("Coupon bookingFrom invalid");
        }
        if (currentDate > data.bookingTo) {
            validationResponse("Coupon bookingTo invalid");
        }
        // Condition 1: If coupon code is 'rrooms' and user has existing bookings
        if (code.toLowerCase() === 'rrooms' && data.isOneTimePerUser === 1 && userId) {
            const existingBookingCount = await db.BookingHotel.count({
                where: { userId }
            });
            if (existingBookingCount > 0) {
                return { status: false, msg: "Coupon not applied. You have already made a booking." };
            }
        }
        // Condition 2: If oneTimePerUser is enabled, ensure user hasn't used it
        if (data.isOneTimePerUser === 1 && userId) {
            const alreadyUsed = await db.BookingHotel.count({
                where: {
                    userId,
                    cuponCode: code.toLowerCase()
                }
            });
            console.log("alreadyUsed - ", alreadyUsed);

            if (alreadyUsed > 0) {
                return { status: false, msg: "Coupon already used by this user" };
            }

        }
        let updatedPrices = [];
        try {
            updatedPrices = JSON.parse(data.updatedPrice || "[]");
        } catch (e) {
            console.warn("Invalid updatedPrice JSON", e);
        }
        const matchedPrice = updatedPrices.find(item => item.property_id == propertyId);
        if (matchedPrice) {
            data.amount = Number(matchedPrice.price);
            data.propertyId = Number(propertyId);
        }
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return coupon;
};

const destroy = async (
    id
) => {
    await db.Coupon.findOne({ where: { id: id } }).then(async (data) => {
        if (!data) {
            validationResponse("Coupon not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.Coupon.destroy({ where: { id: id } });
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, listByUserId, create, update, validateCoupon, destroy, validateCouponByUserId }
