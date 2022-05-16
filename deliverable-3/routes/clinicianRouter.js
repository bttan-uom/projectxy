const express = require('express')
const passport = require('passport')

// create our Router object
const clinicianRouter = express.Router()

const clinicianDashboardController = require('../controllers/clinicianDashboardController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/auth')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

clinicianRouter.get('/', isAuthenticated, clinicianDashboardController.renderClinicianDashboard)

clinicianRouter.get('/patients', isAuthenticated, clinicianDashboardController.renderClinicianPatientList)

clinicianRouter.get('/:patientRecord_id', isAuthenticated, clinicianDashboardController.getDataById)

clinicianRouter.get('/patients/:patient_id', isAuthenticated, clinicianDashboardController.getSinglePatient)








module.exports = clinicianRouter


/*
ROUTERS THAT NEED TO BE COMPLETE:
- clinician viewing all patients
- messages
- clinicial note
*/