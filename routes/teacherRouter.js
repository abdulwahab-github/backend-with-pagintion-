const express = require("express");
const {sendResponse} = require("../helper/helper")
const teacherModel = require("../models/teacherModel")

const route = express.Router();
route.get("/", async (req, res) => {
    try {
      const result = await teacherModel.find();
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result)).status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
});
route.get("/search", async (req, res) => {
    let {name,contact}=req.body
    try {
        if(name){
           const result = await teacherModel.find({
            name:name,
            contact:contact
        })
        if(!result){
            res.send( sendResponse (false, null, 'Data Not Found')).status(400)
        } else {
            res.send(sendResponse(true, result)).status(200)
        }
        }      
    
    }catch (e) {
        console.log(e)
        res.send(sendResponse(false, null, 'Internal error')).status(400)

    }
});
route.get("/teachers", async (req , res)=>{
  const page = parseInt(req.query.page);
  const pagesize = 2;

  try{
    const totalProducts = teacherModel.countDocuments();
    const skip = (page-1)*pagesize
    const totalPages = Math.ceil(totalProducts / pagesize );
    const teacher = await teacherModel.find().skip(skip).limit(pagesize)
    // console.log(course,"course")
    const Teacher = teacher.map((x) => {
      return {
        name: x.name,
          };
    });
  
    res.send(teacher).status(200)
  }catch(e){
console.log(e)
  }

})
route.get("/:id",async (req, res) => {
  let id = req.params.id;
  let result = await teacherModel.findById(id)
  if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)        
  }else{
      res.send(sendResponse(true,result)).status(200)        
  }
});
route.post("/", async (req, res) => {
  let { name,cource, contact } = req.body;
  try {
    let errArr = [];

    if (!name) {
      errArr.push("Required :  Name");
    }
    if (!cource) {
      errArr.push("Required : cource");
    }
     if (!contact) {
      errArr.push("Required : Contact");
    }
    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = {name,cource, contact};
      let teacher = new teacherModel(obj);
      await teacher.save();
      if (!teacher) {
        res
          .send(sendResponse(false, null, "Internal Server Error"))
          .status(400);
      } else {
        res.send(sendResponse(true, teacher, "Saved Successfully")).status(200);}
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Server1 Error"));
  }
});
route.put("/:id",async (req, res) => {
  let id = req.params.id;
  let result =await teacherModel.findById(id) 
  try{
      if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)      
      }else{
      let update = await teacherModel.findByIdAndUpdate(id,req.body,{new:true})     
      if(!update){
      res.send(sendResponse(false,null ,"Internal Error")).status(400)                  
      }else{
          res.send(sendResponse(true,update )).status(200)      
      }
      }
  }catch(e){
      console.log(e)
  }
});
route.delete("/:id",async (req, res) => {

  let id = req.params.id;
  let result =await teacherModel.findById(id) 
  try{
      if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)      
      }else{
      let del = await teacherModel.findByIdAndDelete(id)     
      if(!del){
      res.send(sendResponse(false,null ,"Internal Error")).status(400)                  
      }else{
          res.send(sendResponse(true,del,"Data Deleted")).status(200)      
      }
      }
  }catch(e){
      console.log(e)
  }


});
module.exports = route;
