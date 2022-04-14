const courseModel = require("../models/course");
const catparent = require("../models/parentcategory");
const categoryModal = require("../models/category");
const instructorModal = require("../models/instructor");
const fs = require("fs");

exports.createCourse = async (req, res) => {
  let {
    ccategory,
    price,
    youWellLearn,
    cname,
    ctitle,
    categoryParent,
    cdescription,
    instructor,
  } = req.body;
  let cImage = req.file.filename;

  console.log(req.body);
  const filePath = `./public/uploads/courses/${cImage}`;

  if (
    !cname ||
    !instructor ||
    !ctitle ||
    !categoryParent ||
    !cImage ||
    !youWellLearn ||
    !price ||
    !ccategory
  ) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
      return res.json({ error: "All filled must be required" });
    });
  } else {
    try {
      let checkCourseExists = await courseModel.findOne({ cname: cname });
      if (checkCourseExists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ error: "Course already exists" });
        });
      } else {
        let newCourse = new courseModel({
          cname,
          ctitle,
          price,
          youWellLearn,
          instructor,
          cdescription,
          ccategory,
          categoryParent,
          image: cImage,
        });
        await newCourse.save();
        if (newCourse) {
          //   console.log('saved----->',newCategory._id)
          //  console.log('compared---->',categoryParent)

          // -1 push created course to his parentcategroy --> in hisCouses array

          const parencategoryArray = await catparent.findById(categoryParent);
          // console.log('????',parencategoryArray)
          await parencategoryArray
            .updateOne({ $push: { parentcategoryCourses: newCourse._id } })
            .populate("categoryChild", "name");
          //after catpaent updated find it th show after updated his courses array
          const curentParentCate = await catparent.findById(categoryParent);

          // 2- push created course into his category in course array

          const category = await categoryModal.findById(ccategory);

          await category.updateOne({
            $push: { categoryCourses: newCourse._id },
          });

          const categortafterupdate = await categoryModal.findById(ccategory);

          // 3- push created course into his instructor
          // then update and push instructor his courses array

          instructor1 = await instructorModal.findById(instructor);
          //console.log('instructor --->',instructor1)

          await instructor1.updateOne({ $push: { hisCourses: newCourse._id } });

          const instructorAfterupdate = await instructorModal.findById(
            instructor
          );

          return res.json({
            newCourse,
            instructorAfterupdate,
            curentParentCate,
            categortafterupdate,
            success: "Category created successfully",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// update  course
exports.editCourse = async (req, res) => {
  let { id, cname, ctitle, price, cdescription } = req.body;
  console.log(req.body);
  let cImage = req.file.filename;
  if (!id || !cname || !ctitle || !cdescription || !price) {
    return res.json({ error: "All filled must be required" });
  }
  try {
    const editData = {
      cname,
      ctitle,
      image: cImage,
      cdescription,
      price,
    };

    let editCourse = courseModel.findByIdAndUpdate(id, editData, { new: true });
    let edit = await editCourse.exec((error, courseupdate) => {
      if (error) {
        throw error;
      }
      return res.json({ success: "category edit successfully", courseupdate });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteCourse = async (req, res) => {
  let { id } = req.body;
  console.log(id);
  if (!id) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deletedCategoryFile = await courseModel.findById(id);
      console.log(deletedCategoryFile);
      const filePath = `./public/uploads/courses/${deletedCategoryFile.image}`;

      let deleteCourse = await courseModel.findByIdAndDelete(id);

      //start

      const parencategoryArray = await catparent.findById(
        deleteCourse.categoryParent
      );
      // console.log('---->',parencategoryArray)
      await parencategoryArray.updateOne({
        $pull: { parentcategoryCourses: deleteCourse._id },
      });
      //after catpaent updated find it th show after updated his courses array
      const parentcategoryafter = await catparent.findById(
        deleteCourse.categoryParent
      );

      //-------------------------------------------------//

      // course category delete

      const categoryArray = await categoryModal.findById(
        deleteCourse.ccategory
      );
      // console.log('---->',parencategoryArray)
      await categoryArray.updateOne({
        $pull: { categoryCourses: deleteCourse._id },
      });
      //after catpaent updated find it th show after updated his courses array
      const categoryafter = await categoryModal.findById(
        deleteCourse.ccategory
      );

      //  delete course from  instructor hisCourses array

      const instructorCoursesArray = await instructorModal.findById(
        deleteCourse.instructor
      );
      // console.log('---->',parencategoryArray)
      await instructorCoursesArray.updateOne({
        $pull: { hisCourses: deleteCourse._id },
      });
      //after catpaent updated find it th show after updated his courses array
      const instructorCoursesafter = await instructorModal.findById(
        deleteCourse.instructor
      );

      // end

      if (deleteCategory) {
        // Delete Image from uploads -> categories folder
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

exports.getAllCourses = async (req, res) => {
  try {
    let Courses = await courseModel.find({}).sort({ _id: -1 });
    if (Courses) {
      return res.json({ Courses });
    }
  } catch (err) {
    console.log(err);
  }
};

// find course with params id

exports.coursebyid = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    let coursebyid = await courseModel
      .findById(id)
      .populate("instructor", "name");

    if (coursebyid) {
      return res.json({ coursebyid });
    }
  } catch (err) {
    console.log(err);
  }
};

//search course or instructor
// http://localhost:5000/api/search?search=web
// req.search.query ---> ? after ?  search = {keywod to search}
exports.SearchCourseOrInstructor = async (req, res) => {
  const Coursekeyword = req.query.search
    ? {
        $or: [
          { cname: { $regex: req.query.search, $options: "i" } },
          { ctitle: { $regex: req.query.search, $options: "i" } },
          { cdescription: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const courseSearch = await courseModel.find(Coursekeyword);

  if (courseSearch.length !== 0) {
    console.log(courseSearch);
    res.status(200).json({ message: "course successfully find", courseSearch });
  }

  // {
  const Instructorkeyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { title: { $regex: req.query.search, $options: "i" } },
          { about: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const instructorSearch = await instructorModal.find(Instructorkeyword);
  if (instructorSearch.length !== 0) {
    res
      .status(200)
      .json({ message: "instructor successfully find", instructorSearch });
  }

  //}

  // search category
  const Categorykeyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { title: { $regex: req.query.search, $options: "i" } },
          // { about: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const categorySearch = await categoryModal.find(Categorykeyword);

  if (categorySearch.length !== 0) {
    console.log(categorySearch);
    res.status(200).json({ message: "successfully find", categorySearch });
  }
};

exports.Coursestotal = async (req, res) => {
  const prices = [];

  const allcourses = await courseModel.find({}).distinct("price");

  allcourses.forEach((one) => {
    prices.push(one);
  });

  console.log(prices);

// calculate courses prices

  var totalSalary = 0;
  for (var i = 0; i < prices.length; i++) {
    totalSalary += Number(prices[i]);
  }

  console.log(totalSalary);
  res.status(200).json({ allcourses,totalSalary });
};





//courses total count and price total

// exports.Coursestotal = async(req,res)=>{

//   const totalprices = await courseModel.aggregate([

//     {
//         $group: {
//             _id: null,

//             sum: { $sum: "$price" }
//         }
//     }
// ] )

// // itis work
// // count of courses
// const coursesCount= await courseModel.aggregate( [
//   {
//     $group: {
//        _id: null,

//        count: { $count: { } },
//        averagePrice: { $avg: "$price" },
//        // sum 1 well show courses count when sum=2 well couserse count*2
//        sum: { $sum:1 }
//     }
//   }
// ] )

// // itis work
// const pricefieldFromAll = await courseModel.aggregate( [ { $group : { _id : "$price" } } ] )

// res.status(200).json({totalprices,pricefieldFromAll,coursesCount})

// }
