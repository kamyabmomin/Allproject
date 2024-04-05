exports.loginRegisterRoute = async(req,res ,next)=>{
    if(!req.cookies.token){
        next()
    }else{
        res.render("register_login_dashbord/dashbord")
    }
    
}