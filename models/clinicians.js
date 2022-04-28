const mongoose = require('mongoose')

var clinicianSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    patients_usernames: [{type: String}]
})

const Clinician = mongoose.model('clinician', clinicianSchema)

module.exports = Clinician
