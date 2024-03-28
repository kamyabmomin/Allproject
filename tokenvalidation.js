const jwt = require("jsonwebtoken")


exports.validation1 = async (req, res, next) => {

    var token = req.cookies.token
    // const token = req.headers['authorization']; this fetch postmen stored token values
    console.log(token);
    if (req.cookies.token) {
        jwt.verify(token, 'your-secret-key', (err, valid) => {

            if (err) {
                console.log("token not match ");
                var registerkey = 0
                res.render("login", { registerkey })
            }
            else {
                console.log("cookies found");
                next()
            }

        })


    }
    else {
        var registerkey = 0
        res.render("login", { registerkey })
    }

}

// module.exports = { validation1 }