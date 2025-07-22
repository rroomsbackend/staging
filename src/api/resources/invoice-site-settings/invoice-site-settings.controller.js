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
let upload = multer({ storage: storage }).single('logo');

export default {
    async create(req, res, next) {
        upload(req, res, async function (err) {
            const {
                property_id,
                name,
                address,
                phone,
                email,
                gst_number,
                content,
                query_contact_number
            } = req.body;
            const invoiceSettings = await db.InvoiceSiteSetting.findOne({ where: { propertyId: property_id, deletedAt: null } });
            if (invoiceSettings) {
                return res.status(442).json({ status: false, message: "Invoice site settings already exist for this property." });
            }
            db.InvoiceSiteSetting.create({ propertyId: property_id, logo: fileName, name: name, address: address, phone: phone, email: email, gstNumber: gst_number, content: content, queryContactNumber: query_contact_number })
                .then(result => {
                    return res.status(200).json({ status: true, data: result, message: "Invoice site settings created successfully" });
                })
                .catch(err => {
                    let path = __basedir + "/uploads/" + fileName;
                    if (fs.existsSync(path)) {
                        fs.unlink(path, (err) => {
                            if (err) {
                                return res.status(500).json({ status: false, errors: err });
                            }
                        });
                    }
                    return res.status(500).json({ status: false, message: err.message });
                });
        });
    },

    async update(req, res, next) {
        upload(req, res, async function (err) {
            const {
                property_id,
                name,
                address,
                phone,
                email,
                gst_number,
                content,
                query_contact_number
            } = req.body;
            db.InvoiceSiteSetting.update({ propertyId: property_id, logo: fileName, name: name, address: address, phone: phone, email: email, gstNumber: gst_number, content: content, queryContactNumber: query_contact_number }, { where: { id: req.params.id } })
                .then(result => {
                    return res.status(200).json({ status: true, data: result, message: "Invoice site settings updated successfully" });
                })
                .catch(err => {
                    let path = __basedir + "/uploads/" + fileName;
                    if (fs.existsSync(path)) {
                        fs.unlink(path, (err) => {
                            if (err) {
                                return res.status(500).json({ status: false, errors: err });
                            }
                        });
                    }
                    return res.status(500).json({ status: false, message: err.message });
                });
        });
    },

    async get(req, res) {
        const { property_id } = req.query;
        const invoiceSiteSettingSelection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            include: [
                { model: db.PropertyMaster, required: false }
            ],
            where: [
                { deletedAt: null }
            ],
        }
        if (property_id) {
            invoiceSiteSettingSelection.where = [{
                propertyId: property_id,
                deletedAt: null
            }];
        }
        const selector = Object.assign({}, invoiceSiteSettingSelection);
        db.InvoiceSiteSetting.findAll(selector)
            .then(result => {
                let resultData = JSON.stringify(result);
                resultData = JSON.parse(resultData);
                resultData = resultData.map(obj => {
                    if (obj?.logo) {
                        var base64 = fs.readFileSync(__basedir + "/uploads/" + obj.logo, 'base64');
                        obj['base64Image'] = base64;
                        return obj;
                    }
                    return obj;
                })
                return res.status(200).json({ data: resultData, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getById(req, res) {
        const id = req.params.id;
        db.InvoiceSiteSetting.findOne({ where: { id: id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async delete(req, res, next) {
        const id = req.params.id;
        db.InvoiceSiteSetting.findOne({ where: { id: id } })
            .then(result => {
                let path = __basedir + "/uploads/" + result.logo;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        if (err) {
                            return res.status(500).json({ status: false, errors: err });
                        }
                    });
                }
                db.InvoiceSiteSetting.destroy({ where: { id: req.params.id } }).then(result => {
                    if (result)
                        return res.status(200).json({ status: true, data: result });
                    else
                        return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                })
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },
};