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

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash())

// Track authenticated users through login sessions
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}

// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'))

// Load authentication router
const authRouter = require('./routes/auth')
app.use(authRouter)

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


// link to our routers
const clinicanRouter = require('./routes/clinicianRouter')

const userRouter = require('./routes/userRouter')


// THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianMessages', (req, res) => {
//     res.render('clinicianMessages', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianViewAllPatients', (req, res) => {
//     res.render('clinicianViewAllPatients', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianNotes', (req, res) => {
//     res.render('clinicianNotes', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/addClinicalNote', (req, res) => {
//     res.render('addClinicalNote', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/oneMessageClinician', (req, res) => {
//     res.render('oneMessageClinician', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianSendMessage', (req, res) => {
//     res.render('clinicianSendMessage', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/oneClinicalNote', (req, res) => {
//     res.render('oneClinicalNote', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianViewPatient', (req, res) => {
//     res.render('clinicianViewPatient', {layout : 'main2'});
// });

// // THESE ARE JUST FOR TESTING, NOT CONNECTED TO ANY ROUTERS
// app.get('/clinicianAddPatient', (req, res) => {
//     res.render('clinicianAddPatient', {layout : 'main2'});
// });




app.use('/user', userRouter);
app.use('/clinician',clinicanRouter);


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