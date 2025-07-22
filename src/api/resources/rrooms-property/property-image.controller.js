import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { property_id, image, status } = req.body;
        db.PropertyImage.findOrCreate({ where: {property_id:property_id, image:image }, defaults: { property_id:property_id, image:image, status: status} })
            .then(created => {              
                if (created[1]) {
                        return res.status(200).json({ status: false ,msg: "Property image created successfully"});
                    } 
                 else {
                    return res.status(200).json({status: false ,msg: "Property image already exist", data:created});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async update(req, res, next) {
        const { property_id, image, status } = req.body;
        db.PropertyImage.update({property_id:property_id, image:image, status: status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Property image updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async get(req, res) {
        db.PropertyImage.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.PropertyImage.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async delete(req, res, next) {
        db.PropertyImage.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};