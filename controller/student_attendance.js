const { con } = require("../database/database");
const resultsPerPage = 10;
exports.attandance = async (req, res) => {

    try {
        var colname = req.query.colname || "studentmaster.student_id";
        var id = req.query.id;
        console.log(id);
        var firstname1 = req.query.firstname
        var andor = req.query.andor;
        var persentage = req.query.percentage;
        var abovebelove = req.query.abovebelove;
        var abovebelovedays = req.query.abovebelovedays;
        var day = req.query.days;

        if (req.query.id) {
            ids = ` where attendancemonth.id  in(${id})`
        }
        else {
            ids = " "
        }


        if (!req.query.firstname) {
            firstname = " "
        }
        else {
            firstname = `where studentmaster.student_name like '${firstname1}%'`
        }

        if (req.query.abovebelove && req.query.percentage && req.query.abovebelovedays && req.query.days && req.query.andor) {
            var persentage1 = ` HAVING count(attendancemonth.attendance) * 100 / ( 30) ${req.query.abovebelove} ${persentage} ${andor} count(attendancemonth.attendance) ${abovebelovedays} ${day}`;
        }
        else if (req.query.abovebelovedays && req.query.days) {
            persentage1 = ` HAVING count(attendancemonth.attendance) ${abovebelovedays} ${day}`;
        }
        else if (req.query.abovebelove && req.query.percentage) {
            persentage1 = `HAVING count(attendancemonth.attendance) * 100 / ( 30) ${req.query.abovebelove} ${persentage} `;
        }
        else {
            persentage1 = " "
        }


        var datas = req.query.month;
        let month = datas || 12;
        // console.log(month)
        let year = req.query.year || 2023;
        // console.log(year);
        let days = 30
        // console.log("connected")
        let sql = `select studentmaster.student_id ,studentmaster.student_name   , count(attendancemonth.attendance) as count ,count(attendancemonth.attendance) * 100 / ( 30) as persentage from studentmaster  join attendancemonth  on attendancemonth.id = studentmaster.student_id and attendancemonth.attendance = 'yes' AND month(attendancemonth.dates)= '${month}' and year(attendancemonth.dates)='${year}'   ${ids} ${firstname}    group by studentmaster.student_id ${persentage1};`
        console.log(sql)

        var [result] = await con.query(sql)

        if (result.length == 0) {
            res.send('invalid data')
        }
        else {
            const numOfResults = result.length;
            console.log("this is length " + numOfResults)
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if (page > numberOfPages) {
                res.redirect('/mainpageinsorting?page=' + encodeURIComponent(numberOfPages));
            } else if (page < 1) {
                res.redirect('/mainpageinsorting?page=' + encodeURIComponent('1'));
            }

            if (numOfResults == 0) {

                res.redirect("error")
            }
            else {

                const startingLimit = (page - 1) * resultsPerPage;

                var sql2 = `select studentmaster.student_id ,studentmaster.student_name   , count(attendancemonth.attendance) as count ,count(attendancemonth.attendance) * 100 / ( 30) as persentage from studentmaster  join attendancemonth  on attendancemonth.id = studentmaster.student_id and attendancemonth.attendance = 'yes' AND month(attendancemonth.dates)= '${month}' and year(attendancemonth.dates)='${year}'  ${ids} ${firstname}   group by studentmaster.student_id   ${persentage1} LIMIT ${startingLimit},${resultsPerPage}`;
                var [result] = await con.query(sql2)
                console.log(result);
                if (result.length == 0) {
                    res.send('invalid data')
                }
                else {
                    alldata = JSON.parse(JSON.stringify(result));

                    res.render('student_attendance/attendansewithmultiperserchfilter', { data: alldata, datas, month, year, page, numberOfPages, firstname1, abovebelove, persentage, id, abovebelovedays, day, andor })

                }

                // });
                //  })
            }
        }
        // });
    }
    catch {
        res.send("invalid")
    }
}


exports.update = (req, res) => {
    res.status(200)
    try {
        var id = req.query.id;
        var name = req.query.student_name
        console.log(name)
        console.log(id)


        res.render("student_attendance/update1", { data: name, id })
    }
    catch (e) {
        res.send(e)
    }
}

exports.updateComplate = async (req, res) => {
    try {
        var updatename = req.query.updatedname;
        var id = req.query.id;
        console.log(id, updatename);
        var sql = `UPDATE studentmaster SET student_name = '${updatename}' WHERE student_id= ${id}`;

        var [result] = await con.query(sql)

        console.log(result.affectedRows + " record(s) updated");

        var affectedrows = result.affectedRows;
        console.log(affectedrows)

        res.render("student_attendance/UPDATECOMPLATE1")

    }
    catch (e) {
        res.send(e)
    }
}