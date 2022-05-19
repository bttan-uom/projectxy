const mongoose = require('mongoose')

//messages schema


const assigned_record = new mongoose.Schema({  // each user has an array of these
    record_type: {type: String, required: true},
    is_recording: {type: String, required: true}
})

// const threshold_values = new mongoose.Schema({  // each user has an array of these
//     lower: {type: mongoose.Schema.Types.Decimal128, required: true},
//     higher: {type: mongoose.Schema.Types.Decimal128, required: true}
// })

// const threshold_type = new mongoose.Schema({  // each user has an array of these
//     type: {type: String, required: true},
//     threshold_range: [threshold_values]
// })

const record = new mongoose.Schema({
    record_type: {type: String, required: true},
    value: {type: mongoose.Schema.Types.Decimal128, required: true},
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
    address: {type: String, required: true},
    gender: {type: String, required: true},
    dob: {type: Date, required: true},
    signupdate: {type: Date, required: true},
    clinician_username: {type: String, required: true},
    thresholds: [threshold],
    engagement_rate: mongoose.Schema.Types.Decimal128,
    records: [record],
    messages: [message],
    assigned_records: [assigned_record]
})

const Patient = mongoose.model('patient', patientSchema)
const Record = mongoose.model('record', record)

module.exports = {Patient, Record}








/* 
const resultSchema = new mongoose.Schema({  // each user has an array of these
    subject: {type: String, required: true},
    result: {type: Number, required: true}
})

*/