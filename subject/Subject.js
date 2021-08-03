const Sequelize = require("sequelize")
const connection = require("../database/database")

const Subject = connection.define("subjects", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Subject.sync({force: false})
module.exports = Subject