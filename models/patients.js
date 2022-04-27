const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    
    first_name: String,
    last_name: String
})

const Author = mongoose.model('patients', schema)
module.exports = Author