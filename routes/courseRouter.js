const express = require("express");
const courseModel = require("../models/courseModel")
const { sendResponse } = require("../helper/helper");

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await courseModel.find();
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
  let {name}=req.body
  try {
      if(name){
       const result = await courseModel.find({
          name:name
      }) 
       if (!result) {
          res.send(sendResponse(false, null, 'Data Not Found')).status(400)
      } else {
          res.send(sendResponse(true, result)).status(200)
      }
           
      }
     
  } catch (e) {
      console.log(e)
      res.send(sendResponse(false, null, 'Internal error')).status(400)

  }
});
 
route.get("/courses", async (req , res)=>{
  const page = parseInt(req.query.page);
  const pagesize = 2;

  try{
    const totalProducts = courseModel.countDocuments();
    const skip = (page-1)*pagesize
    const totalPages = Math.ceil(totalProducts / pagesize );
    const course = await courseModel.find().skip(skip).limit(pagesize)
    // console.log(course,"course")
    const Course = course.map((x) => {
      return {
        name: x.name,
          };
    });
  
    res.send(course).status(200)
  }catch(e){
console.log(e)
  }

})





route.post("/", async (req, res) => {
  let { name, duration,fees,shortname } = req.body;
  try {
    let errArr = [];

    if (!name) {
      errArr.push("Required :  Name");
    }
    if (!duration) {
      errArr.push("Required :  Duration");
    }
    if (!shortname) {
      errArr.push("Required : Short Name");
    }
    if (!fees) {
      errArr.push("Required : fees");
    }
    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = { name, duration,fees,shortname};
      let course = new courseModel(obj);
      await course.save();
      if (!course) {
        res
          .send(sendResponse(false, null, "Internal Server Error"))
          .status(400);
      } else {
        res.send(sendResponse(true, course, "Saved Successfully")).status(200);
      }
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Servre Error"));
  }
});
route.get("/:id", async (req, res) => {
  let id = req.params.id
  try {
      const result = await courseModel.findById(id)
      if (!result) {
          res.send(sendResponse(true, null, 'Data Not Found')).status(404)
      } else {
          res.send(sendResponse(true, result)).status(200)
      }
  } catch (e) {
      console.log(e)
      res.send(sendResponse(true, null, 'Internal error')).status(400)
  }
});
route.put("/:id", async (req, res) => {
  let id = req.params.id
  let result = await courseModel.findById(id)

  try {
      if(!result){
          res.send(sendResponse(false, null, 'Data Not Found')).status(404)            
      } else {
          let update = await courseModel.findByIdAndUpdate(id,req.body,{
              new:true,
          }) 
          if(!update){
          res.send(sendResponse(false, null, 'Data Not Found')).status(404)                            
          }else{
              res.send(sendResponse(true, update, 'Data Update')).status(200)            
          }
      }
  } catch (e) {
      res.send(sendResponse(false, null, 'Internal Error')).status(400)
  }



});
route.delete("/:id", async (req, res) => {
let id = req.params.id;
let result =await courseModel.findById(id)

if(!result){
  res.send(sendResponse(false, null, 'Data Not Found')).status(404)                                
}else{
  let deleResult = await courseModel.findByIdAndDelete(id)
  if(!deleResult){
  res.send(sendResponse(false, null, 'Data Not Deleted')).status(400)
}else{
  res.send(sendResponse(true, deleResult, 'Data Deleted')).status(200)                                            
  }
}
});

module.exports = route;
