import { db } from '../../../models';
import sequelize from 'sequelize';
import { getPagination, getPagingData } from '../pagination';
const Op = sequelize.Op

export default {
    async create(req, res) {
        const { propertyId, amount, reason, remarks, expenceType, expenceSubType, paymentSource, refNumber, expenseDate } = req.body;

        await db.DailyExpense.create({
            propertyId: propertyId,
            amount: amount,
            reason: reason,
            remarks: remarks,
            expenceType: expenceType,
            expenceSubType: expenceSubType,
            paymentSource: paymentSource,
            refNumber: refNumber,
            dateTime: expenseDate
        }).then(async (result) => {
            if (result) {
                return res.status(200).json({ status: true, message: "Expense Added successfully", data: result });
            }
            else
                return res.status(400).json({ status: false, message: "failed!" });
        })
            .catch(err => {
                return res.status(500).json({ status: false, message: err.message });
            });
    },

    async update(req, res) {
        try {
            const { propertyId, amount, reason, remarks, expenceType, expenceSubType, paymentSource, refNumber, expenseDate } = req.body;
            db.DailyExpense.update({
                propertyId: propertyId,
                amount: amount,
                reason: reason,
                remarks: remarks,
                expenceType: expenceType,
                expenceSubType: expenceSubType,
                paymentSource: paymentSource,
                refNumber: refNumber,
                dateTime: expenseDate
            }, { where: { id: req.params.id } })
                .then(result => {
                    return res.status(200).json({ data: result, status: true, msg: "Expense details updated successfully" });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    async get(req, res, next) {
        const { page, size, propertyId } = req.query;
        const { limit, offset } = getPagination(page, size);
        const whereClause = {};
        if (propertyId) {
            whereClause.propertyId = parseInt(propertyId);
        }
        const selector = {
            where: whereClause,
            offset: offset,
            limit: limit
        };
        try {
            const result = await db.DailyExpense.findAndCountAll(selector);
            return res.status(200).json({
                ...getPagingData(result, page, limit),
                status: true
            });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },


    async getById(req, res) {
        const id = req.params.id;
        db.DailyExpense.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    },

    async delete(req, res) {
        await db.DailyExpense.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(200).json({ status: false, message: err.message });
        })
    },
};
