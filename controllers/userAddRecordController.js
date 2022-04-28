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
        if (req.body.record_type === undefined) {
            res.render('userAddRecordFail', {error: 'No record type selected.', clinician: clinician})
        } else if (req.body.value === '') {
            res.render('userAddRecordFail', {error: 'Cannot input empty value.', clinician: clinician})
        } else {
            /* Hard-coded for deliverable 2. Remove for deliverable 3. */
            req.body.username = 'pat.fakename@example.com'
            newPatientRecord = new Records(req.body)
            await newPatientRecord.save()
            
            // Hard-coded email for example in deliverable 2.
            // Not to be used in deliverable 3.
            const clinician = await joins.getClinician('pat.fakename@example.com')
            if (!clinician) {
                // Patient does not have a clinician
                return res.sendStatus(404)
            }

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

