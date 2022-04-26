const express = require('express')

// create our Router object
const userAddRecordRouter = express.Router()

// import controller functions
const userAddRecordController = require('../controllers/userAddRecordController')

// add a route to handle the GET request for add records page
userAddRecordRouter.get('/', userAddRecordController.getAddUserRecordsPage)

// add a new JSON object to the database
userAddRecordRouter.post('/', userAddRecordController.addNewUserRecord)

// export the router
module.exports = userAddRecordRouter


