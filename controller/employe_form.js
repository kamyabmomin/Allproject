// const { con } = require("../../database/database")
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { con } = require("../database/database");



exports.save = async (req, res) => {
    // console.log(req.body);
    let data = req.body;
    // con.connect(function (err) {
    //     if (err) {
    //         console.log("eror")
    //     };
    //     console.log("Connected!");
    // })
    // if(res.basicdetailsvalid == true){
    let sql1 = `insert into basic_details (first_name,last_name,designation,address_line1,adderess_line2,email,mobile_no,city,zip_code,bod,state,gender,statues) values ("${data.firstname}" ,"${data.lastname2}" ,"${data.designationfirst}","${data.addressline1}","${data.addressline2}",'${data.email}',${data.number},"${data.city1}",${data.zip},'${data.bob}' ,'${data.state}',"${data.gender}","${data.statuse}")`;

    let [data1] = await con.query(sql1)
    // console.log("1 record inserted");
    let id = data1.insertId;
    // console.log(id);

    // EDUCATION

    if (typeof (data.nameofboard1) == 'string') {
        if (data.nameofboard1 != "") {
            let sql2 = `insert into education (employe_id ,education,passing_year,persentage)  values (${id},'${data.nameofboard1}',${data.passingyear1} ,${data.persentage1})`;
            // console.log(sql2);
            await con.query(sql2)
        }

    } else {
        for (let i = 0; i < data.nameofboard1.length; i++) {
            if (data.nameofboard1[i] != "") {
                let sql2 = `insert into education (employe_id ,education,passing_year,persentage)  values (${id},'${data.nameofboard1[i]}',${data.passingyear1[i]} ,${data.persentage1[i]})`;
                // console.log(sql2);
                await con.query(sql2)
            }
        }
    }

    // console.log(data.Language1);
    //languge
    if (data.Language1) {
        // console.log(data.Language1);
        let read = data.read1 || "no";
        let speak = data.speak1 || "no";
        let write = data.write1 || "no"
        let sql7 = `insert into languageknown ( employe_id,languge ,speak,reading,writing) values (${id} ,"${data.Language1}","${speak}","${read}","${write}")`;
        // console.log(sql7);
        await con.query(sql7)
    }
    // console.log(data.Language2);

    if (data.Language2) {
        // console.log(data.Language2);
        let read = data.read2 || "no";
        let speak = data.speak2 || "no";
        let write = data.write2 || "no"
        let sql8 = `insert into languageknown ( employe_id,languge ,speak,reading,writing) values (${id} ,"${data.Language2}","${speak}","${read}","${write}")`;
        // console.log(sql8);
        await con.query(sql8)
    }

    if (data.Language3) {
        let read = data.read3 || "no";
        let speak = data.speak3 || "no";
        let write = data.write3 || "no"
        let sql9 = `insert into languageknown ( employe_id,languge ,speak,reading,writing) values (${id} ,"${data.Language3}","${speak}","${read}","${write}")`;
        // console.log(sql9);
        await con.query(sql9)
    }
    //technical languge

    for (let i = 1; i < 5; i++) {
        let a = `${data[`technicalLanguage${i}`]}`
        if (a != "undefined") {
            let a = `${data[`technicalLanguage${i}`]}`
            let b = `${data[`techlevel${i}`]}`
            let sql10 = `insert into thecnologiknown  (employe_id,thecnologylanguge,levels) values (${id} ,"${a}" ,"${b}")`
            // console.log(sql10);
            await con.query(sql10)
        }
    }


    //refreance 
    if (typeof (data.name1) == "string") {
        if (data.name1 != "") {
            let sql12 = `insert into refrenceknown  (employe_id,reference_name ,reference_mobile_no,relation) values (${id},'${data.name1}' ,"${data.contactnumber1}" ,"${data.relation1}" )`
            // console.log(sql12);
            await con.query(sql12)

        }

    } else {

        for (let i = 0; i < data.name1.length; i++) {
            if (data.name1[i] != "") {
                let sql12 = `insert into refrenceknown  (employe_id,reference_name ,reference_mobile_no,relation) values (${id},'${data.name1[i]}' ,"${data.contactnumber1[i]}" ,"${data.relation1[i]}" )`
                // console.log(sql12);
                await con.query(sql12)

            }
        }
    }

    //work
    if (typeof (data.compnyname1) == 'string') {
        if (data.compnyname1 != "") {
            let sql13 = `insert into workexperienc (employe_id ,compny_name,designation,join_date ,end_date) values (${id} ,"${data.compnyname1}" ,'${data.designation1}','${data.fromdate1}' ,'${data.todate1}')`
            // console.log(sql13);
            await con.query(sql13)
        }

    } else {
        for (let i = 0; i < data.compnyname1.length; i++) {
            if (data.compnyname1[i] != "") {
                let sql13 = `insert into workexperienc (employe_id ,compny_name,designation,join_date ,end_date) values (${id} ,"${data.compnyname1[i]}" ,'${data.designation1[i]}','${data.fromdate1[i]}' ,'${data.todate1[i]}')`
                // console.log(sql13);
                await con.query(sql13)
            }
        }
    }

    //preferd location
    let sql11 = `insert into Preferens (employe_id ,prefered_location,Notice_period,Expacted_CTC,Current_CTc,department) values (${id},"${data.Preferdlocation}" ,"${data.Noticeperiod}" ,${data.ectc} ,${data.cctc},"${data.department}")`;
    // console.log(sql11);
    await con.query(sql11)
    res.status(200)
    res.render("employe_form/ajxsave");


}

exports.allList = async (req, res) => {
    let sql = `select * from basic_details`
    let [data] = await con.query(sql)
    // console.log(data);
    res.render("employe_form/ajxlist", { data })
}

exports.deleteId = async (req, res) => {
    let id = req.query.id

    let sql = `delete from basic_details where employe_id = ${id}`
    let [data] = await con.query(sql)
    // console.log(data);
    res.redirect("/alllist")
}

exports.updateId = async (req, res) => {

    let id = req.query.id;
    // console.log(id);
    let sql1 = `select *, DATE_FORMAT(bod, "%Y-%m-%d") as bod from basic_details where employe_id=${id}`
    let sql2 = `select * from education where employe_id= ${id}`;
    let sql3 = `select * ,DATE_FORMAT(join_date, "%Y-%m-%d") as join_date ,DATE_FORMAT(end_date, "%Y-%m-%d") as end_date from workexperienc where employe_id=${id}`;
    let sql4 = `select * from languageknown where employe_id=${id}`;
    let sql5 = `select * from refrenceknown where employe_id=${id}`;
    let sql6 = `select * from Preferens where employe_id=${id}`;
    let sql7 = `select * from thecnologiknown where employe_id= ${id}`
    // let sql8 = `select * from   cities where state_id = ${data}`;
    // var [data8] = await con.query(sql8)
    let [data] = await con.query(sql1);
    let [data2] = await con.query(sql2);
    let [data3] = await con.query(sql3);
    let [data4] = await con.query(sql4);
    let [data5] = await con.query(sql5);
    let [data6] = await con.query(sql6);
    let [data7] = await con.query(sql7);
    // console.log(sql2);
    // console.log(data2);
    res.render("employe_form/ajxupdate", { data, data2, data3, data4, data5, data6, data7, id })
    function asynqQuery(query) {
        return new Promise((resolve, reject) => {
            con.query(query, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    }
}

exports.updateIdPost = async (req, res) => {
    let data = req.body;
    // console.log(data);
    let id = req.body.id
    // console.log(id);

    // var education = data.nameofboard1.length
    let sql1 = `UPDATE basic_details SET first_name ='${data.firstname}' , last_name ='${data.lastname2}',designation='${data.designationfirst}' ,address_line1='${data.addressline1}' ,adderess_line2='${data.addressline2}' ,email ='${data.email}' ,mobile_no =${data.number} ,city ='${data.city1}' ,zip_code =${data.zip} , bod ='${data.bob}' , state='${data.state}', gender='${data.gender}',statues='${data.statuse}' WHERE employe_id = ${id}   `
    await con.query(sql1);

    let hiddenidlength
    if (typeof (data.edhiddenid) == "string") {
        hiddenidlength = 1
        // console.log(hiddenidlength);
    }
    else if (!data.edhiddenid) {
        hiddenidlength = 0
    }
    else {
        hiddenidlength = data.edhiddenid.length
    }

    // console.log(hiddenidlength)
    //education
    if (typeof (data.nameofboard1) == 'string') {
        if (data.nameofboard1 != "" && data.passingyear1 != "" && data.persentage1 != "" && hiddenidlength != 0) {
            let sql2 = `update  education   set  education='${data.nameofboard1}' ,passing_year=${data.passingyear1} ,persentage=${data.persentage1} WHERE employe_id = ${id} &&  educationid = ${data.edhiddenid}`;
            // console.log(sql2);
            await con.query(sql2)
        }
        else if (hiddenidlength != 0 && data.nameofboard1 == "") {
            let sql2 = `delete from   education  WHERE employe_id = ${id} &&  educationid = ${data.edhiddenid}`;
            // console.log(sql2);
            await con.query(sql2)

        }
        // if (!data.edhiddenid && data.edemployeid & data.nameofboard1) {
        else {
            if (data.nameofboard1) {
                let sql2 = `insert into education (employe_id ,education,passing_year,persentage)  values (${id},'${data.nameofboard1}',${data.passingyear1} ,${data.persentage1})`;
                // console.log(sql2);
                await con.query(sql2)

            }
        }

    } else {
        for (let i = 0; i < hiddenidlength; i++) {
            if (data.nameofboard1[i] != "" && data.passingyear1[i] != "" && data.persentage1[i] != "" && data.edhiddenid[i]) {
                let sql2 = `update  education   set  education ='${data.nameofboard1[i]}',passing_year=${data.passingyear1[i]} , persentage=${data.persentage1[i]} WHERE employe_id = ${id} &&  educationid = ${data.edhiddenid[i]}`;
                // console.log(sql2);
                await con.query(sql2)
            }
            if (data.nameofboard1[i] == "" && data.edhiddenid[i]) {
                // console.log("sfsefg");
                let sql2 = `delete from   education  WHERE employe_id = ${id} &&  educationid = ${data.edhiddenid[i]}`;
                // console.log(sql2);
                await con.query(sql2)
            }

        }
        for (let i = hiddenidlength; i < data.nameofboard1.length; i++) {
            if (data.nameofboard1[i]) {
                let sql2 = `insert into education (employe_id ,education,passing_year,persentage)  values (${id},'${data.nameofboard1[i]}',${data.passingyear1[i]} ,${data.persentage1[i]})`;
                // console.log(sql2);
                await con.query(sql2)
            }
        }
    }


    //work
    let hiddenworkid
    if (typeof (data.workid) == "string") {
        hiddenworkid = 1
        // console.log(hiddenidlength);
    }
    else if (!data.workid) {
        hiddenworkid = 0
    }
    else {
        hiddenworkid = data.workid.length
    }
    // console.log(hiddenworkid);


    if (typeof (data.compnyname1) == 'string') {
        if (data.compnyname1 != "" && data.designation1 != "" && data.fromdate1 != "" && data.todate1 != "" && data.todate != "" && hiddenworkid != 0) {
            let sql13 = `update  workexperienc set   compny_name = "${data.compnyname1}" ,designation='${data.designation1}',join_date='${data.fromdate1}' ,end_date='${data.todate1}' WHERE employe_id = ${id} && workexperiencid=${data.workid}`
            // console.log(sql13);
            await con.query(sql13)
        }
        else if (data.compnyname1 == "" && hiddenworkid != 0) {
            let sql13 = `delete from   workexperienc   WHERE employe_id = ${id} && workexperiencid=${data.workid}`
            // console.log(sql13);
            await con.query(sql13)

        }
        else {
            if (data.compnyname1) {
                let sql13 = `insert into workexperienc (employe_id ,compny_name,designation,join_date ,end_date) values (${id} ,"${data.compnyname1}" ,'${data.designation1}','${data.fromdate1}' ,'${data.todate1}')`
                // console.log(sql13);
                await con.query(sql13)
            }
        }
    } else {

        for (let i = 0; i < hiddenworkid; i++) {
            // if (typeof (data.workid) != 'string') {
            if (data.compnyname1[i] != "" && data.designation1[i] != "" && data.fromdate1[i] != "" && data.todate1[i] != "" && data.workid[i]) {
                let sql13 = `update  workexperienc set compny_name="${data.compnyname1[i]}" , designation='${data.designation1[i]}',join_date='${data.fromdate1[i]}' , end_date='${data.todate1[i]}' WHERE employe_id = ${id} && workexperiencid=${data.workid[i]}`
                // console.log(sql13);
                await con.query(sql13)
            }
            if (data.compnyname1[i] == "" && data.workid[i]) {
                let sql13 = `delete from   workexperienc   WHERE employe_id = ${id} && workexperiencid=${data.workid[i]}`
                // console.log(sql13);
                await con.query(sql13)
            }
        }

        for (let i = hiddenworkid; i < data.compnyname1.length; i++) {
            if (data.compnyname1) {
                let sql13 = `insert into workexperienc (employe_id ,compny_name,designation,join_date ,end_date) values (${id} ,"${data.compnyname1[i]}" ,'${data.designation1[i]}','${data.fromdate1[i]}' ,'${data.todate1[i]}')`
                // console.log(sql13);
                await con.query(sql13)
            }
        }
    }

    //languge

    if (data.Language1) {
        // console.log(data.Language1);
        let read = data.read1 || "no";
        let speak = data.speak1 || "no";
        let write = data.write1 || "no"
        let sql7 = `UPDATE  languageknown SET languge="${data.Language1}",speak="${speak}",reading="${read}",writing="${write}" WHERE employe_id = ${id}`;
        // console.log(sql7);
        await con.query(sql7)
    }
    // console.log(data.Language2);

    if (data.Language2) {
        // console.log(data.Language2);
        let read = data.read2 || "no";
        let speak = data.speak2 || "no";
        let write = data.write2 || "no"
        let sql8 = `UPDATE  languageknown SET languge="${data.Language2}",speak="${speak}",reading="${read}",writing="${write}" WHERE employe_id = ${id}`;
        // console.log(sql8);
        await con.query(sql8)
    }

    if (data.Language3) {
        let read = data.read3 || "no";
        let speak = data.speak3 || "no";
        let write = data.write3 || "no"
        let sql9 = `UPDATE  languageknown SET languge="${data.Language3}",speak="${speak}",reading="${read}",writing="${write}" WHERE employe_id = ${id}`;
        // console.log(sql9);
        await con.query(sql9)
    }



    if (data.technicalLanguage1 && data.hiddenid1) {
        let sql10 = `UPDATE  thecnologiknown SET  thecnologylanguge ="${data.technicalLanguage1}" ,levels="${data.techlevel1}" WHERE employe_id = ${id}  && technologyid ="${data.hiddenid1}"`
        await con.query(sql10)
        // console.log(sql10)
    }
    if (data.technicalLanguage1 && !data.hiddenid1) {

        let sql10 = `insert into thecnologiknown  (employe_id,thecnologylanguge,levels) values (${id} ,"${data.technicalLanguage1}" ,"${data.techlevel1}")`
        await con.query(sql10)
        // console.log(sql10)

    }
    if (data.technicalLanguage2 && data.hiddenid2) {
        let sql10 = `UPDATE  thecnologiknown SET  thecnologylanguge ="${data.technicalLanguage2}" ,levels="${data.techlevel2}" WHERE employe_id = ${id} && technologyid ="${data.hiddenid2}"`
        await con.query(sql10)
        // console.log(sql10)
    }
    if (data.technicalLanguage2 && !data.hiddenid2) {

        let sql10 = `insert into thecnologiknown  (employe_id,thecnologylanguge,levels) values (${id} ,"${data.technicalLanguage2}" ,"${data.techlevel2}")`
        await con.query(sql10)
        // console.log(sql10)

    }
    if (data.technicalLanguage3 && data.hiddenid3) {
        let sql10 = `UPDATE  thecnologiknown SET  thecnologylanguge ="${data.technicalLanguage3}" ,levels="${data.techlevel3}" WHERE employe_id = ${id} && technologyid ="${data.hiddenid3}"`
        await con.query(sql10)
        // console.log(sql10)
    }
    if (data.technicalLanguage3 && !data.hiddenid3) {

        let sql10 = `insert into thecnologiknown  (employe_id,thecnologylanguge,levels) values (${id} ,"${data.technicalLanguage3}" ,"${data.techlevel3}")`
        await con.query(sql10)
        // console.log(sql10)

    }
    if (data.technicalLanguage4 && data.hiddenid4) {
        let sql10 = `UPDATE  thecnologiknown SET  thecnologylanguge ="${data.technicalLanguage4}" ,levels="${data.techlevel4}" WHERE employe_id = ${id}&& technologyid ="${data.hiddenid4}"`
        await con.query(sql10)
        // console.log(sql10)
    }
    if (data.technicalLanguage4 && !data.hiddenid4) {

        let sql10 = `insert into thecnologiknown  (employe_id,thecnologylanguge,levels) values (${id} ,"${data.technicalLanguage4}" ,"${data.techlevel4}")`
        await con.query(sql10)
        // console.log(sql10)

    }
    //REFRENC

    let hiddenrefrenceid
    if (typeof (data.refenceid) == "string") {
        hiddenrefrenceid = 1
        // console.log(hiddenrefrenceid);
    }
    else if (!data.refenceid) {
        hiddenrefrenceid = 0
    }
    else {
        hiddenrefrenceid = data.refenceid.length
    }
    // console.log(hiddenrefrenceid);




    if (typeof (data.name1) == "string") {
        if (data.name1 != "" && data.contactnumber1 != "" && data.relation1 != "" && hiddenrefrenceid != 0) {
            let sql12 = `UPDATE  refrenceknown SET reference_name ='${data.name1}' ,reference_mobile_no="${data.contactnumber1}" ,relation="${data.relation1}" WHERE employe_id = ${id} &&  refrenceid= ${data.refenceid} `
            // console.log(sql12);
            await con.query(sql12)

        }
        else if (data.name1 == "" && hiddenrefrenceid != 0) {
            let sql12 = `DELETE FROM refrenceknown WHERE  employe_id = ${id} &&  refrenceid= ${data.refenceid} `
            // console.log(sql12);
            await con.query(sql12);
        }
        else {
            if (data.name1) {
                let sql12 = `insert into refrenceknown  (employe_id,reference_name ,reference_mobile_no,relation) values (${id},'${data.name1}' ,"${data.contactnumber1}" ,"${data.relation1}" )`
                // console.log(sql12);
                await con.query(sql12)

            }
        }
    }

    else {

        for (let i = 0; i < hiddenrefrenceid; i++) {
            if (data.name1[i] == "" && data.refenceid) {

                let sql12 = `DELETE FROM refrenceknown WHERE employe_id = ${id} &&  refrenceid= ${data.refenceid[i]} `
                // console.log(sql12);
                await con.query(sql12);
            }
            if (data.name1[i] != "" && data.contactnumber1[i] != "" && data.relation1[i] != "" && data.refenceid[i]) {
                let sql12 = `UPDATE  refrenceknown SET   reference_name='${data.name1[i]}' ,reference_mobile_no="${data.contactnumber1[i]}" ,relation="${data.relation1[i]}" WHERE employe_id = ${id} &&  refrenceid= ${data.refenceid[i]}`
                // console.log(sql12);
                await con.query(sql12)
            }
        }
        for (let i = hiddenrefrenceid; i < data.name1.length; i++) {
            if (data.name1) {
                let sql12 = `insert into refrenceknown  (employe_id,reference_name ,reference_mobile_no,relation) values (${id},'${data.name1[i]}' ,"${data.contactnumber1[i]}" ,"${data.relation1[i]}" )`
                // console.log(sql12);
                await con.query(sql12)

            }
        }
    }


    //PREFRANCE 
    let sql11 = `UPDATE  Preferens SET  prefered_location="${data.Preferdlocation}" ,Notice_period="${data.Noticeperiod}" ,Expacted_CTC=${data.ectc} ,Current_CTc=${data.cctc},department="${data.department}" WHERE employe_id = ${id}`;
    // console.log(sql11);
    await con.query(sql11)


    res.end()

}

exports.city = async (req, res) => {
    let data = req.body.id;
    // console.log(data);
    // console.log(res);
    let sql = `select * from   cities where state_id = ${data}`;
    let [data2] = await con.query(sql)
    res.json(data2)
}