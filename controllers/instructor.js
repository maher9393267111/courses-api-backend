const instructorModel = require("../models/instructor");
const courseModel = require('../models/course')
const fs = require("fs");

exports.creatinstructor = async (req, res) => {
  // hisCourses
  let { name, title, about, experience } = req.body;
  console.log(req.body);
  let cImage = req.file.filename;
  const filePath = `./public/uploads/instructor/${cImage}`;

  if ((!name || !title || !cImage || !about, !experience)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
      return res.json({ error: "All filled must be required" });
    });
  } else {
    try {
      let checkInstructorExists = await instructorModel.findOne({ name: name });
      if (checkInstructorExists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ error: "Category already exists" });
        });
      } else {
        let newInstructor = new instructorModel({
          name,
          about,
          experience,
          title,
          image: cImage,
        });
        await newInstructor.save((err) => {
          if (!err) {
            return res.json({ success: "instructor created successfully" });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// update parebt cat
exports.editinstructor = async (req, res) => {
  let { id, name, title, about, experience } = req.body;
  console.log(req.body.about);
  let cImage = req.file.filename;
  if (!id || !name || !title || !experience) {
    return res.json({ error: "All filled must be required" });
  }
  try {
    const editData = {
      name,
      title,
      image: cImage,
      experience,
      about,
    };

    let editinstructor = await instructorModel
      .findByIdAndUpdate(id, editData, { new: true })
      .exec((error, update) => {
        if (error) {
          res.status(500).json({ error: error.message });
        }
        return res.json({
          success: "instructor edit successfully",
          editinstructor,
          update,
        });
      });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteInstructor = async (req, res) => {
  const { id } = req.body;

  console.log(id);
  if (!id) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deletedCategoryFile = await instructorModel.findById(id);
      console.log(deletedCategoryFile);
      const filePath = `./public/uploads/instructor/${deletedCategoryFile.image}`;

      let deleteinstructor = await instructorModel.findByIdAndDelete(id);
      if (deleteinstructor) {
        // Delete Image from uploads -> categories folder
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "instructor deleted successfully" });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// find all instructor courses

exports.getAllInstructorCourses = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    let instructor = await instructorModel.findById(id).populate("hisCourses");
let instructorCourses = await courseModel.find({instructor:instructor._id}) 

    if (instructorCourses) {
      return res.json({ instructorCourses });
    }
  } catch (err) {
    console.log(err);
  }
};
