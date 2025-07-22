import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { property_id, property_amenities_id, status } = req.body;
        db.PropertyAmenities.findOrCreate({ where: {property_id:property_id, property_amenities_id:property_amenities_id }, defaults: { property_id:property_id, property_amenities_id:property_amenities_id, status: status} })
            .then(created => {              
                if (created[1]) {
                        return res.status(200).json({ status: false ,msg: "Property Amenities created successfully"});
                    } 
                 else {
                    return res.status(200).json({status: false ,msg: "Property Amenities already exist", data:created});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async update(req, res, next) {
        const { property_id, property_amenities_id, status } = req.body;
        db.PropertyAmenities.update({property_id:property_id, property_amenities_id:property_amenities_id, status: status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Property Amenities updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async get(req, res) {
        db.PropertyAmenities.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.PropertyAmenities.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async delete(req, res, next) {
        db.PropertyAmenities.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};