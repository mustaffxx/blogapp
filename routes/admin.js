const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorie')
const Categorie = mongoose.model('Categorie')
require('../models/Post')
const Post = mongoose.model('Post')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/categories', (req, res) => {
    Categorie.find().sort({date: 'desc'}).then((categories => {
        res.render('admin/categories', {categories: categories})
    })).catch((error) => {
        req.flash('error_msg', 'List categories error')
        res.redirect('/admin')
    })
    
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

router.get('/categories/edit/:id', (req, res) => {
    Categorie.findOne({_id: req.params.id}).then((categorie) => {
        res.render('admin/editcategories', {categorie: categorie})
    }).catch((error) => {
        req.flash('error_msg', 'Categorie doenst exist')
        res.redirect('/admin/categories')
    })
    
})

router.post('/categories/edit', (req, res) => {
    Categorie.findOne({_id: req.body.id}).then((categorie) => {
        categorie.name = req.body.name
        categorie.slug = req.body.slug
        categorie.save().then(() => {
            req.flash('success_msg', 'Categorie edited success')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_msg', 'Categorie edit error')
            res.redirect('/admin/categories')
        })
    }).catch((error) => {
        req.flash('error_msg', 'Categorie edit error')
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', (req, res) => {
    Categorie.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categorie deleted')
        res.redirect('/admin/categories')
    }).catch((error) => {
        req.flash('error_msg', 'Categorie delete error')
        res.redirect('/admin/categories')
    })
})

router.get('/posts', (req, res) => {
    Post.find().populate('categorie').sort({date: 'desc'}).then((posts) => {
        res.render('admin/posts', {posts: posts})
    }).catch((error) => {
        req.flash('error_msg', 'Error post list')
        res.redirect('/admin')
    })
    
})

router.get('/posts/add', (req, res) => {
    Categorie.find().then((categories) => {
        res.render('admin/addposts', {categories: categories})
    }).catch((error) => {
        req.flash('error_msg', 'Error load form')
        res.redirect('/admin')
    })
})

router.post('/posts/new', (req, res) => {
    var errors = []
    if(req.body.categorie == "0"){
        errors.push({text: 'Invalid categorie'})
    }
    if(errors.length > 0){
        res.render('admin/addposts', {errors: errors})
    }else{
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            categorie: req.body.categorie,
            slug: req.body.slug
        }
        new Post(newPost).save().then(() => {
            req.flash('success_msg', 'Post created')
            res.redirect('/admin/posts')
        }).catch((error) => {
            req.flash('error_msg', 'Create post save error')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then((post) => {
        Categorie.find().then((categories) => {
            res.render('admin/editposts', {categories: categories, post: post})
        }).catch((error) => {
            req.flash('error_msg', 'List categories error')
            res.redirect('/admin/posts')
        })

    }).catch((error) => {
        req.flash('error_msg', 'Form edit load failed')
        res.redirect('/admin/posts')
    })
    
})

router.post('/posts/edit', (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        post.title = req.body.title
        post.slug = req.body.body
        post.description = req.body.description
        post.content = req.body.content
        post.categorie = req.body.categorie
        post.save().then(() => {
            req.flash('success_msg', 'Post edited')
            res.redirect('/admin/posts')
        }).catch((error) => {
            req.flash('error_msg', 'Post edit error')
            res.redirect('/admin/posts')
        })
    }).catch((error) => {
        req.flash('error_msg', 'Error save edition')
        res.redirect('/admin/posts')
    })
})

router.get('/posts/delete/:id', (req, res) => {
    Post.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Post deleted')
        res.redirect('/admin/posts')
    }).catch((error) => {
        req.flash('error_msg', 'Delete error')
        res.redirect('/admin/posts')
    })
})

module.exports = router