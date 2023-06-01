const mongoose = require("mongoose")

const TeacherSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    }, 
    cource:{
        type:String,
        require:true
    },
    contact:{
        type:String,
        required:true
    }
});

const teacherModel = mongoose.model("teachers",TeacherSchema)
module.exports  = teacherModel;