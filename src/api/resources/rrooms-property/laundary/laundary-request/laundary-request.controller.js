import laundaryRequestService from "./laundary-request.service";

const list = async (req, res, next) => {
    try {
        const { property_id, order_id } = req.query;
        const laundaryRequest = await laundaryRequestService.list(
            property_id,
            order_id
        );
        if (laundaryRequest) {
            return res.status(200).json({
                status: true,
                msg: "Laundary request fetched successfully",
                data: laundaryRequest
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
        const {
            property_id,
            provider_id,
            remark,
            service,
            createdBy, 
            updatedBy } = req.body;
        const laundaryRequest = await laundaryRequestService.create(
            property_id,
            provider_id,
            remark,
            service,
            createdBy,
            updatedBy
        );
        if (laundaryRequest) {
            return res.status(201).json({
                status: true,
                msg: "Laundary request created successfully",
                data: laundaryRequest
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
        const {
            property_id,
            service_id,
            provider_id,
            quantity,
            total_service_amount,
            createdBy,
            updatedBy,
            remark } = req.body;
        const laundaryRequest = await laundaryRequestService.update(
            id,
            property_id,
            service_id,
            provider_id,
            quantity,
            total_service_amount,
            remark,
            createdBy,
            updatedBy
        );
        if (laundaryRequest[0]) {
            return res.status(200).json({
                status: true,
                msg: "Laundary request updated successfully",
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

const changeStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { remark, updated_by, in_qty } = req.body;
        const laundaryRequest = await laundaryRequestService.changeStatus(id, remark, updated_by, in_qty);
        if (laundaryRequest) {
            return res.status(200).json({
                status: true,
                msg: "Laundary request status updated successfully",
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
        const laundaryRequest = await laundaryRequestService.destroy(id);
        if (laundaryRequest) {
            return res.status(200).json({
                status: true,
                msg: "Laundary request deleted successfully",
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

export default { list, create, update, changeStatus, destroy };