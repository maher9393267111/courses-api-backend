const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/parentcat");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/parentcategories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get("/all-category", categoryController.getAllCategory);


router.post("/add-category",  upload.single("cImage"), categoryController.creatparentcat);

// editpaentcat

router.put("/update-category",  upload.single("cImage"), categoryController.editpaentcat);



router.delete(
  "/delete-category",
 
  categoryController.DeleteCatparent
);



// parent cat all his child categories

router.get("/all-childcat/:id", categoryController.getAllChildCategory);


// getAllcourses--> all parentat byid all his courses

router.get("/all-childcourses/:id", categoryController.getAllcourses);






module.exports = router;