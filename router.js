const express = require("express")
const { homePage, registerData, keyCompare, login, loginData, forgetPassword, forgetPasswordData } = require("./controller/login_register/homepage");
const { validation1 } = require("./tokenvalidation");
const router = express.Router()


//login_register_dashbord
router.route("/").get(homePage).post(registerData);
router.route("/keycompare").get(keyCompare);
router.route("/login").get(login).post(loginData);
router.route("/forgetpassword").get(forgetPassword).post(forgetPasswordData);
router.route("/dashbord").get(validation1, (req, res) => {
    res.render("dashbord")
})

//tic_tac_to
router.route("/tictacto").get(validation1, (req, res) => {
    res.render("tictacto")
})

//event_table 
router.route("/eventtable").get(validation1, (req, res) => {
    res.render("event")
})



module.exports = router;