import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../../../models';
const { Op } = require('sequelize');
// import bcrypt from 'bcrypt-nodejs';
import mailer from '../../../mailer';
import config from '../../../config';
import sequelize from 'sequelize';
import multer from 'multer';
import { sendVerificationCode, sendAppUrl, sendOTPToUpdatePassword } from '../sendOtp/sendOtpApis';
import { generateToken } from '../../../middleware/Authentication'
import { sendWelcomeEmail, sendNewRRoomsUser, sendNewPropertyUser, sendContractAcceptanceProperty, sendContractAcceptanceRrooms } from '../../../config/smpt'
import admin from '../../../firebase-admin-config'

var JWTSign = function (user, date) {
    return JWT.sign({
        iss: config.app.name,
        sub: user.id,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, config.app.secret);
}

var makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var image = "";

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __basedir + "/uploads/");
    },
    filename: function (req, file, callback) {
        const fileType = file.originalname.split(".");
        const fileName = fileType[0] + '-' + Date.now() + "." + fileType[1];
        image = fileName;
        callback(null, fileName);
    }
})

const upload = multer({
    storage: storage
}).fields([
    { name: "profileImage", maxCount: 1 }
]);

export default {
    async userCheck(req, res) {
        const { mobile } = req.body;
        db.User.findOne({ where: { mobile: mobile } })
            .then(created => {
                if (created) {
                    return res.status(200).json({ name: created.name, mobile: created.mobile, status: 1, message: 'User exist' });

                }
                else {
                    return res.status(200).json({ status: 0, message: 'User not exist' });
                }
            }
            )
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    async otpGen(req, res, next) {
        var isNewUser = 1;
        const { mobile, referralCode, platform, hash_key } = req.body;
        const newPassword = mobile == '9793081102' || mobile == '9871579746' || mobile == '7007381144' ? 1234 : Math.floor(1000 + Math.random() * 9000);
        // const newPassword = mobile == '9793081102' || mobile == '9871579746' || mobile == '7007381144' ? 1234 : 1234;
        db.User.findOne({ where: { mobile: mobile } }).then(result => {
            if (result) {
                db.User.update({ otp: newPassword }, { where: { id: result.id } })
                    .then(updated => {
                        const response = JSON.stringify(result);
                        const resResult = JSON.parse(response);
                        delete resResult['otp'];
                        sendVerificationCode(mobile, newPassword, hash_key);
                        return res.status(200).json({ status: true, mobile: mobile, message: "OTP sent on mobile.", isNewUser: false, data: resResult });
                    })
                    .catch(err => {
                        return res.status(400).json({ status: false, message: err.message });
                    });
            } else {
                db.User.create({ otp: newPassword, mobile: mobile, useReferralCode: referralCode, platform: platform ? platform : 1 }).then(async user => {
                    const response = JSON.stringify(user);
                    const resResult = JSON.parse(response);
                    delete resResult['otp'];
                    sendVerificationCode(mobile, newPassword, hash_key);
                    //Update Referal Amount if referal code are coming..
                    if (platform == 2 || referralCode == true) {
                        //Create user wallet
                        const newUserAmount = parseInt(process.env.NEW_USER_REFERRAL_AMOUNT)
                        db.UserWallet.create({ amount: newUserAmount, balance: newUserAmount, userId: user.get('id'), transactionType: 1 });
                        //Update exist user wallet amount
                        const userDetails = await db.User.findOne({ where: { referralCode: referralCode } });
                        if (userDetails && referralCode) {
                            const referralAmount = parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT);
                            await db.UserWallet.findOne({ where: { userId: userDetails.get('id') }, order: [['id', 'DESC'], ['updatedAt', 'DESC']] }).then(async function (obj) {
                                db.UserWallet.create({ amount: referralAmount, balance: obj ? obj.get('balance') + referralAmount : referralAmount, userId: userDetails.get('id'), transactionType: 1 });
                            });
                        }
                    }
                    return res.status(200).json({ status: true, mobile: mobile, message: "User created and OTP sent on mobile", isNewUser: true, data: resResult });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            }
        });
    },

    async otpVerify(req, res, next) {
        const { mobile, otp, isNewUser, userId, userCode, referralCode, name, email, gst, company, address } = req.body;
        db.User.findOne({ where: { email: email } }).then(async (res) => {
            if (res == null) {
                //send mail to new user
                await sendWelcomeEmail(email, name);
            }
        })
        db.User.findOne({
            where: { mobile: mobile, otp: otp }
        }).then(async (user) => {
            if (user) {
                var date = new Date();
                req.user = user;
                var x = JWTSign(req.user, date);
                const token = generateToken(user)
                // console.log(token)
                res.cookie('XSRF-token', token, {
                    expire: new Date().setMinutes(date.getMinutes() + 30),
                    httpOnly: true, secure: config.app.secure
                });
                res.user = user.get('id');
                // let updatedReferralCode = ''
                // if (!user.get('name'))
                //     updatedReferralCode = name ? name?.split(' ')[0]?.toUpperCase() + user.get('referralCode')?.toUpperCase() : user.get('referralCode')?.toUpperCase();
                user.update({ name: name, email: email, otp: null, status: 1, gst: gst, company: company, address: address, lastLogged: sequelize.fn('NOW') });
                // sending mail to customer
                // await sendWelcomeEmail(email, name);
                if (referralCode) {
                    //Create user wallet
                    const newUserAmount = parseInt(process.env.NEW_USER_REFERRAL_AMOUNT)
                    db.UserWallet.create({ amount: newUserAmount, balance: newUserAmount, userId: user.get('id'), transactionType: 1 });
                    //Update exist user wallet amount
                    const userDetails = await db.User.findOne({ where: { referralCode: referralCode } });
                    if (userDetails) {
                        const referralAmount = parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT);
                        await db.UserWallet.findOne({ where: { userId: userDetails.get('id') }, order: [['id', 'DESC'], ['updatedAt', 'DESC']] }).then(function (obj) {
                            db.UserWallet.create({ amount: referralAmount, balance: obj ? obj.get('balance') + referralAmount : referralAmount, userId: userDetails.get('id'), transactionType: 1 });
                        });
                    }
                }
                //Updating Referal Code
                // if (updatedReferralCode)
                //     await user.update({ referralCode: updatedReferralCode })
                // Generate and update a unique referral code if not already present
                if (!user.get('referralCode')) {
                    let isUnique = false;
                    let generatedReferralCode = '';
                    while (!isUnique) {
                        generatedReferralCode = (name ? name.split(' ')[0] : 'USER').toUpperCase() +
                            Math.floor(1000 + Math.random() * 9000);
                        const existing = await db.User.findOne({ where: { referralCode: generatedReferralCode } });
                        if (!existing) isUnique = true;
                    }
                    await user.update({ referralCode: generatedReferralCode });
                }
                return res.status(200).json({ success: true, message: "OTP verified successfully", token: token, data: user });
            } else {
                return res.status(400).json({ success: false, message: 'Wrong OTP!' });
            }
        }).catch(error => {
            return res.status(400).json({ success: false, message: error.message });
        });
    },

    async updateUser(req, res, next) {
        upload(req, res, async function (err) {
            const { id } = req.params;
            const { name, email, userCode, referralCode, gst, company, address } = req.body;
            const data = {}
            if (name) {
                data['name'] = name;
            }
            if (email) {
                data['email'] = email;
            }
            if (image) {
                data['profileImage'] = image;
                image = "";
            }
            if (userCode) {
                data['userCode'] = userCode;
            }
            if (referralCode) {
                data['referralCode'] = referralCode;
            }
            if (gst) {
                data['gst'] = gst;
            }
            if (company) {
                data['company'] = company;
            }
            if (address) {
                data['address'] = address;
            }
            db.User.update(data, { where: { id: id } })
                .then(async updated => {
                    if (referralCode) {
                        try {
                            //Create user wallet
                            const user = await db.User.findOne({ where: { id: id } });
                            const newUserAmount = parseInt(process.env.NEW_USER_REFERRAL_AMOUNT);
                            await db.UserWallet.create({
                                amount: newUserAmount,
                                balance: newUserAmount,
                                userId: user.get('id'),
                                transactionType: 1
                            });
                            //Update exist user wallet amount
                            const userDetails = await db.User.findOne({ where: { referralCode: referralCode } });
                            if (userDetails) {
                                const referralAmount = parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT);
                                const obj = await db.UserWallet.findOne({
                                    where: { userId: userDetails.get('id') },
                                    order: [['id', 'DESC'], ['updatedAt', 'DESC']]
                                });
                                await db.UserWallet.create({
                                    amount: referralAmount,
                                    balance: obj ? obj.get('balance') + referralAmount : referralAmount,
                                    userId: userDetails.get('id'),
                                    transactionType: 1
                                });
                            }
                        } catch (error) {
                            console.error("Referral handling error:", error.message);
                        }
                    }
                    if (updated[0] > 0) {
                        return res.status(200).json({ status: true, message: "User updated successfully" });
                    }
                    else
                        return res.status(200).json({ status: false, message: "User not update, due to missing some fields" });
                })
                .catch(err => {
                    return res.status(400).json({ status: false, 'message': err.message });
                });
        })
    },

    async userType(req, res, next) {
        const { role } = req.body;
        db.UserType.findOrCreate({ where: { role: role }, defaults: { role: role } })
            .then(created => {
                if (created[1]) {
                    return res.status(200).json({ status: "200", msg: "success", success: 0 });
                }
                else {
                    return res.status(200).json({ created });
                }
            })
            .catch(err => {
                if (err && err.name && err.name == 'PRAException') {
                    return res.status(500).json({ 'errors': [err.msg] });
                } else {
                    console.log(err);
                    return res.status(500).json({ 'errors': ['Error!!!'] });
                }
            });
    },

    async createCustomer(req, res, next) {
        const { userCode, name, email, mobile, } = req.body;
        db.Customer.findOrCreate({ where: { role: role }, defaults: { userCode: userCode, name: name, email: email, mobile: mobile } })
            .then(created => {
                if (created[1]) {
                    return res.status(200).json({ status: "200", msg: "success", success: 0 });
                }
                else {
                    return res.status(200).json({ created });
                }
            })
            .catch(err => {
                if (err && err.name && err.name == 'PRAException') {
                    return res.status(400).json({ status: false, message: err.message });
                } else {
                    console.log(err);
                    return res.status(400).json({ status: false, message: err.message });
                }
            });
    },

    async updateCustomerprofile(req, res, next) {
        const id = req.params.id
        const { name, email } = req.body;
        db.Customer.update({ name: name, email: email, profileImage: profileImage }, { where: { id: id } })
            .then(result => {
                return res.status(200).json({ status: true, message: "Profile updated successfully", data: result });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },

    // changes by vishwas on 25-01-2025 for ecryption of password - start
    async createRroomsUsers(req, res, next) {
        const { firstName, lastName, email, mobile, role, password, designation, createdBy } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.RroomsUser.findOne({ where: { email: email } }).then(result => {
            if (result) {
                return res.status(200).json({ status: false, message: "User already exist." });
            } else {
                db.RroomsUser.create({ firstName: firstName, lastName: lastName, email: email, mobile: mobile, role: role, designation: designation, password: hashedPassword, userCode: email, createdBy: createdBy }).then(async result => {
                    //const userCode = "R"+firstName.toUpperCase()+result.id.toString();
                    const count = parseInt(result.id);
                    let pad = '00000';
                    var ctxt = '' + count;
                    const userCode = 'RR' + (pad.substr(0, pad.length - ctxt.length) + count).toString();
                    await db.RroomsUser.update({ userCode: userCode }, {
                        where: { id: result.id }
                    });
                    const employeeName = firstName + ' ' + lastName;
                    res.status(200).json({ status: true, message: "User created successfully." });
                    setImmediate(async () => {
                        try {
                            await Promise.allSettled([
                                sendNewRRoomsUser(employeeName, userCode, email, designation, role, password)
                            ]);
                            console.log("All emails processed");
                        } catch (err) {
                            console.error("Error sending email:", err.message);
                        }
                    })
                    // return res.status(200).json({ status: true, message: "User created successfully." });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            }
        });
    },

    async updateRroomsUsers(req, res, next) {
        const { userCode, firstName, lastName, mobile, role, password, designation, updatedBy } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.RroomsUser.update({ userCode: userCode, firstName: firstName, lastName: lastName, mobile: mobile, role: role, designation: designation, password: hashedPassword, updatedBy: updatedBy }, { where: { id: req.params.id } })
            .then(updated => {
                if (updated[0] > 0)
                    return res.status(200).json({ status: true, message: "User updated successfully" });
                else
                    return res.status(200).json({ status: false, message: "User not update, due to missing some fields" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },
    // changes by vishwas on 25-01-2025 for ecryption of password - end

    async getRroomsUsers(req, res) {
        const RroomsUser = {
            include: [
                { model: db.Roles, required: false }
            ]
        }
        db.RroomsUser.findAll(RroomsUser)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }
            )
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    async getRroomsUsersById(req, res) {
        const id = req.params.id;
        const RroomsUser = {
            include: [
                { model: db.Roles, required: false }
            ],
            where: { id: id }
        }
        db.RroomsUser.findOne(RroomsUser)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    async deleteRroomsUsers(req, res) {
        db.RroomsUser.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true, message: "User deleted successfully" });
            else
                return res.status(200).json({ status: false, message: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    // changes by vishwas on 25-01-2025 for ecryption of password - start
    async createPropertyUsers(req, res, next) {
        const { firstName, lastName, propertyId, email, mobile, role, password, designation, agreement, status, createdBy, assigneProperty, assignedProperty } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.PropertyUser.findOne({ where: { email: email } }).then(result => {
            if (result) {
                return res.status(200).json({ status: false, message: "User already exist." });
            } else {
                db.PropertyUser.create({ firstName: firstName, lastName: lastName, propertyId: propertyId, email: email, mobile: mobile, role: role, designation: designation, password: hashedPassword, status: status, userCode: email, agreement: agreement, createdBy: createdBy }).then(async result => {
                    const count = parseInt(result.id);
                    let pad = '00000';
                    var ctxt = '' + count;
                    const userCode = 'PU' + firstName.trim().toUpperCase() + (pad.substr(0, pad.length - ctxt.length) + count).toString();
                    await db.PropertyUser.update({ userCode: userCode }, {
                        where: { id: result.id }
                    });
                    const property = await db.PropertyMaster.findOne({ where: { id: propertyId }, attributes: ['name'], raw: true })
                    let propertyName = property.name;
                    sendNewPropertyUser(propertyName, email, password, firstName, lastName, role, designation);
                    if (assigneProperty && assigneProperty.length > 0) {
                        const userProperty = [];
                        assigneProperty.forEach(element => {
                            userProperty.push({ propertyUserId: result.id, propertyId: element, status: 1, createdBy: createdBy });
                        });
                        await db.UserProperty.bulkCreate(userProperty);
                    } else if (assignedProperty && assignedProperty.length > 0) {
                        const userProperty = [];
                        assignedProperty.forEach(element => {
                            userProperty.push({ propertyUserId: result.id, propertyId: element, status: 1, createdBy: createdBy });
                        });
                        await db.UserProperty.bulkCreate(userProperty);
                    }
                    return res.status(200).json({ status: true, message: "User created successfully." });
                }).catch(err => {
                    return res.status(400).json({ status: false, message: err.message });
                });
            }
        });
    },

    async updatePropertyUsers(req, res, next) {
        const { userCode, firstName, lastName, propertyId, email, mobile, role, password, designation, status, agreement, updatedBy } = req.body;
        const { id } = req.params;
        // const hashedPassword = await bcrypt.hash(password, 10);
        // let updateData = { userCode, firstName, lastName, propertyId, email, mobile, role, password, designation, status, agreement, updatedBy }
        let updateData = { userCode, firstName, lastName, propertyId, email, mobile, role, password, designation, status, updatedBy }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (agreement) {
            if (!propertyId) return res.status(200).json({ status: true, message: "property id is missing!" });
            await db.PropertyMaster.update(
                { agreement: 1 },
                { where: { id: propertyId } }
            );
        }
        const getPropertyID = await db.PropertyUser.findOne({ where: { id: id }, attributes: ['propertyId'] });
        // const getPropertyDetail = await db.PropertyMaster.findOne({ where: { id: getPropertyID.get('propertyId') }, attributes: ['propertyCode', 'name', 'ownerEmail', 'address', 'bookingPolicy', 'noOfRooms'], raw: true });
        await db.PropertyUser.update(updateData, { where: { id: req.params.id } })
            .then(updated => {
                if (updated[0] > 0) {
                    // if (agreement == 1) {
                    //     try {
                    //         Promise.allSettled([
                    //             sendContractAcceptanceProperty(getPropertyDetail?.ownerEmail || 'property@yopmail.com', getPropertyDetail),
                    //             sendContractAcceptanceRrooms('rrooms.in@gmail.com', getPropertyDetail)
                    //         ]).then(() => {
                    //             console.log("All emails processed");
                    //         });
                    //     } catch (err) {
                    //         console.error("Email sending error:", err);
                    //     }
                    // }
                    return res.status(200).json({ status: true, message: "User updated successfully" });
                }
                else
                    return res.status(200).json({ status: false, message: "User not update, due to missing some fields" });
            })
            .catch(err => {
                return res.status(400).json({ status: false, message: err.message });
            });
    },
    // changes by vishwas on 25-01-2025 for ecryption of password - end

    // add pagination by vishwas on 25-01-2025
    async getPropertyUsers(req, res) {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page, 1) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        const PropertyUser = {
            include: [
                { model: db.UserProperty, required: false, attributes: ['id', 'propertyUserId', 'propertyId'] },
                { model: db.Roles, required: false, attributes: ['id', 'roleName', 'roleCode', 'canEdit', 'canDelete', 'canView'] }
            ],
            attributes: ['id', 'propertyId', 'userCode', 'firstName', 'lastName', 'designation', 'email', 'mobile', 'createdBy', 'updatedBy'],
            // limit: limitNumber,
            // offset: offset,
            // raw: true,
            // nest: true
        }
        db.PropertyUser.findAll(PropertyUser)
            .then(result => {
                return res.status(200).json({ result, status: true });
            })
            .catch((err) => {
                console.log(err.message);
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    async deletePropertyUser(req, res, next) {
        db.PropertyUser.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true, message: 'User deleted successfully' });
            else
                return res.status(200).json({ status: false, message: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async getPropertyUsersById(req, res) {
        const id = req.params.id;
        const PropertyUser = {
            include: [
                { model: db.Roles, required: false }
            ],
            where: { id: id }
        }
        db.PropertyUser.findOne(PropertyUser)
            .then(async result => {
                //Get Assigned property also
                const assignedProperty = await db.UserProperty.findAll({ attributes: ["propertyId"], where: { propertyUserId: id } }).map(u => u.get("propertyId"));
                let userProperty = []
                if (assignedProperty && assignedProperty.length > 0) {
                    userProperty = await db.PropertyMaster.findAll({ attributes: ['id', 'propertyCode', 'name'], where: { id: assignedProperty } });
                }
                const raw = JSON.parse(JSON.stringify(result));
                raw['userProperty'] = userProperty;
                return res.status(200).json({ data: raw, status: true });
            })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    async getUserTypes(req, res) {
        db.UserType.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            })
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    // add pagination by vishwas on 25-01-2025
    async getCustomers(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const offset = (pageNumber - 1) * limitNumber;
            const whereClause = {};
            // If search term is provided, filter by name, mobile, or email
            if (search && search.trim() !== '') {
                const searchTerm = `%${search.trim()}%`;
                whereClause[Op.or] = [
                    { name: { [Op.like]: searchTerm } },
                    { mobile: { [Op.like]: searchTerm } },
                    { email: { [Op.like]: searchTerm } },
                    { referralCode: { [Op.like]: searchTerm } }
                ];
            }
            const totalRecords = await db.User.count({ where: whereClause });
            const users = await db.User.findAll({
                where: whereClause,
                limit: limitNumber,
                offset: offset,
                order: [['id', 'DESC']]
            });
            const totalPages = Math.ceil(totalRecords / limitNumber);
            return res.status(200).json({
                status: true,
                data: users,
                pagination: {
                    totalRecords,
                    totalPages,
                    currentPage: pageNumber,
                    perPage: limitNumber
                }
            });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },

    async exportCustomers(req, res) {
        try {
            const { startDate, endDate, useReferralCode } = req.query;

            const whereClause = {};

            // Filter by createdAt date range
            if (startDate && endDate) {
                const start = new Date(`${startDate}T00:00:00.000+05:30`);
                const end = new Date(`${endDate}T23:59:59.999+05:30`);
                whereClause.createdAt = {
                    [Op.between]: [start, end],
                };
            }

            // Filter by useReferralCode value if provided
            if (useReferralCode) {
                whereClause.useReferralCode = useReferralCode;
            }

            const customers = await db.User.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                msg: 'filtered data',
                status: true,
                data: customers,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    },

    async getCustomersById(req, res) {
        db.User.findOne({ where: { id: req.params.id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }
            )
            .catch((err) => {
                return res.status(400).json({ status: false, message: err.message });
            })
    },

    // changes by vishwas on 25-01-2025 for decryption of password - start
    async signinRroomsUsers(req, res, next) {
        const RroomsUser = {
            include: [
                { model: db.Roles, required: false }
            ],
            where: { email: req.body.email },
            attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'password', 'role', 'designation', 'status', 'createdBy', 'updatedBy']
        }
        db.RroomsUser.findOne(RroomsUser).then(async (result) => {
            if (!result || !req.body.password || !result.password) {
                return res.status(400).json({ status: false, message: "User not found or password data missing." });
            }
            const isPasswordValid = await bcrypt.compare(req.body.password, result.password);
            if (!isPasswordValid) {
                return res.status(400).json({ status: false, message: "Incorrect password." });
            }
            var date = new Date();
            req.user = result;
            var x = JWTSign(req.user, date);
            const token = generateToken(result)
            res.cookie('XSRF-token', token, {
                expire: new Date().setMinutes(date.getMinutes() + 30),
                httpOnly: true, secure: config.app.secure
            });
            res.user = result.id;
            await db.RroomsUser.update({ lastLogged: sequelize.fn('NOW') }, { where: { id: result.id } })
            // Exclude password from the returned user object
            const userWithoutPassword = { ...result.get(), password: undefined };
            return res.status(200).json({ status: true, token: token, data: userWithoutPassword });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },
    // changes by vishwas on 25-01-2025 for decryption of password - end

    async signinPropertyUsers(req, res, next) {
        const PropertyUser = {
            include: [
                { model: db.Roles, required: false, attributes: ['id', 'roleName', 'roleCode', 'canEdit', 'canDelete', 'canView', 'status'] },
                // {
                //     model: db.UserProperty, required: false, attributes: ['id', 'propertyUserId', 'propertyId', 'status', 'createdBy'],
                //     include: [
                //         { model: db.PropertyMaster, required: false, attributes: ['id', 'propertyCode', 'name'] }
                //     ]
                // }
            ],
            where: { email: req.body.email },
            // logging: console.log,
            paranoid: false,
            attributes: ["id",
                "propertyId",
                "userCode",
                "role",
                "firstName",
                "lastName",
                "designation",
                "email",
                "password",
                "fcmToken",
                "mobile",
                "status",
                "agreement",
                "otp",
                "createdAt",
                "lastLogged",
                "createdBy",
                "updatedBy",
                "updatedAt",
                "deletedAt"]
        }

        db.PropertyUser.findOne(PropertyUser).then(async (result) => {
            if (result) {
                if (!result || !req.body.password || !result.password) {
                    return res.status(400).json({ status: false, message: "User not found or password data missing." });
                }
                // console.log(result);
                const isPasswordValid = await bcrypt.compare(req.body.password, result.password);
                if (!isPasswordValid) {
                    return res.status(200).json({ status: false, message: "Incorrect password." });
                }
                var date = new Date();
                req.user = result;
                var x = JWTSign(req.user, date);
                res.cookie('XSRF-token', token, {
                    expire: new Date().setMinutes(date.getMinutes() + 30),
                    httpOnly: true, secure: config.app.secure
                });
                res.user = result.id;
                const token = generateToken(result)
                const assignedProperty = await db.UserProperty.findAll({ attributes: ["propertyId"], where: { propertyUserId: result.id } }).map(u => u.get("propertyId"));
                let userProperty = []
                if (assignedProperty && assignedProperty.length > 0) {
                    userProperty = await db.PropertyMaster.findAll({ attributes: ['id', 'propertyCode', 'name', 'address', 'landmark', 'propertyEmailId', 'propertyMobileNumber', 'agreement'], where: { id: assignedProperty } });
                }
                const ownerOfProperty = await db.PropertyMaster.findAll({ attributes: ['id', 'propertyCode', 'name', 'address', 'landmark', 'propertyEmailId', 'propertyMobileNumber', 'agreement'], where: { ownerEmail: result.get('email') } });
                await db.PropertyUser.update({ lastLogged: sequelize.fn('NOW') }, { where: { id: result.id } })
                const raw = JSON.parse(JSON.stringify(result));
                raw['ownerProperty'] = ownerOfProperty;
                raw['userProperty'] = userProperty;
                // Exclude password from the returned user object
                const userWithoutPassword = { ...result.get(), password: undefined };
                return res.status(200).json({ status: true, token: token, data: raw });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid login details' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async ownerAllProperty(req, res, next) {
        try {
            const { ownerEmail } = req.body;
            const raw = await db.PropertyMaster.findAll({ attributes: ['id', 'propertyCode', 'name', 'address', 'landmark', 'propertyEmailId', 'propertyMobileNumber', 'agreement'], where: { ownerEmail: ownerEmail } })
            return res.status(200).json({ status: true, data: raw });
        } catch (err) {
            return res.status(400).json({ status: false, message: err.message });
        }
    },

    async FCMTokenUpdate(req, res, next) {
        try {
            const { userId, fcmToken } = req.body;
            // Check if the user exists in PropertyUser table
            const getPropertyUser = await db.PropertyUser.findOne({ where: { id: userId } });
            if (!getPropertyUser) {
                return res.status(200).json({ status: false, message: "User not found in PropertyUser." });
            }
            // Update FCM token in User table
            await db.PropertyUser.update({ fcmToken }, { where: { id: userId } });
            return res.json({ status: true });
        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
    },

    // created for check notification
    // async sendNotification(req, res, next) {
    //     try {
    //         const x = await admin.messaging().send({
    //             notification: {
    //                 title: "New Order",
    //                 body: "RROOMS Notification! vishwas new order generated, Plz check!",
    //             },
    //             token: "cUs42QU518qBtYZmq02PmS:APA91bFShYXG1nGAiZxo58nou_Gp-h-LpPCXYSlKkKpunGhFf4gh3UcPKgq5AWwJHuYlbQw0rf2llsVfrcN0V2y1Y3x3fEdWCOEutwWHHfbT3bnti8kADww"
    //         });
    //         console.log(x);
    //         res.json({ status: true });
    //     } catch (error) {
    //         return res.status(400).json({ status: false, message: error.message });
    //     }
    // },

    async getPropertyUsersByLoggedOrder(req, res, next) {
        db.PropertyUser.findAll({
            order: [
                ['lastLogged', 'DESC']
            ]
        }).then(result => {
            return res.status(200).json({ status: true, data: result, message: "Success" });
        }).catch(err => {
            return res.status(400).json({ status: false, errors: err.message });
        })
    },

    async deleteUserType(req, res, next) {
        db.UserType.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true, message: 'User type deleted' });
            else
                return res.status(200).json({ status: false, message: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async deleteCustomer(req, res, next) {
        db.Customer.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true });
            else
                return res.status(200).json({ status: false, message: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async deleteUser(req, res, next) {
        db.User.destroy({ where: { id: req.params.id } }).then(result => {
            if (result)
                return res.status(200).json({ status: true, message: 'User deleted' });
            else
                return res.status(200).json({ status: false, message: 'No record found by this id - ' + req.params.id });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async logout(req, res, next) {
        var sess = req.cookies.user;
        if (sess) {
            req.cookies.user = null;
            return res.status(200).json({ status: true, message: "user logout successfully" });
        } else {
            return res.status(400).json({ status: false, message: "User authentication failed" });
        }
    },

    async createRole(req, res) {
        const {
            roleName, roleCode, status, canEdit, canDelete, canView, canAdd, userType
        } = req.body

        db.Roles.create({ roleName, roleCode, status, canEdit, canDelete, canView, canAdd, userType })
            .then(result => {
                return res.status(200).json({ data: result, message: 'Created successfully', status: true });
            }
            )
            .catch((err) => {
                return res.status(400).json({ message: err.message, status: false });
            })
    },

    async updateRole(req, res) {
        const {
            roleName, roleCode, status, canEdit, canDelete, canView, canAdd, userType
        } = req.body
        db.Roles.update({ roleName, roleCode, status, canEdit, canDelete, canView, canAdd, userType }, { where: { id: req.params.id } })
            .then(result => { return res.status(200).json({ message: 'Updated successfully', status: true }) }
            ).catch((err) => { return res.status(400).json({ message: err.message, status: false }); })
    },

    async deletetRole(req, res) {
        db.Roles.destroy({ where: { id: req.params.id } })
            .then(result => {
                return res.status(200).json({ message: 'Role deleted', status: true });
            })
            .catch((err) => {
                return res.status(400).json({ message: err.message, status: false });
            })
    },

    async getRolles(req, res) {
        db.Roles.findAll()
            .then(result => {
                return res.status(200).json({ data: result, status: true, message: "Success" });
            }
            )
            .catch((err) => {
                return res.status(400).json({ message: err.message, status: false });
            })
    },

    async getRoleById(req, res) {
        db.Roles.findOne({ where: { id: req.params.id } })
            .then(result => {
                return res.status(200).json({ data: result, status: true, message: "Success" });
            }
            )
            .catch((err) => {
                return res.status(400).json({ message: err.message, status: false });
            })
    },

    async propertyUsersByPropertyId(req, res, next) {
        db.PropertyUser.findOne({ where: { propertyId: req.params.id } }).then(result => {
            if (result) {
                return res.status(200).json({ success: true, token: token, data: result, message: 'Success' });
            } else
                return res.status(200).json({ status: false, data: result, message: 'No users exist by this property id' });
        }).catch(err => {
            return res.status(500).json({ status: false, message: err.message });
        })
    },

    async getAppUrl(req, res, next) {
        const { mobile } = req.body;
        if (mobile) {
            try {
                sendAppUrl(mobile);
                return res.status(200).json({ status: true, message: 'Url sent successfully' });
            } catch (error) {
                return res.status(500).json({ status: false, message: error.message });
            }
        }
    },

    async generateOtpForPropertyUserPassword(req, res, next) {
        const id = req.params.id
        db.PropertyUser.findOne({ where: { id: id } }).then(async (result) => {
            if (result) {
                const otp = Math.floor(1000 + Math.random() * 9000)
                // console.log("otp - ", otp);
                sendOTPToUpdatePassword(result.get('mobile'), otp)
                result.update({ otp: otp })
                return res.status(200).json({ status: true, message: 'OTP has been sent to your registered mobile number. Please enter it to reset your password.' });
            } else {
                return res.status(400).json({ status: false, message: 'User not found!' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    // changes by vishwas on 25-01-2025 for decryption of password - start
    async updatePropertyUserPassword(req, res, next) {
        const id = req.params.id
        const { password, otp } = req.body
        if (!(id && password && otp)) {
            return res.status(400).json({ status: false, message: 'Id/Password/Otp is required' });
        }
        db.PropertyUser.findOne({ where: { id: id, otp: otp } }).then(async (result) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (result) {
                result.update({ password: hashedPassword, otp: 0 })
                return res.status(200).json({ status: true, message: 'Password updated successfully' });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid OTP/User id!' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },
    // changes by vishwas on 25-01-2025 for decryption of password - end

    async generateOtpForRroomsUserPassword(req, res, next) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: false, message: 'Id is required' });
        }
        db.RroomsUser.findOne({ where: { id: id } }).then(async (result) => {
            if (result) {
                const otp = Math.floor(1000 + Math.random() * 9000)
                sendOTPToUpdatePassword(result.get('mobile'), otp)
                result.update({ otp: otp })
                return res.status(200).json({ status: true, message: 'OTP has been sent to your registered mobile number. Please enter it to reset your password.' });
            } else {
                return res.status(400).json({ status: false, message: 'User not found!' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    // changes by vishwas on 25-01-2025 for decryption of password - start
    async updateRroomsUserPassword(req, res, next) {
        const id = req.params.id
        const { password, otp } = req.body

        if (!(id && password && otp)) {
            return res.status(400).json({ status: false, message: 'Id/Password/OTP is required' });
        }
        db.RroomsUser.findOne({ where: { id: id, otp: otp } }).then(async (result) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (result) {
                result.update({ password: hashedPassword, otp: 0 })
                return res.status(200).json({ status: true, message: 'Password updated successfully' });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid OTP/User id' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },
    // changes by vishwas on 25-01-2025 for decryption of password - end

    // change password for rrooms user when role is 1,2
    async changePasswordByRRoomsUser(req, res, next) {
        const id = req.params.id
        const { password, role } = req.body
        if (!(id && password && (role == 1 || role == 2))) {
            return res.status(400).json({ status: false, message: 'Id/Password is required' });
        }
        db.RroomsUser.findOne({ where: { id: id } }).then(async (result) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (result) {
                result.update({ password: hashedPassword })
                return res.status(200).json({ status: true, message: 'Password changed successfully' });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid User id' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async getRRoomsUserByEmail(req, res) {
        const { email } = req.body;
        try {
            const user = await db.RroomsUser.findOne({ where: { email }, attributes: ['id', 'userCode', 'firstName', 'lastName', 'email', 'mobile'] });
            if (user) {
                return res.status(200).json({
                    status: true,
                    data: user
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "User not found"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    // change password for property user when role is 3,4
    async changePasswordByPropertyUserUser(req, res, next) {
        const id = req.params.id
        const { password, role } = req.body
        if (!(id && password && (role == 3 || role == 4))) {
            return res.status(400).json({ status: false, message: 'Id/Password is required' });
        }
        db.PropertyUser.findOne({ where: { id: id } }).then(async (result) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (result) {
                result.update({ password: hashedPassword })
                return res.status(200).json({ status: true, message: 'Password changed successfully' });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid User id' });
            }
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        })
    },

    async getPropertyUserByEmail(req, res) {
        const { email } = req.body;
        try {
            const user = await db.PropertyUser.findOne({ where: { email }, attributes: ['id', 'userCode', 'firstName', 'lastName', 'email', 'mobile'] });
            if (user) {
                return res.status(200).json({
                    status: true,
                    data: user
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "User not found"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
};
