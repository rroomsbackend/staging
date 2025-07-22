import { db } from "../../../../../models";

const list = async (
    property_id
) => {
    const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    if (!property) {
        validationResponse("Invalid property_id");
    }
    const laundaryServiceSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        where: [
            { propertyId: property_id, deletedAt: null }
        ],
    }
    const selector = Object.assign({}, laundaryServiceSelection);
    const laundaryServices = await db.LaundaryService.findAll(selector);
    return laundaryServices;
}

const create = async (
    property_id,
    name,
    price,
    providerId
) => {
    const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
    if (!property) {
        validationResponse("Invalid property_id");
    }
    return await db.LaundaryService.create({
        propertyId: property_id,
        name: name,
        price: price,
        providerId: providerId
    });
}

const update = async (
    id,
    property_id,
    name,
    price,
    providerId
) => {
    await db.LaundaryService.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Laundary service not found");
        }
        if (data.propertyId != property_id) {
            validationResponse("Invalid property_id");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.LaundaryService.update({
        propertyId: property_id,
        name: name,
        price: price,
        providerId: providerId
    }, { where: { id: id, propertyId: property_id } });
}

const destroy = async (
    id
) => {
    await db.LaundaryService.findOne({ where: { id: id } }).then( async (data) => {
        if (!data) {
            validationResponse("Laundary service not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.LaundaryService.destroy({ where: { id: id } });
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, create, update, destroy }
