const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const method_override=require('method-override')
const ExpressError = require('./utils/ExpressError.js')
const ejsMate = require('ejs-mate')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const flash = require('connect-flash')
const app= express()
const notesRoutes = require('./routes/notes')
const userRoutes=require('./routes/user')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/Notes-Taking')
const db= mongoose.connection
db.on("error", console.error.bind(console,"connection error"))
db.once("open", () =>
{
    console.log("Database connected")
})



app.use(flash())
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended : true}))
app.use(method_override('_method'))

const sessionConfig = {
    name : 'session',
    secret :'thisshouldbeabettersecret!',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // Date.now() in milliseconds, we want the expiry after week so multiply
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>
{
  
    //console.log(req.user)
    res.locals.success = req.flash('success') 
    res.locals.error = req.flash('error')
    res.locals.currentUser=req.user // req.user is from passport , which stores the session information of who is logged in
    next()
})

app.use('/notes',notesRoutes)
app.use('/', userRoutes)

app.get('/',(req,res) =>
{
    res.render('home')
})

app.all('*', (req,res,next) =>
{
    next(new ExpressError('page Not found!!',404))
})

app.use((err,req,res,next) =>
{
    const {status = 500}=err
    if(!err.message) err.message="Something went wrong"
    res.status(status).render('error', {err})
})

app.listen(3000, () =>
{
    console.log("App listening on the port 3000")
})