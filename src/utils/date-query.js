import sequelize, { NOW } from 'sequelize';
const Op = sequelize.Op
import moment from 'moment';

// accepts array of json data and returns sheet
export const createAtDateFormat = async (fromDate, toDate) => {
    try {

        const filter = {}

        if (fromDate) {
            fromDate = new Date(fromDate + " 00:00:00")
        }
        if (toDate) {
            toDate = new Date(toDate + " 23:59:59")
        }

        if (fromDate && toDate) {
            filter['createdAt'] = {
                [Op.between]: [moment(fromDate).format('YYYY-MM-DD HH:mm:ss'), moment(toDate).format('YYYY-MM-DD HH:mm:ss')]
            }
        } else if (fromDate) {
            filter['createdAt'] = {
                [Op.gte]: moment(fromDate).format('YYYY-MM-DD HH:mm:ss')
            }
        } else if (toDate) {
            filter['createdAt'] = {
                [Op.lte]: moment(toDate).format('YYYY-MM-DD HH:mm:ss')
            }
        }

        return filter

    } catch (err) {
        throw new Error(err.message)
    }
};