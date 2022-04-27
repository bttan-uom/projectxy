const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    height: Decimal128,
    address: String,
    gender: String,
    dob: Date,
    signupdate: Date,
    clinician_username: String
})

const Author = mongoose.model('patients', schema)
module.exports = Author