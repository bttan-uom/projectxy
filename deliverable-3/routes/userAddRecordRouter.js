const express = require('express')
const passport = require('passport')

// create our Router object
const userAddRecordRouter = express.Router()

// import controller functions
const userAddRecordController = require('../controllers/userAddRecordController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// add a route to handle the GET request for add records page
userAddRecordRouter.get('/', isAuthenticated, userAddRecordController.getAddUserRecordsPage)

// add a new JSON object to the database
userAddRecordRouter.post('/', isAuthenticated, userAddRecordController.addNewUserRecord)

// export the router
module.exports = userAddRecordRouter


