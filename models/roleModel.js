const DBConfig = require('../configs/connection')

class Role {
    constructor(
        role_name,
        permission,
        created_date,
        created_by,
    ) {
        this.role_name = role_name
        this.permission = permission
        this.created_date = created_date
        this.created_by = created_by
    }

    insert() {
        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO role_mst SET ?'
            const roleData = {
                role_name: this.role_name,
                permission: JSON.stringify(this.permission),
                created_date: this.created_date,
                created_by: this.created_by
            }

            DBConfig.query(sql, roleData, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = Role