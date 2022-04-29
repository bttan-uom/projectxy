const express = require('express')

// create our Router object
const userHistoryRouter = express.Router()

// import people controller functions
const userHistoryController = require('../controllers/userHistoryController')

// add a route to handle the GET request for all people data
userHistoryRouter.get('/', userHistoryController.getAllHistory)

// add a route to handle the GET request for one data instance
userHistoryRouter.get('/:patientRecord_id', userHistoryController.getDataById)

// export the router
module.exports = userHistoryRouter
