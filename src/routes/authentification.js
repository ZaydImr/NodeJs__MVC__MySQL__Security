const express = require('express');
const { route } = require('.');
const router = express.Router();

const passport = require('passport');

router.get('/profile',(req,res)=>{
    res.send('This is your profile :)')
});

router.get('/signup',(req,res)=>{
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

module.exports = router;