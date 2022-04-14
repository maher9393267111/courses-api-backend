const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = mongoose.Schema(
  {
    name: { type:String,required:true},
    title: { type: String },
    about: { type: String },
    image: { type: String },
    Role:{type:String, default:"instructor"  }  ,
    exprirence: {
      type: String,
    },

    hisCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    hisLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],


  },
  { timestamps: true }
);

const instructor = mongoose.model("instructor", instructorSchema);

module.exports =  instructor ;
