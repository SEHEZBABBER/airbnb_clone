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
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.js');

const store = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret : process.env.SECRET_KEY,
    },
    touchAfter : 24 * 3600,
});
store.on("error",()=>{
    throw new ExpressError(401,"mongo session threw a error");
})
// Session configuration
const sessionOptions = {
    store : store,
    secret: process.env.SECRET_KEY,
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
    const MONGO_URL = process.env.MONGO_URL;
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
app.get('/',(req,res)=>{
    res.redirect('/listings');
})
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
