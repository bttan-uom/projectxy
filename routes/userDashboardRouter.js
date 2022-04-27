const express = require('express')

// create our Router object
const userDashboardRouter = express.Router()

// import people controller functions
const userDashboardController = require('../controllers/userDashboardController')

// add a route to handle the GET request for all people data
userDashboardRouter.get('/', userDashboardController.getAllRecords)

// add a route to handle the GET request for one data instance
userDashboardRouter.get('/:patientRecord_id', userDashboardController.getDataById)

// export the router
module.exports = userDashboardRouter

