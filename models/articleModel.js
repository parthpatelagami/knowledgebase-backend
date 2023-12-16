const DBConfig = require('../configs/connection')

class Article {
    constructor(
        ID,
        Name,
        Category_id,
        SubCategory_id,
        Created_by,
        Created_date,
        Updated_by,
        Updated_date,
        Content
    ) {
        this.ID = ID
        this.Name = Name
        this.Category_id = Category_id
        this.SubCategory_id = SubCategory_id
        this.Created_by = Created_by
        this.Created_date = Created_date
        this.Updated_by = Updated_by
        this.Updated_date = Updated_date
        this.Content=Content
    }

    insert() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO knowledgebase.article SET ?'
            const articleData = {
                ID : this.ID,
                Name : this.Name,
                Category_id : this.Category_id,
                SubCategory_id : this.SubCategory_id,
                Created_by : this.Created_by,
                Created_date : this.Created_date,
                Updated_by : this.Updated_by,
                Updated_date : this.Updated_date,
                Content:this.Content
            }

            DBConfig.query(sql, articleData, (err, results) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    console.log(results)
                    resolve(results)
                }
            })
        })
    }
}

module.exports = Article
