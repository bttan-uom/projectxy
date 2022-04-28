// import people model
const Records = require('../models/patientRecords')

const joins = require('./joins')

// handle request to get all people data instances
const renderClinicianDashboard = async (req, res, next) => {
    try {
        const patientRecords = await Records.find().lean()
        res.render('clinicianDashboard', {data: patientRecords.reverse(), layout: 'main2'})
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
            // no record found in database
            return res.sendStatus(404)
        }
        // found the record

        const patient = await joins.getAPatient('pat.fakename@example.com')
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        return res.render('onePatientRecordClinician', {oneItem: record, layout: 'main2', patient: patient})
    } catch (err) {
        return next(err)
    }

}

module.exports = {
    renderClinicianDashboard,
    getDataById
}

