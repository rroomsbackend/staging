import { db } from '../../../models';
import config from '../../../config';
import multer from 'multer';
import { DATEONLY, Op } from 'sequelize';
import sequelize from 'sequelize';

var fileName = "";
var images = [];
var certificate = {ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "",rentAgreement: "",cancelCheque: "",PropertyPanCertificate: ""};
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,  __basedir + "/uploads/");
    },
    filename: function (req, file, callback) {
      const fileType = file.originalname.split(".");
      fileName = fileType[0]+'-'+Date.now()+"."+fileType[1];
      if(file.fieldname == 'images'){
        images.push(fileName);
      }else{
        certificate[file.fieldname] = fileName;
      }
      callback(null, fileName);
    }
});

const upload = multer({
    storage: storage
  }).fields([
    {name: "images", maxCount: 10},
    {name: "ownerpanCertificate", maxCount: 1},
    {name: "owneradharCertificate", maxCount: 1},
    {name: "gstCertificate", maxCount: 1},
    {name: "tanCertificate", maxCount: 1},
    {name: "rentAgreement", maxCount: 1},
    {name: "cancelCheque", maxCount: 1},
    {name: "PropertyPanCertificate", maxCount: 1},
  ]);

export default {
    async create(req, res, next) {      
        upload(req,res, async function(err) {  
            const {
                propertyCategoryId,
                name,
                gstNumber,
                tanNumber,
                propertyDescription,
                longitude,
                latitude,
                address,
                countryId,
                stateId,
                city,
                pincode,
                bookingPolicy,
                ownerFirstName,
                ownerLastName,
                ownerMobile,
                ownerEmail,
                ownerPan,
                ownerAdhar,
                status,
                amenities,
                partialPayment,
                partialPaymentPercentage,
                partialAmount,
                bookingAmount,
                landmark,
                propertyMobileNumber,
                propertyEmailId,
                firmType,
                PropertyPanNumber,
                noOfRooms,
                remarks
            } = req.body;

            const propertyEmailOrMobile = await db.PropertyUser.findOne({where: {[Op.or]: [
                {
                    email: 
                    {
                        [Op.eq]: ownerEmail
                    }
                }, 
                {
                    mobile: 
                    {
                        [Op.eq]: ownerMobile
                    }
                }                
                ]}
            }).catch(err=>{
                return res.status(400).json({ status: false, message: err.message });
            });

            if(propertyEmailOrMobile){
                return res.status(409).json({ status: false, message: 'Property email/mobile number already exist' });
            }

            await db.PropertyMaster.create({
                propertyCategoryId : propertyCategoryId,
                name: name,
                gstNumber:gstNumber,
                tanNumber:tanNumber,
                propertyDescription:propertyDescription,
                longitude:longitude,
                latitude:latitude,
                address:address,
                countryId:countryId,
                stateId:stateId,
                city:city,
                pincode:pincode,
                bookingPolicy:bookingPolicy,
                ownerFirstName:ownerFirstName,
                ownerLastName:ownerLastName,
                ownerMobile:ownerMobile,
                ownerEmail:ownerEmail,
                ownerPan:ownerPan,
                ownerAdhar:ownerAdhar,
                status:0,
                noOfRooms: noOfRooms,
                remarks:remarks,
                partialPayment:partialPayment,
                partialPaymentPercentage:partialPaymentPercentage,
                partialAmount:partialAmount,
                bookingAmount:bookingAmount,
                landmark:landmark,
                propertyMobileNumber:propertyMobileNumber,
                propertyEmailId:propertyEmailId,
                firmType:firmType,
                PropertyPanNumber: PropertyPanNumber,
                PropertyPanCertificate: certificate?.PropertyPanCertificate,
                ownerpanCertificate: certificate?.ownerpanCertificate,
                owneradharCertificate: certificate?.owneradharCertificate,
                gstCertificate: certificate?.gstCertificate,
                tanCertificate: certificate?.tanCertificate,
                rentAgreement: certificate?.rentAgreement,
                cancelCheque: certificate?.cancelCheque
            })
            .then(async(result) => {
                //reset data
                certificate = {ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "",rentAgreement: "",cancelCheque: "", PropertyPanCertificate: ""};
                
                let propertyId = result.id;
                let cityName = city ? "RROOM" + city.split(" ").join('-') : "RROOM";
                cityName = cityName.toString();
                let propertyCode =  cityName.toUpperCase()+propertyId.toString();

                db.PropertyMaster.update({propertyCode: propertyCode}, {
                    where: { id: propertyId }
                });
              
                if(amenities && amenities.length > 0){
                    let itemsParamsAme = [];
                    amenities.forEach(element => {
                        itemsParamsAme.push({propertyAmenitiesId: element, propertyId: propertyId})
                    });
                    console.log("itemsParamsAme",itemsParamsAme);
                    await db.PropertyAmenities.bulkCreate(itemsParamsAme).then().catch(err=>{
                        return res.status(400).json({ status: false, message: err.message });
                    });
                }
                if(images && images.length > 0){
                    let itemsParamsImages = [];
                    images.forEach(element => {
                        itemsParamsImages.push({image: element, propertyId: propertyId})
                    });
                    await db.PropertyImage.bulkCreate(itemsParamsImages).then().catch(error=>{
                        return res.status(400).json({ status: false, message: error.message });
                    });
                    images = [];
                }

                await db.PropertyUser.create({
                    firstName:ownerFirstName,
                    lastName: ownerLastName,
                    propertyId: propertyId,
                    email: ownerEmail,
                    mobile:ownerMobile,
                    role: '1',
                    designation: "admin",
                    password: `${ownerFirstName}@123`,
                    userCode: ownerEmail
                }).then(async user =>{
                    const count = parseInt(user.id);
                    let pad = '00000';
                    var ctxt = '' + count;
                    const userCode = propertyCode + (pad.substr(0, pad.length - ctxt.length) + count).toString();
                    await db.PropertyUser.update({userCode: userCode}, {
                        where: { id: user.id }
                    });
                }).catch(err => {
                    return res.status(500).json({ status: false, message: err.message });
                });
                return res.status(200).json({ status: true, data: result, message: "Property created successfully"});
            })
            .catch(err => {
                return res.status(500).json({ status: false, message: err.message });
            });
        });
    },   

    async update(req, res, next) {
        upload(req,res,async function(err) {
            const {
                propertyCategoryId,
                name,
                gstNumber,
                tanNumber,
                propertyDescription,
                longitude,
                latitude,
                address,
                countryId,
                stateId,
                city,
                pincode,
                bookingPolicy,
                ownerFirstName,
                ownerLastName,
                ownerMobile,
                ownerEmail,
                ownerPan,
                ownerAdhar,
                status,
                amenities,
                partialPayment,
                partialPaymentPercentage,
                partialAmount,
                bookingAmount,
                landmark,
                propertyMobileNumber,
                propertyEmailId,
                firmType,
                PropertyPanNumber,
                imageTitle,
                noOfRooms,
                remarks
            } = req.body;

            const data2 = {
                propertyCategoryId:propertyCategoryId,
                name: name, gstNumber:gstNumber,
                tanNumber:tanNumber,
                propertyDescription:propertyDescription,
                longitude:longitude,
                latitude:latitude,
                address:address,
                countryId:countryId,
                stateId:stateId,
                city:city,
                pincode:pincode,
                bookingPolicy:bookingPolicy,
                ownerFirstName:ownerFirstName,
                ownerLastName:ownerLastName,
                ownerMobile:ownerMobile,
                ownerEmail:ownerEmail,
                ownerPan:ownerPan,
                ownerAdhar:ownerAdhar,
                status:status == 'Active' ? 0 : 1,
                noOfRooms: noOfRooms,
                remarks:remarks,
                partialPayment:partialPayment,
                partialPaymentPercentage:partialPaymentPercentage,
                partialAmount:partialAmount,
                bookingAmount:bookingAmount,
                landmark:landmark,
                propertyMobileNumber:propertyMobileNumber,
                propertyEmailId:propertyEmailId,
                firmType:firmType,
                PropertyPanNumber: PropertyPanNumber,
                PropertyPanCertificate: certificate?.PropertyPanCertificate,
                ownerpanCertificate: certificate?.ownerpanCertificate,
                owneradharCertificate: certificate?.owneradharCertificate,
                gstCertificate: certificate?.gstCertificate,
                tanCertificate: certificate?.tanCertificate,
                rentAgreement: certificate?.rentAgreement,
                cancelCheque: certificate?.cancelCheque
            }

            const data = {}
            Object.keys(data2).forEach((key)=>{
                if(data2[key] && data2[key] != '' && data2[key] != undefined){
                    data[key] = data2[key]
                }
            })

            //console.log("00099999999999",data);

            db.PropertyMaster.update(data, { where: {id:req.params.id }})
                .then(async(updated) => {
                    //reset data
                    certificate = {ownerpanCertificate: "", owneradharCertificate: "", gstCertificate: "", tanCertificate: "",rentAgreement: "",cancelCheque: "",PropertyPanCertificate: ""};
                
                    if(amenities && Array.isArray(amenities) && amenities.length > 0){
                        let itemsParamsAme = [];
                        amenities.forEach(element => {
                            itemsParamsAme.push({propertyAmenitiesId: element, propertyId: req.params.id})
                        });
                        await db.PropertyAmenities.destroy({where: {propertyId: req.params.id}});
                        console.log("00---------------",itemsParamsAme);
                        await db.PropertyAmenities.bulkCreate(itemsParamsAme).then().catch(err=>{
                            return res.status(500).json({ status: false, message: err.message });
                        });
                    }
    
                    if(images && images.length > 0){
                        //console.log("imageTitleimageTitle", imageTitle)
                        let itemsParamsImages = [];
                        images.forEach((element, index) => {
                            console.log("--",element, index)
                            const title = imageTitle[index] != undefined ? imageTitle[index] : "Rroom Property Image"
                            
                            console.log('=======title',title);
                            
                            itemsParamsImages.push({propertyId: req.params.id, title: title, image: element})
                        });
                        //db.PropertyImage.destroy({where: {propertyId: req.params.id}});
                        await db.PropertyImage.bulkCreate(itemsParamsImages).then().catch(err=>{
                            return res.status(500).json({ status: false, message: err.message });
                        });
                        images = [];
                    }
                    return res.status(200).json({ status: true ,msg: "Property updated successfully"});
                })
                .catch(err => {
                    return res.status(500).json({ status: false, message: err.message });                    
                });
        });
    },

    async get(req, res) {
        const propertySelection = {
            //attributes: ['id', 'propertyCode', 'name', 'createdAt', 'landmark', 'approved', 'status', 'updatedAt'],
            through: {attributes: []},
            include: [
                { model: db.PropertyAmenities, attributes: ['id', 'propertyId', 'propertyAmenitiesId'], required: false, where: [
                    {deletedAt: null}
                ] },
                { model: db.PropertyImage, attributes: ['id', 'propertyId', 'title', 'image'], required: false, where: [
                    {deletedAt: null}
                ] },
                { model: db.Rooms,  required: false,
                    /*include: [
                        { model: db.RoomImages, attributes: ['id'], required: false},
                        { model: db.RoomAmenities, attributes: ['id'], required: false},
                        { model: db.RoomDetails, attributes: ['id'], required: false}
                    ]*/
                }
            ],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                {deletedAt: null}
            ],
        }
    
        const selector = Object.assign({}, propertySelection);
        await db.PropertyMaster.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            return res.status(500).json({ status: true, message: err.message});
        });
            
    },

    async getApprovedProperty(req, res) {
        const propertySelection = {
            include: [
                { model: db.PropertyAmenities, required: false},
                { model: db.PropertyImage, required: false},
                { model: db.Rooms, required: false,
                    include: [
                        { model: db.RoomImages, required: false},
                        { model: db.RoomAmenities, required: false},
                        //{ model: db.RoomDetails, required: false}
                    ]
                }
            ],
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                {approved: 1, deletedAt: null}
            ],
        }
    
        const selector = Object.assign({}, propertySelection);
        await db.PropertyMaster.findAll(selector).then(result => {
            return res.status(200).json({ data: result, status: true});
        })
        .catch((err) => {
            res.send(err);
        });
            
    },

    async updatePropertyStatus(req, res){
        const {
            id,
            status,
            approved,
            remarks
        } = req.body;
        db.PropertyMaster.update({status:status,approved: approved, remarks: remarks
        }, { where: {id:id }})
        .then(updated => {
            if(updated)
                return res.status(200).json({ status: true ,msg: "Propert status updated successfully"});
            else
                return res.status(200).json({ status: false ,msg: "Propert status updating failed"});
        })
        .catch(err=>{
            return res.status(500).json({ status: false, 'errors': err });
        })
    },

    async getById(req, res) {
        const id = req.params.id
        const fromDateReq = req?.query?.fromDate;// ? new Date(req?.query?.fromDate).getTime() : new Date().getTime();
        const toDateReq = req?.query?.toDate;// ? new Date(req?.query?.toDate).getTime() : new Date().getTime();
        console.log(fromDateReq, toDateReq);
        const bookingSelector = {
            attributes: ['propertyId', [sequelize.fn('count', sequelize.col('propertyId')), 'totalRoomBooked'], 'propertyRoomsCategoryId'],
            include:[
                {model: db.Rooms, attributes:['id']}
            ],
            where: {bookingStatus: 1, propertyId: id, [Op.or]: [{fromDate: {[Op.between]: [fromDateReq, toDateReq]}}, {toDate: {[Op.between]: [fromDateReq, toDateReq]}}]},
            group: ['propertyId','propertyRoomsCategoryId']
        }       
        
        const bookedRoomsOnDate = await db.BookingHotel.findAll(bookingSelector);
        let rows = JSON.stringify(bookedRoomsOnDate);
        rows = JSON.parse(rows);

        return res.status(200).json({ data: rows, status: false, message: 'Message'});      
        
        return;
        const roomDetailsModel = { model: db.RoomDetails, required: false, where: {status: [0,2]}}
        
        try{
            const result = await db.PropertyMaster.findOne({where : {id:id}});
            const propertiesAmenities = await db.PropertyAmenities.findAll({attributes: ['id', 'propertyId', 'propertyAmenitiesId'], where : {propertyId:id}})
            const propertyImages = await db.PropertyImage.findAll({attributes: ['id', 'propertyId', 'title', 'image'], where : {propertyId:id}})
        
            //**** Fetch Room Details By Property Id */
            const selectorRoomDetails = {
                include: [
                    { model: db.RoomImages, required: false, attributes: ['id', 'roomId', 'imageName']},
                    { model: db.RoomAmenities, required: false, attributes: ['id', 'roomId', 'amenitiesId']},
                    roomDetailsModel,
                ],
                where : {propertyId:id}
            }
            const roomDetails = await db.Rooms.findAll(selectorRoomDetails);
            let rows = JSON.stringify(result);
            rows = JSON.parse(rows);
            rows['PropertyAmenities'] = JSON.parse(JSON.stringify(propertiesAmenities));
            rows['PropertyImage'] = JSON.parse(JSON.stringify(propertyImages));
            const rooms = JSON.parse(JSON.stringify(roomDetails));
            if(rooms && rooms.length > 0){
                rooms.map(obj=>{
                    const avaiableRooms = obj.RoomDetails.filter(rooms=>{                        
                        if(rooms.fromDate && rooms.toDate){
                            const fromDate = new Date(rooms.fromDate).getTime();
                            const toDate = new Date(rooms.toDate).getTime();
                            return !((fromDateReq <= fromDate && toDateReq >= fromDate) || (fromDateReq <= toDate && toDateReq >= toDate)) 
                        }else{
                            return rooms
                        }
                    });
                    obj['avaiableRooms'] = avaiableRooms.length;
                })
            }
            rows['Rooms'] = rooms;
            return res.status(200).json({ data: rows, status: true});
        }catch(err){
            return res.status(500).json({ data: [], status: false, message: err.message});
        }
    },

    async serachProperty(req, res) {
        const {
            query,
            propertyType,
            amenities,
            categoryType,
            rating
        } = req.body;       

        const filterBy = [];
        if(query){
            filterBy.push({propertyCode : {
                [Op.like]: `%${query}%`
            }})

            filterBy.push({name : {
                [Op.like]: `%${query}%`
            }})

            filterBy.push({address : {
                [Op.like]: `%${query}%`
            }})

            filterBy.push({city : {
                [Op.like]: `%${query}%`
            }})

            filterBy.push({stateId : {
                [Op.like]: `%${query}%`
            }})

            filterBy.push({landmark : {
                [Op.like]: `%${query}%`
            }})
        }

        console.log("filter criteria", filterBy);
        return;

        const amenitiesModel = { model: db.PropertyAmenities, required: false };
        if(amenities && amenities.length > 0){
            amenitiesModel.required = true;
            amenitiesModel['where'] = {propertyAmenitiesId: {in: amenities}}
        }
        const ratingModel = { model: db.Rating, required: false };
        if(rating && rating.length > 0){
            ratingModel.required = true;
            ratingModel['where'] = {rating: {in:rating}}
        }
        const couponModel = { model: db.Coupon, required: false };

        const propertySelection = {
            include: [
                amenitiesModel,
                ratingModel,
                couponModel,
                { model: db.PropertyImage, required: false},
                { model: db.Rooms, required: false,
                    include: [
                        { model: db.RoomImages, required: false},
                        { model: db.RoomAmenities, required: false},
                        //{ model: db.RoomDetails, required: false}
                    ]
                }
            ]          
        }

        if(filterBy && filterBy.length > 0){

            if(propertyType && propertyType.length > 0){
                propertySelection['where'] = [{
                    [Op.or]: filterBy
                  },
                  {propertyCategoryId: {in: propertyType}}
                ]
            }else{                
                propertySelection['where'] = [{
                    [Op.or]: filterBy
                  }]
            }
        }


        const selector = Object.assign({}, propertySelection);
        db.PropertyMaster.findAll(selector)
        .then(result => {
            if(result && result.length > 0)
                return res.status(200).json({ data: result, status: true, message:"Found's properties"});
            else{
                return res.status(200).json({ data: result, status: false, message: "No property found!"});
            }
        })
        .catch((err) => {
            return res.status(500).json({ data: [], status: false, message: JSON.stringify(err)});
        });
    },



    async delete(req, res, next) {
        await db.PropertyAmenities.destroy({ where: { propertyId: req.params.id } });
        await db.PropertyImage.destroy({ where: { propertyId: req.params.id } });
        await db.Rooms.destroy({ where: { propertyId: req.params.id } });
        await db.PropertyMaster.destroy({ where: { id: req.params.id } }).then(result => {
            if(result)
                return res.status(200).json({ status: true});
            else
                return res.status(200).json({ status: false, msg: 'No record found by this id - ' + req.params.id});
        }).catch(err => {
            return res.status(500).json({ status: false,errors: err });
        })
    }
};
