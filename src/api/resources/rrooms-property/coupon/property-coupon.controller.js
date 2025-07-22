import propertyCouponService from "./property-coupon.service";

const list = async (req, res, next) => {
    try {
        const { property_id, search, offerMode } = req.query;
        const coupons = await propertyCouponService.list(
            property_id,
            search,
            offerMode ? offerMode : 0
        );
        if (coupons) {
            return res.status(200).json({
                status: true,
                msg: "Coupons fetched successfully",
                data: coupons
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const listByUserId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const offerMode = req?.query?.offerMode ? req?.query?.offerMode : 0
        const coupons = await propertyCouponService.listByUserId(
            id,
            offerMode
        );
        if (coupons) {
            return res.status(200).json({
                status: true,
                msg: "Coupons fetched successfully",
                data: coupons
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const create = async (req, res, next) => {
    try {
        const { property_id, title, code, amount, expireAt, status, allowChange, updatedPrice, start_at, booking_from, booking_to, isOneTimePerUser, offerMode } = req.body;
        const coupon = await propertyCouponService.create(
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
        );
        if (coupon) {
            return res.status(201).json({
                status: true,
                msg: "Coupon created successfully",
                data: coupon
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { property_id, title, code, amount, expireAt, status, allowChange, updatedPrice, start_at, booking_from, booking_to, isOneTimePerUser, offerMode } = req.body;
        const coupon = await propertyCouponService.update(
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
        );

        if (coupon[0]) {
            return res.status(200).json({
                status: true,
                msg: "Coupon updated successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const validateCouponByUserId = async (req, res, next) => {
    try {
        const { code, userId, propertyId } = req.params;
        const coupon = await propertyCouponService.validateCouponByUserId(code, userId, propertyId);
        if (coupon) {
            return res.status(coupon.status == false ? 202 : 200).json({
                status: coupon.status == false ? false : true,
                msg: coupon.status == false ? coupon.msg : "Coupon validated successfully",
                data: coupon.status == false ? null : coupon
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const validateCoupon = async (req, res, next) => {
    try {
        const { code, property_id } = req.params;
        console.log({ code, property_id });
        const coupon = await propertyCouponService.validateCoupon(code, property_id);
        if (coupon) {
            return res.status(200).json({
                status: true,
                msg: "Coupon validated successfully",
                data: coupon
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await propertyCouponService.destroy(id);
        if (coupon) {
            return res.status(200).json({
                status: true,
                msg: "Coupon deleted successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

export default { list, listByUserId, create, update, validateCoupon, destroy, validateCouponByUserId };