const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    clinician_username: String,
    first_name: String,
    last_name: String
})

const Author = mongoose.model('patientRecord', schema)
module.exports = Author