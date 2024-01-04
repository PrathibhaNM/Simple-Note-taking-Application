const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose') // for passport-local-mongoose we need to install passport and passport-local

const userSchema = new Schema({
    email : {
        type : String,
        required:true,
        unique : true
    }
}) 

userSchema.plugin(passportLocalMongoose) // It will add usename and passport to the userSchema
const User = mongoose.model('User', userSchema)
module.exports=User