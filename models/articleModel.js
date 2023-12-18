
class Article {
    constructor(
        Name,
        Category_id,
        Created_by,
        Updated_by,
        Updated_date,
        Content,
        Status,
        Article_UUID,
        DBConfig
    ) {
        this.Name = Name
        this.Category_id = Category_id
        this.Created_by = Created_by
        this.Updated_by = Updated_by
        this.Updated_date = Updated_date
        this.Content=Content
        this.Status=Status
        this.Article_UUID=Article_UUID
        this.DBConfig=DBConfig
    }

    insert() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO knowledgebase.article SET ?'
            const articleData = {
                Name : this.Name,
                Category_id : this.Category_id,
                Created_by : this.Created_by,
                Updated_by : this.Updated_by,
                Updated_date : this.Updated_date,
                Status:this.Status,
                uuid:this.Article_UUID,
                Content:this.Content
            }

            this.DBConfig.query(sql, articleData, (err, results) => {
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
    update(){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE knowledgebase.article SET ? WHERE ID = ?'
            const articleData = {
                Name : this.Name,
                Category_id : this.Category_id,
                Created_by : this.Created_by,
                Updated_by : this.Updated_by,
                Updated_date : this.Updated_date,
                Status:this.Status,
                Content:this.Content
            }

            this.DBConfig.query(sql, [articleData,ID], (err, results) => {
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
