import { db } from '../../../models';
import multer from 'multer';
import fs from 'fs';

let fileName = "";
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __basedir + "/uploads/");
    },
    filename: function (req, file, callback) {
        const fileType = file.originalname.split(".");
        fileName = fileType[0] + '-' + Date.now() + "." + fileType[1];
        callback(null, fileName);
    }
});
let upload = multer({ storage: storage }).single('icon');

export default {
    async create(req, res, next) {
        upload(req, res, async function (err) {
            const { name, status, type } = req.body;
            db.Amenities.create({name: name, icon: fileName, micon: fileName, status: status, type:type })
                .then(result => {                   
                    return res.status(200).json({ status: true, data: result, message: "Amenities created successfully" });
                })
                .catch(err => {
                    return res.status(500).json({status: false, message: err.message});
                });
        });
    },

    async update(req, res, next) {
        upload(req, res, async function (err) {
            const { name, status,type } = req.body;
            db.Amenities.update({ name: name, icon: fileName, micon: fileName, status: status, type:type }, { where: { id: req.params.id } })
                .then(result => {
                    return res.status(200).json({ status: true, data: result, message: "Amenities updated successfully" });
                })
                .catch(err => {
                    return res.status(500).json({status: false, message: err.message});
                });
        });
    },

    async get(req, res) {
        db.Amenities.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({status: false, message: err.message});
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.Amenities.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({status: false, message: err.message});
            })
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.Amenities.findOne({ where: { id: id } })
            .then(result => {
                let path = __basedir + "/uploads/" + result.icon;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        if (err) {
                            return res.status(500).json({ status: false, errors: err });
                        }
                    });
                }
                db.Amenities.destroy({ where: { id: req.params.id } }).then(result => {
                    if (result)
                        return res.status(200).json({ status: true, data: result });
                    else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({status: false, message: err.message});
                })
            }).catch((err) => {
                return res.status(500).json({status: false, message: err.message});
            })
    },
};