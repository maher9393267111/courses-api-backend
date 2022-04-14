const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customizeSchema = mongoose.Schema(
  {
 
name: {type:String},
    image:{type:String},
    createdAt: {
      type: Date,
      default: Date.now,
    },





    
  },
  { timestamps: true }
);
//videoSchema.index({ title: 'text', description: 'text' })

const customize = mongoose.model("customize", customizeSchema);
//Video.createIndexes();
module.exports =  customize ;