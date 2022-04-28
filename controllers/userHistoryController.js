const Records = require('../models/patientRecords')

const joins = require('./joins')

// handle request to get all data instances
const getAllHistory = async (req, res, next) => {
    try {
        // Hard-coded email for example in deliverable 2.
        // Not to be used in deliverable 3.
        const clinician = await joins.getClinician('pat.fakename@example.com')
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        const patientRecords = await Records.find().lean()
        return res.render('history', {data: patientRecords.reverse(), clinician: clinician})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const record = await Records.findById(req.params.patientRecord_id).lean()
        if (!record) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found the author

        // Hard-coded email for example in deliverable 2.
        // Not to be used in deliverable 3.
        const clinician = await joins.getClinician('pat.fakename@example.com')
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        return res.render('oneData', {oneItem: record, clinician: clinician})
    } catch (err) {
        return next(err)
    }

}

// exports an object, which contain functions imported by router
module.exports = {
    getAllHistory,
    getDataById
}
