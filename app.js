const express = require("express");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const RentLocRoutes = require('./routes/rentloc')
const ReviewRoutes = require('./routes/review')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.listen(3000, () => {
  console.log("Server Running on port 3000");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use('/rentloc', RentLocRoutes)

app.use('/rentloc/:id/review', ReviewRoutes)

app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});

//Catch all for any error
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(status).render("error", { err });
});
