if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError.js');
const ListingsRoute = require("./routes/listing.js");
const ReviewRoute = require("./routes/reviews.js");
const UserRoute = require("./routes/user.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.js');

// Session configuration
const sessionOptions = {
    secret: "mysecretekey",
    resave: false,
    saveUninitialized: true, // Fixed typo
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fixed incorrect usage
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Passport Configuration
app.use(passport.initialize()); // Fixed typo
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // Fixed typo
passport.deserializeUser(User.deserializeUser()); // Fixed typo

// Database Connection
async function main() {
    const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust';
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("Connection Successful"))
    .catch((err) => console.log(err));

app.listen(8080, () => {
    console.log("Listening on port 8080");
});

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    res.locals.isuservalid = req.user;
    next();
});

// Routes
app.use('/listings', ListingsRoute);
app.use('/listings/:id', ReviewRoute);
app.use('/', UserRoute);

// Error Handling
app.use('*', (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode);
    res.render("error", { message });
});
