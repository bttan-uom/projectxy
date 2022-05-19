const express = require('express')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const { redirect } = require('express/lib/response')

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

// set up role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole) 
            return next()
        else if (req.user.role=="patient"){
            res.redirect('/user')
        }
        else if (req.user.role=="clinician"){
            res.redirect('/clinician')
        }
        else {
            res.redirect('/auth')
        }
    }    
}


clinicianRouter.get('/', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.renderClinicianDashboard
);


clinicianRouter.get('/patients', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.renderClinicianPatientList
);


clinicianRouter.get('/patients/:patient_id/:record_id', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.getDataById
);


clinicianRouter.get('/patients/:patient_id', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.getSinglePatient
);

clinicianRouter.get('/addNewPatient', isAuthenticated, hasRole("clinician"),
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    clinicianDashboardController.getAddNewUserPage
);

clinicianRouter.post('/addNewPatient', isAuthenticated, hasRole("clinician"),
    body('first_name', 'cannot be empty').not().isEmpty().escape(),
    body('last_name', 'cannot be empty').not().isEmpty().escape(),
    body('phone', 'must be a number').isNumeric().escape(),
    body('email', 'must be an email address').isEmail().escape(),
    body('address', 'cannot be empty').not().isEmpty().escape(),
    body('height', 'must be a number').isFloat({ min: 50, max: 272}).escape(), 
    body("thresholds.*.blood_glucose_lower", "TOO LOW").isFloat({ min: 5, max: 5 }).escape(),
    function(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.send(errors) // if validation errors, do not process data
        }
        res.userInfo = req.user.toJSON();
        next()
    },
    clinicianDashboardController.addNewUser
);

module.exports = clinicianRouter


/*
ROUTERS THAT NEED TO BE COMPLETE:
- clinicial note
*/