import { db } from "../../../../../models";
import sequelize from 'sequelize';
const Op = sequelize.Op;

const list = async (
    property_id
) => {
    const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    if (!property) {
        validationResponse("Invalid property_id");
    }
    const laundaryProviderSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        where: [
            { propertyId: property_id, deletedAt: null }
        ],
    }
    const selector = Object.assign({}, laundaryProviderSelection);
    const laundaryProviders = await db.LaundaryProvider.findAll(selector);
    return laundaryProviders;
}

const create = async (
    property_id,
    name,
    email,
    phone,
    address,
    provider_code,
    alternate_mobile,
    pan_number,
    gst,
    bank_name,
    branch_name,
    account_name,
    account_number,
    ifsc
) => {
    const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
    if (!property) {
        validationResponse("Invalid property_id");
    }
    const provider = await db.LaundaryProvider.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { phone: phone }
            ]
        }
    });
    if (provider) {
        if (provider.email == email) {
            validationResponse("Email already exists.");
        }
        if (provider.phone == phone) {
            validationResponse("Phone already exists.");
        }
    }
    return await db.LaundaryProvider.create({
        propertyId: property_id,
        name: name,
        email: email,
        phone: phone,
        address: address,
        providerCode: provider_code,
        alternateMobile: alternate_mobile,
        panNumber: pan_number,
        gst: gst,
        bankName: bank_name,
        branchName: branch_name,
        accountName: account_name,
        accountNumber: account_number,
        ifsc: ifsc
    });
}

const update = async (
    id,
    property_id,
    name,
    email,
    phone,
    address,
    provider_code,
    alternate_mobile,
    pan_number,
    gst,
    bank_name,
    branch_name,
    account_name,
    account_number,
    ifsc
) => {
    await db.LaundaryProvider.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Laundary provider not found");
        }
        if (data.propertyId != property_id) {
            validationResponse("Invalid property_id");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    const provider = await db.LaundaryProvider.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { phone: phone }
            ]
        }
    });
    if (provider) {
        if (provider.email == email && provider.id != id) {
            validationResponse("Email already exists.");
        }
        if (provider.phone == phone && provider.id != id) {
            validationResponse("Phone already exists.");
        }
    }
    return await db.LaundaryProvider.update({
        propertyId: property_id,
        name: name,
        email: email,
        phone: phone,
        address: address,
        providerCode: provider_code,
        alternateMobile: alternate_mobile,
        panNumber: pan_number,
        gst: gst,
        bankName: bank_name,
        branchName: branch_name,
        accountName: account_name,
        accountNumber: account_number,
        ifsc: ifsc
    }, { where: { id: id, propertyId: property_id } });
}

const destroy = async (
    id
) => {
    await db.LaundaryProvider.findOne({ where: { id: id } }).then( async (data) => {
        if (!data) {
            validationResponse("Laundary provider not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.LaundaryProvider.destroy({ where: { id: id } });
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, create, update, destroy }
