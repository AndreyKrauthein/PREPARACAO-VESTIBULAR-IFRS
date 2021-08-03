const express = require("express")
const router = express.Router()
const Sequelize = require("sequelize")
const slugify  = require("slugify")
const Subject = require("./Subject")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/subject", adminAuth, (req, res) => {
    Subject.findAll().then( subjects => {
        res.render("admin/subject/index.ejs", {subjects: subjects})
    })
})

router.get("/admin/subject/new", adminAuth, (req, res) => {
    res.render("admin/subject/new.ejs")
})

router.post("/admin/save/new", adminAuth, (req, res) => {
    const title = req.body.title 
    Subject.create({
        title: title,
        slug: slugify(title)
    }).then(
        res.redirect("/admin/subject")
    )
})

router.get("/admin/subject/edit/:id", adminAuth, (req, res) => {
    const id = req.params.id
    Subject.findOne({
        where: {id: id}
    }).then( subject => {
        res.render("admin/subject/edit.ejs", {subject: subject})
    })
})

router.post("/admin/subject/update/:id", adminAuth, (req, res) => {
    const title = req.body.title
    const id = req.params.id
    Subject.update({title: title, slug: slugify(title)},{where: {id: id}})
    .then(() =>
        res.redirect("/admin/subject")
    )
})

router.post("/admin/subject/delete/:id", adminAuth, (req, res) => {
    const id = req.params.id
    Subject.destroy({
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/subject")
    })
})

module.exports = router