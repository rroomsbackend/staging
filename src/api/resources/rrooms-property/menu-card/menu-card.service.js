import { db } from "../../../../models";
import fs from 'fs';

const get = async (
    property_id
) => {
    const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    if (!property) {
        validationResponse("Invalid property_id");
    }
    const menuCardSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        where: [
            { propertyId: property_id, deletedAt: null }
        ],
    }
    const selector = Object.assign({}, menuCardSelection);
    const menuCards = await db.PropertyMenuCard.findAll(selector);
    return menuCards;
}

const create = async (
    menu_cards
) => {
    return db.PropertyMenuCard.bulkCreate(
        menu_cards
    ).then((data) => {
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const update = async (
    menu_cards,
    propertyId
) => {
    await db.PropertyMenuCard.findAll({ where: { propertyId: propertyId } }).then((data) => {
        if (data) {
            data.map(element => {
                let path = __basedir + "/uploads/" + element.menuCard;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        if (err) {
                            validationResponse(err?.message);
                        }
                    });
                }
            })
            return data;
        };
    }).catch((error) => {
        validationResponse(error?.message);
    });
    db.PropertyMenuCard.destroy({ where: { propertyId: propertyId } }).then((data) => {
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return db.PropertyMenuCard.bulkCreate(
        menu_cards
    ).then((data) => {
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const destroy = async (
    id
) => {
    await db.PropertyMenuCard.findOne({ where: { id: id } }).then((data) => {
        if (data) {
            let path = __basedir + "/uploads/" + data.menuCard;
            if (fs.existsSync(path)) {
                fs.unlink(path, (err) => {
                    if (err) {
                        validationResponse(err?.message);
                    }
                });
            }
            return data;
        } else {
            validationResponse("Menu card not found");
        };
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return db.PropertyMenuCard.destroy({ where: { id: id } }).then((data) => {
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const validateCreate = async (property_id, status) => {
    if (!['active', 'inactive'].includes(status)) {
        validationResponse("Invalid status");
    }
    const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
    if (!property) {
        validationResponse("Invalid property_id");
    }
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { get, validateCreate, create, update, destroy }
