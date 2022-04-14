const categoryModel = require("../models/category");
const catparent = require('../models/parentcategory')
const courseyModal = require('../models/course')
const fs = require("fs")



exports.creatcatgory= async(req, res)=> {
    let { name,title,categoryParent } = req.body;
    let cImage = req.file.filename;
   // console.log(cImage)
    const filePath = `./public/uploads/categories/${cImage}`;

    if (!name || !title || !categoryParent || !cImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    } else {
      
      try {
        let checkCategoryExists = await categoryModel.findOne({ name: name });
        if (checkCategoryExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ error: "Category already exists" });
          });
        } else {
          let newCategory = new categoryModel({
            name,
          title,
          categoryParent,
            image:cImage,
          });
          await newCategory.save()
            if (newCategory) {
             //   console.log('saved----->',newCategory._id)
         //  console.log('compared---->',categoryParent)

                const  parencategoryArray = await catparent.findById(categoryParent )
               // console.log('????',parencategoryArray)
               await  parencategoryArray.updateOne({ $push: {    categoryChild: newCategory._id } }).populate('categoryChild','name')

const curentParentCate = await catparent.findById(categoryParent)
              return res.json({newCategory,curentParentCate, success: "Category created successfully" });
            }
          
        
            
          
          
          ;
        }
      } catch (err) {
        console.log(err);
      }
    }
  }





  
  // update parebt cat
  exports.editcategory=async(req, res) =>{
    let { id,name,title,} = req.body;
    console.log(req.body)
    let cImage = req.file.filename;
    if (!id || !name || !title) {
      return res.json({ error: "All filled must be required" });
    }
    try {

const editData ={
  name,title,cImage
}


      let editCategory = categoryModel.findByIdAndUpdate(id,editData,{new:true});
      let edit = await editCategory.exec((error,catupdate)=>{
if (error) {
throw error

}
return res.json({ success: "category edit successfully",catupdate });


      });
    
    } catch (err) {
      console.log(err);
    }
  }





  


  exports.DeleteCategory= async(req, res)=> {
    let { id } = req.body;
    console.log(id)
    if (!id) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(id);
        console.log(deletedCategoryFile)
        const filePath = `./public/uploads/categories/${deletedCategoryFile.image}`;

        let deleteCategory = await categoryModel.findByIdAndDelete(id);
        let deleteCategoryfromparent = await catparent.updateOne({ $pull: {    categoryChild: deleteCategory._id} })
        if (deleteCategory) {
          // Delete Image from uploads -> categories folder 
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
         
            return res.json({ success: "Category deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }




  // all categories


   exports.getAllCategory=async(req, res)=> {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  }

// get all category instructors
  // get all category courses

  exports.categoryAllCourses =async(req,res) =>{

const id = req.params.id

const categorybyId = await categoryModel.findById(id)
console.log(categorybyId._id)

const categoryCourses = await courseyModal.find({ccategory:categorybyId._id})

if (categoryCourses){


res.status(200).json({message:'successfully find',categoryCourses})

}


  }