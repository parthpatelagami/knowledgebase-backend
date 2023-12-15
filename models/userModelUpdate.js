const DBConfig = require('../configs/connection')

class UserUpdate {
    constructor(
        user_id,
        firstName,
        lastName,
        password,
        role_id,
        updated_date,
        updated_by
    ) {
        this.user_id = user_id
        this.firstName = firstName
        this.lastName = lastName
        this.password = password
        this.role_id = role_id
        this.updated_date = updated_date
        this.updated_by = updated_by
    }

    update() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE user_mst SET ? WHERE user_id = ?'
            const userData = {
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password,
                role_id: this.role_id,
                updated_date: this.updated_date,
                updated_by: this.updated_by
            }

            const userId = this.user_id

            DBConfig.query(sql, [userData, userId], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = UserUpdate
