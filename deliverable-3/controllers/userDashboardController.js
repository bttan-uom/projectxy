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
    try {
        const patient = await joins.getAPatient(res.userInfo.username)
        if (!patient) {
            // Patient does not have a clinician
            return res.sendStatus(404)
        }
        // found the author
        return res.render('oneData', {oneItem: patient})
    } catch (err) {
        return next(err)
    }
    
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllRecords,
    getDataById
}
