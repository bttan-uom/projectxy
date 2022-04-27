const PatientRecord = require('../models/patientRecords')

// handle request to get all data instances
const getAddUserRecordsPage = (req, res) => {
    res.render('userAddRecord')
}

// handle request to get one data instance
const addNewUserRecord = async (req, res, next) => {
    try {
        newPatientRecord = new PatientRecord( req.body )
        await newPatientRecord.save()
        res.render('userAddRecordSuccess', {oneItem: PatientRecord})
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

