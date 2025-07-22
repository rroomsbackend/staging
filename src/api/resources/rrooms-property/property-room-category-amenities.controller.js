import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { property_room_category_id, amenities_id, status } = req.body;
        db.PropertyRoomCategoryAmenities.findOrCreate({ where: {property_room_category_id:property_room_category_id, amenities_id:amenities_id }, defaults: { property_room_category_id:property_room_category_id, amenities_id:amenities_id, status: status} })
            .then(created => {              
                if (created[1]) {
                        return res.status(200).json({ status: false ,msg: "Property room category amenities created successfully"});
                    } 
                 else {
                    return res.status(200).json({status: false ,msg: "Property room category amenities already exist", data:created});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async update(req, res, next) {
        const { property_room_category_id, amenities_id, status } = req.body;
        db.PropertyRoomCategoryAmenities.update({amenities_id:amenities_id, property_room_category_id:property_room_category_id, status: status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Property room category amenities updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async get(req, res) {
        db.PropertyRoomCategoryAmenities.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.PropertyRoomCategoryAmenities.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async delete(req, res, next) {
        db.PropertyRoomCategoryAmenities.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};