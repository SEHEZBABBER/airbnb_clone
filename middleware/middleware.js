const express = require('express');
const app = express();
const isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("error","you need to login before accessing this page");
        req.session.redirect_local_url = req.originalUrl;
        res.redirect('/login');
    }
};
const save_url = (req,res,next)=>{
    if(req.session.redirect_local_url){
        res.locals.redirect_local_url = req.session.redirect_local_url;
    }
    else{
        res.locals.redirect_local_url = null;
    }
    next();
};
module.exports = {isLoggedin,save_url};