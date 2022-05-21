const Records = require('../models/patientRecords')
const joins = require('./joins')

// handle request to get all data instances
const getAddUserRecordsPage = async (req, res) => {
    try {
        const patient = joins.getPatient(res.userInfo.username)
        const clinician = joins.getClinician(patient.clinician)
        res.render('userAddRecord', {clinician: clinician})
    } catch(err) {
        return next(err)
    }
}

// handle request to get one data instance
const addNewUserRecord = async (req, res, next) => {
    try {
        if (req.body.record_type === undefined) {
            res.render('userAddRecordFail', {error: 'No record type selected.', clinician: clinician})
        } else if (req.body.value === '') {
            res.render('userAddRecordFail', {error: 'Cannot input empty value.', clinician: clinician})
        } else {
            newPatientRecord = new Records(req.body)
            await newPatientRecord.save()
            
            const patient = joins.getPatient(res.userInfo.username)
            const clinician = joins.getClinician(patient.clinician)
            res.render('userAddRecordSuccess', {clinician: clinician})
        }
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAddUserRecordsPage,
    addNewUserRecord
}

