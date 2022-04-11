//const mongoose = require("../db/mongoConnection");
const Schema = mongoose.Schema;

const instructorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: { type: String },

    image: { type: String },

    categoryCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
cateegoryParent:{
    type: Schema.Types.ObjectId,
    ref: "parentcat",

}


  },
  { timestamps: true }
);

const category = mongoose.model("category", categorySchema);

module.exports = category ;
