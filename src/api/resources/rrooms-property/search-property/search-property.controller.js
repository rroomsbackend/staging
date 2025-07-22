import searchPropertyService from "./search-property.service";

/* const index = async (req, res, next) => {
    try {
        const {
            query,
            property_type,
            amenities,
            room_type,
            ratings,
            order_by,
            order_direction,
            price_range,
            traveller_choice,
            pin_code,
            // city_id,
            cityId,
            long,
            lat,
            page, limit
        } = req.query;
        await searchPropertyService.logSearch(req.query);
        const result = await searchPropertyService.get(
            query,
            property_type,
            amenities,
            room_type,
            ratings,
            order_by ? order_by.toLowerCase() : null,
            order_direction ? order_direction.toLowerCase() : null,
            price_range,
            traveller_choice,
            pin_code,
            // city_id,
            cityId,
            long,
            lat, page, limit
        );
        if (result) {
            return res.status(200).json({
                status: true,
                msg: "Property fetched successfully",
                data: result
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        console.log("index - ", error);
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
} */

const index = async (req, res, next) => {
    try {
        const {
            query,
            property_type,
            amenities,
            room_type,
            ratings,
            order_by,
            order_direction,
            price_range,
            traveller_choice,
            pin_code,
            cityId,
            long,
            lat,
            page, limit
        } = req.query;
        await searchPropertyService.logSearch(req.query);
        const result = await searchPropertyService.get(
            query,
            property_type,
            amenities,
            room_type,
            ratings,
            order_by ? order_by.toLowerCase() : null,
            order_direction ? order_direction.toLowerCase() : null,
            price_range,
            traveller_choice,
            pin_code,
            cityId,
            long,
            lat, page, limit
        );
        if (result && result.length > 0) {
            return res.status(200).json({
                status: true,
                msg: "Property fetched successfully",
                count: result[0].count,
                data: result?.map(r => r?.plainItem).sort((a, b) => a.distance - b.distance),
            });
        }
        return res.status(200).json({
            status: false,
            msg: "No results"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const suggestion = async (req, res, next) => {
    try {
        const { query } = req.query;
        const result = await searchPropertyService.getSuggestion(query);
        if (result) {
            return res.status(200).json({
                status: true,
                msg: "Property suggestions fetched successfully",
                data: result
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        console.log("suggestion - ", error);
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

// add pagination to getSearchLogs start
const getSearchLogs = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await searchPropertyService.getSearchLogs(page, limit);
        if (result) {
            return res.status(200).json({
                status: true,
                msg: "Property search logs fetched successfully",
                data: result
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
// add pagination to getSearchLogs start

export default { index, suggestion, getSearchLogs };