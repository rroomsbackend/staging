import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { property_room_category_id, name, status } = req.body;
        db.PropertyRoomCategoryImage.findOrCreate({ where: {property_room_category_id:property_room_category_id, name:name }, defaults: { property_room_category_id:property_room_category_id, name:name, status: status} })
            .then(created => {              
                if (created[1]) {
                        return res.status(200).json({ status: false ,msg: "Property room category image created successfully"});
                    } 
                 else {
                    return res.status(200).json({status: false ,msg: "Property room category image already exist", data:created});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async update(req, res, next) {
        const { property_room_category_id, name, status } = req.body;
        db.PropertyRoomCategoryImage.update({name:name, property_room_category_id:property_room_category_id, status: status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Property room category image updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async get(req, res) {
        db.PropertyRoomCategoryImage.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.PropertyRoomCategoryImage.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async delete(req, res, next) {
        db.PropertyRoomCategoryImage.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};