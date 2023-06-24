const express = require("express");
const path = require("path");
const { MongoClient } = require( "mongodb");
const Express = require("express");
const Cors = require ("cors");
const BodyParser = require ("body-parser");
const cookieParser = require ("cookie-parser");

const {connectToMongoDB} = require("./connect");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth")

const UsersUrl = require("./models/url");

const urlRoute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

// ---------------------
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb+srv://siddikhan6040:8gcGOQmD5GZQq029@cluster0.9gf10xc.mongodb.net/short-url?retryWrites=true&w=majority")
.then(()=>console.log("mongodb connected"));
const client = new MongoClient("mongodb+srv://siddikhan6040:8gcGOQmD5GZQq029@cluster0.9gf10xc.mongodb.net/food?retryWrites=true&w=majority");


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cookieParser()) ;
app.use(Cors()) ;

app.use("/url",restrictToLoggedInUserOnly,urlRoute);//,restrictToLoggedInUserOnly
app.use("/user", userRoute);
app.use("/", checkAuth,staticRoute);//, checkAuth

app.get("/url/:shortId", async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await UsersUrl.findOneAndUpdate({shortId},{$push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    }})
    res.redirect(entry.redirectURL);
})

// -------------------Search Functionality code-----------------------?////
var collection;

app.get("/search", async (request,response)=>{
    try{
        let result = await collection.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${request.query.term}`,
                        "path": "redirectURL",
                        "fuzzy": {
                            "maxEdits": 2
                        }
                    }
                }
            }
        ]).toArray();
        response.send(result); 
    }catch(e){
        response.status(500).send({message: e.message});
    }
});

app.listen(PORT, async () => {
    try{
        await client.connect();
        collection = client.db("short-url").collection("urls");
        console.log(`Server started at PORT:${PORT}`);
    }catch (e){
        console.error(e);
    }
});
