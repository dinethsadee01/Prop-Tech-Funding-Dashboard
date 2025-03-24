require("dotenv").config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
    COLLECTION_NAME: "funding", // Collection for funding data
    USERS_COLLECTION: "users"   // Collection for user data
};
