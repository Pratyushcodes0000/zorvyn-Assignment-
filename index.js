const express = require("express");
const http = require("http");
const connectDB = require("./db/db");
const apiLimiter = require('./middleware/rateLimiter')
const app = express();
const server = http.createServer(app);

require("dotenv").config();
connectDB();


//middlewares
app.use(apiLimiter) // global simple rate limiter(could be applied per route too)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//imports here
const user = require("./routes/User");
const Record = require("./routes/Records");
const Dashboard = require("./routes/Dashboard");

//usage here
app.use("/api", user);
app.use("/api", Record);
app.use("/api", Dashboard);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
