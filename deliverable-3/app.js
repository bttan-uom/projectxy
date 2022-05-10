const exphbs = require('express-handlebars')
const moment = require('moment');
var tz = require('moment-timezone');


// Import express
const express = require('express')
// Set your app up as an express app
const app = express()


const flash = require('express-flash')  // for showing login error messages
const session = require('express-session')  // for managing user sessions
app.use(express.static('public'))   // define where static assets like CSS live
app.use(express.urlencoded({ extended: true })) // needed so that POST form works
app.use(flash())


app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'myglucose-app', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1800000 // sessions expire after 30 minutes
        },
    })
)



// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')

var hbs = exphbs.create({});

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input



// use PASSPORT
const passport = require('./passport.js')
app.use(passport.authenticate('session'))

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// set up role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole) 
            return next()
        else {
            res.redirect('/')
        }
    }
}


// use EXPRESS-VALIDATOR (not actually used at this stage)
const { body, validationResult } = require('express-validator')
const { redirect } = require('express/lib/response')

// process login attempt
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  // if bad login, send user back to login page
    (req, res) => { 
        console.log('user ' + req.user.username + ' logged in with role ' + req.user.role)     // for debugging
        res.redirect('/')   // login was successful, send user to home page
    }
)

// user requests Home page - requires authentication
app.get('/', isAuthenticated, (req, res) => {
    if (req.user.role === 'clinician') {
        res.redirect('/clinicianDashboard')    // redirect users with 'teacher' role to teachers' home page
    }
    else {
        res.render('userDashboard.hbs', {student: req.user.toJSON()})    // users without 'teacher' role (students) go to this page
    }
})

// user requests Teachers page - requires authentication AND user must have 'teacher' role
app.get('/clinicianDashboard', isAuthenticated, hasRole('clinician'), async (req, res) => {
//  allStudents = await User.find({role:'patient'}, {username:true, address:true, _id:false}).lean() // get list of all students, to render for teacher

})



// user logs out
app.post('/logout', (req, res) => {
    req.logout()          // kill the session
    res.redirect('/')     // redirect user to Home page, which will bounce them to Login page
})






// link to our routers
const userHistoryRouter = require('./routes/userHistoryRouter')

const userDashboardRouter = require('./routes/userDashboardRouter')

const userAddRecordRouter = require('./routes/userAddRecordRouter')

const clinicanDashboardRouter = require('./routes/clinicianDashboardRouter')


// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianMessages', (req, res) => {
    res.render('clinicianMessages', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianViewAllPatients', (req, res) => {
    res.render('clinicianViewAllPatients', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianNotes', (req, res) => {
    res.render('clinicianNotes', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/addClinicalNote', (req, res) => {
    res.render('addClinicalNote', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/oneMessageClinician', (req, res) => {
    res.render('oneMessageClinician', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianSendMessage', (req, res) => {
    res.render('clinicianSendMessage', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/oneClinicalNote', (req, res) => {
    res.render('oneClinicalNote', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianViewPatient', (req, res) => {
    res.render('clinicianViewPatient', {layout : 'main2'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/login', (req, res) => {
    res.render('login', {layout : 'loggedout'});
});

// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
app.get('/clinicianAddPatient', (req, res) => {
    res.render('clinicianAddPatient', {layout : 'main2'});
});





app.use('/userAddRecord', userAddRecordRouter)
app.use('/userHistory', userHistoryRouter)
app.use('/userDashboard', userDashboardRouter)
app.use('/clinicianDashboard', clinicanDashboardRouter)
app.use('/', userDashboardRouter)

require('./models')

// if user attempts to access any other route, send a 404 error with a customized page
app.get('*', (req, res) => {
    res.render('404.hbs')
})



// limit an array to a maximum of elements (from the start)
hbs.handlebars.registerHelper('limit', function (arr, limit) {
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(0, limit);
});

hbs.handlebars.registerHelper('getCurrentDate', function() {
    return new hbs.handlebars.SafeString(
        moment().tz('Australia/Melbourne').format("DD/MM/YY")
    );
});

hbs.handlebars.registerHelper('formatDate', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("DD/MM/YY")
    );
});

hbs.handlebars.registerHelper('formatLongDate', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("MMMM Do YYYY<br> h:mm a zz")
    );
});

hbs.handlebars.registerHelper ('truncate', function (str, len) {
    if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr (0, len);
        new_str = str.substr (0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr (0, len);
        
        return new hbs.handlebars.SafeString ( new_str +'...' ); 
    }
    return str;
});


hbs.handlebars.registerHelper('if_eq', function(record_type, patientData) {
    if (record_type == "Blood Glucose"){
        const upperGlucoseThreshold = 5.6;
        const lowerGlucoseThreshold = 3.9;
        
        var outOfStyle = 'style="background: #FFA630;"';
        if ((patientData > upperGlucoseThreshold) || (patientData < lowerGlucoseThreshold)) {
            // outOfRange = true;
            return outOfStyle;
        }
    }
    return 'style="background-color:var(--grey);"';//outOfRange;
});

hbs.handlebars.registerHelper('if_eq_clinician_dashboard', function(record_type, patientData) {
    if (record_type == "Blood Glucose"){
        const upperGlucoseThreshold = 5.6;
        const lowerGlucoseThreshold = 3.9;
        var outOfStyle = 'style="background: #FFA630;"';
        if ((patientData > upperGlucoseThreshold) || (patientData < lowerGlucoseThreshold)) {
            // outOfRange = true;
            return outOfStyle;
        }
    }
    return 'style="background-color:var(#FFFFFF);"';//outOfRange;
});

hbs.handlebars.registerHelper('if_threshold_text', function(record_type, patientData) {
    if (record_type == "Blood Glucose"){
        const upperGlucoseThreshold = 5.6;
        const lowerGlucoseThreshold = 3.9;
        if ((patientData > upperGlucoseThreshold) || (patientData < lowerGlucoseThreshold)) {
            // outOfRange = true;
            var thresholdWarning = 'Threshold Warning';
            return thresholdWarning;
        }
    }
    return 'None';
});

hbs.handlebars.registerHelper('isOverThreshold', function(record_type, patientData) {
    if (record_type == "Blood Glucose"){
        const upperGlucoseThreshold = 5.6;
        const lowerGlucoseThreshold = 3.9;
        return ((patientData > upperGlucoseThreshold) || (patientData < lowerGlucoseThreshold))

    }
    return false;
});

hbs.handlebars.registerHelper('isFromToday', function (givenDate) {
    const currentDate = new Date();
    const convertCurrentDate = moment(currentDate).tz('Australia/Melbourne').format("DD/MM/YY");
    const convertGivenDate = moment(givenDate).tz('Australia/Melbourne').format("DD/MM/YY");
    return convertGivenDate == convertCurrentDate;
});


// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('MyGlucose is running!')
})