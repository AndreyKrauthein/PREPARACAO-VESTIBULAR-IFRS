const express = require("express")
const slugify = require("slugify")
const router = express.Router()
const Subject = require("../subject/Subject")
const Matter = require("./Matter")
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/matter", adminAuth,  (req, res)  => {
    Matter.findAll({
        include: [{model: Subject}]
    }).then(matters => {
        res.render("admin/matter/index.ejs", {matters: matters})
    })
})

router.get("/admin/matter/new", adminAuth, (req, res) => {
    Subject.findAll().then(subjects => {
        res.render("admin/matter/new.ejs", {subjects: subjects})
    })
    
})

router.post("/admin/matter/save", adminAuth, (req, res) => {
    const subject = req.body.subject
    const title = req.body.title
    const body = req.body.body
    Matter.create({
        title: title,
        slug: slugify(title),
        body: body,
        subjectId: subject
    }).then(() => {
        res.redirect("/admin/matter")
    })

    
})

router.get("/admin/matter/edit/:id", adminAuth, (req, res) => {
    const id = req.params.id
    Subject.findAll().then(subjects => {
        Matter.findOne({
            where: {id: id}
        }).then( matter => {
            res.render("admin/matter/edit.ejs", {matter: matter, subjects: subjects})
        })
    })
})

router.post("/admin/matter/update/:id", adminAuth,  (req, res) => {
    const subject = req.body.subject
    const title = req.body.title
    const body = req.body.body
    const id = req.params.id
    Matter.update({subjectId: subject, title: title, body: body, slug: slugify(title)}, {where: {id: id}}).then(
        res.redirect("/")
    )
})

router.post("/admin/matter/delete/:id", adminAuth, (req, res) => {
    const id = req.params.id
    Matter.destroy({where: {id: id}}).then(
        res.redirect("/admin/matter")
    ).catch(res.redirect("/admin/matter/new.ejs"))
})

router.get("/matters/page/:num", (req, res) => {
    let page = req.params.num
    var offset = 0
    
    if (isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * 4
    }
    Matter.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id','DESC']],
    }).then(matters => {

        var next
        if (offset + 4 >= matters.count){
            next = false
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            matters: matters,
        }

        Subject.findAll().then(subjects => {
            res.render("admin/matter/page", {result: result, subjects: subjects})
        })
    })

    
})
module.exports = router