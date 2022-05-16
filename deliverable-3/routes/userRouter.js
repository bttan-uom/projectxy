const express = require('express')
const passport = require('passport')

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

userRouter.get('/history', isAuthenticated,
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAllHistory
);


userRouter.get('/:record_id', isAuthenticated, 
    function(req, res, next) {
        console.log("ABCDEFGHIKL")
        res.userInfo = req.user.toJSON()
        next()
    },
    userDashboardController.getDataById
)



// add a route to handle the GET request for one data instance


// add a route to handle the GET request for add records page
// userRouter.get('/addRecord', isAuthenticated, userDashboardController.getAddUserRecordsPage)

userRouter.get('/addRecord', isAuthenticated,
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getAddUserRecordsPage
);

// // add a new JSON object to the database
// userRouter.post('/addRecord', isAuthenticated, userDashboardController.addNewUserRecord)

userRouter.post('/addRecord', isAuthenticated,
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.addNewUserRecord
);


// // add a route to handle the GET request for one data instance
// userRouter.get('/history/:patient_id', isAuthenticated, userDashboardController.getDataById)

userRouter.post('/history/:record.record_id', isAuthenticated,
    function(req, res, next){ 
       res.userInfo = req.user.toJSON()
       next()
    },
    userDashboardController.getDataById
);


// export the router
module.exports = userRouter

