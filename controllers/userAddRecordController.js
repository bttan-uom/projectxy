// import people model
// const res = require('express/lib/response')
const Author = require('../models/patientRecords')
//const peopleData = require('../models/peopleModel')

// CHALLENGE EXERCISE: change this to use MongoDB!
// const insertData = (req, res) => {
//     const { id, first_name, last_name } = req.body
//     peopleData.push({ id, first_name, last_name })
//     return res.redirect('back')
// }
const getAddUserRecordsPage = (req, res) => {
    res.render('userAddRecord')
}

// CHALLENGE solution
// note: This function is omitted from my solution on Heroku
const addNewUserRecord = async (req, res, next) => {
    try {
        newAuthor = new Author( req.body )
        await newAuthor.save()
        res.render('userAddRecordSuccess')
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

