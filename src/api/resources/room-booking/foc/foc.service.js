import { db } from "../../../../models";

const list = async (
    property_id,
    from_at,
    to_at
) => {
    const focRequestSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        include: [
            { model: db.BookingHotel, required: false, attributes: ['bookingCode']}
        ],
        where: [
            { deletedAt: null }
        ],
        attributes: ['id', 'bookingId', 'propertyId', 'amount', 'remark', 'status', 'createdAt']
    }
    if (property_id && !from_at && !to_at) {
        focRequestSelection.where = [{
            propertyId: property_id,
            deletedAt: null
        }];
    }
    if (!property_id && from_at && to_at) {
        const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if (!dateRegex.test(from_at) || !dateRegex.test(to_at)) {
            validationResponse("Invalid date format. e.g: 'YYYY-MM-DD'");
        }
        focRequestSelection.where = [{
            createdAt: {
                $between: [from_at, to_at]
            },
            deletedAt: null
        }];
    }
    const selector = Object.assign({}, focRequestSelection);
    const focRequests = await db.FOCRequest.findAll(selector);
    return focRequests;
}

const create = async (
    property_id,
    booking_id,
    amount,
    remark
) => {
    await validateCreate(property_id, booking_id);
    return await db.FOCRequest.create({
        propertyId: property_id,
        bookingId: booking_id,
        amount: amount,
        remark: remark ? remark : null
    });
}

const update = async (
    id,
    booking_id,
    status
) => {
    const FOCRequest = await db.FOCRequest.findOne({where: { id: id }});
    if (!FOCRequest) {
        validationResponse("FOC request not found");
    }
    if (FOCRequest.bookingId != booking_id) {
        validationResponse("Invalid booking_id");
    }
    if (["approved", "rejected"].includes(FOCRequest.status)) {
        validationResponse("Request is already " + FOCRequest.status);
    }
    let requestStatus = "approved";
    if (!status) {
        requestStatus = "rejected";
    }
    return await db.FOCRequest.update({
        status: requestStatus
    }, { where: { id: id, bookingId: booking_id } }).then(async (data) => {
        if (status) {
            return await db.BookingHotel.update({
                dueAmount: 0,
                collectedPayment: FOCRequest.amount
            }, { where: { id: booking_id } });
        }
        return await db.BookingHotel.update({
            updatedAt: new Date()
        }, { where: { id: booking_id } });
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const validateCreate = async (
    property_id,
    booking_id
) => {
    const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    if (!property) {
        validationResponse("Invalid property_id");
    }
    const booking = await db.BookingHotel.findOne({where : { id: booking_id }})
    if (!booking) {
        validationResponse("Invalid booking_id");
    }
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, create, update }
