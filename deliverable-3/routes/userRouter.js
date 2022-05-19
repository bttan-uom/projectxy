const express = require('express')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const { redirect } = require('express/lib/response')

// create our Router object
const userRouter = express.Router()

// import people controller functions
const userDashboardController = require('../controllers/userDashboardController')

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


userRouter.get('/', isAuthenticated, hasRole("patient"),
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAllRecords
);

// add a route for GET request to user messages page
userRouter.get('/messages', isAuthenticated, hasRole("patient"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    userDashboardController.getMessages
);

// add a route for GET request to user messages page
userRouter.get('/messages/:message_id', isAuthenticated, hasRole("patient"),
    function(req, res, next) {
        res.userInfo = req.user.toJSON()
        next()
    },
    userDashboardController.getAMessage
);

userRouter.get('/history/:record_id', isAuthenticated, hasRole("patient"), 
    function(req, res, next) {

        res.userInfo = req.user.toJSON()
        next()
    },
    userDashboardController.getDataById
)

// userRouter.post('/history/:record_id', isAuthenticated, hasRole("patient"),
//     function(req, res, next){ 
//        console.log(req.params.record_id)
//        res.userInfo = req.user.toJSON()
//        next()
//     },
//     userDashboardController.getDataById
// );

userRouter.get('/history', isAuthenticated, hasRole("patient"),
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAllHistory
);


userRouter.get('/:record_id', isAuthenticated, hasRole("patient"), 
    function(req, res, next) {

        res.userInfo = req.user.toJSON()
        next()
    },
    userDashboardController.getDataById
)






// add a route to handle the GET request for add records page

userRouter.get('/addRecord', isAuthenticated, hasRole("patient"),
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAddUserRecordsPage
);

// // add a new JSON object to the database

userRouter.post('/addRecord', isAuthenticated, hasRole("patient"),
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.addNewUserRecord
);



// export the router
module.exports = userRouter

