const Sequelize = require("sequelize")

const connection = new Sequelize('preparacao-vestibular', 'root', 'Krauthein2005', {
    host: 'localhost',
    dialect: 'mysql'
})



module.exports = connection