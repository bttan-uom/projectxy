const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

// Hardcode user for now
// const USER = { id: 123, username: 'user', password: 'password', secret: 'info30005' }


// Updated serialize/deserialize functions
passport.serializeUser((user, done) => {
    done(undefined, user._id)
})
passport.deserializeUser((userId, done) => {
    User.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

// Updated LocalStrategy function
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect username or password',
                })
            }

            // Check password
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect username or password',
                    })
                }
            
                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
    })
)

module.exports = passport


