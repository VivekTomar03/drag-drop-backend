const mongoose = require("mongoose")
require("dotenv").config()
const connection = mongoose.connect(process.env.MongoURL)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    
    connection
}