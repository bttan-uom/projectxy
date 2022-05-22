// import people model
const Patients = require('../models/patients')
const joins = require('./joins')
const Clinicians = require('../models/clinicians')
const moment = require('moment')
const User = require('../models/user')
var tz = require('moment-timezone')

// handle request to get all people data instances
const renderClinicianDashboard = async (req, res, next) => {
    try { 
        const clinician = await joins.getClinician(res.userInfo.username)
        const patients = await joins.getAllPatientObjects(clinician)
        const messages = await joins.listAllMessages(clinician)
        const notes = await joins.getAllNotes(clinician)
        return res.render('clinicianDashboard', {clinician: clinician, patients: patients, layout: 'main2', nmessages: messages.length, nnotes: notes.length, npatients: patients.length})
    } catch (err) {
        return next(err)
    }
}

// handle request to get all people data instances
const renderClinicianPatientList = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        const nmessages = await joins.listAllMessages(clinician)
        res.render('clinicianViewAllPatients', {data: clinician.patients.reverse(), layout: 'main2', nmessages: nmessages.length})
    } catch (err) {
        return next(err)
    }  
}


// handle request to get one data instance
const getSinglePatient = async (req, res, next) => {
    // search the database by ID
    try {
        const patient = await joins.getPatient(req.params.patient_id)
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

const editSinglePatientPage = async (req, res, next) => {
    // search the database by ID
    try {
        const patient = await joins.getPatient(req.params.patient_id)
        if (!patient) {
            /* Record not associated with a patient. Should be impossible, but
            just in case */
            return res.sendStatus(404)
        }
        // found the record

        return res.render('clinicianEditPatient', {oneItem: patient, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}



// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        // found the record
        const patient = await joins.getPatient(req.params.patient_id)
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

const newMessage = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        res.render('clinicianSendMessage', {patients: clinician.patients, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const getMessages = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length !== 0) {
            /* Viewing an individual message */
            const patient = await joins.getPatient(req.query.user)
            const message = await joins.getAMessage(patient, req.query.message)
            res.render('oneMessageClinician', {patient: patient, message: message})
        } else {
            /* Viewing all messages */
            const clinician = await joins.getClinician(res.userInfo.username)
            const allmessages = await joins.listAllMessages(clinician)
            res.render('clinicianMessages', {npatients: clinician.patients.length, data: allmessages.reverse(), layout: 'main2'})
        }
    } catch (err) {
        return next(err)
    }
}

const sendPatientMessage = async (req, res, next) => {
    try {
        if (req.body.username === undefined || req.body.username === '') {
            res.render('clinicianSendMessageFail', {error: 'No username selected.'})
        } else if (req.body.comment === undefined || req.body.comment === '') {
            res.render('clinicianSendMessageFail', {error: 'Cannot send empty comment.'})
        } else if (req.body.timestamp === undefined || req.body.timestamp === '') {
            res.render('clinicianSendMessageFail', {error: 'Could not get current time.'})
        } else {
            const patient = await joins.getPatient(req.body.username)
            Patients.Patient.findOneAndUpdate(
                {"email": req.body.username}, 
                {$push: {messages: {content: req.body.comment, time: req.body.timestamp}}},
                {},
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
            );
            res.render('clinicianSendMessageSuccess', {patient: patient, layout: 'main2'})
        }
    } catch (err) {
        return next(err)
    }
}

const renderAllNotes = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length !== 0) {
            /* Viewing an individual note */
            const patient = await joins.getPatient(req.query.user)
            const note = await joins.getANote(patient, req.query.note)
            res.render('oneClinicalNote', {patient: patient, note: note})
        } else {
            /* Viewing all note */
            const clinician = await joins.getClinician(res.userInfo.username)
            const allnotes = await joins.getAllNotes(clinician)
            const allmessages = await joins.getAllMessages(clinician)
            res.render('clinicianNotes', {notes: allnotes.reverse(), npatients: clinician.patients.length, nmessages: allmessages.length, layout: 'main2'})    
        }
    } catch (err) {
        return next(err)
    }
}

const newNote = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        const allnotes = await joins.getAllNotes(clinician)
        const allmessages = await joins.getAllMessages(clinician)
        res.render('clinicianNewNote', {patients: clinician.patients, nnotes: allnotes.length, nmessages: allmessages.length, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const createNote = async (req, res, next) => {
    try {
        if (req.body.username === undefined || req.body.username === '') {
            res.render('clinicianCreateNoteFail', {error: 'No username selected.'})
        } else if (req.body.content === undefined || req.body.content === '') {
            res.render('clinicianCreateNoteFail', {error: 'Cannot create empty note.'})
        } else if (req.body.timestamp === undefined || req.body.timestamp === '') {
            res.render('clinicianCreateNoteFail', {error: 'Could not get current time.'})
        } else {
            const patient = await joins.getPatient(req.body.username)
            Patients.Patient.findOneAndUpdate(
                {"email": req.body.username}, 
                {$push: {notes: {content: req.body.content, time: req.body.timestamp}}},
                {},
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
            );
            res.render('clinicianCreateNoteSuccess', {patient: patient})
        }
    } catch (err) {
        return next(err)
    }
}

const getAddNewUserPage = async (req, res, next) => {
    try {
        const PatientsList = await Patients.Patient.find().lean()
        const clinicianUsername = res.userInfo.username

        res.render("clinicianAddPatient", {data: PatientsList.reverse(), clinician: clinicianUsername, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const addNewUser = async (req, res, next) => {
    try {
        newPatient = new Patients.Patient(req.body)
        await newPatient.save()


        const formatTemporaryPassword = moment(req.body.dob).tz('Australia/Melbourne').format("DD-MM-YYYY")

        newUser = new User({
            username: req.body.email,
            password: formatTemporaryPassword,
            role: "patient"

        })
        await newUser.save()
        
        Clinicians.findOneAndUpdate(
            {"email": res.userInfo.username},
            {$push: {
                    patients: {
                        $each: [{email: newPatient.email}]
                    }
            }}, 
            (err) => {
                if (err) {
                    console.log(err)
                }
            }
        );
        
        
        Patients.Patient.findOneAndUpdate(
            {"email": newPatient.email}, 
            {$push: {
                    thresholds: {
                        $each: [{name: "glucose", lower: req.body.blood_glucose_lower, upper: req.body.blood_glucose_upper}, 
                                {name: "insulin", lower: req.body.insulin_lower, upper: req.body.insulin_upper},
                                {name: "weight", lower: req.body.weight_lower, upper: req.body.weight_upper},
                                {name: "exercise", lower: req.body.exercise_lower, upper: req.body.exercise_upper}]

                    },
                    assigned_records: {
                        $each: [{record_type: "glucose", is_recording: req.body.glucose_required},
                                {record_type: "insulin", is_recording: req.body.insulin_required},
                                {record_type: "weight", is_recoridng: req.body.weight_required},
                                {record_type: "exercise", is_recording: req.body.exercise_required}]
                    }
                }
            },
            (err) => {
                if (err) {
                    console.log(err)
                }
            }
        );
        

        patientEmail = newPatient.email
        const redirectString = "patients/" + newPatient.email
        res.redirect(redirectString)

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    renderClinicianDashboard,
    getDataById,
    renderClinicianPatientList,
    getSinglePatient,
    sendPatientMessage,
    getMessages,
    newMessage,
    renderAllNotes,
    newNote,
    createNote,
    addNewUser,
    getAddNewUserPage,
    editSinglePatientPage
}

