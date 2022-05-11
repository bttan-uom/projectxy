const express = require('express')
const passport = require('passport')

// create our Router object
const userRouter = express.Router()

// import people controller functions
const userHistoryController = require('../controllers/userHistoryController')
const userDashboardController = require('../controllers/userDashboardController')
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

// add a route to handle the GET request for all people data
userRouter.get('/', isAuthenticated, userDashboardController.getAllRecords)

// add a route to handle the GET request for one data instance
// userRouter.get('/:patientRecord_id', userDashboardController.getDataById)

// add a route to handle the GET request for add records page
userRouter.get('/userAddRecord', isAuthenticated, userAddRecordController.getAddUserRecordsPage)

// add a new JSON object to the database
userRouter.post('/userAddRecord', isAuthenticated, userAddRecordController.addNewUserRecord)

// add a route to handle the GET request for all people data
userRouter.get('/history', isAuthenticated, userHistoryController.getAllHistory)

// // add a route to handle the GET request for one data instance
userRouter.get('/history/:patientRecord_id', isAuthenticated, userHistoryController.getDataById)

// export the router
module.exports = userRouter

