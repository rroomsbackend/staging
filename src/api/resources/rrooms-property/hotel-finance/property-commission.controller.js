import { db } from '../../../../models';

export default {
    async create(req, res, next) {
        const { property_id, commission_per, updatedBy } = req.body;
        db.RRoomsCommission.findOrCreate({ where: {propertyId:property_id}, defaults: { propertyId:property_id, commissionPercentage:commission_per, lastUpdatedBy: updatedBy} })
            .spread((result, isCreated) => {         
                if (isCreated) {
                        return res.status(200).json({ status: true ,msg: "Property commission added.", data:result});
                    } 
                 else {
                    return res.status(400).json({status: true ,msg: "Property commission already exist.", data:result.dataValues});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async update(req, res, next) {
        const {commission_per, updatedBy } = req.body;
        db.RRoomsCommission.update({commissionPercentage:commission_per, lastUpdatedBy: updatedBy}, { where: {propertyId:req.params.id }})
            .then(updated => { 
                return res.status(200).json({status: true, msg: "Property commission percentage updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({status: false, 'errors': err });
                
            });
    },

    async get(req, res) {
        db.RRoomsCommission.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getById(req, res) {
        const propertyId = req.params.id;
        db.RRoomsCommission.findOne({where : {propertyId:propertyId}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async delete(req, res, next) {
        db.RRoomsCommission.destroy({ where: { propertyId: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};