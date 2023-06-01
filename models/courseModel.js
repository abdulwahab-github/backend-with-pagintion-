const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    fees:{
        type:String,
        require:true
    },
    shortname:{
        type:String,
        require:true

    },
    
})

const courseModel = mongoose.model('course',courseSchema)
module.exports = courseModel
