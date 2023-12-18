const DBConfig = require('../configs/connection')

class SubCategory_Update {
    constructor(
        subcategory_id,
        subcategory_name,
        description,
        status,
        updated_date,
        updated_by,
    ) {
        this.subcategory_id = subcategory_id
        this.subcategory_name = subcategory_name
        this.description = description
        this.status = status
        this.updated_date = updated_date
        this.updated_by = updated_by
    }

    SubCategoryUpdate() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE subcategory_mst SET ? WHERE subcategory_id = ?'
            const SubCategoryData = {
                subcategory_name: this.subcategory_name,
                description: this.description,
                status: this.status,
                updated_date: this.updated_date,
                updated_by: this.updated_by,
            }

            DBConfig.query(sql, [SubCategoryData, this.subcategory_id], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = SubCategory_Update