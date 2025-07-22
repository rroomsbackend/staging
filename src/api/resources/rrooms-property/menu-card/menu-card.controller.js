import menuCardService from "./menu-card.service";
import multer from 'multer';

let fileName = "";
let menuCards = [];
let storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null,  __basedir + "/uploads/");
  },
  filename: function (req, file, callback) {
    const fileType = file.originalname.split(".");
    fileName = fileType[0]+'-'+Date.now()+"."+fileType[1];
    menuCards.push(fileName);
    callback(null, fileName);
  }
});
let upload = multer({ storage : storage}).array('menu_card',10);

const get = async (req, res, next) => {
    try {
        const { property_id } = req.params;
        const menuCards = await menuCardService.get(property_id);
        if (menuCards) {
            return res.status(200).json({
                status: true,
                msg: "Menu cards fetched successfully",
                data: menuCards
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const create = async (req, res, next) => {
    upload(req,res,async function(err) {
        try {
            const { property_id, status } = req.body;
            await menuCardService.validateCreate(property_id, status);
            if(menuCards && menuCards.length > 0){
                let data = [];
                menuCards.forEach(element => {
                    data.push({menuCard: element, propertyId: property_id, status: status})
                });
                menuCards = [];
                const menuCard = await menuCardService.create(data);
                if (menuCard) {
                    return res.status(201).json({
                        status: true,
                        msg: "Menu cards uploaded successfully",
                        data: menuCard
                    });
                }
            }
            return res.status(500).json({
                status: false,
                msg: "Internal server error"
            });
        } catch (error) {
            menuCards = [];
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    });
}

const update = async (req, res, next) => {
    upload(req,res,async function(err) {
        try {
            const { property_id, status } = req.body;
            await menuCardService.validateCreate(property_id, status);
            if(menuCards && menuCards.length > 0){
                let data = [];
                menuCards.forEach(element => {
                    data.push({menuCard: element, propertyId: property_id, status: status})
                });
                menuCards = [];
                const menuCard = await menuCardService.update(data, property_id);
                if (menuCard) {
                    return res.status(201).json({
                        status: true,
                        msg: "Menu cards updated successfully",
                        data: menuCard
                    });
                }
            }
            return res.status(500).json({
                status: false,
                msg: "Internal server error"
            });
        } catch (error) {
            menuCards = [];
            return res.status(error?.code ? error.code : 500).json({
                status: false,
                msg: error?.message
            });
        }
    });
}

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menuCard = await menuCardService.destroy(id);
        if (menuCard) {
            return res.status(200).json({
                status: true,
                msg: "Menu card deleted successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

export default { get, create, update, destroy };