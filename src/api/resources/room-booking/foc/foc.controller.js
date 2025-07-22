import focService from "./foc.service";

const list = async (req, res, next) => {
    try {
        const { property_id, from_at, to_at } = req.query;
        const foc = await focService.list(
            property_id,
            from_at,
            to_at
        );
        if (foc) {
            return res.status(200).json({
                status: true,
                msg: "FOC request fetched successfully",
                data: foc
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
        const { property_id, booking_id, amount, remark } = req.body;
        const foc = await focService.create(
            property_id,
            booking_id,
            amount,
            remark
        );
        if (foc) {
            return res.status(201).json({
                status: true,
                msg: "FOC request created successfully",
                data: foc
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
        const { booking_id, status } = req.body;
        const foc = await focService.update(
            id,
            booking_id,
            status
        );
        if (foc[0]) {
            return res.status(200).json({
                status: true,
                msg: "FOC request updated successfully",
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