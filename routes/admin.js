const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorie')
const Categorie = mongoose.model('Categorie')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Posts page')
})

router.get('/categories', (req, res) => {
    res.render('admin/categories')
})

router.get('/categories/add', (req, res) => {
    res.render('admin/addcategories')
})

router.post('/categories/new', (req, res) => {
    var errors = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: 'Invalid name'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Invalid Slug'})
    }
    if(req.body.name.length < 2){
        errors.push({text: 'Small name'})
    }

    if(errors.length > 0){
        res.render('admin/addcategories', {errors: errors})
    }else{
        const newCategorie = {
            name: req.body.name,
            slug: req.body.slug
        }
    
        new Categorie(newCategorie).save().then(() => {
            req.flash('success_msg', 'Categorie created!')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_msg', 'Save error, try again.')
            res.redirect('/admin')
        })         
    }    
})

module.exports = router