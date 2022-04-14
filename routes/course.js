const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/courses");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get("/all-courses", courseController.getAllCourses);


router.post("/add-course",  upload.single("image"), courseController.createCourse);

// editpaentcat

router.put("/update-course",  upload.single("image"), courseController.editCourse);



router.delete("/delete-course",courseController.DeleteCourse);

// course by id .coursebyid

router.get("/coursebyid/:id",courseController.coursebyid);


// find  by search course  instructor




 // courses total prices
 router.get("/courses-total",courseController.Coursestotal);






module.exports = router;