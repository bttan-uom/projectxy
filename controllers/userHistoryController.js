// import people model
// const res = require('express/lib/response')
const Author = require('../models/patientRecords')

// handle request to get all data instances
const getAllHistory = async (req, res, next) => {
    try {
        const patientRecords = await Author.find().lean()
        return res.render('history', {data: patientRecords})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const author = await Author.findById(req.params.patientRecord_id).lean()
        if (!author) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found the author
        return res.render('oneData', {oneItem: author})
    } catch (err) {
        return next(err)
    }

}

// exports an object, which contain functions imported by router
module.exports = {
    getAllHistory,
    getDataById,
}
