const joins = require('./joins')
const Patients = require("../models/patients")
const User = require("../models/user")
const bcrypt = require("bcrypt");

// handle request to get all data instances
const getAllRecords = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        let latest_message = "No message available"
        if (patient.messages.length > 0) {
            latest_message = patient.messages[patient.messages.length - 1].content
        }
        const tocomplete = await joins.getMessagesNotCompleted(patient)
        return res.render('index', {patient: patient, clinician: clinician, currentUser: res.userInfo, latest_message: latest_message, tocomplete: tocomplete})
    } catch (err) {
        return next(err)
    }
}

const getHistory = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0) {
            // Viewing all historical records
            const patient = await joins.getPatient(res.userInfo.username)
            const clinician = await joins.getClinician(patient.clinician)
            return res.render('history', {records: patient.records.reverse(), clinician: clinician, currentUser: res.userInfo})
        } else if (Object.keys(req.query).length === 1) {
            // Viewing a single record
            const patient = await joins.getPatient(res.userInfo.username)
            const clinician = await joins.getClinician(patient.clinician)
            const record = await joins.getARecord(patient, req.query.record)
            return res.render('oneData', {patient: patient, clinician: clinician, record: record})
        }
    } catch (err) {
        return next(err)
    }
}

// handle request to get all data instances
const getAddUserRecordsPage = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        const tocomplete = await joins.getMessagesNotCompleted(patient)
        res.render('userAddRecord', {oneItem: patient, clinician: clinician, tocomplete: tocomplete})
    } catch(err) {
        return next(err)
    }
}

// handle request to get all data instances
const getUserInformation = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userInformation', {patient: patient, clinician: clinician, userInfo: res.userInfo})
    } catch(err) {
        return next(err)
    }
}


const renderEditUserInformation = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userEditInformation', {patient: patient, clinician: clinician})
    } catch(err) {
        return next(err)
    }
}

const editUserInformation = async (req, res, next) => {
    try { 
        const patient = await joins.getPatient(res.userInfo.username)
        const oldPatientUsername = res.userInfo.username
        if (!patient) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }

        Patients.Patient.updateOne(
            {email: patient.email},
            {$set: {first_name: req.body.first_name, 
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    gender: req.body.gender,
                    height: req.body.height,
                    dob: req.body.dob
            }}, (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
        )
        
        const salt = await bcrypt.genSalt(10);

        User.updateOne(
            {username: oldPatientUsername},
            {$set:{username: req.body.email,
                   password: await bcrypt.hash(req.body.password, salt),
                   role: "patient"
            }}, (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
        )

        res.redirect('/auth')

    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const addNewUserRecord = async (req, res, next) => {
    try {
        const patient = joins.getPatient(res.userInfo.username)
        const clinician = joins.getClinician(patient.clinician)
        console.log(req.body)

        if (req.body.record_type === undefined) {
            res.render('userAddRecordFail', {error: 'No record type selected.', clinician: clinician})
        } else if (req.body.value === '') {
            res.render('userAddRecordFail', {error: 'Cannot input empty value.', clinician: clinician})
        } else {


            Patients.Patient.findOneAndUpdate(
                {"email": res.userInfo.username},
                {$push: {
                        records: {
                            $each: [{record_type: req.body.record_type, value: req.body.value, comments: req.body.comments, created_at: new Date(), updatedAt: new Date()}]
                        }
                }},
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
            );
            
            res.render('userAddRecordSuccess', {oneItem: patient, clinician: clinician})
        }
    } catch (err) {
        return next(err)
    }
}

// handle request to get all messages from a clinician
const getMessages = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userMessages', {clinician: clinician, data: patient.messages.reverse(), length: patient.messages.length})
    } catch(err) {
        return next(err)
    }
}

const getAMessage = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        const message = await joins.getAMessage(patient, req.params.message_id)
        res.render('oneMessagePatient', {clinician: clinician, message: message})
    } catch(err) {
        return next(err)
    }
}

const getLeaderboard = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        await joins.updateEngagement(patient)
        const rankings = await joins.getTopFive()
        const position = await joins.inLeaderboard(patient, rankings)
        res.render('userLeaderboard', {clinician: clinician, leaderboard: rankings, position: position, engagement: patient.engagement_rate})
    } catch(err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllRecords,
    getHistory,
    getAddUserRecordsPage,
    addNewUserRecord,
    getUserInformation,
    renderEditUserInformation,
    editUserInformation,
    getMessages,
    getAMessage,
    getLeaderboard
}
