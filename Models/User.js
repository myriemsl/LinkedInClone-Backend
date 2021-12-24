const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    email: String,
    password: String,
    avatar: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", UserSchema);