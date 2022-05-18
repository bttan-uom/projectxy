// import people model
const Records = require('../models/patientRecords')
const Patients = require('../models/patients')
const joins = require('./joins')

// handle request to get all people data instances
const renderClinicianDashboard = async (req, res, next) => {
    try { 
        const clinician = await joins.getClinicianOnly(res.userInfo.username)
        if (!clinician) {
            return res.sendStatus(404)
        }
        const patients = await Patients.Patient.find().lean()
        return res.render('clinicianDashboard', {clinician: clinician, data: patients, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

// handle request to get all people data instances
const renderClinicianPatientList = async (req, res, next) => {
    try {
        const PatientsList = await Patients.Patient.find().lean()
        res.render('clinicianViewAllPatients', {data: PatientsList.reverse(), layout: 'main2'})
    } catch (err) {
        return next(err)
    }  
}


// handle request to get one data instance
const getSinglePatient = async (req, res, next) => {
    // search the database by ID
    try {
        const patient = await joins.getAPatient(req.params.patient_id)
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        // found the record

        return res.render('clinicianViewPatient', {oneItem: patient, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}



// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        // found the record
        const patient = await joins.getAPatient(req.params.patient_id)
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        return res.render('onePatientRecordClinician', {patient: patient, layout: 'main2', recordToShow: req.params.record_id})
    } catch (err) {
        return next(err)
    }

}

// const addNewUserRecord = async (req, res, next) => {
//     try {
//         if (req.body.record_type === undefined) {
//             res.render('userAddRecordFail', {error: 'No record type selected.', clinician: clinician})
//         } else if (req.body.value === '') {
//             res.render('userAddRecordFail', {error: 'Cannot input empty value.', clinician: clinician})
//         } else {
//             /* Hard-coded for deliverable 2. Remove for deliverable 3. */
//             req.body.username = 'pat.fakename@example.com'
//             newPatientRecord = new Records(req.body)
//             await newPatientRecord.save()
            
//             // Hard-coded email for example in deliverable 2.
//             // Not to be used in deliverable 3.
//             const clinician = await joins.getClinician('pat.fakename@example.com')
//             if (!clinician) {
//                 // Patient does not have a clinician
//                 return res.sendStatus(404)
//             }

//             res.render('userAddRecordSuccess', {oneItem: patient, clinician: clinician})
//         }
//     } catch (err) {
//         return next(err)
//     }
// }

const getAddNewUserPage = async (req, res, next) => {
    try {
        const PatientsList = await Patients.Patient.find().lean()
        res.render("clinicianAddPatient", {data: PatientsList.reverse(), layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const writeMessage = async (req, res, next) => {
    try {
        const patient = await joins.getAPatient(req.params.patient_id)
        if (!patient) {
            res.sendStatus(404)
        }

        res.render('clinicianSendMessage', {patient: patient})
    } catch (err) {
        return next(err)
    }
}

const getMessages = async (req, res, next) => {
    res.render('clinicianMessages')
}


const sendPatientMessage = async (req, res, next) => {
    try {
        if (req.body.username === undefined) {
            res.render('clinicianSendMessageFail', {error: 'No username selected.'})
        } else if (req.body.comment === '') {
            res.render('clinicianSendMessageFail', {error: 'Cannot send empty comment.'})
        } else {
            const patient = await joins.getAPatient(req.body.username)
            patient.messages.push({content: req.body.comment, time: req.body.timestamp})
            res.render('clinicianSendMessageSuccess', {patient: patient})
        }
    } catch (err) {
        return next(err)
    }
}

// const addNewUser = async (req, res, next) => {
//     try {

//     } catch (err) {
//         return next(err)
//     }
// }

module.exports = {
    renderClinicianDashboard,
    getDataById,
    renderClinicianPatientList,
    getSinglePatient,
    // addNewUser,
    getAddNewUserPage,
    sendPatientMessage,
    getMessages,
    writeMessage
}

