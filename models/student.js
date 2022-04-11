//const mongoose = require("../db/mongoConnection");
const Schema = mongoose.Schema;

const studentSchema = mongoose.Schema(
  {
    name: { type:String,required:true},
    email: { type: String,required:true},
    description: { type: String },
    image:{type:String},
    passwor:{type:String,required:true},
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
module.exports =  student ;