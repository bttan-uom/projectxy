// import people model
const Author = require('../models/patientRecords')

// handle request to get all people data instances
const renderClinicianDashboard = async (req, res, next) => {
    try {
        const patientRecords = await Author.find().lean()
    res.render('clinicianDashboard', {data: patientRecords, layout: 'main2'})
    } catch (err) {
        return next(err)
    }  
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const author = await Author.findById(req.params.patientRecord_id).lean()
        if (!author) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found the author
        return res.render('onePatientRecordClinician', {oneItem: author, layout: 'main2'})
    } catch (err) {
        return next(err)
    }

}

module.exports = {
    renderClinicianDashboard,
    getDataById
}

