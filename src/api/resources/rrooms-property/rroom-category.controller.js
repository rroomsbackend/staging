import { db } from '../../../models';
import config from '../../../config';

export default {
    async createRroomCategory(req, res, next) {
        const { name, maxPrice, status } = req.body;
        db.RroomCategory.findOrCreate({ where: {name:name }, defaults: { name:name, maxPrice: maxPrice, status: status} })
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

    async updateRroomCategory(req, res, next) {
        const { name, maxPrice, status } = req.body;
        db.RroomCategory.update({name:name, maxPrice: maxPrice, status:status}, { where: {id:req.params.id }})
            .then(updated => { 
                return res.status(200).json({ status: true ,msg: "Category updated successfully"});
            })
            .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });
                
            });
    },

    async getRroomCategory(req, res) {
        db.RroomCategory.findAll({attributes: ['id', 'name']})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async getRroomCategoryById(req, res) {
        const id = req.params.id;
        db.RroomCategory.findOne({where : {id:id}})
            .then(result => {
                return res.status(200).json({ data: result, status: true});
            })
            .catch((err) => {
                res.send(err);
            })
    },

    async deleteRroomCategory(req, res, next) {
        db.RroomCategory.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    },
};