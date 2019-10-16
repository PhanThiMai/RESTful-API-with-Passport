
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    password: { type: String, required: true, max: 20, min: 6 },
    email: { type: String, required: false, unique: true, max: 100, min: 5 }

});

module.exports = mongoose.model("users", userSchema);
