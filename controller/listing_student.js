const { con } = require("../database/database");


exports.listing_student = async (req, res) => {
    res.status(200);
    var sql = "select * from student  LIMIT  50000 ";
    var [result] = await con.query(sql)
    alldata = JSON.parse(JSON.stringify(result));
    res.render('listing_student/listing1', { data: alldata })

}