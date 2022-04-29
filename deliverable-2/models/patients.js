const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    height: mongoose.Schema.Types.Decimal128,
    address: String,
    gender: String,
    dob: Date,
    signupdate: {type: Date, required: true},
    clinician_username: {type: String, required: true}
})

const Patient = mongoose.model('patient', patientSchema)

module.exports = Patient
