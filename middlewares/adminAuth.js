function adminAuth(req, res, next){
    //Está logado
    if(req.session.user != undefined){
        next()
    } else {
        //Nao ta logado
        res.redirect("/login")
    }
}

module.exports = adminAuth