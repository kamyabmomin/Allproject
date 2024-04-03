exports.timeConvertor = async (req, res) => {

    let date = new Date();
    var date1 = date.toLocaleTimeString();
    console.log(date1);
    res.render('time_convertor/homepagetimeconvertor', { date1 })
}