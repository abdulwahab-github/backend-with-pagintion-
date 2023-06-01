const express = require("express");
const studentModel = require("../models/studentModel");
const { sendResponse } = require("../helper/helper");

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await studentModel.find();
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
  let {firstName,lastName} = req.body
    try {
      if(firstName){
      const result = await studentModel.find({
      firstName:firstName,
      lastName:lastName,
    })
    if (!result) {
      res.send(sendResponse(true, null, 'Data Not Found')).status(404)
    } else {
      res.send(sendResponse(true, result)).status(200)
    }
  }    
 
  } catch (e) {
    console.log(e)
    res.send(sendResponse(true, null, 'Internal error')).status(400)

  }
});
route.get("/students", async (req , res)=>{
  const page = parseInt(req.query.page);
  const pagesize = 2;

  try{
    const totalProducts = studentModel.countDocuments();
    const skip = (page-1)*pagesize
    const totalPages = Math.ceil(totalProducts / pagesize );
    const students = await studentModel.find().skip(skip).limit(pagesize)
    // console.log(course,"course")
    const Students = students.map((x) => {
      return {
        name: x.firstName,
          };
    });
  
    res.send(students).status(200)
  }catch(e){
console.log(e)
  }

})
route.get("/:id", async (req, res) => {
  let id = req.params.id
  try {
    const result = await studentModel.findById(id)
    if (!result) {
      res.send(sendResponse(true, null, 'Data Not Found')).status(400)
    } else {
      res.send(sendResponse(true, result)).status(200)
    }
  } catch (e) {
    console.log(e)
    res.send(sendResponse(true, null, 'Internal error')).status(400)
  }
});
route.post("/", async (req, res) => {
  let { firstName, lastName,email,password, contact } = req.body;
  try {
    let errArr = [];

    if (!firstName) {
      errArr.push("Required : First Name");
    }
    if (!email) {
      errArr.push("Required : Email");
    }
    if (!password) {
      errArr.push("Required : Password");
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
      let obj = { firstName, lastName,email,password, contact};
      let student = new studentModel(obj);
      await student.save();
      if (!student) {
        res
          .send(sendResponse(false, null, "Internal Server Error"))
          .status(400);
      } else {
        res.send(sendResponse(true, student, "Saved Successfully")).status(200);
      }
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Servre Error"));
  }
});
route.put("/:id", async (req, res) => {
  let id = req.params.id;
  let result = await studentModel.findById(id)
  try {
    if (!result) {
      res.send(sendResponse(false, null, 'Data Not Found')).status(404)
    } else { 
      let UpdateResult = await studentModel.findByIdAndUpdate(id,req.body,{
        new:true,
      })

      if (!UpdateResult) {
        res.send(sendResponse(false, null, 'Data Not Found')).status(400)
      } else {
        res.send(sendResponse(true, UpdateResult, "Data deleted successfuly")).status(200)
      }

    }
  } catch (e) {
    console.log(e)
    res.send(sendResponse(false, null, 'internal Error')).status(400)
  }

});
route.delete("/:id", async (req, res) => {
  let id = req.params.id
  let result = await studentModel.findById(id)
  try {
    if (!result) {
      res.send(sendResponse(false, null, 'Data Not Found')).status(404)
    } else {
      let deleteResult = await studentModel.findByIdAndDelete(id)
      if (!deleteResult) {
        res.send(sendResponse(false, null, 'Data Not Found')).status(400)
      } else {
        res.send(sendResponse(true, result, "Data deleted successfuly")).status(200)
      }
    }
  } catch (e) {
    console.log(e)
    res.send(sendResponse(false, null, 'internal Error')).status(400)
  }

});

module.exports = route;
