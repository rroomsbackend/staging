import { db } from '../../../models';

export default {
    async create(req, res, next) {
        const { referral_code, new_user_id } = req.body;
        const newUser = await db.User.findOne({ where: { id: new_user_id, deletedAt: null } });
        if (!newUser) {
            return res.status(422).json({ status: false, message: "Invalid new user id" });
        }
        const currentUser = await db.User.findOne({ where: { referralCode: referral_code, deletedAt: null } });
        if (!currentUser) {
            return res.status(422).json({ status: false, message: "Invalid referral code" });
        }
        const currentUserWallet = await db.UserWallet.findOne({
            where: { userId: currentUser.id },
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ]
        });
        let requestData = [
            {
                userId: new_user_id,
                amount: parseInt(process.env.NEW_USER_REFERRAL_AMOUNT),
                balance: parseInt(process.env.NEW_USER_REFERRAL_AMOUNT),
            }
        ];
        if (currentUserWallet) {
            const updatedUserWallet = {
                userId: currentUserWallet.userId,
                amount: parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT),
                balance: parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT) + currentUserWallet.balance
            }
            requestData = [...requestData, updatedUserWallet];
        } else {
            const updatedUserWallet = {
                userId: currentUser.id,
                amount: parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT),
                balance: parseInt(process.env.CURRENT_USER_REFERRAL_AMOUNT)
            }
            requestData = [...requestData, updatedUserWallet];
        }
        await db.UserWallet.bulkCreate(requestData).then(async (result) => {
            return res.status(200).json({ status: true, data: result, message: "Wallet created successfully" });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async update(req, res, next) {
        const { user_id } = req.params;
        const { booking_amount } = req.body;
        const user = await db.User.findOne({ where: { id: user_id, deletedAt: null } });
        if (!user) {
            return res.status(422).json({ status: false, message: "Invalid user id" });
        }
        const wallet = await db.UserWallet.findOne({
            where: { userId: user_id },
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ]
        });
        await db.UserWallet.create({
            userId: user_id,
            //amount: wallet.balance < booking_amount ? wallet.balance : booking_amount,
            amount: booking_amount,
            balance: wallet.balance < booking_amount ? 0 : wallet.balance - booking_amount,
            transactionType: false
        }).then(async (result) => {
            return res.status(200).json({ status: true, data: result, message: "Wallet used successfully" });
        }).catch(err => {
            return res.status(400).json({ status: false, message: err.message });
        });
    },

    async get(req, res) {
        const { user_id } = req.query;
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }
        if (user_id) {
            selection.where = [{
                userId: user_id,
                deletedAt: null
            }];
        }
        const selector = Object.assign({}, selection);
        await db.UserWallet.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getByUserId(req, res) {
        const { id } = req.params;
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }
        if (id) {
            selection.where = [{
                userId: id,
                deletedAt: null
            }];
        }
        const selector = Object.assign({}, selection);
        await db.UserWallet.findAll(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    },

    async getByUserIdOrMobileNo(req, res) {
        const { id, mobile } = req.body;
        const selection = {
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: [
                { deletedAt: null }
            ],
        }

        if (id) {
            selection.where = [{
                userId: id,
                deletedAt: null
            }];
        } else if (mobile) {
            const userDetails = await db.User.findOne({ where: { mobile: mobile } });
            if (userDetails) {
                selection.where = [{
                    userId: userDetails.get('id'),
                    deletedAt: null
                }];
            }
        }

        if (!id && !mobile) {
            return res.status(400).json({ status: false, message: "Mobile number/user id required!" });
        }


        const selector = Object.assign({}, selection);
        await db.UserWallet.findOne(selector)
            .then(result => {
                return res.status(200).json({ data: result, status: true });
            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
    }
};