import { db } from "../../../../../models";

const arrayColumn = (arr, n) => arr.map(x => x[n]);

const list = async (
    property_id,
    order_id
) => {
    let response = [];
    let laundaryOrderSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        include: [
            {
                model: db.LaundaryRequest, required: true,
                include: [
                    { model: db.LaundaryService, required: true},
                    { model: db.LaundaryProvider, required: true}
                ]
            }
        ],
        where: [
            { deletedAt: null }
        ]
    };
    if (property_id && !order_id) {
        const property = await db.PropertyMaster.findOne({where: { id: property_id }});
        if (!property) {
            validationResponse("Invalid property_id");
        }
        laundaryOrderSelection.where = [{
            propertyId: property_id,
            deletedAt: null
        }];
    }
    if (order_id && !property_id) {
        laundaryOrderSelection.where = [{
            id: order_id,
            deletedAt: null
        }];
    }
    const selector = Object.assign({}, laundaryOrderSelection);
    const laundaryOrders = await db.LaundaryOrder.findAll(selector);
    if (laundaryOrders.length) {
        response = laundaryOrders.map((order) => {
            let item = {...order.toJSON()};
            let totalAmount = arrayColumn(order.LaundaryRequests, "totalServiceAmount");
            item.totalAmount = totalAmount.reduce((a, b) => a + b, 0);
            return item;
        })
    }
    return response;
}

const create = async (
    property_id,
    provider_id,
    remark,
    service,
    createdBy,
    updatedBy
) => {
    try {
        await validateCreate(
            property_id,
            provider_id
        );
        return await db.LaundaryOrder.create({
            propertyId: property_id,
            createdBy,
            updatedBy
        }).then((order) => {
            let data = [];
            service.forEach(element => {
                data.push({
                    orderId: order.id,
                    providerId: provider_id,
                    serviceId: element.service_id,
                    quantity: parseInt(element.quantity),
                    totalServiceAmount: parseInt(element.total_service_amount),
                    remark: remark ? remark : null,
                    createdBy,
                    updatedBy
                })
            });
            return db.LaundaryRequest.bulkCreate(data).then((item) => {
                return item;
            }).catch((error) => {
                validationResponse(error?.message);
            });
        }).catch((error) => {
            validationResponse(error?.message);
        });
    } catch (error) {
        validationResponse(error?.message);
    }
}

const update = async (
    id,
    property_id,
    service_id,
    provider_id,
    quantity,
    total_service_amount,
    remark,
    createdBy,
    updatedBy
) => {
    await db.LaundaryRequest.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Laundary request not found");
        } else {
            if (data.status != 'out') {
                validationResponse("Unauthorized");
            }
            if (data.receivedAt) {
                validationResponse("Unauthorized");
            }
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    await validateUpdate(
        property_id,
        service_id,
        provider_id,
        quantity,
        total_service_amount
    );
    return await db.LaundaryRequest.update({
        serviceId: service_id,
        providerId: provider_id,
        quantity: parseInt(quantity),
        totalServiceAmount: parseInt(total_service_amount),
        remark: remark ? remark : null,
        createdBy,
        updatedBy
    }, {where: { id: id }}).then((request) => {
        return request;
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const changeStatus = async (
    id,
    remark,
    updated_by,
    in_qty
) => {
    let laundaryData = null;
    await db.LaundaryRequest.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Laundary request not found");
        } else {
            if (data.status == 'in') {
                validationResponse("Laundary request already acknowledged");
            }
            laundaryData = data;
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.LaundaryRequest.update({
        status: "in",
        receivedAt: new Date(),
        remark: remark ? remark : laundaryData?.remark,
        updatedBy: updated_by,
        inQty: in_qty
    }, { where: { id: id } });
}

const destroy = async (
    id
) => {
    await db.LaundaryRequest.findOne({ where: { id: id } }).then( async (data) => {
        if (!data) {
            validationResponse("Laundary request not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.LaundaryRequest.destroy({ where: { id: id } });
}

const validateCreate = async (property_id, provider_id) => {
    try {
        const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
        if (!property) {
            validationResponse("Invalid property_id");
        }
        const laundaryProvider = await db.LaundaryProvider.findOne({ where: { id: provider_id } });
        if (!laundaryProvider) {
            validationResponse("Invalid provider_id");
        }
    } catch (error) {
        validationResponse(error.message);
    }
}

const validateUpdate = async (property_id, service_id, provider_id, quantity, total_service_amount) => {
    try {
        const property = await db.PropertyMaster.findOne({ where: { id: property_id } });
        if (!property) {
            validationResponse("Invalid property_id");
        }
        const laundaryService = await db.LaundaryService.findOne({ where: { id: service_id } });
        if (!laundaryService) {
            validationResponse("Invalid service_id");
        } else {
            const totalAmount = parseInt(quantity) * parseInt(laundaryService.price);
            if (totalAmount != parseInt(total_service_amount)) {
                validationResponse("Invalid total_service_amount");
            }
        }
        const laundaryProvider = await db.LaundaryProvider.findOne({ where: { id: provider_id } });
        if (!laundaryProvider) {
            validationResponse("Invalid provider_id");
        }
    } catch (error) {
        validationResponse(error.message);
    }
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, create, update, changeStatus, destroy }
