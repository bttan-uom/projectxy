const express = require('express')

// create our Router object
const userRouter = express.Router()

// import people controller functions
const userHistoryController = require('../controllers/userHistoryController')
const userDashboardController = require('../controllers/userDashboardController')
const userAddRecordController = require('../controllers/userAddRecordController')

// add a route to handle the GET request for all people data
userRouter.get('/', userDashboardController.getAllRecords)

// add a route to handle the GET request for one data instance
userRouter.get('/:patientRecord_id', userDashboardController.getDataById)

// add a route to handle the GET request for add records page
userRouter.get('/userAddRecord', userAddRecordController.getAddUserRecordsPage)

// add a new JSON object to the database
userRouter.post('/userAddRecord', userAddRecordController.addNewUserRecord)

// add a route to handle the GET request for all people data
userRouter.get('/history', userHistoryController.getAllHistory)

// // add a route to handle the GET request for one data instance
userRouter.get('/history/:patientRecord_id', userHistoryController.getDataById)

// export the router
module.exports = userRouter

