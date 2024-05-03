const { con } = require("../database/database");
const resultsPerPage = 30;
exports.paging = async (req, res) => {
    let data = req.body;
  
    let sql = 'select count(id) as totalstudent from student';
    let [result] = await con.query(sql)
  
    const numOfResults = result[0].totalstudent;
  
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
        res.redirect(`/pagindindex?page=${numberOfPages}`);
        return
    } else if (page < 1) {
        res.redirect('/pagindindex?page=1');
        return
    }
    const startingLimit = (page - 1) * resultsPerPage;
   
    sql = `SELECT * FROM student LIMIT ${startingLimit},${resultsPerPage}`;

    [result] = await con.query(sql)

    res.render('paging_student_listing/index1', { data: result, page, numberOfPages });

};

exports.pagingPost = async (req, res) => {
    let data = req.body;
    let key = Object.values(data)
    JSON.stringify(key);

    const order = key[0];
    let colamname = key[1];
    
    let key1 = key[2];
    if (key1 == "submit") {
        let sql = `SELECT * FROM student ORDER BY ${colamname} ${order}`;
        let [result1] = await con.query(sql)
        const numOfResults = result1.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            res.redirect('/?page=' + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
            res.redirect('/?page=' + encodeURIComponent('1'));
        }
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * FROM student ORDER BY ${colamname}  ${order} LIMIT ${startingLimit},${resultsPerPage}`;
        let [result] = await con.query(sql)
        res.render('paging_student_listing/index1', { data: result, page, numberOfPages });
    }
}
