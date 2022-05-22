// import people model
const Patients = require('../models/patients')
const joins = require('./joins')
const Clinicians = require('../models/clinicians')

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
const getPatientRecords = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0) {
            /* Viewing all patients */
            const clinician = await joins.getClinician(res.userInfo.username)
            const patients = await joins.getAllPatientObjects(clinician)
            const messages = await joins.listAllMessages(clinician)
            const notes = await joins.getAllNotes(clinician)
            res.render('clinicianViewAllPatients', {patients: patients, layout: 'main2', messages: messages.length, notes: notes.length})
        } else if (Object.keys(req.query).length === 1) {
            /* Viewing a single patient */
            const patient = await joins.getPatientById(req.query.user)
            const records = await joins.getAllRecords(patient)
            return res.render('clinicianViewPatient', {patient: patient, records: records, layout: 'main2'})
        } else if (Object.keys(req.query).length === 2) {
            /* Viewing an individual patient record */
            const patient = await joins.getPatientById(req.query.user)
            const record = await joins.getARecord(patient, req.query.record)
            return res.render('onePatientRecordClinician', {patient: patient, record: record, layout: 'main2'})
        }
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
            const patient = await joins.getPatientById(req.query.user)
            const message = await joins.getAMessage(patient, req.query.message)
            res.render('oneMessageClinician', {patient: patient, message: message, layout: 'main2'})
        } else {
            /* Viewing all messages */
            const clinician = await joins.getClinician(res.userInfo.username)
            const allmessages = await joins.listAllMessages(clinician)
            const notes = await joins.getAllNotes(clinician)
            res.render('clinicianMessages', {messages: allmessages.reverse(), layout: 'main2', patients: clinician.patients.length, notes: notes.length})
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
            const patient = await joins.getPatientById(req.query.user)
            const note = await joins.getANote(patient, req.query.note)
            res.render('oneClinicalNote', {patient: patient, note: note, layout: 'main2'})
        } else {
            /* Viewing all note */
            const clinician = await joins.getClinician(res.userInfo.username)
            const allnotes = await joins.getAllNotes(clinician)
            const allmessages = await joins.listAllMessages(clinician)
            res.render('clinicianNotes', {notes: allnotes.reverse(), patients: clinician.patients.length, messages: allmessages.length, layout: 'main2'})    
        }
    } catch (err) {
        return next(err)
    }
}

const newNote = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        const allnotes = await joins.getAllNotes(clinician)
        const allmessages = await joins.listAllMessages(clinician)
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
            res.render('clinicianCreateNoteSuccess', {patient: patient, layout: 'main2'})
        }
    } catch (err) {
        return next(err)
    }
}

const getAddNewUserPage = async (req, res, next) => {
    try {
        const clinician = await joins.getClinician(res.userInfo.username)
        res.render("clinicianAddPatient", {patients: clinician.patients.length, clinician: clinician.email, layout: 'main2'})
    } catch (err) {
        return next(err)
    }
}

const addNewUser = async (req, res, next) => {
    try {
        newPatient = new Patients.Patient(req.body)
        await newPatient.save()
        
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
    getPatientRecords,
    sendPatientMessage,
    getMessages,
    newMessage,
    renderAllNotes,
    newNote,
    createNote,
    addNewUser,
    getAddNewUserPage
}

