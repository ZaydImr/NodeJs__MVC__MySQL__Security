const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');

passport.use('local.signup',new LocalStrategy({
    usernameField:'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{ 
    const newUser = { username, password, fullname: req.body.fullname };
    await pool.query('INSERT INTO users SET ?', [newUser]);
}));

// passport.serializeUser((usr,done)=>{

// });