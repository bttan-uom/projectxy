const Records = require('../models/patientRecords')

const joins = require('./joins')

// handle request to get all data instances
const getAllRecords = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician('pat.fakename@example.com')
        const patientRecords = await Records.find().lean()
        return res.render('index', {data: patientRecords, clinician: clinician})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const author = await Records.findById(req.params.patientRecord_id).lean()
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
    getAllRecords,
    getDataById
}
