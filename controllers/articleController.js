const DBConfig = require('../configs/connection')
const Article = require('../models/articleModel')
const AttachmentsModel=require('../models/attachmentsModel')
const fs = require('fs');
require('dotenv').config()

async function getArticle(req,res){

    try{
        const sql = `SELECT * from article`;
        DBConfig.query(sql, (err, results) => {
            console.log(results)

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Article Send Successfully',
                    articles: results
                })
            }
        })

    }catch(error){
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }

}

async function CreateArticle(req,res){
    try{
        const {
            Name,
            Category_id,
            SubCategory_id,
            Created_by,
            Created_date,
            Updated_by,
            Updated_date,
            Content,
            Attachments,
            Article_UUID
            } = req.body
            DBConfig.beginTransaction()
            const article = new Article(Name, Category_id, SubCategory_id, Created_by, Created_date, Updated_by, Updated_date, Content,DBConfig);
            const result = await article.insert()
            const id=result.insertId;
            const attaachmetresult=await addAttachment(id,Attachments,Article_UUID,Created_date,DBConfig)
            DBConfig.commit();
            res.status(201).json({
                success: true,
                message: 'article created successfully',
                article: result,
            })
           

    }catch(error){
        DBConfig.rollback();
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}
async function addAttachment(id,attachments,Article_UUID,Created_date,DBConfig){
    try{
        const attachmentsResults=new AttachmentsModel(attachments,id,Created_date,DBConfig);
        const result=await attachmentsResults.insert();
        const sourceFile = process.env.FILE_UPLOAD_PATH+"/"+Article_UUID+"/"; // Replace with your actual filename
        const destinationFile = process.env.PUBLIC_FOLDER_PATH+"/attachment_"+id;
        const copied=await fs.cp(sourceFile, destinationFile,{ recursive: true },(err) => {
        if (err) throw err;
            console.log('File copied successfully!');
          });
        
        
    }catch(err){
        console.log("Error in addattachment function",err);
        throw Error("AttachMent Coundnt added",err)
    }
}


module.exports={getArticle,CreateArticle}