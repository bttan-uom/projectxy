const mongoose = require('mongoose')

const usernameSchema = new mongoose.Schema({
    email: {type: String, required: true}
})

const clinicianSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    patients: [usernameSchema]
})

const Clinician = mongoose.model('clinician', clinicianSchema)

module.exports = Clinician
