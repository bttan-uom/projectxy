const Records = require('../models/patientRecords')

const joins = require('./joins')

// handle request to get all data instances
const getAddUserRecordsPage = async (req, res) => {
    try {
        // Hard-coded email for example in deliverable 2.
        // Not to be used in deliverable 3.
        const clinician = await joins.getClinician('pat.fakename@example.com')
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        res.render('userAddRecord', {clinician: clinician})
    } catch(err) {
        return next(err)
    }
}

// handle request to get one data instance
const addNewUserRecord = async (req, res, next) => {
    try {
        // Hard-coded email for example in deliverable 2.
        // Not to be used in deliverable 3.
        const clinician = await joins.getClinician('pat.fakename@example.com')
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        newPatientRecord = new Records( req.body )
        await newPatientRecord.save()
        res.render('userAddRecordSuccess', {oneItem: newPatientRecord, clinician: clinician})
    } catch (err) {
        return next(err)
    }
}



// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

