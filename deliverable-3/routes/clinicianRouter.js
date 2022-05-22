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

clinicianRouter.post('/patients/edit', isAuthenticated, hasRole("clinician"), 
    function (req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.editUserInformation
);

clinicianRouter.get('/patients/edit', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.editPatientRecords
);




clinicianRouter.get('/patients', isAuthenticated, hasRole("clinician"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.getPatientRecords
);


clinicianRouter.get('/addNewPatient', isAuthenticated, hasRole("clinician"),
    function(req, res, next) { 
       res.userInfo = req.user.toJSON()
       next()
    },
    clinicianDashboardController.getAddNewUserPage
);

// add a route for GET request to clinician messages page
clinicianRouter.get('/messages', isAuthenticated, hasRole("clinician"), 
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.getMessages
);

// add a route for GET request to clinician new message page
clinicianRouter.get('/newmessage', isAuthenticated, hasRole("clinician"),
    function(req, res, next) { 
       res.userInfo = req.user.toJSON()
       next()
    },
    clinicianDashboardController.newMessage
);

// add a route for POST request for a message
clinicianRouter.post('/sendmessage', isAuthenticated, hasRole("clinician"), 
    function (req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.sendPatientMessage
);

// add a route for GET request to clinician notes page
clinicianRouter.get('/notes', isAuthenticated, hasRole("clinician"), 
    function (req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.renderAllNotes
);

// add a route for GET request to clinician new note page
clinicianRouter.get('/newnote', isAuthenticated, hasRole("clinician"),
    function(req, res, next) { 
       res.userInfo = req.user.toJSON()
       next()
    },
    clinicianDashboardController.newNote
);

// add a route for POST request for a clinical note
clinicianRouter.post('/createnote', isAuthenticated, hasRole("clinician"), 
    function (req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.createNote
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
    body('dob', 'cannot be empty').not().isEmpty().escape(),
    body('phone', 'must be a number').isNumeric().escape(),
    body('email', 'must be an email address').isEmail().escape(),
    body('address', 'cannot be empty').not().isEmpty().escape(),
    body('height', 'must be a number').isFloat({ min: 50, max: 272}).escape(),
    function(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('clinicianAddPatientFail', {layout: 'main2'})
        }
        res.userInfo = req.user.toJSON();
        next()
    },
    clinicianDashboardController.addNewUser
);

clinicianRouter.get('/comments', isAuthenticated, hasRole("clinician"),
    function(req,res,next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    clinicianDashboardController.getAllComments
)



module.exports = clinicianRouter
