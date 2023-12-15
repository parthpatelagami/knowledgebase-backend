const DBConfig = require('../configs/connection')

class RoleUpdate {
    constructor(
        role_id,
        role_name,
        permission,
        updated_date,
        updated_by
    ) {
        this.role_id = role_id
        this.role_name = role_name
        this.permission = permission
        this.updated_date = updated_date
        this.updated_by = updated_by
    }

    update() {
        return new Promise((resolve, reject) => {

            const sql = 'UPDATE role_mst SET ? WHERE role_id = ?'
            const roleData = {
                role_name: this.role_name,
                permission: JSON.stringify(this.permission),
                updated_date: this.updated_date,
                updated_by: this.updated_by
            }

            const roleId = this.role_id

            DBConfig.query(sql, [roleData, roleId], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = RoleUpdate