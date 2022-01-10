const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');

const pool = require('../database');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username,password, done) => {

    const rows = await pool.query('Select * from users where username = ?', [username]);
    if(rows.length){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password,user.password);
        if(validPassword)
            done(null, user, req.flash('success', 'Welcome '+ user.fullname));
        else
            done(null, false, req.flash('message', 'Incorrect Password'));
    }
    else
        return done(null, false, req.flash('message', 'Username doesn\'t exists'));

}));

passport.use('local.signup',new LocalStrategy({
    usernameField:'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{ 
    const newUser = { username, password, fullname: req.body.fullname };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=> {
    const rows = await pool.query('Select * from users where id = ?', [id]);
    done(null, rows[0]);
});