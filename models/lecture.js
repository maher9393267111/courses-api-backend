const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = mongoose.Schema(
  {
    instructor: { type: Schema.Types.ObjectId, ref: "instructor" },
    title: { type: String },
    name:{type:String},
    course: {type: Schema.Types.ObjectId, ref: "course"},
    lectureImage: { type: String },

    description: { type: String },
    video: { type: String, title:{type:String},duration:{type:Number} },
    pImages: {
      type: Array,
    //  required: true,
    },
    lectureLikes: [
  {
        type: Schema.Types.ObjectId,
        ref: "student",
      }],
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
module.exports = Lecture;
