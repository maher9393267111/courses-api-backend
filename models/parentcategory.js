const mongoose = require('mongoose') 
const Schema = mongoose.Schema;

const parentCategory = mongoose.Schema(
  {
    name:{type:String,required:true},
    categoryChild:[  { type: Schema.Types.ObjectId, ref: "category" }],
    title: { type: String},
    description: { type: String },
    image:{type:String},
    parentcategoryCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },





    
  },
  { timestamps: true }
);
//videoSchema.index({ title: 'text', description: 'text' })

const parentCat = mongoose.model("parentcat", parentCategory);
//Video.createIndexes();
module.exports = parentCat ;