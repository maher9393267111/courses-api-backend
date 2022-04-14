const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lecture");
const multer = require("multer");
//const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/lectures");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});


const upload = multer({ storage: storage });

const cpUpload = upload.fields([{ name: 'mainimage', maxCount: 1 }, { name: 'images', maxCount: 8 }])
const cpUpload2 = upload.fields([{ name: 'main', maxCount: 1 }, { name: 'array', maxCount: 8 }])


router.get("/all-lectures", lectureController.getAllLectures);


router.post("/add-lecture",  cpUpload ,lectureController.creatLecture);

// editpaentcat

router.put("/update-lecture",  upload.any(), lectureController.editlecture);



router.delete("/delete-lecture",lectureController.Deletelecture);

// lecture byid 

router.get("/lecturebyid",lectureController.getLectureById);

// find by search  lectureSearch

router.get("/lectureSearch",lectureController.lectureSearch);


module.exports = router;