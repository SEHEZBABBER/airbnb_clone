const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require('express-session')
const flash = require('connect-flash');
const sessionOptions = {
    secret:"mysecretekey",
    resave:false,
    saveUninitalized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded(true));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
main().then(()=>{
    console.log("Conenction Succesful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust'; 
    await mongoose.connect(MONGO_URL);
}
app.listen(8080,()=>{
    console.log("listening through port 8080");
});

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    next();
});

app.use('/listings',listings);
app.use('/listings/:id',reviews);


app.use('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went Wrong!"} = err;
    res.status(statusCode)
    res.render("error",{message});
});