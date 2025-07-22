import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize from 'sequelize';
import config from '../config';
import tabModel from './banquetBooking';

const basename = _basename(__filename);
const db = {};

let sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.connection,
    username: config.db.username,
    password: config.db.password,
    logging: false,
    operatorsAliases: 'Op',
    //dialectOptions: {
    //useUTC: false, // for reading from database
    //},
    timezone: '+05:30', // for writing to database
    pool: {
        max: 20,
        min: 1,
        idle: 20000,
        acquire: 1000000
    }
});

readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    console.log("Model name -", modelName)
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
// (async () => {
//     try {
//       await sequelize.sync({ models: ['Venue','BanquetBooking', 'BanquetBookingPayment', 'RestaurantFoodOrder', 'RestaurantFoodOrderPayment'], });
//     //   console.log("BanquetBooking table created (if it didn't exist)!");
//     } catch (error) {
//       console.error("Error creating BanquetBooking table:", error);
//     }
//   })();

// (async () => {
//     try {
//         await sequelize.sync();
//         console.log("All tables created or synchronized successfully.");
//     } catch (error) {
//         console.error("Error synchronizing database:", error);
//     }
// })();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };