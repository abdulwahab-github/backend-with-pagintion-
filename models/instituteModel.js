const mongoose = require('mongoose')

const instituteSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    shortname:{
        type:String,
    },
    telephone:{
        type:String,
        required:true
    },
    
})

const instituteModel = mongoose.model('institute',instituteSchema)
module.exports = instituteModel
