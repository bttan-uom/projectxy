const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    username: String,
    phone: String
})

const Clinician = mongoose.model('clincianDetail', schema)
module.exports = Cliniican
