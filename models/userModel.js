const DBConfig = require('../configs/connection')

class User {
    constructor(
        user_id,
        firstName,
        lastName,
        email,
        password,
        role_id,
        created_date,
        created_by,
    ) {
        this.user_id = user_id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
        this.role_id = role_id
        this.created_date = created_date
        this.created_by = created_by
    }

    insert() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_mst SET ?'
            const userData = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                role_id: this.role_id,
                created_date: this.created_date,
                created_by: this.created_by
            }

            DBConfig.query(sql, userData, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = User
