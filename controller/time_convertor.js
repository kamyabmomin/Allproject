exports.timeConvertor = async (req, res) => {

    let date = new Date();
    let date1 = date.toLocaleTimeString();
  
    res.render('time_convertor/homepagetimeconvertor', { date1 })
}