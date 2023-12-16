
class AttachmentsModel {
    constructor(
        File_Name,
        Article_id,
        Created_date,
        DBConfig
    ) {
        this.File_Name = File_Name
        this.Article_id = Article_id
        this.Created_date = Created_date
        this.DBConfig=DBConfig
    }

    insert() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO knowledgebase.Attachments(File_Name,Article_id,Created_Date) VALUES ?'
            const articleData = 
            this.File_Name.map((filename)=>{
                console.log("FileNAmesss",filename)
                return (
                    [
                         filename,
                         this.Article_id,
                         this.Created_date
                    ]
                )
            })
            
            console.log("articleData",articleData)
            this.DBConfig.query(sql, [articleData], (err, results) => {
                if (err) {
                    console.log("Error in knowlegebase.attachments",err)
                    reject(err)
                } else {
                    console.log(results)
                    resolve(results)
                }
            })
        })
    }
}

module.exports = AttachmentsModel
