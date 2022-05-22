const joins = require('./joins')

// handle request to get all data instances
const getAllRecords = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        const latest_message = patient.messages[patient.messages.length - 1].content
        return res.render('index', {patient: patient, clinician: clinician, currentUser: res.userInfo, latest_message: latest_message})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        return res.render('oneData', {oneItem: patient, clinician: clinician, recordToView: req.params.record_id})
    } catch (err) {
        return next(err)
    }
}

const getAllHistory = async (req, res, next) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        return res.render('history', {data: patient, clinician: clinician, currentUser: res.userInfo})
    } catch (err) {
        return next(err)
    }
}

// handle request to get all data instances
const getAddUserRecordsPage = async (req, res) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userAddRecord', {oneItem: patient, clinician: clinician})
    } catch(err) {
        return next(err)
    }
}

// handle request to get all data instances
const getUserInformation = async (req, res) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userInformation', {patient: patient, clinician: clinician, userInfo: res.userInfo})
    } catch(err) {
        return next(err)
    }
}


const renderEditUserInformation = async (req, res) => {
    try {
        const patient = await joins.getPatient(res.userInfo.username)
        const clinician = await joins.getClinician(patient.clinician)
        res.render('userEditInformation', {patient: patient, clinician: clinician})
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
        const clinician = await joins.getClinician(patient.email)
        console.log(clinician);
        const rankings = await joins.getTopFive()
        const position = await joins.inLeaderboard(patient.email, rankings)
        res.render('userLeaderboard', {clinician: clinician, leaderboard: rankings, position: position, engagement: patient.engagement_rate})
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
    getUserInformation,
    renderEditUserInformation,
    getMessages,
    getAMessage,
    getLeaderboard
}
