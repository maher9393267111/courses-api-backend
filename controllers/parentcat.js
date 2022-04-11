const categoryModel = require('../models/parentcategory')
 const mongoose = require('mongoose') 



  exports.creatparentcat =async(req, res)=> {
    let { name, title } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    if (!name ||   !title|| !cImage) {
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
          image:  cImage,
          });
          await newCategory.save((err) => {
            if (!err) {
              return res.json({ success: "Category created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }


  exports.editpaentcat=async(req, res) =>{
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




  