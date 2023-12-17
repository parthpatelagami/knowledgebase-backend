
class ArticleUpdate {
    constructor(
        ID,
        Name,
        Category_id,
        SubCategory_id,
        Created_by,
        Updated_by,
        Updated_date,
        Content,
        Status,
        DBConfig
    ) {
        this.ID=ID
        this.Name = Name
        this.Category_id = Category_id
        this.SubCategory_id = SubCategory_id
        this.Created_by = Created_by
        this.Updated_by = Updated_by
        this.Updated_date = Updated_date
        this.Content=Content
        this.Status=Status
        this.DBConfig=DBConfig
    }

    update(){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE knowledgebase.article SET ? WHERE ID = ?'
            const articleData = {
                Name : this.Name,
                Category_id : this.Category_id,
                SubCategory_id : this.SubCategory_id,
                Created_by : this.Created_by,
                Updated_by : this.Updated_by,
                Updated_date : this.Updated_date,
                Status:this.Status,
                Content:this.Content
            }

            this.DBConfig.query(sql, [articleData,this.ID], (err, results) => {
                if (err) {
                    console.log(sql);
                    console.log("SQLLLLLLLLL update error",err)
                    reject(err)
                } else {
                    console.log("SQLLLLLLLLL update result",results)
                    resolve(results)
                }
            })
        })
    }
}

module.exports = ArticleUpdate
