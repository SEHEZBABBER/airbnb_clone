const ExpressError = require('../utils/expressError.js');
const User = require('../models/User.js');
module.exports.form_signup = (req,res)=>{
    res.render("signup");
};
module.exports.post_signup = async(req,res,next)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registerdUser = await User.register(newUser,password);
    req.flash("success","User Registerd Successfully");
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        else{
            req.session.user_id = req.user._id;
            res.redirect('/listings');
        }
    });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
};
module.exports.form_login = (req,res)=>{
    res.render("login");
};
module.exports.post_login = async(req,res,next)=>{
    req.flash("success","Login Successul");
    req.session.user_id = req.user._id;
    if(!res.locals.redirect_local_url)res.locals.redirect_local_url = '/listings';
    res.redirect(res.locals.redirect_local_url);
};
module.exports.log_out = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","logout successfull");
            res.redirect('/listings');
        }
    })
};