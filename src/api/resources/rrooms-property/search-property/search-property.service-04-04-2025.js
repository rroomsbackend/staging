import { db } from "../../../../models";
import sequelize from 'sequelize';
const Op = sequelize.Op;

const get = async (
    query,
    property_type,
    amenities,
    room_type,
    ratings,
    order_by,
    order_direction,
    price_range,
    traveller_choice,
    pin_code,
    // city_id,
    locality,
    cityId,
    long,
    lat,
    page = 1,
    limit = 10
) => {
    const offset = (page - 1) * limit;
    const propertyAttribute = [
        "id",
        "name",
        "propertyCode",
        "propertyCategoryId",
        "address",
        "partialPayment",
        "partialPaymentPercentage",
        "partialAmount",
        "bookingAmount",
        "status",
        "noOfRooms",
        "approved",
        "landmark",
        "locaidAccept",
        "coupleFriendly",
        "locality",
        "profileImageID",
        "cityId",
        "pincode",
        "travellerChoice"]

    // const propertyType = { model: db.PropertyCategory, attributes: ['id', 'name'], required: false };
    const propertyType = { model: db.PropertyCategory, as: 'PropertyCategory', attributes: ['id', 'name'], required: false };

    const ratingModel = {
        attributes: ['id', 'rating', 'review'],
        model: db.Rating,
        required: false
    };

    const couponModel = {
        attributes: ['id', 'title', 'code', 'amount'],
        model: db.Coupon,
        required: false
    };

    const propertyImage = {
        attributes: ['id', 'image'],
        model: db.PropertyImage,
        required: false
    };

    const amenitiesModel = {
        attributes: ['id', 'propertyAmenitiesId'],
        model: db.PropertyAmenities,
        required: false,
        include: [
            {
                attributes: ['id', 'name', 'icon', 'micon'],
                model: db.Amenities,
                required: false
            }
        ]
    };

    const roomsModel = {
        attributes: ['id', 'categoryId', 'regularPrice', 'offerPrice', 'roomDescription'],
        model: db.Rooms,
        required: false,
        include: [
            // {
            //     attributes: ['id', 'roomId', 'imageName', 'status'],
            //     model: db.RoomImages,
            //     required: false
            // },
            // {
            //     attributes: ['id', 'roomId', 'amenitiesId', 'status'],
            //     model: db.RoomAmenities,
            //     required: false
            // },
            // {
            //     attributes: ['id', 'roomId', 'categoryId', 'floorNumber', 'roomNumber', 'status'],
            //     model: db.RoomDetails,
            //     required: false
            // }
        ]
    };

    const propertyCity = {
        attributes: ['id', 'name'],
        model: db.cities,
        required: false
    };

    const propertyState = {
        attributes: ['id', 'name'],
        model: db.states,
        required: false
    };

    const propertySelection = {
        include: [
            propertyType,
            //couponModel,
            propertyImage
        ],
        where: [{ approved: 1 }],
        limit: parseInt(limit),
        offset: parseInt(offset)
    }

    let filter = {};

    const latitude = lat ? Number(lat) : 0;
    const longitude = long ? Number(long) : 0;
    const distance = 10;
    const getLocality = query?.split(',')[0] || query;
    if (query && !latitude && !longitude) {
        const citiesIds = await db.cities.findAll({ attributes: ["id"], where: [{ name: { [Op.like]: `${query}%` } }] }).map(u => u.get("id"));
        const localitiesPinCode = await db.Locality.findAll({ attributes: ["pin_code"], where: [{ name: { [Op.like]: `${getLocality}%` } }] }).map(u => u.get("pin_code"));
        console.log("localitiesPinCode - ", localitiesPinCode);

        //const statesIds =  await db.states.findAll({attributes: ["id"], where: [{name: {[Op.like]: `%${query}%`}}]}).map(u => u.get("id"));
        filter = searchFilter(query, localitiesPinCode, citiesIds, []);
        if (query?.city) {
            filter['cityId'] = parseInt(query?.city)
        }
        if (query?.stateId) {
            filter['stateId'] = parseInt(query?.stateId)
        }
        propertySelection.where = [filter, { approved: 1 }]
    } else {
        propertySelection.where = [filter, { approved: 1 }]
    }
    if (property_type) {
        const propertyTypeArray = property_type?.split(",").map(Number) || [];
        filter['propertyCategoryId'] = { [Op.in]: propertyTypeArray }
        propertySelection.where = [filter]
    }
    if (traveller_choice) {
        const id = traveller_choice?.split(',')[0];
        if (id && id > 0) {
            filter['travellerChoice'] = { [Op.like]: `%${id?.toString()}%` }
            propertySelection.where = [filter]
        }
    }
    if (pin_code) {
        filter['pincode'] = pin_code
        propertySelection.where = [filter]
        //propertySelection.where = [filter, {pincode: pin_code }]
    }
    if (cityId) {
        filter['cityId'] = cityId,
            propertySelection.where = [filter]
        //propertySelection.where = [filter, {cityId: city_id }]
    }
    if (!propertySelection.include) {
        propertySelection.include = [];
    }
    if (amenities) {
        const amenitiesArray = amenities?.split(",") || [];
        if (amenitiesArray.length) {
            amenitiesModel.required = true;
            amenitiesModel.where = [{ propertyAmenitiesId: { in: amenitiesArray } }];
            propertySelection.include.push(amenitiesModel);
        }
    }
    // else {
    //     propertySelection.include.push(amenitiesModel);
    // }
    if (room_type) {
        const roomTypeArray = room_type?.split(",") || [];
        if (roomTypeArray.length) {
            roomsModel.required = true;
            roomsModel.where = [{ categoryId: { [Op.in]: roomTypeArray } }];
            propertySelection.include.push(roomsModel);
        }
    } else {
        propertySelection.include.push(roomsModel);
    }
    if (ratings) {
        const ratingArray = ratings?.split(",") || [];
        if (ratingArray.length) {
            ratingModel.required = true;
            ratingModel.where = [{ rating: { in: ratingArray } }];
            propertySelection.include.push(ratingModel);
        }
    } else {
        propertySelection.include.push(ratingModel);
    }
    if (order_by == 'price' && order_direction) {
        propertySelection.order = [[db.Rooms, 'regularPrice', order_direction]]
    }
    if (order_by == 'rating' && order_direction) {
        propertySelection.order = [[db.Rating, 'rating', order_direction]]
    }
    if (price_range) {
        const price_regex = /^[0-9]*-?[0-9]*$/;
        if (!price_regex.test(price_range)) {
            validationResponse("Invalid price_range format. e.g: '0-0'");
        }
        const price = price_range?.split("-").map(function (x) {
            return parseInt(x, 10);
        }) || [0, 0];
        roomsModel.required = true;
        const roomModalWhere = roomsModel.where ? roomsModel.where : [];
        roomsModel.where = [...roomModalWhere, {
            regularPrice: {
                $between: price
            }
        }];
    }

    // if (latitude && longitude) {
    //     const selector = Object.assign({}, propertySelection);
    //     return await db.PropertyMaster.scope({
    //         method: ['distance', latitude, longitude, distance]
    //     }).findAll(selector);
    // } else {
    //     propertySelection['attributes'] = propertyAttribute
    //     const selector = Object.assign({}, propertySelection);
    //     return await db.PropertyMaster.findAll(selector);
    // }

    let result;
    if (latitude && longitude) {
        const selector = Object.assign({}, propertySelection);
        result = await db.PropertyMaster.scope({
            method: ['distance', latitude, longitude, distance]
        }).findAll(selector);
    } if (locality) {
        const getlocality = locality?.split(',')[0] || locality;
        console.log("getLocality - ", getlocality);

        propertySelection.where = {
            locality: {
                [Op.like]: `%${getlocality}%`
            }
        }
        const selector = Object.assign({}, propertySelection);
        result = await db.PropertyMaster.findAll(selector);
    } else {
        propertySelection['attributes'] = propertyAttribute;
        console.log(JSON.stringify(propertySelection, null, 2));

        const selector = Object.assign({}, propertySelection);
        result = await db.PropertyMaster.findAll(selector);
    }
    const getHotelIDs = result.map((hotel) => hotel.id);
    const getHotelAminties = await db.PropertyAmenities.findAll({
        where: {
            propertyId: {
                [Op.in]: getHotelIDs
            }
        },
        attributes: ['id', 'propertyId', 'propertyAmenitiesId'],
        include: [
            {
                model: db.Amenities,
                attributes: ['id', 'name', 'icon', 'micon'],
                required: false
            }
        ]
    });

    return result.map((item, index) => {
        const plainItem = item.toJSON();
        const hotelAminties = getHotelAminties.filter((aminty) => { return aminty.propertyId == plainItem.id });
        plainItem.PropertyAmenities = hotelAminties.length > 0 ? hotelAminties : [];
        return plainItem;
    });

    // result.map((item, index) => {console.log("Hotel ID - " + item.id + " - Aminities - " + item.PropertyAmenities.length)});
    // result.forEach((property) => {
    //     if (property.PropertyAmenities.length > 3) {
    //         property.PropertyAmenities = property.PropertyAmenities.slice(0, 3);
    //     }
    // });
    // result.forEach((property) => {
    //     if (property.Ratings.length > 0) {
    //         const sum = property.Ratings.reduce((acc, rating) => acc + rating.rating, 0);
    //         const averageRating = sum / property.Ratings.length;
    //         property.averageRating = averageRating;
    //         delete property.Ratings;
    //     }
    // });
    // return result;
    // return result.map((property) => ({
    //     id: property.id,
    //     name: property.name,
    //     propertyCode: property.propertyCode,
    //     propertyCategoryId: property.propertyCategoryId,
    //     address: property.address,
    //     partialPayment: property.partialPayment,
    //     partialPaymentPercentage: property.partialPaymentPercentage,
    //     partialAmount: property.partialAmount,
    //     bookingAmount: property.bookingAmount,
    //     PropertyCategory: property.PropertyCategory,
    //     status: property.status,
    //     noOfRooms: property.noOfRooms,
    //     approved: property.approved,
    //     landmark: property.landmark,
    //     PropertyImages: property.PropertyImages,
    //     Rooms: property.Rooms,
    //     locaidAccept: property.locaidAccept,
    //     coupleFriendly: property.coupleFriendly,
    //     locality: property.locality,
    //     profileImageID: property.profileImageID,
    //     cityId: property.cityId,
    //     pincode: property.pincode,
    //     travellerChoice: property.travellerChoice,
    //     PropertyAmenities: property.PropertyAmenities,
    //     dRatings: property.averageRating,
    // }));
}

const getSuggestion = async (
    query,
) => {
    const propertyLocality = {
        attributes: ['id', 'name', 'pinCode'],
        model: db.Locality,
        required: false
    };

    const localityCity = {
        attributes: ['id', 'name'],
        model: db.cities,
        required: false
    };

    const propertyCity = {
        attributes: ['id', 'name'],
        model: db.cities,
        required: false
    };

    const propertyState = {
        attributes: ['id', 'name'],
        model: db.states,
        required: false
    };

    const propertySelection = {
        attributes: [
            'id',
            //'propertyCode',
            'name',
            'cityId',
            // 'city_id',
            //'address',
            'locality',
            'stateId',
            'pincode',
            //'landmark'
        ],
        include: [
            propertyCity,
            //propertyState
        ],
        limit: 20
    }
    let filter = {};
    if (query) {
        const cities = await db.cities.findAll({ attributes: ['id', 'name'], where: [{ name: { [Op.like]: `%${query}%` } }], limit: 4 })
        let localitites = null;
        if (cities && cities.length > 0) {
            const selectedCityId = JSON.parse(JSON.stringify(cities))[0]?.id
            // localitites = await db.Locality.findAll({ attributes: ['id', 'name', 'pinCode'], where: [{ cityId: selectedCityId }], order: [['name', 'asc']] })
            localitites = await db.Locality.findAll({ attributes: ['id', 'name', 'pin_code'], where: [{ city_id: selectedCityId }], order: [['name', 'asc']] })
            // console.log("localitites if- ", JSON.parse(JSON.stringify(localitites)));
        } else {
            let getLocality = query?.split(',')[0] || query
            // localitites = await db.Locality.findAll({ attributes: ['id', 'name', 'pinCode'], where: [{ name: { [Op.like]: `%${query}%` } }], order: [['name', 'asc']], include: [localityCity] })
            localitites = await db.Locality.findAll({ attributes: ['id', 'name', 'pin_code'], where: [{ name: { [Op.like]: `%${getLocality}%` } }], order: [['name', 'asc']], include: [localityCity] })
            // console.log("localitites else- ", JSON.parse(JSON.stringify(localitites)));
        }

        if (localitites && localitites.length > 0 || cities && cities.length > 0) {
            // const cityParse = cities ? JSON.parse(JSON.stringify(cities)).map(obj => { obj['type'] = 'CITY'; obj['pinCode'] = ''; return obj; }) : []
            const cityParse = cities ? JSON.parse(JSON.stringify(cities)).map(obj => { obj['type'] = 'CITY'; return obj; }) : []
            // console.log("cityParse if- ", JSON.parse(JSON.stringify(cityParse)));
            let localitParse = localitites ? JSON.parse(JSON.stringify(localitites)).map(obj => { obj['type'] = 'LOCALITY'; return obj; }) : []
            // console.log("localitParse if- ", JSON.parse(JSON.stringify(localitParse)));
            if (localitParse.length > 0 && cityParse.length == 0) {
                localitParse = localitParse?.map(obj => {
                    obj['name'] = obj['name'] + ', ' + obj?.city?.name;
                    return obj;
                })
            }
            const result = [...cityParse, ...localitParse]
            return result;
        } else {
            filter = searchFilter(query, [], [], []);
            filter['status'] = { [Op.not]: 0 };
            propertySelection.where = [filter, { approved: 1 }]
        }
    } else {
        filter['status'] = { [Op.not]: 0 };
        propertySelection.where = [filter, { approved: 1 }]
    }
    const selector = Object.assign({}, propertySelection);
    const result = await db.PropertyMaster.findAll(selector);
    let resultData = JSON.parse(JSON.stringify(result))
    if (resultData && resultData?.length > 0) {
        resultData = resultData?.map(obj => {
            obj['name'] = obj['name'] + ', ' + obj?.city?.name;
            obj['type'] = "PROPERTY"
            return obj;
        })
    }
    return resultData;
}

const logSearch = async (request) => {
    return await db.PropertySearchLog.create({
        request: request
    });
}

// add pagination to getSearchLogs start
const getSearchLogs = async (page, limit) => {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    const searchLogSelection = {
        order: [
            ['id', 'DESC'],
            ['updatedAt', 'DESC']
        ],
        where: [
            { deletedAt: null }
        ],
        limit: limitNumber,  // Set limit for pagination
        offset: offset       // Set offset for pagination
    }
    const selector = Object.assign({}, searchLogSelection);
    let searchLogs = await db.PropertySearchLog.findAll(selector);
    if (searchLogs.length) {
        searchLogs = searchLogs?.filter(log => {
            if (Object.keys(JSON.parse(log.request)).length) {
                return true;
            }
            return false;
        });
    }
    return searchLogs;
}
// add pagination to getSearchLogs end

const searchFilter = (query, localitites = [], citiesIds = [], statesIds = []) => {
    let fields = [
        /*{
            propertyCode: {
                [Op.like]: `%${query}%`
            }
        },
        {
            name: {
                [Op.like]: `%${query}%`
            }
        },
        {
            address: {
                [Op.like]: `%${query}%`
            }
        },
        {
            landmark: {
                [Op.like]: `%${query}%`
            }
        },
        {
            pincode: {
                [Op.like]: `%${query}%`
            }
        }*/
    ];

    if (localitites && localitites.length > 0) {
        fields.push({
            pincode: {
                [Op.in]: localitites
            }
        })
    }

    if (citiesIds && citiesIds.length > 0) {
        fields.push({
            cityId: {
                [Op.in]: citiesIds
            }
        })
    }

    if (statesIds && statesIds.length > 0) {
        fields.push({
            stateId: {
                [Op.in]: statesIds
            }
        })
    }

    if (localitites.length == 0 && citiesIds.length == 0) {
        fields = [
            {
                name: {
                    [Op.like]: `%${query}%`
                }
            }
            /*{
                address: {
                    [Op.like]: `%${query}%`
                }
            },
            {
                landmark: {
                    [Op.like]: `%${query}%`
                }
            },
            {
                pincode: {
                    [Op.like]: `%${query}%`
                }
            },
            {
                propertyCode: {
                    [Op.like]: `%${query}%`
                }
            }*/
        ];
    }

    const filter = { [Op.or]: fields }
    return filter;
}

const validationResponse = (msg = "") => {
    const error = new Error(msg);
    error.code = 422;
    throw error;
}

export default { get, getSuggestion, logSearch, getSearchLogs }
