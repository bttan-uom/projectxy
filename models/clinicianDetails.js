const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    phone: String
})

const Clinician = mongoose.model('clincianDetails', schema)
module.exports = Clinician
