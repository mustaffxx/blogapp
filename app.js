// Modules
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Post')
    const Post = mongoose.model('Post')
    require('./models/Categorie')
    const Categorie = mongoose.model('Categorie')
    const passport = require('passport')
    require('./config/auth')(passport)
    const db = require('./config/db')
    // Routes import
    const admin = require('./routes/admin')
    const users = require('./routes/user')
    

// Configs
    // Session
        app.use(session({
            secret: 'nodejscourse',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log('Mondodb connected')
        }).catch((error) => {
            console.log('Error: ' + error)
        })  
    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Routes
    app.get('/', (req, res) => {
        Post.find().populate('categorie').sort({date: 'desc'}).then((posts) => {
            res.render('index', {posts: posts})
        }).catch((error) => {
            req.flash('error_msg', 'Error list post')
            res.redirect('/404')
        })        
    })

    app.get('/post/:slug', (req, res) => {
        Post.findOne({slug: req.params.slug}).then((post) => {
            if(post){
                res.render('post/index', {post: post})
            }else{
                req.flash('error_msg', 'This post doenst exists')
                res.redirect('/')
            }
        }).catch((error) => {
            req.flash('error_msg', 'error')
            res.redirect('/')
        })
    })

    app.get('/categories', (req, res) => {
        Categorie.find().then((categories) => {
            res.render('categories/index', {categories: categories})
        }).catch((error) => {
            req.flash('error_msg', 'categories list error')
            res.redirect('/')
        })
    })

    app.get('/categories/:slug', (req, res) => {
        Categorie.findOne({slug: req.params.slug}).then((categorie) => {
            if(categorie){
                Post.find({categorie: categorie._id}).then((posts) => {
                    res.render('categories/posts', {posts: posts, categorie: categorie})
                }).catch((error) => {
                    req.flash('error_msg', 'list post error')
                    res.redirect('/')
                })
            }else{
                req.flash('error_msg', 'categorie doenst exists')
                res.redirect('/')            }
        }).catch((error) => {
            req.flash('error_msg', 'categories list error')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Error 404!')
    })

    app.use('/admin', admin)
    app.use('/users', users)

// Others
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log('Server up!')
})