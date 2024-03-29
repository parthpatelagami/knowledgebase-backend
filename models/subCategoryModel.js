const DBConfig = require('../configs/connection')

class SubCategory {
    constructor(
        category_id,
        subcategory_name,
        description,
        status,
        created_date,
        created_by,
    ) {
        this.category_id = category_id
        this.subcategory_name = subcategory_name
        this.description = description
        this.status = status
        this.created_date = created_date
        this.created_by = created_by
    }

    insertSubCategory() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO subcategory_mst SET ?'
            const taskData = {
                category_id: this.category_id,
                subcategory_name: this.subcategory_name,
                description: this.description,
                status: this.status,
                created_date: this.created_date,
                created_by: this.created_by,
            }

            DBConfig.query(sql, taskData, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = SubCategory