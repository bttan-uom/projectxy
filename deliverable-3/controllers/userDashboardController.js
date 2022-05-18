const Patients = require('../models/patients')

const joins = require('./joins')

// handle request to get all data instances
const getAllRecords = async (req, res, next) => {
    console.log(res.userInfo)
    // if (req.session.customerID == undefined){
    //     // for the weird URL's
    //     res.redirect("/user/login")
    // }
    try {
        // Hard-coded email for example in deliverable 2.
        // Not to be used in deliverable 3.
        const clinician = await joins.getClinician(res.userInfo.username)
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        return res.render('index', {data: patient, clinician: clinician, currentUser: res.userInfo})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    console.log(req.params.record_id);

    const recordToView = req.params.record_id
    try {
        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            return res.sendStatus(404)
        }

        const clinician = await joins.getClinician(res.userInfo.username)
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        
        return res.render('oneData', {oneItem: patient, clinician: clinician, recordToView: req.params.record_id})
    } catch (err) {
        return next(err)
    }
}

const getAllHistory = async (req, res, next) => {
    console.log(res.userInfo)

    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        return res.render('history', {data: patient, clinician: clinician, currentUser: res.userInfo})
    } catch (err) {
        return next(err)
    }
}


// handle request to get all data instances
const getAddUserRecordsPage = async (req, res) => {
    // console.log("Test")
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        if (!clinician) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        res.render('userAddRecord', {oneItem: patient, clinician: clinician})
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

            res.render('userAddRecordSuccess', {oneItem: patient, clinician: clinician})
        }
    } catch (err) {
        return next(err)
    }
}

// handle request to get all messages from a clinician
const getMessages = async (req, res, next) => {
    try {
        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            return res.sendStatus(404)
        }
        const clinician = await joins.getClinician(res.userInfo.username)
        if (!clinician) {
            return res.sendStatus(404)
        }
        res.render('userMessages', {clinician: clinician, data: patient.messages.reverse(), length: patient.messages.length})
    } catch(err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllRecords,
    getDataById,
    getAllHistory,
    getAddUserRecordsPage,
    addNewUserRecord,
    getMessages
}
