const categoryModel = require("../models/parentcategory");
const mongoose = require("mongoose");
const courseyModal = require("../models/course");

const fs = require("fs");
const parentCat = require("../models/parentcategory");

exports.creatparentcat = async (req, res) => {
  let { name, title } = req.body;
  let cImage = req.file.filename;
  const filePath = `../server/public/uploads/parentcategories/${cImage}`;

  if (!name || !title || !cImage) {
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
          image: cImage,
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
};

// update parebt cat
exports.editpaentcat = async (req, res) => {
  let { id, name, title } = req.body;
  console.log(req.body);
  let cImage = req.file.filename;
  if (!id || !name || !title) {
    return res.json({ error: "All filled must be required" });
  }
  try {
    const editData = {
      name,
      title,
      cImage,
    };

    const newCourse = await Course.updateOne(
      { _id: id },
      {
        $set: {
          editData,
        },
      }
    );

    res.status(200).json({ newCourse, success: "updated successfully" });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteCatparent = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (!id) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deletedCategoryFile = await categoryModel.findById(id);
      console.log(deletedCategoryFile);
      const filePath = `./public/uploads/parentcategories/${deletedCategoryFile.image}`;

      let deleteCategory = await categoryModel.findByIdAndDelete(id);
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
};

// all categories

exports.getAllCategory = async (req, res) => {
  try {
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    if (Categories) {
      return res.json({ Categories });
    }
  } catch (err) {
    console.log(err);
  }
};

// find specefic parencat all child categories
exports.getAllChildCategory = async (req, res) => {
  const id = req.params.id;
  console.log("params id --->", id);

  try {
    let Categories = await categoryModel
      .findById(id)
      .sort({ _id: -1 })
      .populate("categoryChild");
    if (Categories) {
      return res.json({ Categories });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getAllcourses = async (req, res) => {
  const id = req.params.id;

  try {
    const parentcatbyId = await parentCat.findById(id);
    console.log(parentcatbyId._id);

    const parentcatCourses = await courseyModal.find({
      categoryParent: parentcatbyId._id,
    });

    if (parentcatCourses) {
      res.status(200).json({ message: "successfully find", parentcatCourses });
    }
  } catch (error) {
    console.log(error);

    res.status(401).json({ message: error.message });
  }
};
