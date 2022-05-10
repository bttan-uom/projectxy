const express = require('express')
const passport = require('passport')

// create our Router object
const userHistoryRouter = express.Router()

// import people controller functions
const userHistoryController = require('../controllers/userHistoryController')

const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// add a route to handle the GET request for all people data
userHistoryRouter.get('/', isAuthenticated, userHistoryController.getAllHistory)

// add a route to handle the GET request for one data instance
userHistoryRouter.get('/:patientRecord_id', isAuthenticated,  userHistoryController.getDataById)

// export the router
module.exports = userHistoryRouter
