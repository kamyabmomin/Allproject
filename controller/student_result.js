const { con } = require("../database/database");
const resultsPerPage = 10;
exports.result = async (req, res) => {
    res.status(200);



    let sql1 = "SELECT  exameresult.student_id ,studentmaster.student_name, (select sum(obtain_theory_marks )   from  exameresult where exame_type = 2 and  exameresult.student_id = studentmaster.student_id  group by student_id) as totaltheory2 ,(select sum(obtain_theory_marks )   from  exameresult where exame_type = 1 and exameresult.student_id = studentmaster.student_id   group by student_id) as totaltheory1 , (select sum(obtain_practical_marks)    from  exameresult where exame_type = 2 and  exameresult.student_id = studentmaster.student_id  group by student_id)  as totalpractical2 ,(select sum(obtain_practical_marks)   from  exameresult where exame_type = 1 and exameresult.student_id = studentmaster.student_id   group by student_id) as totalpractical1 , (select sum(obtain_practical_marks)  from  exameresult where exame_type = 3  and exameresult.student_id = studentmaster.student_id  group by student_id) as totalpractical3,(select sum(obtain_theory_marks ) from  exameresult where exame_type = 3  and exameresult.student_id = studentmaster.student_id  group by student_id)  as totaltheory3  FROM  studentmaster JOIN exameresult  on studentmaster.student_id  = exameresult.student_id group by studentmaster.student_id  ;"

    let [result] = await con.query(sql1)

    const numOfResults = result.length;
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    // console.log(page + "page numbner");
    if (page > numberOfPages) {
        res.redirect('/result/?page=' + encodeURIComponent(numberOfPages));
        return
    } else if (page < 1) {

        res.redirect('/result/?page=' + encodeURIComponent('1'));
        return
    }

    const startingLimit = (page - 1) * resultsPerPage;
    // console.log(startingLimit);

    let sql2 = `SELECT  exameresult.student_id ,studentmaster.student_name, (select sum(obtain_theory_marks )   from  exameresult where exame_type = 2 and  exameresult.student_id = studentmaster.student_id  group by student_id) as totaltheory2 ,(select sum(obtain_theory_marks )   from  exameresult where exame_type = 1 and exameresult.student_id = studentmaster.student_id   group by student_id) as totaltheory1 , (select sum(obtain_practical_marks)    from  exameresult where exame_type = 2 and  exameresult.student_id = studentmaster.student_id  group by student_id)  as totalpractical2 ,(select sum(obtain_practical_marks)   from  exameresult where exame_type = 1 and exameresult.student_id = studentmaster.student_id   group by student_id) as totalpractical1 , (select sum(obtain_practical_marks)  from  exameresult where exame_type = 3  and exameresult.student_id = studentmaster.student_id  group by student_id) as totalpractical3,(select sum(obtain_theory_marks ) from  exameresult where exame_type = 3  and exameresult.student_id = studentmaster.student_id  group by student_id)  as totaltheory3  FROM  studentmaster JOIN exameresult  on studentmaster.student_id  = exameresult.student_id group by studentmaster.student_id   LIMIT ${startingLimit},${resultsPerPage}`;
    // console.log(sql);

    let [result2] = await con.query(sql2)
    alldata = JSON.parse(JSON.stringify(result2));

    res.render('student_result/result1', { data: alldata, page, numberOfPages })

}

exports.moreDetails = async (req, res) => {
    let id = req.query.id;
    let totalpractical = req.query.totalpractical
    let totaltheory = req.query.totaltheory;
    // console.log(totaltheory)
    // console.log(id)
    let sql = ` select studentmaster.student_name as name , exameresult.exame_type as typ ,subjectmaster.sub_name as sub  , exameresult.obtain_theory_marks as theory ,exameresult.obtain_practical_marks as prectical 
    from exameresult join studentmaster on studentmaster.student_id  = exameresult.student_id join subjectmaster on 
    subjectmaster.sub_id = exameresult.sub_id  where exameresult.student_id = '${id}'; `


    var [result] = await con.query(sql)
    alldata = JSON.parse(JSON.stringify(result));
    // console.log(alldata)

    let sql2 = `select studentmaster.student_id ,studentmaster.student_name   , count(attendancemonth.attendance) as count   from   studentmaster join attendancemonth  on attendancemonth.id = studentmaster.student_id and  attendancemonth.attendance = 'yes' and attendancemonth.id = '${id}' group by studentmaster.student_id  ;`


    var [result] = await con.query(sql2)
    resultdata = JSON.parse(JSON.stringify(result));

    let sql3 = `select count(attendancemonth.id) alldaycount from attendancemonth where attendancemonth.id='${id}'`
    var [result] = await con.query(sql3)
    allday = JSON.parse(JSON.stringify(result));
    res.render('student_result/moredetailsofstudent', { data: alldata, resultdata, allday, totalpractical, totaltheory })

}