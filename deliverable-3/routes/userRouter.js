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
        return res.redirect('/auth')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


userRouter.get('/', isAuthenticated,
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAllRecords
);

// user requests Home page - requires authentication
userRouter.get('/', isAuthenticated, (req, res) => {
    if (req.user.role === 'clinician') {
        res.redirect('/clinician')    // redirect users with 'teacher' role to teachers' home page
    }
    else
        res.userInfo = req.user.toJSON()
        userRouter.get('/', isAuthenticated, userDashboardController.getAllRecords)
})



// add a route to handle the GET request for one data instance
userRouter.get('/:patient_id', userDashboardController.getDataById)

// add a route to handle the GET request for add records page
userRouter.get('/userAddRecord', isAuthenticated, userAddRecordController.getAddUserRecordsPage)

// add a new JSON object to the database
userRouter.post('/userAddRecord', isAuthenticated, userAddRecordController.addNewUserRecord)

// add a route to handle the GET request for all people data
userRouter.get('/history', isAuthenticated, userHistoryController.getAllHistory)

// // add a route to handle the GET request for one data instance
userRouter.get('/history/:patient_id', isAuthenticated, userHistoryController.getDataById)

// export the router
module.exports = userRouter

