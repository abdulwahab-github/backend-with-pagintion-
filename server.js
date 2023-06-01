const express = require("express");
require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose");
const StudentRouter = require("./routes/studentRouter");
const TeacherRouter = require("./routes/teacherRouter")
const InstituteRouter = require("./routes/instituteRouter")
const CourseRouter = require("./routes/courseRouter")


const app = express();
app.use(express.json());
app.use(cors())
app.use("/api/student", StudentRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/institute", InstituteRouter);
app.use("/api/course",CourseRouter );
// app.use("/api/teacher", TeacherRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Database Connected Successfully and server is listening on this port 5000"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
