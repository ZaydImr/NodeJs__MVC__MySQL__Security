const express = require('express');
const router = express.Router();

const pool = require('../database');

// Get Links
router.get('/', async (req,res)=>{
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', {links});
});

// Add Link
router.get('/add',(req,res)=>{
    res.render('links/add')
});

router.post('/add',async (req,res)=>{
    const { title, url, description } = req.body;
    const newLink = { title, url, description };
    await pool.query('INSERT INTO links set ?', [newLink]);
    res.redirect('/links');
});

// Edit Link
router.get('/edit/:id',async (req,res)=>{
    const link = await pool.query('SELECT * FROM links where id=?',req.params.id);
    res.render('links/edit',{link:link[0]})
});

router.post('/edit/:id',async (req,res)=>{
    const { id } = req.params;
    const { title, url, description} = req.body;
    const newLink = { title, url, description };
    await pool.query('UPDATE links set ? where id = ?', [newLink, id]);
    console.log(newLink,id);
    res.redirect('/links');
});

// Delete Link
router.get('/delete/:id', async (req,res)=>{
    await pool.query('DELETE FROM links where id=?',req.params.id);
    res.redirect('/links');
});

module.exports = router;