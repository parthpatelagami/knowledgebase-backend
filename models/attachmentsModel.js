
class AttachmentsModel {
    constructor(
        File_Name,
        Article_id,
        DBConfig
    ) {
        this.File_Name = File_Name
        this.Article_id = Article_id
        this.DBConfig=DBConfig
    }

    insert() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO knowledgebase.Attachments(File_Name,Article_id) VALUES ?'
            const articleData = 
            this.File_Name.map((filename)=>{
                console.log("FileNAmesss",filename)
                return (
                    [
                         filename,
                         this.Article_id,
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
