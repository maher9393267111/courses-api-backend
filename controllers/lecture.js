const lectureModel = require("../models/lecture");
const instructorModel = require("../models/instructor");
const courseyModal = require("../models/course");
const fs = require("fs");

const clearimage = (file) => {
  fs.unlink(file, (err) => {
    if (err) {
      console.log(err);
    }
  console.log('image deleted successfully')
  });
};

exports.creatLecture = async (req, res) => {
  let { name, title, instructor, description, course } = req.body;
 // console.log(req.body);
  let cImage = req.files.mainimage[0].filename;
 // console.log("maun image --->", cImage);
  let imagesarray = req.files.images; // -->

  const emptyArray = [];
  for (const img of imagesarray) {
    emptyArray.push(img.filename);
  }

  //console.log(emptyArray)
  // we want only the req.files.images,filname to every image in array

  var imagesfilterFileName = [imagesarray[0].filename, imagesarray[1].filename];

  // console.log(' mainimage --->',imagesfilterFileName )

  const filePath = `./public/uploads/lectures/${cImage}`;

  if (
    !name ||
    !course ||
    !title ||
    !instructor ||
    !cImage ||
    // !emptyArray ||
    !description
  ) {
    // clear all images in images array
    for (const img of imagesarray) {
      clearimage(img.path);
    }

    // then clear main image
    clearimage(filePath);
  } else {
    try {
      let checkLectureExists = await lectureModel.findOne({ name: name });
      if (checkLectureExists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ error: "Category already exists" });
        });
      } else {
        let newLecture = new lectureModel({
          name,
          title,
          course,
          instructor,
          description,

          lectureImage: cImage,
          pImages: emptyArray,
          //imagesfilterFileName,
        });
        await newLecture.save();
        if (newLecture) {
          newLecture.populate("course", name); // true
          // save new lectue in his course
          const course1 = await courseyModal.findById(course);
          // console.log('????',parencategoryArray)
          await course1
            .updateOne({
              $push: { lectures: newLecture._id },
            })
            .populate("lectures", "name");

          // add lecture after saved in database in course model

          const currentCouresAfter = await courseyModal.findById(course);

          await currentCouresAfter.updateOne({
            $push: { hisLectures: newLecture._id },
          });

          // update instructor lecturesArray

          const instructorforLecture = await instructorModel.findById(
            instructor
          );

          //push this lectures._id into instructor hislecturesarray

          await instructorforLecture
            .updateOne({
              $push: { hisLectures: newLecture._id },
            })
            .populate("hisLectures", "name");

          const instructorafterAdd = await instructorModel.findById(instructor);

          return res.json({
            success: "Lectures created successfully",
            newLecture,
            instructorafterAdd,
            currentCouresAfter,
          });
        }
      }
    } catch (err) {
      console.log(err);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    }
  }
};

// update lecture
exports.editlecture = async (req, res) => {
    let { name, title, description, id } = req.body;



 const removeimages =lectureModel.updateMany({ _id: id }, { $unset: { lectureImage: '',pImages: '' } });

 // console.log('deleteimages',oldimagesfind);
 let cImage = req.files[0].filename;  // mainimage {single}
// console.log("maun image --->", cImage);
  let imagesOne = req.files[1].filename; // -->  images array 
 let imagestwo = req.files[2].filename;
  const emptyArray = [];

     emptyArray.push(imagesOne,imagestwo);

     console.log('images=====>',emptyArray,'mainimage -->',cImage)




  if (!id || !name || !title || !description) {
    return res.json({ error: "All filled must be required" });
  }
  try {
    const editData = {
      name,
      title,
      lectureImage:cImage,
      description,
     pImages: emptyArray,
    };

    let editLecture = await lectureModel.findByIdAndUpdate(id, editData, {
      new: true,
    }).exec((error, lectureupdate) => {
      if (error) {
        throw error;
      }
      return res.json({ success: "lecture edit successfully", lectureupdate });
    });
  } catch (err) {
    console.log(err.message);
  }
};




exports.Deletelecture = async (req, res) => {
  let { id } = req.body;
  console.log(id);
  if (!id) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deleteLectureFile = await lectureModel.findById(id);
      console.log(deleteLectureFile);
      
         const filePath = `./public/uploads/lectures/${deleteLectureFile.lectureImage}`;

      let deleteLecture = await lectureModel.findByIdAndDelete(id);

// delete lecture from his instructor model

      let deleteLecturefromInstructor = await instructorModel.updateOne({_id:deleteLecture.instructor},{
        $pull: { hisLectures: deleteLecture._id },
      });


//  start delete lecture from his course model


const deleteLectureFromCourse =await courseyModal.updateOne({_id:deleteLecture.course},{

  $pull:{lectures:deleteLecture._id}
})


// end ----------------------------------------------

      if (deleteLecture) {
        



   // delete imagesArray from path     
const imagesArray =deleteLecture.pImages
console.log(imagesArray)
//const filePath = `./public/uploads/lectures/${deleteLectureFile.lectureImage}`;
for (const img of imagesArray) {
    console.log('img -------->',img)
    const filePathArray = `./public/uploads/lectures/${img}`;   
    clearimage(filePathArray);
    
  }


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

exports.getAllLectures = async (req, res) => {
  try {
    let Lectures = await lectureModel.find({}).sort({ _id: -1 });
    if (Lectures) {
      return res.json({ Lectures });
    }
  } catch (err) {
    console.log(err);
  }
};



exports.getLectureById = async (req, res) => {
  //const id = req.params.id;

  const  {id} = req.body

  const LecturebyId = await lectureModel.findById(id);
  console.log(LecturebyId);



  if (LecturebyId) {
    res.status(200).json({ message: "successfully find",LecturebyId  });
  }
};



// search for lecture


exports.lectureSearch = async (req, res) => {
  const Lectuekeyword = req.query.search
  ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
    
      ],
    } : {};


const lecture = await lectureModel.find(Lectuekeyword)

if (lecture.length !== 0) {

//res.send(lecture)
res.status(200).json({message:'lecture founded',lecture})


}


else{
  
  res.status(200).json({message:'lecture Not founded'})
}


}








