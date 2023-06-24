const shortid = require("shortid")
const UsersUrl = require("../models/url.js")

async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url is required"})
    const shortId = shortid();
    const createDocument = async()=>{
        try{
            const newUrl = new UsersUrl({
            shortId: shortId,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id,
            })
            await newUrl.save();
        }catch(err){
        console.log(err);
        }
    }
    createDocument();
    const allurls = await UsersUrl.find({ createdBy: req.user._id });

    // const allurls = await UsersUrl.find({});

    return res.render("home",{
        id:shortId,
        urls: allurls,
    })
    // return res.redirect("/",{
    //     id:shortId,
    // })
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await UsersUrl.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length, analytics:result.visitHistory})
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}

