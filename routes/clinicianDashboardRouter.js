const express = require('express')

// create our Router object
const clinicanDashboardRouter = express.Router()

const clinicianDashboardController = require('../controllers/clinicianDashboardController')


clinicanDashboardRouter.get('/', clinicianDashboardController.renderClinicianDashboard)


module.exports = clinicanDashboardRouter