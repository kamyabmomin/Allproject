const express = require("express");
const app = express();
const port = 6800;
const fs = require('fs');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
var nodemailer = require('nodemailer');
var bodyParser = require("body-parser");
const Swal = require('sweetalert2')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(cookieParser())
const { validation1 } = require("./tokenvalidation")
var mysql = require('mysql2');
const { Console, log } = require("console");
const { strict } = require("assert");
const md5 = require("md5");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "loginregisteruser"
}).promise()



app.get("/", async (req, res) => {
    id2 = ""
    registerkey = 1
    res.render('homepage', { id2, registerkey })
})

app.post("/", async (req, res) => {
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



})
app.get("/keycompare", async (req, res) => {
    var key = req.query.key;
    sql = `select  user_keys ,timestemps from users where user_keys="${key}"`
    var [data] = await con.query(sql)
    var currantdate = new Date()
    timediffrent = currantdate - data[0].timestemps
    if (data[0].user_keys == key && timediffrent < 40000) {

        var registerkey = 1
        res.render("login", { registerkey })
    }
    else {
        var sql = `delete from users where user_keys="${key}"`
        var data = con.query(sql)
        var registerkey = 0
        res.render("homepage", { registerkey })
    }

})
app.get("/login", (req, res) => {
    var registerkey = 0
    res.render("login", { registerkey })
})

app.post("/login", async (req, res) => {

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
        console.log("password not match");

    }
    // console.log(sql);
    // console.log(fetchdata[0].salt, fetchdata[0].user_keys);

    res.end()


})

// function authentication(req, res, next) {
//     const authHeader = req.headers.authorization;
//     // console.log(authHeader);
// }


app.get("/forgetpassword", async (req, res) => {
    try {
        res.render("forget")

    }
    catch (err) {
        res.send(err)
    }
})


app.post("/forgetpassword", async (req, res) => {
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
})



app.get("/registerusingemail", async (req, res) => {
    id2 = ""
    registerkey = 1
    res.render('registerusingemail', { id2, registerkey })
})

app.post("/registerusingemail", async (req, res) => {
    // alert("axdacd")
    var data = req.body
    console.log(data);
    var email = req.body.email
    console.log(email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kamyab.momin.2024@gmail.com',
            pass: '8128744072k'
        }
    });

    var mailOptions = {
        from: 'kamyab.momin.2024@gmail.com',
        to: `${email}`,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    var sqlemail = `select * from users where email = "${email}"`
    var [emaildata] = await con.query(sqlemail)

    if (emaildata.length == 0) {
        console.log("sdsdvgrd");
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
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



})

//dashbord
app.get("/dashbord", validation1, (req, res) => {
    res.render("dashbord")
})


//tic tak to 
app.get("/tictacto", (req, res) => {
    res.render("tictacto")
})


//event table 
app.get("/eventtable", (req, res) => {
    res.render("event")
})


//table cells 
app.get("/tablecell", (req, res) => {
    res.render("tablecells")
})

//sorting
app.get("/sorting", (req, res) => {
    res.render("sorting")
})
// crud in file 

app.get("/crudinfile", (req, res) => {
    res.status(200);
    res.render("form")


})

app.post("/details", (req, res) => {
    res.status(200);

    var oneuserdata = req.body;
    oneuserdata.id = crypto.randomUUID();


    var data = fs.readFileSync('database.json', "utf-8")
    var parsdata = JSON.parse(data)


    parsdata.push(oneuserdata)


    fs.writeFileSync('database.json', JSON.stringify(parsdata), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });


    res.render("details", { data: parsdata })

})

app.post("/more", (req, res) => {
    res.status(200);


    var fatchingdata = req.body;
    //  console.log(JSON.stringify(req.body))
    var val = Object.keys(fatchingdata).toString();
    //  console.log(val)
    var OBJECT = Object.values(fatchingdata).toString();
    // console.log(OBJECT);
    var data = fs.readFileSync('database.json', "utf-8");
    var data1 = JSON.parse(data)
    var pass


    if (OBJECT == "update") {
        data1.forEach(element => {
            if (element.id == val) {
                pass = element
            }
            else
                console.log("no match ")

        });

        res.render("update", { data: pass });
    }
    if (OBJECT == "more") {
        data1.forEach(element => {
            if (element.id == val) {
                pass = element
            }
            else
                console.log("no match ")

        });

        res.render("more", { data: pass });
    }
    //   console.log(pass)




    if (OBJECT == "delete") {
        // console.log("delete");
        const objWithIdIndex = data1.findIndex((obj) => obj.id == val);
        // console.log(objWithIdIndex);

        if (objWithIdIndex > -1) {
            // console.log("object index")
            data1.splice(objWithIdIndex, 1);
        }
        console.log(data1)
        fs.writeFileSync('database.json', JSON.stringify(data1), function (err) {
            if (err) throw err; {
                console.log('Saved!');
            }

            console.log("save")
        });
        res.render("details", { data: data1 });
    }



})
app.listen(port, (error) => {
    if (!error) {
        console.log("server is running")
    }
    else
        console.log("error")

})