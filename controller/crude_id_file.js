const fs = require('fs');

exports.writeData= (req, res) => {
    res.status(200);

    var oneuserdata = req.body;
    oneuserdata.id = crypto.randomUUID();


    var data = fs.readFileSync('database.json', "utf-8")
    var parsdata = JSON.parse(data)


    parsdata.push(oneuserdata)


    fs.writeFileSync('database.json', JSON.stringify(parsdata), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });


    res.render("crude_in_file/details", { data: parsdata })

}
exports.more = (req, res) => {
    res.status(200);


    var fatchingdata = req.body;
    //  console.log(JSON.stringify(req.body))
    var val = Object.keys(fatchingdata).toString();
    //  console.log(val)
    var OBJECT = Object.values(fatchingdata).toString();
    // console.log(OBJECT);
    var data = fs.readFileSync('database.json', "utf-8");
    var data1 = JSON.parse(data)
    var pass


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