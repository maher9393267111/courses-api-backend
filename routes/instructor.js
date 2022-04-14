const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructor");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/instructor");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


// router.get("/all-category", categoryController.getAllCategory);


router.post("/add-instructor",  upload.single("image"), instructorController.creatinstructor);

// editpaentcat

 router.put("/update-instructor",  upload.single("image"), instructorController.editinstructor);



 router.delete("/delete-instructor",instructorController.DeleteInstructor);


// getAllInstructorCourses

router.get("/all-instructor-courses/:id",instructorController.getAllInstructorCourses);

module.exports = router;