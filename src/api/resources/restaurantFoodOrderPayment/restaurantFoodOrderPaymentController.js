import * as paymentService from './restaurantFoodOrderPaymentService';

export const create = async (req, res) => {
    try {
        const result = await paymentService.createPayment(req.body);
        return res.status(201).json({ status: true, message: 'Payment created successfully', data: result });
    } catch (error) {
        console.log("error0", error);
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const update = async (req, res) => {
    try {
        const result = await paymentService.updatePayment(req.params.id, req.body);
        return res.status(200).json({ status: true, message: "Payment updated successfully", data: result });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const get = async (req, res) => {
    try {
        const result = await paymentService.getPayments(req.query);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({ status: false, message: error?.message });
    }
};

export const getById = async (req, res) => {
    try {
        const result = await paymentService.getPaymentById(req.params.id);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const deletePayment = async (req, res) => {
    try {
        const result = await paymentService.deletePayment(req.params.id);
        return res.status(200).json({ status: true, message: 'Record deleted successfully' });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

//download report
export const restFoodOrderPaymentReport = async (req, res) => {
    try {

        const workbook = await paymentService.downloadRestaurantFoodOrderReport(req.query);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=restaurant_food_order_payment_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}