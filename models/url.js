const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [{timestamp: {type: Number}}],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
    },
    {timestamp: true}
);

const UsersUrl = mongoose.model("url", urlSchema);

module.exports = UsersUrl;