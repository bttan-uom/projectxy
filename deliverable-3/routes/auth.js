const passport = require('passport')
const express = require('express')
const router = express.Router()
const userDashboardRouter = express.Router()
const userDashboardController = require('../controllers/userDashboardController')
const User = require('../models/user.js')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Main page which requires login to access
// Note use of authentication middleware here
// router.get('/', isAuthenticated, (req, res) => {
//     res.render('index', { title: 'Express', user: req.user })
    
// })


router.get('/', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login', layout: 'loggedout'})
})

router.post('/',
    passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), 
    (req, res) => { 
        console.log(req.user.username + ' logged in with role ' + req.user.role)  // for debugging

        if (req.user.role == "patient"){
            res.redirect('/user')   // login was successful, send user to home page
        }
        else if (req.user.role == "clinician"){
            res.redirect('/clinician')
        }

        
    }   
    
)

// Handle logout
router.post('/logout', (req, res) => {
    req.logout()

    res.redirect('/login')
})

module.exports = router


