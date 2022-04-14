const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema= mongoose.Schema(
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
        ref: "course",
      },
    ],
categoryParent:{
    type: Schema.Types.ObjectId,
    ref: "parentcat",

}


  },
  { timestamps: true }
);

const category = mongoose.model("category", categorySchema);

module.exports = category ;
