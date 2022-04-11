
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

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());
app.use(express.static("public"));





// routes middleware

  app.use('/api/parentcat', parentcatRoute)
// app.use('/api',catRoute)
// app.use('/api',SubRoutes)
// app.use('/api',ProductRoute)
// app.use('/api',CloudRoute)
// app.use('/api',UserRoute)
// app.use('/api',CuponRoute)
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