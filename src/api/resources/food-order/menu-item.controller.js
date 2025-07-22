import { db } from '../../../models';

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default {

    // commented on 25-06-2025
    // async create(req, res, next) {
    //     const { items } = req.body;
    //     try {
    //         const dataArray = []
    //         if (items && items.length > 0) {
    //             items.forEach(element => {
    //                 const { category_id, property_id, name, price, quantity, gstType, gstPercent } = element;
    //                 const L = price / (parseFloat(gstPercent) + 100) * 100;
    //                 const TAX_AMOUNT = gstType == "INC" ? price - L : (price * gstPercent) / 100;
    //                 const INCLUSIVE_TAX_AMOUNT = gstType == "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
    //                 const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
    //                 const GST_AMOUNT = TAX_AMOUNT * quantity;
    //                 const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
    //                 const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;
    //                 const itemCode = Math.round(Math.random() * (999999 - 9999) + 9999);
    //                 dataArray.push({
    //                     categoryId: category_id,
    //                     propertyId: property_id,
    //                     name: name, price: price,
    //                     itemCode: "FOOD_ITEM" + itemCode?.toString(),
    //                     gstType: gstType,
    //                     gstPercent: gstPercent,
    //                     taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
    //                     inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
    //                     finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
    //                     gstAmount: Number(GST_AMOUNT?.toFixed(2)),
    //                     amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
    //                     incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
    //                     quantity: quantity
    //                 })
    //             })
    //         } else {
    //             return res.status(400).json({ status: false, message: 'Invalid data' });
    //         }
    //         await db.FoodMenuItem.bulkCreate(dataArray)
    //             .then(result => {
    //                 return res.status(200).json({ status: true, data: result, message: "Menu Item created successfully" });
    //             }).catch(err => {
    //                 return res.status(400).json({ status: false, message: err.message });
    //             });
    //     } catch (error) {
    //         return res.status(error?.code ? error.code : 500).json({
    //             status: false,
    //             msg: error?.message
    //         });
    //     }
    // },


    // Fixed on 25-06-2025 fix itemCode should create like - 001,002
    // async create(req, res, next) {
    //     const { items } = req.body;
    //     try {
    //         const dataArray = [];
    //         const latestItem = await db.FoodMenuItem.findOne({
    //             order: [['itemCode', 'DESC']],
    //             where: {
    //                 itemCode: { [db.Sequelize.Op.regexp]: '^[0-9]{3}$' } // only 3-digit numeric codes
    //             }
    //         });
    //         let nextCode = 1;
    //         if (latestItem && latestItem.itemCode) {
    //             nextCode = parseInt(latestItem.itemCode, 10) + 1;
    //         }
    //         for (const element of items) {
    //             const { category_id, property_id, name, price, quantity, gstType, gstPercent } = element;
    //             const L = price / (parseFloat(gstPercent) + 100) * 100;
    //             const TAX_AMOUNT = gstType == "INC" ? price - L : (price * gstPercent) / 100;
    //             const INCLUSIVE_TAX_AMOUNT = gstType == "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
    //             const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
    //             const GST_AMOUNT = TAX_AMOUNT * quantity;
    //             const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
    //             const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;
    //             const itemCode = nextCode.toString().padStart(3, '0'); // '001', '002', etc.
    //             nextCode++;
    //             dataArray.push({
    //                 categoryId: category_id,
    //                 propertyId: property_id,
    //                 name: name,
    //                 price: price,
    //                 itemCode: itemCode,
    //                 gstType: gstType,
    //                 gstPercent: gstPercent,
    //                 taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
    //                 inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
    //                 finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
    //                 gstAmount: Number(GST_AMOUNT?.toFixed(2)),
    //                 amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
    //                 incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
    //                 quantity: quantity
    //             });
    //         }
    //         await db.FoodMenuItem.bulkCreate(dataArray)
    //             .then(result => {
    //                 return res.status(200).json({ status: true, data: result, message: "Menu Item created successfully" });
    //             }).catch(err => {
    //                 return res.status(400).json({ status: false, message: err.message });
    //             });
    //     } catch (error) {
    //         return res.status(error?.code ? error.code : 500).json({
    //             status: false,
    //             msg: error?.message
    //         });
    //     }
    // },

    async create(req, res, next) {
        const { items } = req.body;
        const t = await db.sequelize.transaction();
        try {
            const dataArray = [];
            // Locking latest item inside transaction
            const latestItem = await db.FoodMenuItem.findOne({
                order: [['itemCode', 'DESC']],
                where: {
                    itemCode: { [db.Sequelize.Op.regexp]: '^[0-9]{3}$' }
                },
                transaction: t,
                lock: t.LOCK.UPDATE
            });
            let nextCode = 1;
            if (latestItem && latestItem.itemCode) {
                nextCode = parseInt(latestItem.itemCode, 10) + 1;
            }
            for (const element of items) {
                const { category_id, property_id, name, price, quantity, gstType, gstPercent } = element;
                const L = price / (parseFloat(gstPercent) + 100) * 100;
                const TAX_AMOUNT = gstType == "INC" ? price - L : (price * gstPercent) / 100;
                const INCLUSIVE_TAX_AMOUNT = gstType == "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
                const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
                const GST_AMOUNT = TAX_AMOUNT * quantity;
                const AMOUT_BEFOR_TAX = FINAL_PRICE - GST_AMOUNT;
                const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;
                const itemCode = nextCode.toString().padStart(3, '0');
                nextCode++;
                dataArray.push({
                    categoryId: category_id,
                    propertyId: property_id,
                    name: name,
                    price: price,
                    itemCode: itemCode,
                    gstType: gstType,
                    gstPercent: gstPercent,
                    taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
                    inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
                    finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
                    gstAmount: Number(GST_AMOUNT?.toFixed(2)),
                    amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
                    incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
                    quantity: quantity
                });
            }
            const result = await db.FoodMenuItem.bulkCreate(dataArray, { transaction: t });
            await t.commit();
            return res.status(200).json({ status: true, data: result, message: "Menu Item created successfully" });
        } catch (error) {
            await t.rollback();
            return res.status(error?.code || 500).json({ status: false, msg: error.message });
        }
    },

    async update(req, res, next) {
        const { category_id, property_id, name, price, quantity, gstType, gstPercent } = req.body;
        if (!price || !quantity || !gstPercent) {
            return res.status(400).json({ status: false, message: 'Price, Quantity and Gst percent can not be empty!' });
        }
        try {
            const property = await db.PropertyMaster.findOne({ where: { id: property_id, deletedAt: null } });
            if (!property) {
                validationResponse("Invalid property_id");
            }
            // const category = await db.FoodItemCategory.findOne({ where: { id: category_id, deletedAt: null } })
            // if (!category) {
            //     validationResponse("Invalid category_id");
            // }
            const menuItem = await db.FoodMenuItem.findOne({ where: { id: req.params.id, deletedAt: null } })
            if (!menuItem) {
                validationResponse("Invalid menu item");
            }

            const L = price / (parseFloat(gstPercent) + 100) * 100
            const TAX_AMOUNT = gstType == "INC" ? price - L : (price * gstPercent) / 100
            const INCLUSIVE_TAX_AMOUNT = gstType == "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
            const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
            const GST_AMOUNT = TAX_AMOUNT * quantity;
            const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
            const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;

            await db.FoodMenuItem.update({
                categoryId: category_id,
                propertyId: property_id,
                name: name,
                gstType: gstType,
                gstPercent: gstPercent,
                taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
                inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
                finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
                gstAmount: Number(GST_AMOUNT?.toFixed(2)),
                amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
                incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
                quantity: quantity,
                price: price
            }, { where: { id: req.params.id, deletedAt: null } })
                .then(result => {
                    return res.status(200).json({ status: true, data: result, msg: "Menu item updated successfully" });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
        } catch (error) {
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    },

    async get(req, res) {
        const { property_id } = req.query;
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }
        if (property_id) {
            selection.where = [{
                propertyId: property_id,
                deletedAt: null
            }];
        }
        const selector = Object.assign({}, selection);
        await db.FoodMenuItem.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })

    },

    async getById(req, res) {
        const id = req.params.id;
        db.FoodMenuItem.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.FoodMenuItem.findOne({ where: { id: id } })
            .then(result => {
                db.FoodMenuItem.destroy({ where: { id: req.params.id } }).then(result => {
                    if (result)
                        return res.status(200).json({ status: true, data: result });
                    else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                })
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },
};