const jwt = require("jsonwebtoken")


exports.validation1 = async (req, res, next) => {

    let token = req.cookies.token
    // const token = req.headers['authorization']; this fetch postmen stored token values
    // console.log(token);

    if (req.cookies.token) {
        jwt.verify(token, 'your-secret-key', (err, valid) => {

            if (err) {
                // console.log("token not match ");
                var registerkey = 0
                res.render("register_login_dashbord/login", { registerkey })
            }
            else {
                console.log("cookies found");
                next()
            }

        })


    }
    else {
        let registerkey = 0
        res.render("login", { registerkey })
    }

}

