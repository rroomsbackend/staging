import propertyRatingService from "./property-rating.service";

const list = async (req, res, next) => {
    try {
        const { property_id, bookingCode } = req.query;
        const ratings = await propertyRatingService.list(
            property_id,
            bookingCode
        );
        if (ratings) {
            if (ratings.length) ratings.push({ averageRatings: Math.floor(ratings.averageRatings)});
            return res.status(200).json({
                status: true,
                msg: "Rating fetched successfully",
                data: ratings
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
        const { user_id, property_id, ratings, reviews, status, bookingCode, fromDate, toDate } = req.body;
        const rating = await propertyRatingService.create(
            user_id,
            property_id,
            ratings,
            reviews,
            status,
            bookingCode,
            fromDate,
            toDate
        );
        if (rating) {
            return res.status(201).json({
                status: true,
                msg: "Rating created successfully",
                data: rating
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
        const { user_id, property_id, ratings, reviews, status, bookingCode, fromDate, toDate } = req.body;
        const rating = await propertyRatingService.update(
            id,
            user_id,
            property_id,
            ratings,
            reviews,
            status,
            bookingCode,
            fromDate,
            toDate
        );
        if (rating[0]) {
            return res.status(200).json({
                status: true,
                msg: "Rating updated successfully",
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

export default { list, create, update };