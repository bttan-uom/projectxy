const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    record_type: {type: String, default: ''},
    value: {type: String, default: ''},
    username: {type: String, default: ''},
    comment: {type: String, default: ''}
}, { timestamps: { createdAt: 'created_at' } })

const Record = mongoose.model('patientRecord', schema)

module.exports = Record
