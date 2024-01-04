const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotesSchema = new Schema(
    {
        title : 
        {
            type: String,
            required : true,
            minlength : 3,
            maxlength : 50
        },

        content : 
        {
            type :String,
            required : true,
            minlength:1

        },

    },
    {
        timestamps: true,
    }
)

const Notes = mongoose.model('Notes', NotesSchema)
module.exports = Notes