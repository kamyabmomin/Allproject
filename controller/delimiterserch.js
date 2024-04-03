const { con } = require("../database/database")

exports.delimiterSarch = async (req, res) => {
    res.status(200)

    var symbolestring = "_ ^ $ } { :"
    var sreching = req.query.serch || " "
    console.log(sreching)
    var a = sreching.split(/[_^$}{:}]/);
    console.log(a);
    var firstnamearray = [];
    var lastnamearray = [];
    var emailarray = [];
    var mobilenumber = [];
    var city = [];
    var age = []

    for (let i = 1; i < a.length; i++) {
        var index = sreching.indexOf(a[i])
        var findingsymbolrindex = index - 1
        var symbole = sreching.charAt(findingsymbolrindex)

        if (symbole == "_") {

            firstnamearray.push(`first_name like '${a[i]}%' `)

        }

        else if (symbole == "^") {

            lastnamearray.push(`last_name like '${a[i]}%'`)

        }
        else if (symbole == "$") {

            emailarray.push(`country like "${a[i]}%"`);
    
        }
        else if (symbole == "}") {

            age.push(` years =  ${a[i]} `)
        }
        else if (symbole == "{") {

            mobilenumber.push(` phon_no  like '${a[i]}%' `)
        }
        else if (symbole == ":") {

            city.push(` city like "${a[i]}%" `)
        }
        else {
            console.log("no serch");
        }

    }
    var temp = []
    if (firstnamearray.length > 0) {
        var firstname = firstnamearray.join(" or ");
        console.log(firstname);
        temp.push(firstname);
    }
    if (lastnamearray.length > 0) {
        var lastname = lastnamearray.join(" or ");
        console.log(lastname);
        temp.push(lastname);
    }
    if (emailarray.length > 0) {
        var cuntry = emailarray.join(" or ");
        console.log(cuntry);
        temp.push(cuntry);
    }

    if (mobilenumber.length > 0) {
        var mobilenumbers = mobilenumber.join(" or ");
        console.log(mobilenumbers);
        temp.push(mobilenumbers);
    }


    if (city.length > 0) {
        var citys = city.join(" or ");
        console.log(citys);
        temp.push(citys);
    }

    if (age.length > 0) {
        var ages = age.join(" or ");
        console.log(ages);
        temp.push(ages);
    }
    if (temp.length > 0) {
        var query = " where " + temp.join(" and ")
    }

    if (!req.query.serch) {
        var sql = `select * from student  limit 200 `
    }
    else if (temp.length != 0) {
        sql = `select * from student ${query} limit 100 `
    } else {
        var nodisplay = 0
    }
    var [result] = await con.query(sql)
    console.log(result)
    res.render('delimiterserch/delimiterserch', { alldata: result, sreching, nodisplay })
    

}