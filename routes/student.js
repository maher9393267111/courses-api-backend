const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/student");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});


const upload = multer({ storage: storage });

//const cpUpload = upload.fields([{ name: 'mainimage', maxCount: 1 }, { name: 'images', maxCount: 8 }])




router.post("/add-student",  upload.single('image') ,studentController.creatStudent);



//router.get("/all-students", studentController.getAllStudents);


// editpaentcat



    router.put("/update-student",  upload.single('image'), studentController.editstudent);



router.delete("/delete-student",studentController.DeleteStudent);



// lecture byid 

router.get("/studentbyid",studentController.getStudentById );



//  student like course

router.post("/like-course",studentController.likeCourse);



// student  like lecture

router.post("/like-lecture",studentController.likeLecture);




// student add course to his cart


 router.post("/cart",studentController.studentCart);






// student add lecture to saving lectures --> read  in onother time
// student add course to wishlist
// student make comment to course 
// student show all he likes courses
// show all dislike courses
// show all student in cart courses
// show all saving lecture
// show all wishlist courses
// make rating to lecture
// make rating to course
// show all course students



//router.get("/studentbyid",studentController.getLectureById);



module.exports = router;