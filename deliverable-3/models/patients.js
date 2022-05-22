const mongoose = require('mongoose')

//messages schema

const note = new mongoose.Schema({
    date: {type: Date, required: true},
    content: {type: String, required: true}
})

const record = new mongoose.Schema({
    record_type: {type: String, required: true},
    value: {type: String, required: true},
    comments: {type: String, required: false},
    created_at: {type: Date, required: true},
    updatedAt: {type: Date, required: true}
})

const message = new mongoose.Schema({
    content: {type: String, required: true},
    time: {type: Date, required: true}
})

const threshold = new mongoose.Schema({
    name: {type: String, required: true},
    lower: {type: mongoose.Schema.Types.Decimal128, required: true},
    upper: {type: mongoose.Schema.Types.Decimal128, required: true}
})


const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    height: mongoose.Schema.Types.Decimal128,
    address: String,
    gender: String,
    dob: Date,
    signupdate: {type: Date, required: true},
    clinician: {type: String, required: true},
    thresholds: [threshold],
    engagement_rate: mongoose.Schema.Types.Decimal128,
    records: [record],
    messages: [message],
    notes: [note]
})

const Patient = mongoose.model('patient', patientSchema)
const Record = mongoose.model('record', record)

module.exports = {Patient, Record}