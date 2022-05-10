const express = require('express')
const passport = require('passport')

// create our Router object
const userDashboardRouter = express.Router()

// import people controller functions
const userDashboardController = require('../controllers/userDashboardController')


// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// add a route to handle the GET request for all people data
userDashboardRouter.get('/', isAuthenticated, userDashboardController.getAllRecords)

// add a route to handle the GET request for one data instance
userDashboardRouter.get('/:patientRecord_id', isAuthenticated, userDashboardController.getDataById)

// export the router
module.exports = userDashboardRouter

