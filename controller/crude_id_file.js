const fs = require('fs');

exports.writeData = (req, res) => {
    res.status(200);
    let oneuserdata = req.body;
    oneuserdata.id = crypto.randomUUID();
    let data = fs.readFileSync('database.json', "utf-8")
    let parsdata = JSON.parse(data)
    parsdata.push(oneuserdata)

    try {
        fs.writeFileSync('database.json', JSON.stringify(parsdata), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });


        res.render("crude_in_file/details", { data: parsdata })
    } catch (e) {
        res.send(e)
    }
}
exports.more = (req, res) => {
    res.status(200);
    let fatchingdata = req.body;
    //  console.log(JSON.stringify(req.body))
    let val = Object.keys(fatchingdata).toString();
    //  console.log(val)
    let OBJECT = Object.values(fatchingdata).toString();
    // console.log(OBJECT);
    let data = fs.readFileSync('database.json', "utf-8");
    let data1 = JSON.parse(data)
    let pass


    if (OBJECT == "update") {
        data1.forEach(element => {
            if (element.id == val) {
                pass = element
            }
            else
                console.log("no match ")

        });

        res.render("crude_in_file/update", { data: pass });
    }
    if (OBJECT == "more") {
        data1.forEach(element => {
            if (element.id == val) {
                pass = element
            }
            else
                console.log("no match ")

        });

        res.render("crude_in_file/more", { data: pass });
    }
    //   console.log(pass)




    if (OBJECT == "delete") {
        // console.log("delete");
        const objWithIdIndex = data1.findIndex((obj) => obj.id == val);
        // console.log(objWithIdIndex);

        if (objWithIdIndex > -1) {
            // console.log("object index")
            data1.splice(objWithIdIndex, 1);
        }
        console.log(data1)
        fs.writeFileSync('database.json', JSON.stringify(data1), function (err) {
            if (err) throw err; {
                console.log('Saved!');
            }

            console.log("save")
        });
        res.render("crude_in_file/details", { data: data1 });
    }



}