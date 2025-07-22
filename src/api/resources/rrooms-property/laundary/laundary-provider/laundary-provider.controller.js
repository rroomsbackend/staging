import laundaryProviderService from "./laundary-provider.service"

const list = async (req, res, next) => {
    try {
        const { property_id } = req.query;
        const laundaryProvider = await laundaryProviderService.list(
            property_id
        );
        if (laundaryProvider) {
            return res.status(200).json({
                status: true,
                msg: "Laundary provider fetched successfully",
                data: laundaryProvider
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
            name,
            email,
            phone,
            address,
            provider_code,
            alternate_mobile,
            pan_number,
            gst,
            bank_name,
            branch_name,
            account_name,
            account_number,
            ifsc
        } = req.body;
        const laundaryProvider = await laundaryProviderService.create(
            property_id,
            name,
            email,
            phone,
            address,
            provider_code,
            alternate_mobile,
            pan_number,
            gst,
            bank_name,
            branch_name,
            account_name,
            account_number,
            ifsc
        );
        if (laundaryProvider) {
            return res.status(201).json({
                status: true,
                msg: "Laundary provider created successfully",
                data: laundaryProvider
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
            name,
            email,
            phone,
            address,
            provider_code,
            alternate_mobile,
            pan_number,
            gst,
            bank_name,
            branch_name,
            account_name,
            account_number,
            ifsc
        } = req.body;
        const laundaryProvider = await laundaryProviderService.update(
            id,
            property_id,
            name,
            email,
            phone,
            address,
            provider_code,
            alternate_mobile,
            pan_number,
            gst,
            bank_name,
            branch_name,
            account_name,
            account_number,
            ifsc
        );
        if (laundaryProvider[0]) {
            return res.status(200).json({
                status: true,
                msg: "Laundary provider updated successfully",
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
        const laundaryProvider = await laundaryProviderService.destroy(id);
        if (laundaryProvider) {
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