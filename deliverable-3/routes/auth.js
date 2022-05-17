const passport = require('passport')
const express = require('express')
const router = express.Router()
const userDashboardRouter = express.Router()
const userDashboardController = require('../controllers/userDashboardController')
const User = require('../models/user.js')


router.get('/', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login', layout: 'loggedout'})
})

router.post('/',
    passport.authenticate('local', {failureRedirect: '/auth', failureFlash: true}), 

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

    res.redirect('/auth')
})

module.exports = router


