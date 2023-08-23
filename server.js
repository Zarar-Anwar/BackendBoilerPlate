const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const middlewares = require("./middleware/express-middle-wares");
const routes = require("./routes/MainRoutes");

// Connection file of Database--------------------------------------------------
require("./models/index");

// Creating Server--------------------------------------------------------------
const app = express();

// Use when Adding React Build to Server File
const BuildConfig = () => {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
};

// Add when to show images from here to React
app.use(express.static(path.join(__dirname, "public")));

// Express Middle Wares---------------------------------------------------------
middlewares(app);

// API Routes-------------------------------------------------------------------
routes(app);

// Server Running---------------------------------------------------------------
app.listen(process.env.PORT, () => {
  console.log(`The Server is Running at http://localhost:${process.env.PORT}`);
});
