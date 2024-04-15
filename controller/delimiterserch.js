const { con } = require("../database/database")

exports.delimiterSarch = async (req, res) => {
    res.status(200)
    try {
        let symbolestring = "_ ^ $ } { :"
        let sreching = req.query.serch || " "
        let a = sreching.split(/[_^$}{:}]/);
        let firstnamearray = [];
        let lastnamearray = [];
        let emailarray = [];
        let mobilenumber = [];
        let city = [];
        let age = []

        for (let i = 1; i < a.length; i++) {
            let index = sreching.indexOf(a[i])
            let findingsymbolrindex = index - 1
            let symbole = sreching.charAt(findingsymbolrindex)

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
        let temp = []
        if (firstnamearray.length > 0) {
            let firstname = firstnamearray.join(" or ");
            console.log(firstname);
            temp.push(firstname);
        }
        if (lastnamearray.length > 0) {
            let lastname = lastnamearray.join(" or ");
            console.log(lastname);
            temp.push(lastname);
        }
        if (emailarray.length > 0) {
            let cuntry = emailarray.join(" or ");
            console.log(cuntry);
            temp.push(cuntry);
        }

        if (mobilenumber.length > 0) {
            let mobilenumbers = mobilenumber.join(" or ");
            console.log(mobilenumbers);
            temp.push(mobilenumbers);
        }


        if (city.length > 0) {
            let citys = city.join(" or ");
            console.log(citys);
            temp.push(citys);
        }

        if (age.length > 0) {
            let ages = age.join(" or ");
            console.log(ages);
            temp.push(ages);
        }
        let query;
        if (temp.length > 0) {
            query = " where " + temp.join(" and ")
        }
        let sql;
        let nodisplay
        if (!req.query.serch) {
            sql = `select * from student  limit 200 `
        }
        else if (temp.length != 0) {
            sql = `select * from student ${query} limit 100 `
        } else {
            nodisplay = 0
        }
        let [result] = await con.query(sql)
        console.log(result)
        res.render('delimiterserch/delimiterserch', { alldata: result, sreching, nodisplay })


    }
    catch (e) {

        res.send(e + "enter valis serch query")
    }
}