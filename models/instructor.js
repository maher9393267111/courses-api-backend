//const mongoose = require("../db/mongoConnection");
const Schema = mongoose.Schema;

const instructorSchema = mongoose.Schema(
  {
    name: { type:String,required:true},
    title: { type: String },
    about: { type: String },
    image: { type: String },
    exprirence: {
      type: String,
    },

    hisCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const instructor = mongoose.model("instructor", instructorSchema);

module.exports = { instructor };
