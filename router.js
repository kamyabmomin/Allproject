const express = require("express")
const { homePage, registerData, keyCompare, login, loginData, forgetPassword, forgetPasswordData } = require("./controller/login_register/homepage");
const { validation1 } = require("./tokenvalidation");
const { writeData, more } = require("./controller/crude_id_file");
const { save, allList, deleteId, updateId, updateIdPost, city } = require("./controller/employe_form");
const router = express.Router()


//login_register_dashbord
router.route("/").get(homePage).post(registerData);
router.route("/keycompare").get(keyCompare);
router.route("/login").get(login).post(loginData);
router.route("/forgetpassword").get(forgetPassword).post(forgetPasswordData);
router.route("/dashbord").get(validation1, (req, res) => {
    res.render("register_login_dashbord/dashbord")
})

//tic_tac_to
router.route("/tictacto").get(validation1, (req, res) => {
    res.render("tic-tac-toi/tictacto")
})

//event_table 
router.route("/eventtable").get(validation1, (req, res) => {
    res.render("event_table/event")
})

//table_cell
router.route("/tablecell").get(validation1, (req, res) => {
    res.render("table_cell/tablecells")
})

//sorting 
router.route("/sorting").get(validation1, (req, res) => {
    res.render("sorting/sorting")
})


//crude_in_file 
router.route("/crudinfile").get(validation1, (req, res) => {
    res.status(200);
    res.render("crude_in_file/form")
})

router.route("/details").post(validation1, writeData)
router.route("/more").post(validation1, more)


//employeForm
router.route("/employeformvalidation").get(validation1, (req, res) => {
    res.status(200);
    res.render("employe_form/form")
})

router.route("/ajxform").get(validation1, (req, res) => {
    let educationvalid = true;
    let valid = true;
    var data = ""
    res.render('employe_form/ajxform', { valid, educationvalid, data })
})

router.route("/save").post(validation1,save);
router.route("/alllist").get(validation1, allList)
router.route("/delete/id").get(validation1, deleteId);
router.route("/update/id").get(validation1, updateId);
router.route("/update/id").post(validation1, updateIdPost);
router.route("/city/city/city").post(validation1 ,city)


//fetch_api 
router.route("/tablefetchapi").get(validation1, (req, res) => {
    res.render('fetch_api/tablefetchapi')
})

router.route("/details").get( validation1, (req, res) => {
    res.render('fetch_api/detailstablefetchapi')
})


module.exports = router;