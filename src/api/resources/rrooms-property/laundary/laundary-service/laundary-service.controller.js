import laundaryServiceService from "./laundary-service.service";

const list = async (req, res, next) => {
    try {
        const { property_id } = req.query;
        const laundaryServices = await laundaryServiceService.list(
            property_id
        );
        if (laundaryServices) {
            return res.status(200).json({
                status: true,
                msg: "Laundary service fetched successfully",
                data: laundaryServices
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
        const { property_id, name, price, providerId } = req.body;
        const laundaryService = await laundaryServiceService.create(
            property_id,
            name,
            price,
            providerId
        );
        if (laundaryService) {
            return res.status(201).json({
                status: true,
                msg: "Laundary service created successfully",
                data: laundaryService
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
        const { property_id, name, price, providerId } = req.body;
        const laundaryService = await laundaryServiceService.update(
            id,
            property_id,
            name,
            price,
            providerId
        );
        if (laundaryService[0]) {
            return res.status(200).json({
                status: true,
                msg: "Laundary service updated successfully",
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

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const laundaryService = await laundaryServiceService.destroy(id);
        if (laundaryService) {
            return res.status(200).json({
                status: true,
                msg: "Laundary service deleted successfully",
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

export default { list, create, update, destroy };