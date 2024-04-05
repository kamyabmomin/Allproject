const express = require("express");
const app = express();
const port = 6800;
const cookieParser = require('cookie-parser')
const route = require("./router")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(route)


app.listen(port, (error) => {
    if (!error) {
        console.log("server is running")
    }
    else
        console.log("error")

})