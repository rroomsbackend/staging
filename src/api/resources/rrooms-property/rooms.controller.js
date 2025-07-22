import { db } from '../../../models';
import config from '../../../config';
import multer from 'multer';
import e from 'express';
import moment from 'moment';

var fileName = "";
var images = [];
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __basedir + "/uploads/");
    },
    filename: function (req, file, callback) {
        console.log("images Data body", file)
        const fileType = file.originalname.split(".");
        fileName = fileType[0] + '-' + Date.now() + "." + fileType[1];
        if (file.fieldname == 'images') {
            images.push(fileName);
        }
        callback(null, fileName);
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: "images", maxCount: 10 }
]);

export default {
    async create(req, res, next) {
        upload(req, res, async function (err) {
            const { propertyId, categoryId, roomDescription, status, amenities, minPrice, maxPrice, regularPrice, roomDetails, occupancy, breakFastPrice, ap, map, heroImage, fromDate, toDate } = req.body;
            await db.Rooms.create({
                propertyId: propertyId,
                categoryId: categoryId,
                minPrice: minPrice,
                maxPrice: maxPrice,
                regularPrice: regularPrice,
                roomDescription: roomDescription,
                occupancy: occupancy,
                breakFastPrice: breakFastPrice,
                ap: ap,
                map: map,
                heroImage: heroImage,
                fromDate: fromDate,
                toDate: toDate
            })
                .then(async (result) => {
                    if (amenities && amenities.length > 0) {
                        let itemsParamsAme = [];
                        amenities.forEach(element => {
                            itemsParamsAme.push({ amenitiesId: element, roomId: result.id })
                        });
                        await db.RoomAmenities.bulkCreate(itemsParamsAme).then().catch(err => {
                            console.log("ame", err);
                        });
                    }
                    if (roomDetails && roomDetails.length > 0) {
                        let itemsRoomDetails = [];
                        roomDetails.forEach(element => {
                            let data = JSON.parse(element);
                            itemsRoomDetails.push({ roomId: result.id, propertyId: propertyId, categoryId: categoryId, floorNumber: data.floorNumber, roomNumber: data.roomNumber, occupancy: data.occupancy })
                        });
                        await db.RoomDetails.bulkCreate(itemsRoomDetails).then().catch(err => {
                        });
                    }
                    if (images && images.length > 0) {
                        let itemsParamsImages = [];
                        images.forEach(element => {
                            itemsParamsImages.push({ imageName: element, roomId: result.id })
                        });
                        await db.RoomImages.bulkCreate(itemsParamsImages).then().catch(error => {
                            console.log("imagess", err)
                        });
                        images = [];
                    }
                    return res.status(200).json({ status: true, msg: "Room created successfully" });
                }).then()
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ 'errors': err });
                });
        });
    },

    async update(req, res, next) {
        upload(req, res, async function (err) {
            const { propertyId, categoryId, roomDescription, status, amenities, minPrice, maxPrice, regularPrice, roomDetails, occupancy, breakFastPrice, ap, map, heroImage, offerPrice, fromDate, toDate } = req.body;
            db.Rooms.update({
                propertyId: propertyId,
                categoryId: categoryId,
                roomDescription: roomDescription,
                minPrice: minPrice,
                maxPrice: maxPrice,
                regularPrice: regularPrice,
                occupancy: occupancy,
                breakFastPrice: breakFastPrice,
                offerPrice: offerPrice,
                fromDate: fromDate,
                toDate: toDate,
                ap: ap,
                map: map,
                heroImage: heroImage
            }, { where: { id: req.params.id } })
                .then(async (updated) => {
                    if (amenities && amenities.length > 0) {
                        let itemsParamsAme = [];
                        amenities.forEach(element => {
                            itemsParamsAme.push({ amenitiesId: element, roomId: req.params.id })
                        });
                        await db.RoomAmenities.destroy({ where: { roomId: req.params.id } });
                        await db.RoomAmenities.bulkCreate(itemsParamsAme);
                    }
                    let roomdetails = [];
                    if (roomDetails && roomDetails.length > 0) {
                        let itemsRoomDetails = [];
                        roomDetails.forEach(element => {
                            let data = JSON.parse(element);
                            itemsRoomDetails.push({ roomId: req.params.id, propertyId: propertyId, categoryId: categoryId, floorNumber: data.floorNumber, roomNumber: data.roomNumber, occupancy: data.occupancy })
                        });
                        //roomdetails = itemsRoomDetails;
                        await db.RoomDetails.destroy({ where: { roomId: req.params.id } });
                        await db.RoomDetails.bulkCreate(itemsRoomDetails);
                    }
                    console.log("-------------", images);
                    const orgImage = images;
                    if (images && images.length > 0) {
                        let itemsParamsImages = [];
                        images.forEach(element => {
                            itemsParamsImages.push({ imageName: element, roomId: req.params.id })
                        });
                        //db.RoomImages.destroy({where: {roomId: req.params.id}});
                        await db.RoomImages.bulkCreate(itemsParamsImages);
                        images = [];
                    }
                    return res.status(200).json({ status: true, msg: "Room updated successfully", images: orgImage, roomDetails: roomdetails });
                })
                .catch(err => {
                    return res.status(500).json({ status: false, 'errors': err });

                });
        })
    },

    async updateRoomHeroImage(req, res, next) {
        const id = req.params.id;
        const { heroImage } = req.body;
        if (id && heroImage) {
            await db.Rooms.findOne({ where: { id: id } }).then(result => {
                if (result) {
                    result.update({ heroImage: heroImage });
                    return res.status(200).json({ status: true, message: 'Hero image updated successfully.' });
                } else {
                    return res.status(400).json({ status: false, message: 'Room does not exist by submitted id' });
                }
            }).catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
        } else {
            return res.status(400).json({ status: false, message: 'Room id and heroImage is required' });
        }
    },

    async updateRoomStatus(req, res, next) {
        const {
            status,
            id
        } = req.body;
        await db.Rooms.update({
            status: status
        }, { where: { id: id } })
            .then(updated => {
                if (updated)
                    return res.status(200).json({ status: true, msg: "Room status updated successfully" });
                else
                    return res.status(200).json({ status: false, msg: "Room status updating failed" });
            })
            .catch(err => {
                return res.status(500).json({ status: false, 'errors': JSON.stringify(err) });
            })
    },

    async updateRoomDetailsStatus(req, res, next) {
        const {
            status,
            id
        } = req.body;

        await db.RoomDetails.findOne({ where: { id: id } }).then(result => {
            if (result) {
                if (result.get('status') == 1) {
                    return res.status(200).json({ status: false, message: "You can't change the status of this room, bcz this room assigned to some one guest." });
                } else {
                    result.update({ status: status });
                }
                return res.status(200).json({ status: true, msg: "Room detail status updated successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Room detail status updating failed" });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    // commented on 09-06-2025
    // async blockUnblockRoom(req, res, next) {
    //     const {
    //         status,
    //         ids,
    //         fromDate,
    //         toDate
    //     } = req.body;
    //     if (fromDate && toDate) {
    //         db.RoomDetails.update({ fromDate: fromDate, toDate: toDate, status: status }, { where: { id: ids } })
    //             .then(updated => {
    //                 if (updated)
    //                     return res.status(200).json({ status: true, msg: "Rooms status updated successfully" });
    //                 else
    //                     return res.status(200).json({ status: false, msg: "Rooms status updating failed" });
    //             })
    //             .catch(err => {
    //                 return res.status(400).json({ status: false, message: err?.message });
    //             })
    //     } else if (status == 0) {
    //         db.RoomDetails.update({ fromDate: null, toDate: null, status: status }, { where: { id: ids } })
    //             .then(updated => {
    //                 if (updated)
    //                     return res.status(200).json({ status: true, msg: "Rooms status updated successfully" });
    //                 else
    //                     return res.status(200).json({ status: false, msg: "Rooms status updating failed" });
    //             })
    //             .catch(err => {
    //                 return res.status(400).json({ status: false, message: err?.message });
    //             })
    //     } else {
    //         db.RoomDetails.update({ status: status }, { where: { id: ids } })
    //             .then(updated => {
    //                 if (updated)
    //                     return res.status(200).json({ status: true, msg: "Rooms status updated successfully" });
    //                 else
    //                     return res.status(200).json({ status: false, msg: "Rooms status updating failed" });
    //             })
    //             .catch(err => {
    //                 return res.status(400).json({ status: false, message: err?.message });
    //             })
    //     }
    // },

    // upload krna hai aj 10-06-2025
    async blockUnblockRoom(req, res, next) {
        const { status, ids, fromDate, toDate, propertyId } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(200).json({ status: false, msg: "Room IDs are required." });
        }
        try {
            const activeBookings = await db.BookingHotel.findAll({
                where: {
                    bookingStatus: 2,
                    propertyId: propertyId
                },
                attributes: ['assignRoomDetailsId']
            });
            const assignedRoomIds = new Set();
            for (const booking of activeBookings) {
                const idsArr = booking.assignRoomDetailsId?.split(',').map(id => parseInt(id)) || [];
                idsArr.forEach(id => assignedRoomIds.add(id));
            }
            const blockedIds = ids.filter(id => assignedRoomIds.has(id));
            const freeIds = ids.filter(id => !assignedRoomIds.has(id));
            if (blockedIds.length > 0) {
                return res.status(200).json({
                    status: false,
                    // msg: `Selected Room(s) ${blockedIds.join(', ')} are currently assigned. Please unblock/block after checkout.`
                    msg: `Selected Room(s) are currently assigned to booking(s). Please unblock/block after checkout.`
                });
            }
            let updatePayload = { status };
            if (fromDate && toDate) {
                updatePayload.fromDate = fromDate;
                updatePayload.toDate = toDate;
            } else if (status == 0) {
                updatePayload.fromDate = null;
                updatePayload.toDate = null;
            }
            console.log("ddddd");
            const updated = await db.RoomDetails.update(updatePayload, { where: { id: freeIds } });
            if (updated) {
                return res.status(200).json({ status: true, msg: "Rooms status updated successfully" });
            } else {
                return res.status(200).json({ status: false, msg: "Rooms status updating failed" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: false, message: err.message });
        }
    },

    async applyOffers(req, res, next) {
        const {
            offerPrice,
            id,
            fromDate,
            toDate
        } = req.body;

        const from = fromDate ? moment(new Date(fromDate)).format('YYYY-MM-DD') : null
        const to = toDate ? moment(new Date(toDate)).format('YYYY-MM-DD') : null

        //API Updated as umesh Told
        await db.Rooms.update({ offerPrice: offerPrice, fromDate: from, toDate: to }, { where: { id: id } }).then(resp => {
            return res.status(200).json({ status: true, message: "Offer price updated successfully" });
        }).catch(err => {
            return res.status(200).json({ status: false, msg: "Offer price updating failed" });
        })

        /*await db.Rooms.findOne({where: {id: id}}).then(async(resp)=>{
            if(resp){
                const regularPrice = resp.get('regularPrice');
                await resp.update({offerPrice: regularPrice, regularPrice: offerPrice}).then(result=>{
                    return res.status(200).json({ status: true ,msg: "Offer price updated successfully"});
                }).catch(error=>{
                    return res.status(200).json({ status: false ,msg: "Offer price updating failed"});
                });
            }else{
                return res.status(200).json({ status: false ,msg: "No details found by this id"});
            }
        }).catch(error=>{
            return res.status(200).json({ status: false ,msg: "Offer price updating failed"});
        })*/
    },

    async get(req, res) {
        const roomSelection = {
            include: [
                { model: db.RoomAmenities, required: false },
                { model: db.RoomImages, required: false },
                { model: db.PropertyMaster, required: false },
                { model: db.RoomDetails, required: false }
            ]
        }

        const selector = Object.assign({}, roomSelection);
        await db.Rooms.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true });
        })
            .catch((err) => {
                res.send(err);
            });

    },

    async getById(req, res) {
        const id = req.params.id;
        const roomSelection = {
            include: [
                { model: db.RoomDetails, required: false },
                { model: db.RoomAmenities, required: false },
                { model: db.RoomImages, required: false },
                { model: db.PropertyMaster, required: false }

            ],
            where: { id: id }
        }
        const selector = Object.assign({}, roomSelection);
        db.Rooms.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async getRoomByPropertyId(req, res) { //tempBlocked no need
        const propertyId = req.params.id;
        const roomSelection = {
            attributes: ['id', 'categoryId', 'propertyId', 'regularPrice', 'roomDescription', 'breakFastPrice', 'ap', 'map', 'heroImage'],
            include: [
                //{ model: db.RoomAmenities, required: false, attributes: ['id', '']},
                { model: db.RoomImages, required: false, attributes: ['id', 'roomId', 'imageName'] },
                { model: db.PropertyMaster, required: false, attributes: ['name', 'propertyCode', 'noOfRooms'] },
                { model: db.RoomDetails, required: false, attributes: ['id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber', 'occupancy', 'status', 'fromDate', 'toDate', 'tempBlocked'] }
            ],
            where: { propertyId: propertyId }
        }
        const selector = Object.assign({}, roomSelection);
        db.Rooms.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async getRoomByRoomIdPropertyId(req, res) {
        const roomId = req.params.id;
        const propertyId = req.params.propertyId;
        console.log(roomId, propertyId);
        const roomSelection = {
            include: [
                { model: db.RoomAmenities, required: false },
                { model: db.RoomImages, required: false },
                { model: db.PropertyMaster, required: false },
                { model: db.RoomDetails, required: false }
            ],
            where: { id: roomId, propertyId: propertyId }
        }
        const selector = Object.assign({}, roomSelection);
        db.Rooms.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    async delete(req, res, next) {
        await db.RoomImages.destroy({ where: { roomId: req.params.id } });
        await db.RoomAmenities.destroy({ where: { roomId: req.params.id } });
        await db.Rooms.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(500).json({ status: false, errors: err });
        })
    },

    async deleteRoomImage(req, res, next) {
        db.RoomImages.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(500).json({ status: false, errors: err });
        })
    },
};
