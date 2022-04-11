//const mongoose = require("../db/mongoConnection");
const Schema = mongoose.Schema;

const lectureSchema = mongoose.Schema(
  {
    writer: { type: Schema.Types.ObjectId, ref: "instructor" },
    title: { type: String},
    description: { type: String },
    image:{type:String},
    createdAt: {
      type: Date,
      default: Date.now,
    },





    
  },
  { timestamps: true }
);
//videoSchema.index({ title: 'text', description: 'text' })

const Lecture = mongoose.model("Lecture", lectureSchema);
//Video.createIndexes();
module.exports =  Lecture ;