const mongoose = require("mongoose");
const { USERS_COLLECTION } = require("../config/Config");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true }); // Role-based access control

module.exports = mongoose.model("User", userSchema, USERS_COLLECTION);
