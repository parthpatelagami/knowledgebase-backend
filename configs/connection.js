const mysql = require('mysql2')
const colors = require("colors")

const DBConfig = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Agami@210",
    database: "task_management_system"
})

DBConfig.connect((err) => {
    if (err) {
        console.log(`MYSQL CONNECTION ERROR: ${err}`.bgRed.white)
    } else {
        console.log(`CONNECTED TO MYSQL DATABASE SUCCESSFULLY`.bgGreen.white)
    }
})

module.exports = DBConfig   