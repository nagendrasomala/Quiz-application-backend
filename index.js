const express = require("express");
const app = express();
const facultyRoute = require("./controller/facultyRoute");
const studentRoute = require("./controller/studentRoute");
const quizRoute = require("./controller/quizroute");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://nagendrababusomala:Nagvenk2006@cluster0.uvkdnuf.mongodb.net/newquizapp");
mongoose.set("strictQuery",true);
var db = mongoose.connection;
db.on("open",()=>console.log("connected to db"));
db.on("error",()=>console.log("Error connected"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use("/f",facultyRoute);
app.use("/s",studentRoute);
app.use("/q",quizRoute);
// app.use("/question",questionRoute);

app.listen(4000,()=>{
    console.log('Server is running on port 4000');
})