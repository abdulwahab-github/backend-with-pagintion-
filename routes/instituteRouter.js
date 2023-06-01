const express = require("express");
const instituteModel = require("../models/instituteModel");
const { sendResponse } = require("../helper/helper");

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await instituteModel.find();
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
  let {name,telephone}=req.body
  try {
      if(name){
         const result = await instituteModel.find({
          name:name,
          telephone:telephone
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
route.get("/institutes", async (req , res)=>{
  const page = parseInt(req.query.page);
  const pagesize = 2;

  try{
    const totalProducts = instituteModel.countDocuments();
    const skip = (page-1)*pagesize
    const totalPages = Math.ceil(totalProducts / pagesize );
    const institute = await instituteModel.find().skip(skip).limit(pagesize)
    // console.log(course,"course")
    const Institute = institute.map((x) => {
      return {
        name: x.name,
          };
    });
  
    res.send(institute).status(200)
  }catch(e){
console.log(e)
  }

})

route.get("/:id",async (req, res) => {
  let id = req.params.id;
  let result = await instituteModel.findById(id)
  if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)        
  }else{
      res.send(sendResponse(true,result)).status(200)        
  }
});
route.post("/", async (req, res) => {
  let { name, address,shortname,telephone } = req.body;
  try {
    let errArr = [];

    if (!name) {
      errArr.push("Required :  Name");
    }
    if (!address) {
      errArr.push("Required : Address");
    }
    if (!shortname) {
      errArr.push("Required : Short Name");
    }
    if (!telephone) {
      errArr.push("Required : Telephone");
    }
    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = { name, address,shortname,telephone};
      let institute = new instituteModel(obj);
      await institute.save();
      if (!institute) {
        res
          .send(sendResponse(false, null, "Internal Server Error"))
          .status(400);
      } else {
        res.send(sendResponse(true, institute, "Saved Successfully")).status(200);
      }
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Servre Error"));
  }
});
route.put("/:id",async (req, res) => {
  let id = req.params.id;
  let result =await instituteModel.findById(id) 
  try{
      if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)      
      }else{
      let update = await instituteModel.findByIdAndUpdate(id,req.body,{new:true})     
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
  let result =await instituteModel.findById(id) 
  try{
      if(!result){
      res.send(sendResponse(false,null ,"data not found")).status(404)      
      }else{
      let del = await instituteModel.findByIdAndDelete(id)     
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
