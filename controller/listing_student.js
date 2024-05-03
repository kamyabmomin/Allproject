const { con } = require("../database/database");


exports.listing_student = async (req, res) => {

    let sql = "select * from student  LIMIT  50000 ";
    let [result] = await con.query(sql)
    alldata = JSON.parse(JSON.stringify(result));
    res.status(200);
    res.render('listing_student/listing1', { data: alldata })

}