const DBConfig = require('../configs/connection')
const User = require('../models/authModel')

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        DBConfig.beginTransaction((beginErr) => {
            if (beginErr) {
                return reject(beginErr)
            }

            // Retrieve the user's information
            const selectSql = "SELECT u.*, r.permission, role_name FROM user_mst u " +
                "LEFT JOIN role_mst r ON u.role_id = r.role_id " +
                "WHERE u.email = ?"

            DBConfig.query(selectSql, [email], (selectErr, selectResults) => {
                if (selectErr) {
                    DBConfig.rollback(() => {
                        reject(selectErr)
                    })
                } else if (selectResults.length === 0) {
                    DBConfig.rollback(() => {
                        resolve(null) // User not found
                    })
                } else {
                    DBConfig.commit((commitErr) => {
                        if (commitErr) {
                            DBConfig.rollback(() => {
                                reject(commitErr)
                            })
                        } else {
                            const userData = selectResults[0]
                            const jsonPermission = JSON.parse(userData.permission)
                            const user = new User(
                                userData.email,
                                userData.firstName,
                                userData.lastName,
                                userData.company_name,
                                userData.profile,
                                jsonPermission,
                                userData.role_name,
                                userData.isSuspended,
                                userData.user_id
                            )
                            resolve(user)
                        }
                    })
                }
            })

        })
    })
}

async function createUser(newUser) {

    return new Promise((resolve, reject) => {
        const insertSQL = "INSERT INTO user_mst SET ?"
        DBConfig.query(insertSQL, newUser, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
}

module.exports = { getUserByEmail, createUser }