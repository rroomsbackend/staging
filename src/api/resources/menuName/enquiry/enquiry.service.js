import { db } from "../../../models";

const get = async (
    enquiry_id,
    user_id
) => {
    const enquirySelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        include: [
            { model: db.RroomsUser, required: false}
        ],
        where: [
            { deletedAt: null }
        ],
    }
    if (enquiry_id && !user_id) {
        enquirySelection.where = [{
            id: enquiry_id,
            deletedAt: null
        }];
    }
    if (user_id && !enquiry_id) {
        enquirySelection.where = [{
            assignTo: user_id,
            deletedAt: null
        }];
    }
    if (user_id && enquiry_id) {
        enquirySelection.where = [{
            id: enquiry_id,
            assignTo: user_id,
            deletedAt: null
        }];
    }
    const selector = Object.assign({}, enquirySelection);
    const enquiries = await db.Enquiries.findAll(selector);
    return enquiries;
}

const create = async (
    first_name,
    last_name,
    mobile,
    email,
    property_name,
    address_line_1,
    address_line_2,
    state_id,
    city,
    pincode
) => {
    // const state = await db.states.findOne({ where: { id: state_id, deletedAt: null } });
    // if (!state) {
    //     validationResponse("Invalid state_id");
    // }
    return await db.Enquiries.create({
        firstName: first_name,
        lastName: last_name,
        mobile: mobile,
        email: email,
        propertyName: property_name,
        addressLine1: address_line_1,
        addressLine2: address_line_2 ? address_line_2 : null,
        stateId: state_id,
        city: city,
        pincode: pincode
    });
}

const update = async (
    id,
    first_name,
    last_name,
    mobile,
    email,
    property_name,
    address_line_1,
    address_line_2,
    state_id,
    city,
    pincode
) => {
    await db.Enquiries.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Enquiry not found");
        };
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.Enquiries.update({
        firstName: first_name,
        lastName: last_name,
        mobile: mobile,
        email: email,
        propertyName: property_name,
        addressLine1: address_line_1,
        addressLine2: address_line_2 ? address_line_2 : null,
        stateId: state_id,
        city: city,
        pincode: pincode
    }, { where: { id: id } });
}

const remark = async (
    id,
    assign_to,
    remark
) => {
    const enquiry = await db.Enquiries.findOne({ where: { id: id } });
    if (!enquiry) {
        validationResponse("Enquiry not found");
    } else if (enquiry.assignTo != assign_to) {
        validationResponse("Enquiry not assigned to user: " + assign_to);
    };
    return await db.Enquiries.update({
        remark: remark
    }, { where: { id: id, assignTo: assign_to } });
}

const assign = async (
    id,
    assign_to
) => {
    const enquiry = await db.Enquiries.findOne({ where: { id: id } });
    if (!enquiry) {
        validationResponse("Enquiry not found");
    };
    const RroomsUser = await db.RroomsUser.findOne({where : { id: assign_to }});
    if (!RroomsUser) {
        validationResponse("Invalid assign_to");
    }
    return await db.Enquiries.update({
        assignTo: assign_to
    }, { where: { id: id } });
}

const destroy = async (
    id
) => {
    await db.Enquiries.findOne({ where: { id: id } }).then( async (data) => {
        if (!data) {
            validationResponse("Enquiry not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.Enquiries.destroy({ where: { id: id } });
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { get, create, update, remark, assign, destroy }
