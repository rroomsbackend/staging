import roomPriceSettingService from "./room-price-setting.service";

const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const roomPriceSetting = await roomPriceSettingService.get(id);
        if (roomPriceSetting) {
            return res.status(200).json({
                status: true,
                msg: "Room price setting fetched successfully",
                data: roomPriceSetting
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
        const { title, amount } = req.body;
        const roomPriceSetting = await roomPriceSettingService.update(
            id,
            title,
            amount
        );
        if (roomPriceSetting[0]) {
            return res.status(200).json({
                status: true,
                msg: "Room price setting updated successfully",
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

export default { get, update };