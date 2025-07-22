import serviceTaxService from "./service-tax.service";

const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tax = await serviceTaxService.get(id);
        if (tax) {
            return res.status(200).json({
                status: true,
                msg: "Service tax fetched successfully",
                data: tax
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
        const tax = await serviceTaxService.update(
            id,
            title,
            amount
        );
        if (tax[0]) {
            return res.status(200).json({
                status: true,
                msg: "Tax updated successfully",
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