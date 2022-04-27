const Author = require('../models/patientRecords')

// handle request to get all data instances
const getAddUserRecordsPage = (req, res) => {
    res.render('userAddRecord')
}

// handle request to get one data instance
const addNewUserRecord = async (req, res, next) => {
    try {
        newAuthor = new Author( req.body )
        await newAuthor.save()
        res.render('userAddRecordSuccess', {oneItem: author})
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

