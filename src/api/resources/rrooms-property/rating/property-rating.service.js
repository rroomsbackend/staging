import { db } from "../../../../models";

const list = async (
    property_id,
    bookingCode
) => {
    const where = {}
    if(bookingCode){
        where['bookingCode'] = bookingCode
    }

    if(property_id){
        where['propertyId'] = property_id
    }

    where['deletedAt'] = null

    // const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    // if (!property) {
    //     validationResponse("Invalid property_id");
    // }
    const ratingSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        where: [
            where
        ],
        include: [
            {
                attributes: ['id', 'name'],
                model: db.User,
                required: false
            }
        ]
    }
    const selector = Object.assign({}, ratingSelection);
    const ratings = await db.Rating.findAll(selector);
    if (ratings.length) {
        const allRatings = ratings.map(rating => rating['rating']);
        const averageRatings = average(allRatings);
        ratings.averageRatings = averageRatings;
    }
    return ratings;
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

const create = async (
    user_id,
    property_id,
    ratings,
    reviews,
    status,
    bookingCode,
    fromDate,
    toDate
) => {
    await validateCreate(user_id, property_id);
    return await db.Rating.create({
        userId: user_id,
        propertyId: property_id,
        rating: ratings,
        review: reviews,
        status: status,
        bookingCode: bookingCode,
        fromDate: fromDate,
        toDate: toDate
    });
}

const update = async (
    id,
    user_id,
    property_id,
    ratings,
    reviews,
    status,
    bookingCode,
    fromDate,
    toDate
) => {
    await db.Rating.findOne({where: { id: id }}).then((data) => {
        if (!data) {
            validationResponse("Rating not found");
        }
        if (data.userId != user_id) {
            validationResponse("Invalid user_id");
        }
        if (data.propertyId != property_id) {
            validationResponse("Invalid property_id");
        }
    }).catch((error) => {
        validationResponse(error?.message);
    });
    return await db.Rating.update({
        userId: user_id,
        propertyId: property_id,
        rating: ratings,
        review: reviews,
        status: status,
        bookingCode: bookingCode,
        fromDate: fromDate,
        toDate: toDate
    }, { where: { id: id, userId: user_id, propertyId: property_id } });
}

const validateCreate = async (
    user_id,
    property_id
) => {
    const user = await db.User.findOne({where : { id: user_id }})
    if (!user) {
        validationResponse("Invalid user_id");
    }
    const property = await db.PropertyMaster.findOne({where: { id: property_id }});
    if (!property) {
        validationResponse("Invalid property_id");
    }
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { list, create, update }
