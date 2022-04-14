const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },

    image: { type: String },

    pass: { type: String, required: true },
    savedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    wishlistCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],

    savedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    followinstructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "instructor",
      },
    ],
    readlaterLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    likedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    likedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    commntedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],

    studentCart1: [ { 
       couresPrice : {type:Number}   ,
      
        coureObjdect: {
          type: Schema.Types.ObjectId,
          ref: "course",
        },
      
    }],

studentCart:{type:Array, courseprice:{type:Number},courseid:{ type: Schema.Types.ObjectId,
  ref: "course",}}
,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
//videoSchema.index({ title: 'text', description: 'text' })

const student = mongoose.model("student", studentSchema);
//Video.createIndexes();
module.exports = student;
