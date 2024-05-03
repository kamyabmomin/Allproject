const { con } = require("../database/database");
const resultsPerPage = 10;
exports.attandance = async (req, res) => {

    // try {
    let colname = req.query.colname || "studentmaster.student_id";
    let id = req.query.id;
    let firstname1 = req.query.firstname
    let andor = req.query.andor;
    let persentage = req.query.percentage;
    let abovebelove = req.query.abovebelove;
    let abovebelovedays = req.query.abovebelovedays;
    let day = req.query.days;

    if (req.query.id) {
        ids = ` where attendancemonth.id  in(${id})`
    }
    else {
        ids = " "
    }

    let firstname
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


    let datas = req.query.month;
    let month = datas || 12;

    let year = req.query.year || 2023;
 
    let days = 30

    let sql = `select studentmaster.student_id ,studentmaster.student_name   , count(attendancemonth.attendance) as count ,count(attendancemonth.attendance) * 100 / ( 30) as persentage from studentmaster  join attendancemonth  on attendancemonth.id = studentmaster.student_id and attendancemonth.attendance = 'yes' AND month(attendancemonth.dates)= '${month}' and year(attendancemonth.dates)='${year}'   ${ids} ${firstname}    group by studentmaster.student_id ${persentage1};`


    let [result] = await con.query(sql)

    if (result.length == 0) {
        res.send('invalid data')
    }
    else {
        const numOfResults = result.length;
    
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            
            res.redirect("?page=10")
            return
            // res.redirect('/mainpageinsorting/?page=10');
        } else if (page < 1) {
            res.redirect('/mainpageinsorting?page=' + encodeURIComponent('1'));
            return
        }

        if (numOfResults == 0) {

            res.send("error")
        }
        else {

            const startingLimit = (page - 1) * resultsPerPage;
          
            let sql2 = `select studentmaster.student_id ,studentmaster.student_name   , count(attendancemonth.attendance) as count ,count(attendancemonth.attendance) * 100 / ( 30) as persentage from studentmaster  join attendancemonth  on attendancemonth.id = studentmaster.student_id and attendancemonth.attendance = 'yes' AND month(attendancemonth.dates)= '${month}' and year(attendancemonth.dates)='${year}'  ${ids} ${firstname}   group by studentmaster.student_id   ${persentage1} LIMIT ${startingLimit},${resultsPerPage}`;
            let [result] = await con.query(sql2)
           
            if (result.length == 0) {
                res.send('invalid data')
            }
            else {
                alldata = JSON.parse(JSON.stringify(result));

                res.render('student_attendance/attendansewithmultiperserchfilter', { data: alldata, datas, month, year, page, numberOfPages, firstname1, abovebelove, persentage, id, abovebelovedays, day, andor })

            }

        }
    }
    
 
}


exports.update = (req, res) => {
    
    try {
        let id = req.query.id;
        let name = req.query.student_name
   


        res.render("student_attendance/update1", { data: name, id })
    }
    catch (e) {
        res.send(e)
    }
}

exports.updateComplate = async (req, res) => {
    try {
        let updatename = req.query.updatedname;
        let id = req.query.id;
        let sql = `UPDATE studentmaster SET student_name = '${updatename}' WHERE student_id= ${id}`;
        let [result] = await con.query(sql)

     

        let affectedrows = result.affectedRows;
   

        res.render("student_attendance/UPDATECOMPLATE1")

    }
    catch (e) {
        res.send(e)
    }
}