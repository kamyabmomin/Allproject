const { con } = require("../database/database");

exports.component = async (req, res) => {
    res.status(200)
    try {

        let comboname = req.query.name;
        // console.log(comboname);
        let sql
        alldata1 = 1;
        if (req.query.name) {
            sql = `select  select_master.select_name ,select_master.inputtype,option_master.option_name ,option_master.option_value ,option_master.option_id ,option_master.selectedoption  from select_master inner JOIN option_master ON select_master.select_id  = option_master.select_id   where  select_master.select_name ='${comboname}' `

        }
        else {
            alldata1 = 0
        }
        console.log(alldata1)
        if (alldata1 == 0) {
            res.render("component/component", { alldata1 });
        } else {
            let [result] = await con.query(sql)
            // console.log(alldata1)
            // console.log(result)
            res.render("component/component", { alldata: result, alldata1, comboname });
        }

    }
    catch (e) {
        res.send("error in syntex")
    }
}