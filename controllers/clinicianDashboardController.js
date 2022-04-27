// import people model
const Author = require('../models/patientRecords')

// handle request to get all people data instances
const renderClinicianDashboard = (req, res) => {
    res.render('clinicianDashboard', {layout: 'main2'})  
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
        return res.render('onePatientRecordClinician', {oneItem: author})
    } catch (err) {
        return next(err)
    }

}

module.exports = {
    renderClinicianDashboard
}

