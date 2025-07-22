import { db } from '../../../models';
import config from '../../../config';
import { Op } from 'sequelize';

export default {
    async create(req, res, next) {
        const {
            name,
            propertyId,
            suplierCode,
            email,
            mobile,
            address,
            adharNumber,
            panNumber,
            gst,
            bankName,
            branchName,
            accountName,
            accountNumber,
            ifsc,
            status,
            createdBy
        } = req.body;

        /*const userExit = await db.Supliers.findOne({where: {[Op.or]: [
            {
                email: 
                {
                    [Op.eq]: email
                }
            }, 
            {
                mobile: 
                {
                    [Op.eq]: mobile
                }
            }                
            ]}
        }).catch(err=>{
            return res.status(400).json({ status: false, message: err.message });
        });
        
        console.log("-------",res.statusCode)
        if(userExit){
            return res.status(409).json({ status: false, message: 'Suppler email/mobile number already exist' });
        }*/

        await db.Supliers.create({ 
            name,
            propertyId,
            suplierCode,
            email,
            mobile,
            address,
            adharNumber,
            panNumber,
            gst,
            bankName,
            branchName,
            accountName,
            accountNumber,
            ifsc,
            status,
            createdBy
        })
        .then(result => {
            if(result)
                return res.status(200).json({ status: true ,message: "Subliers added successfully"});
            else
            return res.status(200).json({ status: false ,message: "Sublier adding failed!"});
        })
        .catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        });
        
    },

    async update(req, res, next) {
        const {
            name,
            propertyId,
            suplierCode,
            email,
            mobile,
            address,
            adharNumber,
            panNumber,
            gst,
            bankName,
            branchName,
            accountName,
            accountNumber,
            ifsc,
            status,
            createdBy
        } = req.body;
        await db.Supliers.update({ 
            name,
            propertyId,
            suplierCode,
            email,
            mobile,
            address,
            adharNumber,
            panNumber,
            gst,
            bankName,
            branchName,
            accountName,
            accountNumber,
            ifsc,
            status,
            createdBy
        }, { where: {id:req.params.id }})
        .then(result => {
            if(result)
                return res.status(200).json({ status: true ,message: "Supliers updated successfully"});
            else
            return res.status(200).json({ status: false ,message: "Supliers adding failed!"});
        })
        .catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        });
        
    },

    async get(req, res) {
        const selection = {
            // include: [
            //     { model: db.InventoryCategories, required: true}
            // ]
        }
    
        const selector = Object.assign({}, selection);
        await db.Supliers.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
            
    },

    async getById(req, res) {
        const id = req.params.id;
        const selection = {
            // include: [
            //     { model: db.InventoryCategories, required: true}
            // ],
            where : {id:id}
        }
    
        const selector = Object.assign({}, selection);
        await db.Supliers.findOne(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
            
    },

    async getByUserId(req, res) {
        const id = req.params.id;
        const selection = {
            // include: [
            //     { model: db.InventoryCategories, required: true}
            // ],
            where : {createdBy:id}
        }    
        const selector = Object.assign({}, selection);
        await db.Supliers.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
            
    },

    async getByPropertyId(req, res) {
        const id = req.params.id;
        const selection = {
            // include: [
            //     { model: db.InventoryCategories, required: true}
            // ],
            where : {propertyId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.Supliers.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
            
    },

    async getByCategoryId(req, res) {
        const id = req.params.id;
        const selection = {
            // include: [
            //     { model: db.InventoryCategories, required: true}
            // ],
            where : {categoryId:id}
        }    
        const selector = Object.assign({}, selection);
        await db.Supliers.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(400).json({ status: false, message: err.message });
        });
            
    }
};