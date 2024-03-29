const exphbs = require('express-handlebars')
const moment = require('moment');
const crypto = require('crypto');
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
        secret: process.env.SESSION_SECRET || 'diabetesathome',
        name: 'myglucose-app', // The cookie name (CHANGE THIS)
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

// app.get('/', (req, res) => {
//     res.redirect("/user")
// })

// link to our routers
const clinicanRouter = require('./routes/clinicianRouter')
const userRouter = require('./routes/userRouter')
const auth = require('./routes/auth')
app.use('/auth', auth);
app.use('/user', userRouter);
app.use('/clinician',clinicanRouter);




require('./models')




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

hbs.handlebars.registerHelper('generateHash', function(encodeString) {

    hash = crypto.getHashes();

    hashPwd = crypto.createHash('sha1').update(encodeString).digest('hex');
  
    console.log(hash); 

    return hash;
});


hbs.handlebars.registerHelper('formatDate', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("DD/MM/YY")
    );
});

hbs.handlebars.registerHelper('compareMale', function(givenGender) {
    if (givenGender == "Male"){
        return "selected"
    }
});
hbs.handlebars.registerHelper('compareFemale', function(givenGender) {
    if (givenGender == "Female"){
        return "selected"
    }
});
hbs.handlebars.registerHelper('compareOther', function(givenGender) {
    if (givenGender == "Other"){
        return "selected"
    }
});

hbs.handlebars.registerHelper('formatDateLongYear', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("DD/MM/YYYY")
    );
});

hbs.handlebars.registerHelper('formatLongDate', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("MMMM Do YYYY<br> h:mm a zz")
    );
});

hbs.handlebars.registerHelper('formatCurrentDateForPost', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("YYYY-MM-DD")
    );
});

hbs.handlebars.registerHelper('formatCurrentDateForPost', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("YYYY-MM-DD")
    );
});

hbs.handlebars.registerHelper('negativeThreshold', function(threshold) {
    if (threshold == -1){
        return "Not Recorded"
    }
    else{
        return threshold
    }
});

hbs.handlebars.registerHelper('shouldUserRecord', function(threshold) {
    if (threshold == -1){
        return false
    }
    else{
        return true
    }
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

hbs.handlebars.registerHelper('one_record_compare', function(record_id, id_to_compare) {
    if (record_id == id_to_compare){
        return true
    }
    return false;
});

hbs.handlebars.registerHelper('print_data', function(data) {
    console.log(data)
    return true
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


hbs.handlebars.registerHelper('getTimestamp', function() {
    return new hbs.handlebars.SafeString(
        moment().tz('Australia/Melbourne').format()
    );
});

hbs.handlebars.registerHelper('formatLongDateNoBreak', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).tz('Australia/Melbourne').format("MMMM Do YYYY h:mm a")
    );
});

hbs.handlebars.registerHelper('formatUpper', function (str) {
    if (typeof str === String) {
        return str.replace(/^\w/, (c) => c.toUpperCase());
    }
})

hbs.handlebars.registerHelper('previewString', function (str) {
    if (str == "" || str == null) {
        return str
    }
    if (str.length < 50) {
        return str
    }
    return str.slice(0, 50) + "..."
})

hbs.handlebars.registerHelper('isInLeaderboard', function (position) {
    if (position == 0) {
        return "<h3>You aren't on the leaderboard, but keep trying!</h3>"
    }
    let pos = ""
    if (position % 10 == 1) {
        pos = 'st'
    } else if (position % 10 == 2) {
        pos = 'nd'
    } else if (position % 10 == 3) {
        pos = 'rd'
    } else {
        pos = 'th'
    }

    return '<h3>You are ' + position + pos + ' on the leaderboard</h3>'
});

// greater than or equal to
hbs.handlebars.registerHelper('isEngagementHigh', function(engagement) {
    if (engagement >= 0.8) {
        return '<p><img style="width:3rem" src="/img/badges/badge1.png"></p><p>Congratuations! Your engagement rate is ' + (engagement * 100).toFixed(0) + '%</p>'
    }
    return '<p>Your engagement rate is ' + (engagement * 100).toFixed(0) + "%. Keep recording your data, and if you get above 80%, you'll earn a special badge!</p>"
});

hbs.handlebars.registerHelper('formatEngagement', function(engagement) {
    return (engagement * 100).toFixed(0)
});


hbs.handlebars.registerHelper('formatThresholds', function(threshold) {
    if (threshold == "glucose"){
        return "Blood Glucose (nMol/L)"
    }
    if (threshold == "insulin"){
        return "Insulin (doses)"
    }
    if (threshold == "weight"){
        return "Weight (kg)"
    }
    if (threshold == "exercise"){
        return "Exercise (steps)"
    }
});

hbs.handlebars.registerHelper('formatRecord', function(record) {
    if (record == "Not recorded") {
        return 'style=\"background-color: #FFA630;\"'
    }
});

hbs.handlebars.registerHelper('highlightErrorRow', function(error) {
    if (error != 'None') {
        return 'style=\"background-color: #FFA630;\"'
    }
});

hbs.handlebars.registerHelper('if_no_records_left', function(tocomplete) {
    if (tocomplete.length == 0) {
        return '<p>Well done on entering all your records for today!</p>'
    }
});

hbs.handlebars.registerHelper('get_num_records_left', function(tocomplete) {
    if (tocomplete.length == 0) {
        return '<h3>0</h3>'
    }
    return '<h3>' + tocomplete.length + '</h3>'
});

app.get('/', (req, res) => {
    res.render('welcome.hbs', {layout: "loggedout"})
})
app.get('/aboutus', (req, res) => {
    res.render('aboutus.hbs', {layout: "loggedout"})
})
app.get('/aboutdiabetes', (req, res) => {
    res.render('aboutdiabetes.hbs', {layout: "loggedout"})
})

// if user attempts to access any other route, send a 404 error with a customized page
app.get('*', (req, res) => {
    res.render('404.hbs', {layout: "loggedout"})
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('MyGlucose is running!')
})