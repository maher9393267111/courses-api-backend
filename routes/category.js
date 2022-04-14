const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get("/all-category", categoryController.getAllCategory);


router.post("/add-category",  upload.single("catimage"), categoryController.creatcatgory);

// editpaentcat

router.put("/update-category",  upload.single("catimage"), categoryController.editcategory);



router.delete("/delete-category",categoryController.DeleteCategory);




// find allc specefic category courses   
router.get("/category-courses/:id",categoryController.categoryAllCourses);


module.exports = router;