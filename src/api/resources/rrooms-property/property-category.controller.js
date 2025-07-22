import { db } from '../../../models';
import config from '../../../config';

export default {
    async createPropertyCategory(req, res, next) {
        const { name, status } = req.body;
        db.PropertyCategory.findOrCreate({ where: {name:name }, defaults: { name:name, status:status} })
            .then(created => {              
                if (created[1]) {
                        return res.status(200).json({ status: false ,msg: "Category created successfully"});
                    } 
                 else {
                    return res.status(200).json({status: false ,msg: "Category already exist", data:created});
                }
            })
            .catch(err => {
                return res.status(500).json({ 'errors': err });
            });
    },   

    async updatePropertyCategory(req, res, next) {
        const { name, status } = req.body;
        db.PropertyCategory.update({name:name, status:status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Category updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async getPropertyCategory(req, res) {
        db.PropertyCategory.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getPropertyCategoryById(req, res) {
        const id = req.params.id;
        db.PropertyCategory.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async deletePropertyCategory(req, res, next) {
        db.PropertyCategory.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};