import { db } from "../../../../models";

const get = async (id) => {
    return await db.Tax.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Tax not found");
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
    await db.Tax.findOne({ where: { id: id } }).then((data) => {
        if (!data) {
            validationResponse("Tax not found");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.Tax.update({
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
