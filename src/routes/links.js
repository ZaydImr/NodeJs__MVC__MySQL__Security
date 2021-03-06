const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Get Links
router.get('/', isLoggedIn, async (req,res)=>{
    const links = await pool.query('SELECT * FROM links where user_id = ?', [req.user.id]);
    res.render('links/list', {links});
});

// Add Link
router.get('/add', isLoggedIn, (req,res)=>{
    res.render('links/add')
});

router.post('/add', isLoggedIn, async (req,res)=>{
    const { title, url, description } = req.body;
    const newLink = { title, url, description, user_id: req.user.id };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

// Edit Link
router.get('/edit/:id', isLoggedIn, async (req,res)=>{
    const link = await pool.query('SELECT * FROM links where id=?',req.params.id);
    res.render('links/edit',{link:link[0]})
});

router.post('/edit/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    const { title, url, description} = req.body;
    const newLink = { title, url, description };
    await pool.query('UPDATE links set ? where id = ?', [newLink, id]);
    req.flash('success', 'Link updated successfully');
    res.redirect('/links');
});

// Delete Link
router.get('/delete/:id', isLoggedIn,  async (req,res)=>{
    await pool.query('DELETE FROM links where id=?',req.params.id);
    req.flash('success', 'Link Removed successfully');
    res.redirect('/links');
});

module.exports = router;