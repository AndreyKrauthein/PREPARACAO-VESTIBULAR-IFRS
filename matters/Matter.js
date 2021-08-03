const Sequelize = require("sequelize")
const connection = require("../database/database")
const Subject = require("../subject/Subject")

const Matter = connection.define("matters", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Subject.hasMany(Matter) 
Matter.belongsTo(Subject)

Matter.sync({force: false})
module.exports = Matter