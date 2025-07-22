//const newrelic = require('newrelic');
import "dotenv/config";
import { db } from "./models";
import { restRouter } from "./api";
import config from "./config";
import appManager from "./app";
import path from 'path';
// import './passport';
import "./invoiceCron";
import "./unblock-rooms-cron"
import "./all-property-occupancy"
import "./expired-bookings"
import "./propertySummery"
var cors = require("cors");

import "./errors";
import invoiceJob from "./jobs/generate-invoice";

if (process.env.APP_ENV === "prod") {
  import("newrelic").then((newrelic) => {
    console.log("newrelic imported");
  });
}

global.appRoot = path.resolve(__dirname);

const PORT = config.app.port;

const app = appManager.setup(config, path.join(__dirname, "resources"));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin, use specific URL instead of '*' for production
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handle OPTIONS (preflight) requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin, or use a specific URL for production
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200); // Respond with status 200 for preflight requests
});

app.use(cors());

/* Route handling */
app.use("/api", restRouter);

// GET all users
app.get("/", (req, res) => {
  res.json({ message: "Welcome to RRooms API" });
});

app.use((req, res, next) => {
  next(new RequestError("Invalid route", 404));
});

app.use((error, req, res, next) => {
  if (!(error instanceof RequestError)) {
    error = new RequestError("Some Error Occurred", 500, error.message);
  }
  error.status = error.status || 500;
  res.status(error.status);
  let contype = req.headers["content-type"];
  var json = !(
    !contype ||
    contype.indexOf("application/json") !== 0 ||
    !contype.indexOf("multipart/form-data") !== 0
  );
  return res.json({ errors: error.errorList });
  /*if (!json) {
    return res.json({ errors: error.errorList });
  } else {
    res.render(error.status.toString(), {layout: null})
  }*/
});

/* Database Connection */
db.sequelize
  .authenticate()
  .then(function () {
    console.log("Nice! Database looks fine");
    //scheduler.init();
  })
  .catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
  });
//app.setTimeout(500000);
/* Start Listening service */
app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});
