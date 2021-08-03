const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const session = require("express-session")

const subjectController = require("./subject/SubjectController")
const matterController = require("./matters/MatterController")
const userController = require("./user/UserController")

const Subject = require("./subject/Subject")
const Matter = require("./matters/Matter")
const User = require("./user/User")

//view engine
app.set('view engine', 'ejs')

//Sessions
app.use(session({
    secret: "qualquercoisa",
    cookie: {maxAge: 30000000} //definindo o tempo do cookie em milisegundos (expiraçao da sessao)
}))

//file static
app.use(express.static("public"))

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    }).catch((error) => {
        console.log("Conexão nao foi feita")
    })


//rotas 
app.use("/", subjectController)
app.use("/", matterController)
app.use("/", userController)

app.get("/", (req, res) => {
    Matter.findAll({
        order: [['id','DESC']],
        limit: 4
    }).then(matters => {
        Subject.findAll().then( subjects => {
            res.render("index", {matters: matters, subjects: subjects})
        })
    })
})

app.get("/:slug", (req, res) => {
    const slug = req.params.slug
    Matter.findOne({
        where: {slug: slug}
    }).then(matter => {
        if (matter != undefined){
            Subject.findAll().then( subjects => {
                res.render("matter", {matter: matter, subjects: subjects})
            })
        } else {
            res.redirect("/")
        }
        
    }).catch(err => {
        res.redirect("/")
    })
})

app.get("/subject/:slug", (req, res) => {
    let slug = req.params.slug
    Subject.findOne({
        where: {slug: slug},
        include: [{model: Matter}]
    }).then(subject => {
            Subject.findAll().then(subjects => {
                res.render("indexSubject", {matters: subject.matters, subjects: subjects})
            })
    })
})

app.listen(3000, () => {
    console.log("O servidor está rodando!")
})