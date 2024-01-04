const express = require('express')

const mongoose = require('mongoose')
const catchAsync=require('../utils/catchAsync.js')
const router = express.Router()
const Note = require('../models/notes.js')



router.get('/', catchAsync(async(req,res) =>
{
    const notes = await Note.find({})
    res.render('notes/index', {notes})
}))

router.get('/new', catchAsync(async(req, res) =>
{
    res.render('notes/new')
}))



router.get('/:id/edit', catchAsync(async(req,res) =>
{
    const {id} = req.params
    const note = await Note.findById(id)
    res.render('notes/edit', {note})
}))

router.post('/', catchAsync(async(req,res) =>
{
    const newNote = new Note(req.body)
   
    await newNote.save()
    console.log(newNote)
    res.redirect(`/notes/${newNote._id}`)
}))

router.delete('/:id', catchAsync(async(req,res) =>
{
    const {id} = req.params
    const note = await Note.findByIdAndDelete(id)
    res.redirect('/notes')
}))

router.get('/:id', catchAsync(async(req,res) =>
{
    const {id} = req.params
    const note =await Note.findById(id)
    res.render('notes/showDetails', {note})
}))

router.put('/:id', catchAsync(async(req,res) => 
{
    const {id}= req.params
    const note = await Note.findByIdAndUpdate(id,req.body, {runValidators : true, new : true})
    res.redirect(`/notes/${note._id}`)
}))

module.exports=router