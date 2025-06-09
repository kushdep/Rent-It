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
const UserRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const passport = require('passport')
const LocalStratergy = require('passport-local')
const User = require('./models/user')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  ("Database connected");
});

app.listen(3000, () => {
  console.log("Server Running on port 3000");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

const sessionConfig = {
  secret: 'SecretIsSecret',
  resave: false,
  saveUnitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})

// app.use(()=>console.log('Cloudinary name:', process.env.CLOUDINARY_NAME))
app.use('/', UserRoutes)
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
