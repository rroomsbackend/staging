export default (sequelize, DataTypes) => {
    const PropertyMaster = sequelize.define('PropertyMaster', {
        propertyCode: DataTypes.STRING,
        propertyCategoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'PropertyCategories',
                key: 'id'
            },
            field: 'propertyCategoryId'
        },
        name: DataTypes.STRING,
        gstNumber: DataTypes.STRING,
        tanNumber: DataTypes.STRING,
        propertyDescription: DataTypes.TEXT,
        longitude: DataTypes.DECIMAL(7, 7),
        latitude: DataTypes.DECIMAL(7, 7),
        address: DataTypes.STRING(1200),
        countryId: DataTypes.STRING,
        stateId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'states',
                key: 'id'
            },
            field: 'stateId'
        },
        cityId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'cities',
                key: 'id'
            },
            field: 'cityId'
        },
        pincode: DataTypes.INTEGER,
        bookingPolicy: DataTypes.TEXT,
        ownerFirstName: DataTypes.STRING,
        ownerLastName: DataTypes.STRING,
        ownerMobile: DataTypes.STRING,
        ownerEmail: DataTypes.STRING,
        ownerPan: DataTypes.STRING,
        ownerAdhar: DataTypes.STRING,
        partialPayment: DataTypes.INTEGER,
        partialPaymentPercentage: DataTypes.STRING,
        partialAmount: DataTypes.FLOAT,
        bookingAmount: DataTypes.FLOAT,
        status: DataTypes.INTEGER,
        noOfRooms: DataTypes.INTEGER(4),
        remarks: DataTypes.TEXT,
        approved: DataTypes.INTEGER,
        ownerpanCertificate: DataTypes.STRING,
        owneradharCertificate: DataTypes.STRING,
        PropertyPanCertificate: DataTypes.STRING,
        PropertyPanNumber: DataTypes.STRING,
        gstCertificate: DataTypes.STRING,
        tanCertificate: DataTypes.STRING,
        rentAgreement: DataTypes.STRING,
        cancelCheque: DataTypes.STRING,
        landmark: DataTypes.STRING,
        propertyMobileNumber: DataTypes.STRING,
        propertyEmailId: DataTypes.STRING,
        firmType: DataTypes.STRING,
        bankDetails: DataTypes.STRING,
        locaidAccept: DataTypes.INTEGER,
        coupleFriendly: DataTypes.INTEGER,
        locality: DataTypes.STRING,
        travellerChoice: DataTypes.STRING,
        legalName: DataTypes.STRING,
        profileImageID: DataTypes.INTEGER,
        payAtHotel: DataTypes.INTEGER(2),
        remarkForCancellation: DataTypes.STRING, // added on 08-05-2025 by discussing umesh sir
        approvedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        }, // added on 08-05-2025 by discussing umesh sir
        onboardedRooms: DataTypes.INTEGER, // added on 13-05-2025 by discussing umesh sir
        propertyLiveAt: DataTypes.STRING, // added on 19-06-2025 by discussing umesh sir
        roomsCommission: DataTypes.INTEGER, // added on 13-05-2025 by discussing umesh sir
        roomSize: DataTypes.STRING, // added on 13-05-2025 by discussing umesh sir
        hub: DataTypes.INTEGER, // added on 13-05-2025 by discussing umesh sir
        zone: DataTypes.STRING(100), // added on 13-05-2025 by discussing umesh sir
        place_id: DataTypes.STRING, // // added on 15-05-2025 by discussing umesh and vijay
        reSubmitted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 15-05-2025 by discussing umesh
        haveBanquateLawan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 13-05-2025 by discussing umesh sir
        haveRestaurent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 13-05-2025 by discussing umesh sir
        haveBar: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 13-05-2025 by discussing umesh sir
        allowHourly: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 04-06-2025 by discussing umesh sir
        havelawn: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 04-06-2025 by discussing umesh sir
        haveRoofTop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 13-05-2025 by discussing umesh sir
        haveConferenceRoom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 13-05-2025 by discussing umesh sir
        createdBy: DataTypes.INTEGER,
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        onboarded_date: DataTypes.STRING,
        agreementEndDate: DataTypes.STRING, // // added on 27-05-2025 by discussing umesh
        agreement: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        }, // added on 27-05-2025 by discussing umesh
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        paranoid: true
    });

    // Add the afterCreate and afterUpdate hooks
    PropertyMaster.afterCreate(async (property, options) => {
        const { PropertyMasterLog } = sequelize.models;
        await PropertyMasterLog.create({
            propertyId: property.id,
            action: 'create',
            dataSnapshot: property.toJSON(),
            createdBy: property.createdBy || null
        });
    });

    PropertyMaster.afterUpdate(async (property, options) => {
        const { PropertyMasterLog, RroomsUser } = sequelize.models;
        const changedFields = property.changed();
        const logs = [];

        if (changedFields.length === 0) {
            console.log("No fields were changed, skipping log creation.");
            return;
        }
        let addedCustomLog = false;

        // Conditional log for approval
        if (property.approvedBy && property.approved == 1 && property.previous('approved') != 1) {
            const approver = await RroomsUser.findOne({ where: { id: property.approvedBy } });
            if (approver) {
                logs.push({
                    propertyId: property.id,
                    action: 'update',
                    dataSnapshot: property.toJSON(),
                    updatedBy: property.updatedBy || null,
                    remark: `Property approved by ${approver.firstName} ${approver.lastName} (ID: ${approver.id})`
                });
                addedCustomLog = true;
            }
        }

        if (property.approved == 2 && !!property.remarkForCancellation && !!property.updatedBy) {
            const updater = await RroomsUser.findOne({ where: { id: property.updatedBy } });
            if (updater) {
                logs.push({
                    propertyId: property.id,
                    action: 'update',
                    dataSnapshot: property.toJSON(),
                    updatedBy: property.updatedBy,
                    remark: `Property rejected by ${updater.firstName} ${updater.lastName} (ID: ${updater.id})`
                });
                addedCustomLog = true;
            }
        }

        if (addedCustomLog == false) {
            logs.push({
                propertyId: property.id,
                action: 'update',
                dataSnapshot: property.toJSON(),
                updatedBy: property.updatedBy || null
            });
        }
        // Write all log entries to the PropertyMasterLog table
        try {
            await Promise.all(logs.map(log => PropertyMasterLog.create(log)));
        } catch (error) {
            console.error("Error while creating PropertyMasterLog:", error); // Error handling
        }
    });

    PropertyMaster.addScope('distance', (latitude, longitude, distance, unit = "km") => {
        const constant = unit == "km" ? 6371 : 3959;
        const haversine = `(
            ${constant} * acos(
                cos(radians(${latitude}))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians(${longitude}))
                + sin(radians(${latitude})) * sin(radians(latitude))
            )
        )`;
        return {
            attributes: [
                "id",
                "name",
                "propertyCode",
                "propertyCategoryId",
                "gstNumber",
                "tanNumber",
                "propertyDescription",
                "longitude",
                "latitude",
                "address",
                "countryId",
                "stateId",
                "cityId",
                "pincode",
                "bookingPolicy",
                "ownerFirstName",
                "ownerLastName",
                "ownerMobile",
                "ownerEmail",
                "ownerPan",
                "ownerAdhar",
                "partialPayment",
                "partialPaymentPercentage",
                "partialAmount",
                "bookingAmount",
                "status",
                "noOfRooms",
                //"remarks",
                "approved",
                "ownerpanCertificate",
                "owneradharCertificate",
                "PropertyPanCertificate",
                "PropertyPanNumber",
                "gstCertificate",
                "tanCertificate",
                "rentAgreement",
                "cancelCheque",
                "landmark",
                "propertyMobileNumber",
                "propertyEmailId",
                "firmType",
                "bankDetails",
                "locaidAccept",
                "coupleFriendly",
                "locality",
                "legalName",
                "profileImageID",
                "travellerChoice",
                "createdAt",
                "updatedAt",
                "payAtHotel",
                [sequelize.literal(haversine), 'distance'],
            ],
            order: [sequelize.literal('distance asc')],
            limit: 30,
            having: sequelize.literal(`distance <= ${distance}`)
        }
    })

    PropertyMaster.associate = function (models) {
        PropertyMaster.hasMany(models.PropertyImage, { foreignKey: 'propertyId' });
        PropertyMaster.hasOne(models.PropertyUser, { foreignKey: 'propertyId' });
        PropertyMaster.belongsTo(models.cities, { foreignKey: 'cityId' });
        PropertyMaster.belongsTo(models.Hub, { foreignKey: 'hub' });
        PropertyMaster.belongsTo(models.RroomsUser, { foreignKey: 'createdBy', as: 'creator' });
        PropertyMaster.belongsTo(models.RroomsUser, { foreignKey: 'approvedBy', as: 'approver' });
        PropertyMaster.belongsTo(models.RroomsUser, { as: 'updater', foreignKey: 'updatedBy' });
        // PropertyMaster.belongsTo(models.cities, { foreignKey: 'cityId', as: 'City' });
        PropertyMaster.belongsTo(models.states, { foreignKey: 'stateId' });
        PropertyMaster.hasMany(models.PropertyAmenities, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.Rooms, { foreignKey: 'propertyId' });
        PropertyMaster.hasOne(models.BookingHotel, { foreignKey: 'propertyId' });
        PropertyMaster.hasOne(models.Payment, { foreignKey: 'propertyId' });
        PropertyMaster.hasOne(models.InventoryInStocks, { foreignKey: 'propertyId' });
        // PropertyMaster.belongsTo(models.PropertyCategory, { foreignKey: 'propertyCategoryId' });
        PropertyMaster.belongsTo(models.PropertyCategory, {
            foreignKey: 'propertyCategoryId',
            as: 'PropertyCategory'
        });
        PropertyMaster.hasMany(models.Rating, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.Coupon, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.UserProperty, { foreignKey: 'propertyId' });
        PropertyMaster.hasOne(models.RRoomsCommission, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.PropertyInvoice, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.DailyExpense, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.RestaurantFoodOrderPayment, { foreignKey: 'propertyId' });
        PropertyMaster.hasMany(models.BanquetEnquiry, { foreignKey: 'propertyId' });
    };
    return PropertyMaster;
};
