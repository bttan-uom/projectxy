// import people model
const Author = require('../models/patientRecords')

// handle request to get all people data instances
const renderClinicianDashboard = (req, res) => {
    res.render('clinicianDashboard', {layout: 'main2'})  
}

module.exports = {
    renderClinicianDashboard
}

