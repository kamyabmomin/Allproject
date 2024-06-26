const { con } = require("../../database/database")
const md5 = require("md5");
const jwt = require("jsonwebtoken")

exports.homePage = async (req, res) => {
    id2 = ""
    registerkey = 1
    res.render('register_login_dashbord/homepage', { id2, registerkey })
}
exports.registerData = async (req, res) => {
    let data = req.body
    let email = req.body.email
    let sqlemail = `select * from users where email = "${email}"`
    let [emaildata] = await con.query(sqlemail)

    if (emaildata.length == 0) {
        let slat = makeid(4)
        let password = md5(req.body.passwords + slat);
        let conformpassword = md5(req.body.conformpassword + slat);
        let key = makeid(12)
        let sql = `insert into users (firstname  ,lastname , email  ,mobilenumber  ,userid  ,passwords  ,conformpassword  ,salt  ,user_keys ) values ("${data.firstname}" , "${data.lastname}" ,"${data.email}" ,"${data.mobilenumber}" , "${data.userid}" ,'${password}' ,'${conformpassword}' ,"${slat}" ,"${key}" ) `
        let [id] = await con.query(sql)

        let id2 = id.insertId;
        
        res.status(200).json({ key: key, id: id2 })
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
    let key = req.query.key;
    let id = req.query.id
    sql = `select  user_keys ,timestemps from users where user_keys="${key}"`
    let [data] = await con.query(sql)
    let currantdate = new Date()
    timediffrent = currantdate - data[0].timestemps
    if (data[0].user_keys == key && timediffrent < 40000) {

        let registerkey = 1
        let sql = `UPDATE users SET timestemp = 'yes' WHERE user_id = ${id};`
        // let sql = `insert into users (timestemp) values ("yes") where user_id = ${id}`;
        let [data] = await con.query(sql);
        res.render("register_login_dashbord/login", { registerkey })
    }
    else {
        let sql = `delete from users where user_keys="${key}"`
        let data = con.query(sql)
        let registerkey = 0
        res.render("register_login_dashbord/homepage", { registerkey })
    }

}
exports.login = (req, res) => {
    let registerkey = 0
    res.render("register_login_dashbord/login", { registerkey })
}
exports.loginData = async (req, res) => {

    let data = req.body;
   
    let sql = ` select *  from users where email = '${req.body.email}' `;
    let [fetchdata] = await con.query(sql);
  
    if (fetchdata.length > 0) {
        const salt = fetchdata[0].salt;
        
        const password = md5(req.body.passwords + salt)
      


        if (password == fetchdata[0].passwords && fetchdata[0].timestemp == "yes") {
           
            const token = jwt.sign({ userId: req.body.email }, 'your-secret-key', {
                expiresIn: '1h',
            });
          
            res.cookie("token", token).status(200).json({ token: token })


        } else {
          
            res.status(400)

        }
    }
    else {
       
        res.status(400)

    }


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
     
        if (req.body.email && req.body.passwords == "" && req.body.conformpassword == "") {

         
            let sql = `select * from users where email = "${req.body.email}"`;
            let [data] = await con.query(sql);
           

            if (data.length > 0) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json({ massage: "email is not register" })

            }

        }
        else {

           
            let email = req.body.email;
            let sql = `select * from users where email = "${email}"`
            let [emaildata] = await con.query(sql);
            
            let salt = emaildata[0].salt;
 
            pass = req.body.passwords
            pass += salt
       
            let password = md5(pass);
            let conformpassword = md5(req.body.conformpassword + salt);
            
            let updatesql = `update users set passwords = '${password}' ,conformpassword = '${conformpassword}' where user_id = ${emaildata[0].user_id}`
     
            try {
                let [data] = await con.query(updatesql)
           
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

