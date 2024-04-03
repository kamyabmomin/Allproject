const { con } = require("../../database/database")
const md5 = require("md5");
const jwt = require("jsonwebtoken")

exports.homePage = async (req, res) => {
    id2 = ""
    registerkey = 1
    res.render('register_login_dashbord/homepage', { id2, registerkey })
}
exports.registerData = async (req, res) => {
    var data = req.body
    var email = req.body.email
    var sqlemail = `select * from users where email = "${email}"`
    var [emaildata] = await con.query(sqlemail)

    if (emaildata.length == 0) {
        var slat = makeid(4)
        var password = md5(req.body.passwords + slat);
        var conformpassword = md5(req.body.conformpassword + slat);
        var key = makeid(12)
        var sql = `insert into users (firstname  ,lastname , email  ,mobilenumber  ,userid  ,passwords  ,conformpassword  ,salt  ,user_keys ) values ("${data.firstname}" , "${data.lastname}" ,"${data.email}" ,"${data.mobilenumber}" , "${data.userid}" ,'${password}' ,'${conformpassword}' ,"${slat}" ,"${key}" ) `
        var [id] = await con.query(sql)
        var id2 = id.insertId;
        res.status(200).json({ key: key })
    }
    else {

        res.status(400).json();

    }

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

}
exports.keyCompare = async (req, res) => {
    var key = req.query.key;
    sql = `select  user_keys ,timestemps from users where user_keys="${key}"`
    var [data] = await con.query(sql)
    var currantdate = new Date()
    timediffrent = currantdate - data[0].timestemps
    if (data[0].user_keys == key && timediffrent < 40000) {

        var registerkey = 1
        res.render("register_login_dashbord/login", { registerkey })
    }
    else {
        var sql = `delete from users where user_keys="${key}"`
        var data = con.query(sql)
        var registerkey = 0
        res.render("register_login_dashbord/homepage", { registerkey })
    }

}
exports.login = (req, res) => {
    var registerkey = 0
    res.render("register_login_dashbord/login", { registerkey })
}
exports.loginData = async (req, res) => {

    let data = req.body;
    console.log(data);
    let sql = ` select *  from users where email = '${req.body.email}' `;
    var [fetchdata] = await con.query(sql);
    console.log(fetchdata);
    if (fetchdata.length > 0) {
        const salt = fetchdata[0].salt;
        console.log(salt);
        const password = md5(req.body.passwords + salt)
        console.log(password);


        if (password == fetchdata[0].passwords) {
            console.log("password match");
            const token = jwt.sign({ userId: req.body.email }, 'your-secret-key', {
                expiresIn: '1h',
            });
            // authentication()
            console.log(token);
            res.cookie("token", token).status(200).json({ token: token })


        } else {
            console.log("password not match");
            res.status(400)

        }
    }
    else {
        console.log(" password not match");
        res.status(400)

    }
    // console.log(sql);
    // console.log(fetchdata[0].salt, fetchdata[0].user_keys);

    res.end()


}
exports.forgetPassword = async (req, res) => {
    try {
        res.render("register_login_dashbord/forget")

    }
    catch (err) {
        res.send(err)
    }
}
exports.forgetPasswordData = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.email && req.body.passwords == "" && req.body.conformpassword == "") {

            console.log("fetch email");
            console.log(req.body);
            var sql = `select * from users where email = "${req.body.email}"`;
            var [data] = await con.query(sql);
            console.log(sql);
            // console.log(data);

            if (data.length > 0) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json({ massage: "email is not register" })

            }

        }
        else {

            console.log("forget passwords");
            console.log(req.body);
            let email = req.body.email;
            let sql = `select * from users where email = "${email}"`
            var [emaildata] = await con.query(sql);
            console.log(emaildata);
            let salt = emaildata[0].salt;
            console.log(salt);
            pass = req.body.passwords
            pass += salt
            console.log(pass);
            let password = md5(pass);
            let conformpassword = md5(req.body.conformpassword + salt);
            console.log(password + "and" + conformpassword);

            let updatesql = `update users set passwords = '${password}' ,conformpassword = '${conformpassword}' where user_id = ${emaildata[0].user_id}`
            console.log(updatesql);
            try {
                var [data] = await con.query(updatesql)
                console.log("SFSF" + data.affectedRows);
                res.status(200).json({ massage: "pasword set " })
            }
            catch (err) {
                return res.json({ massage: err })
            }

        }
    }
    catch (err) {
        res.send(err)
    }
}
// exports.
