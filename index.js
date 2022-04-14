
const path = require('path')
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();

// app
const app = express();

const parentcatRoute =require('./routes/parentcat')
const categryRoute =require('./routes/category')
const instructorRoute = require('./routes/instructor')
const customizeRoute = require('./routes/customize')
const coursesRoutes = require('./routes/course')
const lectureRoutes = require('./routes/lecture')
const studentRoute = require('./routes/student')
// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));





// routes middleware

  app.use('/api/parentcat', parentcatRoute)
 app.use('/api/category',categryRoute)
 app.use('/api/instructor',instructorRoute)
 app.use('/api/customize',customizeRoute)
app.use('/api/course',coursesRoutes)
 app.use('/api/lecture',lectureRoutes)
 app.use('/api/student',studentRoute)
// app.use('/api',StripeRoute)
// app.use('/api',AdminRoute)
//   readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));



mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
     
    })
    .then(() => console.log('DB Connected'));



// --------------------------deployment------------------------------
//  const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/mern-2/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }
// --------------------------deployment------------------------------






//PORT 

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})