const express = require('express')

// create our Router object
const userDashboardRouter = express.Router()

// import people controller functions
const userDashboardController = require('../controllers/userDashboardController')

// add a route to handle the GET request for all people data
userDashboardRouter.get('/', userDashboardController.getAllPeopleData)

// add a route to handle the GET request for one data instance
userDashboardRouter.get('/:id', userDashboardController.getDataById)

// add a new JSON object to the database
userDashboardRouter.post('/', userDashboardController.insertData)

// export the router
module.exports = userDashboardRouter

