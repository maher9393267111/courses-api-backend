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


router.post("/add-category",  upload.single("cImage"), categoryController.creatparentcat);

// editpaentcat

router.put("/update-category",  upload.single("cImage"), categoryController.editpaentcat);



// router.post(
//   "/delete-category",
//   loginCheck,
//   categoryController.getDeleteCategory
// );


module.exports = router;