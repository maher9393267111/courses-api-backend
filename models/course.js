const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  ctitle: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please add a course title"],
  },
  cdescription: {
    type: String,
    required: [true, "Please add a description"],
  },
  Coursename: {
    type: String,
    required: [true, "Please add name of course"],
  },
  lecturesNumber: {
    type: Number,
    // required: [true, 'Please add a description'],
  },
  youWellLearn: {
    type: String,
    // required: [true, 'Please add a minimum skill'],
    //
  },
  courseFor: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   bootcamp: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Bootcamp',
  //     required: true,
  //   },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "instructor",
    // required: true,
  },
  lectures: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "lecture",
      // required: true,
    },
  ],
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "student", // -->students
      // required: true,
    },
  ],
  role: {
    type: String,
    default: "instructor",

    // required: true,
  },

studentsReview:[{

    type: mongoose.Schema.ObjectId,
    ref: "student", // -->students
    // required: true,


}]


});



const course = mongoose.model("course", CourseSchema);
//Video.createIndexes();
module.exports = { course };