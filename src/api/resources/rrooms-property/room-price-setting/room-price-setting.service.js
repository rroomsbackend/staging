import { db } from "../../../../models";

const get = async (id) => {
    return await db.RoomPriceSetting.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Room price setting not found");
        }
        return data;
    }).catch((error) => {
        validationResponse(error?.message);
    });
}

const update = async (
    id,
    title,
    amount
) => {
    await db.RoomPriceSetting.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Room price setting not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.RoomPriceSetting.update({
        title: title,
        amount: amount
    }, { where: { id: id } });
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { get, update }
