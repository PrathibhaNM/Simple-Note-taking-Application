const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync=require('../utils/catchAsync.js')

router.get('/register', (req,res) =>
{
    res.render('users/register')
})

router.post('/register', catchAsync(async(req,res) =>{
    try{
        const {username,email,password}=req.body
        const user = new User({email,username})
        const registeredUser = await User.register(user,password)
        req.login(registeredUser, function(err)
        {
             if(err) return next(err)
             req.flash('success', 'Welcome to Notes')
             res.redirect('/notes')
        })
        
        }
     
        catch(e)
        {
         req.flash('error', e.message)
         res.redirect('/register')
        }
}))

router.get('/login', (req,res) =>
{
    res.render('users/login')
})

router.post('/login', (req,res)=>
{
    req.flash('success', 'welcome back!!')
    const redirectUrl= res.locals.returnTo || '/notes'
    res.redirect(redirectUrl)
})

router.get('/logout', (req,res) =>
{

    req.logout(function(err) {
        if(err)
        {
            return next(err)
        }

        req.flash('success', "Successfully, logged out")
        res.redirect('/notes')
    });

})
module.exports=router