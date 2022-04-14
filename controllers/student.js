const studentModel = require("../models/student");
const instructorModel = require("../models/instructor");
const courseModel = require("../models/course");
const lectureModel = require('../models/lecture')
const fs = require("fs");
const { CLIENT_RENEG_LIMIT } = require("tls");

exports.creatStudent = async (req, res) => {
  // hisCourses
  let { name, pass, email, description } = req.body;
  console.log(req.body);
  let cImage = req.file.filename;
  console.log(cImage);
  const filePath = `./public/uploads/student/${cImage}`;

  if (!name || !cImage || !email || !pass) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
      return res.json({ error: "All filled must be required" });
    });
  } else {
    try {
      let checkStudentExists = await studentModel.findOne({ name: name });
      if (checkStudentExists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ error: "student already exists" });
        });
      } else {
        let newStudent = new studentModel({
          name,
          description,
          pass,
          email,
          // title,
          image: cImage,
        });
        await newStudent.save((err) => {
          if (!err) {
            console.log("new student -->", newStudent);
            return res.json({
              success: "instructor created successfully",
              newStudent,
            });
          }
        });
      }
    } catch (err) {
      throw err;
      console.log(err.message);
    }
  }
};

// update parebt cat
exports.editstudent = async (req, res) => {
  let { id, name, description, email, pass } = req.body;
  console.log(req.body);
  let cImage = req.file.filename;
  if (!id || !name || !description || !pass) {
    return res.json({ error: "All filled must be required" });
  }

  // find student all image and delete befor update it
  const oldstudentimage = await studentModel.findById(id);
  const oldimage = oldstudentimage.image;
  console.log("old image path--->", oldimage);
  const filePath = `./public/uploads/student/${oldimage}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
    // return res.json({ error: filePath });
  });

  try {
    const editData = {
      name,

      image: cImage,
      description,
      pass,
      email,
    };

    let editstudent = await studentModel
      .findByIdAndUpdate(id, editData, { new: true })
      .exec((error, update) => {
        if (error) {
          res.status(500).json({ error: error.message });
        }
        return res.json({
          success: "student edit successfully",
          //  editstudent,
          update,
        });
      });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteStudent = async (req, res) => {
  const { id } = req.body;

  console.log(id);
  if (!id) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deleteStudentFile = await studentModel.findById(id);
      console.log(deleteStudentFile);
      const filePath = `./public/uploads/instructor/${deleteStudentFile.image}`;

      let deleteStudent = await studentModel.findByIdAndDelete(id);
      if (deleteStudent) {
        // Delete Image from uploads -> categories folder
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "student deleted successfully" });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// find all instructor courses

exports.getStudentById = async (req, res) => {
  const { id } = req.body;
  console.log(id);

  try {
    let student = await studentModel.findById(id);

    if (student) {
      return res.json({ student });
    }
  } catch (err) {
    console.log(err);
  }
};

// db.survey.find(
// { "results": { $elemMatch: { product: { $ne: "xyz" } } } }
//    )




exports.likeCourse = async (req, res) => {
  const { studentid, courseid } = req.body;
  console.log(studentid, "-------", courseid);

  try {
    // check if student like this cours before if he likes it deslike the cpourse and pull it

    //const checkme=await studentModel.findOne({ _id: studentid }, { likedCourses: { $elemMatch: {courseid } } })

    const dislikecourse = await studentModel.findOne({
      likedCourses: { $elemMatch: { $eq: courseid } },
    });
    console.log(dislikecourse);
    if (dislikecourse) {
      console.log("i well deslike this course maher");
      let studentcheck = await studentModel.updateOne(
        { _id: studentid },
        { $pull: { likedCourses: courseid } }
      );
      //you can update course model cours liked array
      let coursedeslike = await lectureModel.updateOne(
        { _id:courseid },
        { $pull: { courseLikes: studentid } }
      );

      return res.json({
        message: "student dislike course successfully",
        coursedeslike,
        studentcheck,
      });
    } else {
      let student = await studentModel.updateOne(
        { _id: studentid },
        { $push: { likedCourses: courseid } }
      );
      //you can update course model cours liked array
      let coursethatLiked = await courseModel.updateOne(
        { _id: courseid },
        { $push: { courseLikes: studentid } }
      );

      if (student) {
        return res.json({
          message: "student like course successfully",
          student,
          coursethatLiked,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};



// student like lecture



exports.likeLecture = async (req, res) => {
    const { studentid, lectureid } = req.body;
    console.log( lectureid);
  
    try {
      // check if student like this lecture before if he likes it deslike the cpourse and pull it
  
      //const checkme=await studentModel.findOne({ _id: studentid }, { likedCourses: { $elemMatch: {courseid } } })
  
   
      var one = await studentModel.find({

        $and: [

            { likedLectures: { $elemMatch: { $eq: lectureid} } },
            { _id:studentid },
        ],
    })

    console.log('-->',one)
     

     
    const dislecture = await studentModel.findOne({
        likedLectures: { $elemMatch:{lectureid}  },
      });

      if (one.length === 0) {

        console.log('----- empty -----')
      }

     
      if (one.length  !== 0) {
        console.log("i well deslike this course maher");
        let studentcheck = await studentModel.updateOne(
          { _id: studentid },
          { $pull: { likedLectures: lectureid } }
        );
        //you can update course model cours liked array
        let lecturedeslike = await lectureModel.updateOne(
          { _id: lectureid },
          { $pull: { lectureLikes: studentid } }
        );
  
        return res.json({
          message: "student dislike lecture successfully",
          lecturedeslike,
          studentcheck,
        });
      } 
      
      
      
      
      
     else {
        let student = await studentModel.updateOne(
          { _id: studentid },
          { $push: { likedLectures: lectureid } }
        );
        //you can update course model cours liked array
        let lecturethatLiked = await lectureModel.updateOne(
          { _id: lectureid },
          { $push: { lectureLikes: studentid } }
        );
  
        if (student) {
          return res.json({
            message: "student like lecture successfully",
            student,
            lecturethatLiked,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  


  // add course and his price to cart

// {"$push":{"StudentOtherDetails.$.StudentFriendName":"James"}});

  exports.studentCart = async(req,res)=>{

const {courseid,studentid} = req.body

// find coure by id

const course = await courseModel.findById(courseid)
//console.log('course----> ',course.price)




const Data  ={
studentCart1:[{coursePrice:course.price,courseObject:course._id} ]


}

const studentUpdate = await studentModel.findByIdAndUpdate(studentid,
  Data,{new:true}
  
  )

  console.log(studentUpdate)

// const studentauth2 = await studentModel.updateOne({_id:studentid},

//   {$set:{'studentCart1.coursePrice':course.price}}

// )





res.status(200).json({studentUpdate})


  }