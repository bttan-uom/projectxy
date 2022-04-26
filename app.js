const exphbs = require('express-handlebars')

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

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to our routers
const peopleRouter = require('./routes/peopleRouter')

const userDashboardRouter = require('./routes/userDashboardRouter')

const userAddRecordRouter = require('./routes/userAddRecordRouter')

app.use('/userAddRecord', userAddRecordRouter)
// the demo routes are added to the end of the '/people' path
app.use('/userHistory', peopleRouter)
// the demo routes are added to the end of the '/people' path
app.use('/userDashboard', userDashboardRouter)
app.use('/', userDashboardRouter)

require('./models')


// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('MyGlucose is running!')
})

//  http://localhost:3000/userDashboard


