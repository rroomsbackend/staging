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
import "./errors";
import invoiceJob from "./jobs/generate-invoice";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

var cors = require("cors");

if (process.env.APP_ENV === "prod") {
  import("newrelic").then((newrelic) => {
    console.log("newrelic imported");
  });
}
global.appRoot = path.resolve(__dirname);
const PORT = config.app.port || 4000;
console.log("PORT - ", PORT);
const app = appManager.setup(config, path.join(__dirname, "resources"));
const server = http.createServer(app);
// ===============
// CORS middleware
// ===============
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ==============================================
// Handle OPTIONS (preflight) requests explicitly
// ==============================================
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(cors());

// ==============
// Route handling
// ==============
app.use("/api", restRouter);
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
});

// ===================
// Database Connection
// ===================
db.sequelize
  .authenticate()
  .then(function () {
    console.log("Nice! Database looks fine");
  })
  .catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

// ============================
// HTTP & Socket.IO Integration
// ============================
// const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
global.io = io;

io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);

  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });

  // 🔁 TEST trigger manually
  socket.on('test-order', ({ propertyId }) => {
    io.emit(`new-order-${propertyId}`, {
      type: 'NEW_ORDER',
      data: {
        "id": 47,
        "userId": 1,
        "bookingId": 47164,
        "propertyId": 106,
        "roomNumber": "102",
        "orderAmount": 126,
        "ncType": "Room Service",
        "otherGuestName": "vishwas",
        "orderItems": "[{\"name\":\"Fried Rice\",\"price\":126,\"qty\":1,\"amountBeforeTax\":120,\"taxAmount\":6,\"propertyId\":106,\"totalAmount\":126,\"gstPercentage\":5,\"id\":15}]",
        "remark": "tt",
        "createdBy": 0,
        "totalFoodAmountBeforeGST": 120,
        "dueAmount": 126,
        "updatedAt": "2025-07-23T07:23:15.652Z",
        "createdAt": "2025-07-23T07:23:15.652Z"
      }
    });
  });
});

// global.io.to(`property-${propertyId}`).emit("newOrder", {
//   orderId: createdOrder.id,
//   customerName: createdOrder.customerName,
//   items: createdOrder.items,
//   total: createdOrder.total,
//   message: "New Order Received!",
// });

// =======================
// Start Listening service
// =======================
// app.listen(PORT, () => {
server.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});
