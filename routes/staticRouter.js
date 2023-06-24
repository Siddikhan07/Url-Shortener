const express = require("express");
const UsersUrl = require("../models/url");

const router = express.Router();

router.get("/", async(req,res)=>{
    if(!req.user) return res.redirect("/login")
    const allurls = await UsersUrl.find({ createdBy: req.user._id });
    return res.render("home",{
        urls: allurls,
    });
})

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.get("/login",(req,res)=>{
    return res.render("login");
});

module.exports = router;
