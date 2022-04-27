const exphbs = require('express-handlebars')
const moment = require('moment');


// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

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
const userHistoryRouter = require('./routes/userHistoryRouter')

const userDashboardRouter = require('./routes/userDashboardRouter')

const userAddRecordRouter = require('./routes/userAddRecordRouter')

const clinicanDashboardRouter = require('./routes/clinicianDashboardRouter')

app.use('/userAddRecord', userAddRecordRouter)
app.use('/userHistory', userHistoryRouter)
app.use('/userDashboard', userDashboardRouter)
app.use('/clinicianDashboard', clinicanDashboardRouter)
app.use('/', userDashboardRouter)

require('./models')


// limit an array to a maximum of elements (from the start)
hbs.handlebars.registerHelper('limit', function (arr, limit) {
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(0, limit);
});

hbs.handlebars.registerHelper('formatDate', function(dateString) {
    return new hbs.handlebars.SafeString(
        moment(dateString).format("DD/MM/YY").toUpperCase()
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



// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('MyGlucose is running!')
})