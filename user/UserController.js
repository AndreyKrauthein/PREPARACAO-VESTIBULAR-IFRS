const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/user/new", adminAuth, (req, res) => {
    res.render("admin/user/new")
})

router.post("/admin/user/save", adminAuth, (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user == undefined){
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/")
            })
        } else {
            res.redirect("/admin/users/create")
        }
    })

})

router.get("/login", (req, res) => {
    res.render("admin/user/login")
})

router.post("/authenticate", (req, res) => {
    const email = req.body.email
    const password = req.body.password

    console.log(email, password)

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user != undefined){
            let correct = bcrypt.compareSync(password, user.password)
            
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/subject")
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })
})


router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router