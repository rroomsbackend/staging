import { db } from '../../../models';
import config from '../../../config';

export default {
    async create(req, res, next) {
        /*const {
            itemName,
            propertyId,
            categoryId,
            unit,
            price,
            quantity,
            createdBy,
            updatedBy,
            deletedBy,
            status
        } = req.body;
        await db.InventoryItems.create({ 
            itemName,
            propertyId,
            categoryId,
            unit,
            price,
            quantity,
            createdBy,
            updatedBy,
            deletedBy,
            status
        })
        .then(result => {
            if(result)
                return res.status(200).json({ status: true ,msg: "Items added successfully"});
            else
            return res.status(200).json({ status: false ,msg: "Items adding failed!"});
        })
        .catch(err => {
            return res.status(500).json({ 'errorsd': err });
        });*/
        const {
            propertyId,
            categoryId,
            createdBy,
            status,
            items
        } = req.body;
        if(items && items.length > 0){            
            let itemsParams = [];
            items.forEach(element => {                
                /*const L = element?.price/105*100;
                const TAX_AMOUNT = element?.price - L;
                const INCLUSIVE_TAX_AMOUNT = L + TAX_AMOUNT;
                const FINAL_PRICE = element?.quantity * INCLUSIVE_TAX_AMOUNT;
                const GST_AMOUNT = TAX_AMOUNT * element?.quantity;
                const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
                const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;*/             
                itemsParams.push({
                    itemName: element?.itemName,
                    itemCode: Math.round(Math.random() * (999999 - 9999) + 9999),
                    propertyId: propertyId,
                    categoryId: categoryId,
                    unit: element?.unit,
                    price: element?.price,
                    //gstType: element?.gstType,
                    //gstPercent: element?.gstPercent,
                    //taxAmount: TAX_AMOUNT,
                    //inclusiveTaxAmount: INCLUSIVE_TAX_AMOUNT,
                    //finalPrice: FINAL_PRICE,
                    //gstAmount: GST_AMOUNT,
                    //amountBeforeTax: AMOUT_BEFOR_TAX,
                    //incGstPrice: INC_GST_PRICE,
                    quantity: element?.quantity,
                    createdBy: createdBy
                })
            });
            db.InventoryItems.bulkCreate(itemsParams).then(result=>{
                if(result)
                    return res.status(200).json({ status: true ,message: "Items added successfully"});
                else
                    return res.status(200).json({ status: false ,message: "Items adding failed!"});
            }).catch(err=>{
                return res.status(400).json({ status: false, message: err.message});
            });            
        }
        
    },

    async update(req, res, next) {
        const {
            itemName,
            itemCode,
            propertyId,
            categoryId,
            unit,
            price,
            quantity,
            //gstType,
            //gstAmount,
           // gstPercent,
            //taxAmount,
            //inclusiveTaxAmount,
            //finalPrice,
            //incGstPrice,
            //amountBeforeTax,
            createdBy,
            updatedBy,
            deletedBy,
            status
        } = req.body;

        /*const L = price / 105*100;
        const TAX_AMOUNT = price - L;
        const INCLUSIVE_TAX_AMOUNT = L + TAX_AMOUNT;
        const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
        const GST_AMOUNT = TAX_AMOUNT * quantity;
        const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
        const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;

        incGstPrice = INC_GST_PRICE;
        taxAmount = TAX_AMOUNT;
        inclusiveTaxAmount = INCLUSIVE_TAX_AMOUNT;
        finalPrice = FINAL_PRICE;
        gstAmount = GST_AMOUNT;
        amountBeforeTax = AMOUT_BEFOR_TAX;*/
        await db.InventoryItems.update({ 
            itemName,
            itemCode,
            propertyId,
            categoryId,
            unit,
            price,
            quantity,
            //gstType,
            //gstPercent,
            //taxAmount,
            //inclusiveTaxAmount,
            //finalPrice,
           // amountBeforeTax,
           // incGstPrice,
            status,
            createdBy,
            updatedBy,
            deletedBy
        }, { where: {id:req.params.id }})
        .then(result => {
            if(result)
                return res.status(200).json({ status: true ,message: "Items updated successfully"});
            else
            return res.status(200).json({ status: false ,message: "Items adding failed!"});
        })
        .catch(err => {
            return res.status(400).json({ status: false, message: err.message});
        });
        
    },

    async get(req, res) {
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false}
            ]
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryItems.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });            
    },

    async getById(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false}
            ],
            where : {id:id}
        }
    
        const selector = Object.assign({}, selection);
        await db.InventoryItems.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false}
            ],
            where : {createdBy:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryItems.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false}
            ],
            where : {propertyId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryItems.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    },

    async getByCategoryId(req, res) {
        const id = req.params.id;
        const selection = {
            include: [
                { model: db.InventoryCategories, required: false}
            ],
            where : {categoryId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.InventoryItems.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message});
        });
            
    }
};