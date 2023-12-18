const DBConfig = require('../configs/connection')
const Article = require('../models/articleModel')
const AttachmentsModel=require('../models/attachmentsModel')
const ArticleUpdate=require('../models/articleUpdateModel')
const elArticleService=require('../service/articleElasticSearchService')
const fs = require('fs');
const fsExtra = require('fs-extra');
require('dotenv').config()

async function getArticle(req,res){

    try{
        var sql = `SELECT ar.*,cm.name as category_name from article ar INNER join category_mst cm ON ar.Category_id=cm.category_id`;
        const id=req.params.id;
        if(id!=undefined){
            sql+= ` where ID=`+id
        }
        const articleresult = await new Promise((resolve, reject) => {
            DBConfig.query(sql, (err, results) => {
                if (err) {
                    console.error('Error:', err);
                    reject(err);
                } else {
                    console.log(results);
                    resolve(results);
                }
            });
        });
        //console.log(articleresult);
        var sqlattachments=`select File_Name,Article_id from Attachments`;
        if(id!=undefined){
            sql+= ` where ID=`+id
        }
        const attachmentResult = await new Promise((resolve, reject) => {
            DBConfig.query(sqlattachments, (err, attachmentResults) => {
                if (err) {
                    console.error('Error fetching attachments:', err);
                    reject(err);
                } else {
                   // console.log(attachmentResults);
                    resolve(attachmentResults);
                }
            });
        });
        const articlesWithAttachments = articleresult.map(article => {
            const articleAttachments = attachmentResult.filter(attachment => attachment.Article_id === article.ID).map(attachment=>attachment.File_Name);
            return {
                ...article,
                attachments: articleAttachments
            };
        });

        
        res.status(200).json({
            success: true,
            message: 'Article Send Successfully',
            articles: articlesWithAttachments
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
            Updated_by,
            Updated_date,
            Content,
            Attachments,
            Article_UUID,
            Category_Name,
            Status
            } = req.body
            DBConfig.beginTransaction()
            const article = new Article(Name, Category_id, SubCategory_id, Created_by, Updated_by, Updated_date, Content,Status,Article_UUID,DBConfig);
            const result = await article.insert()
            const id=result.insertId;
            if(Attachments.length>0){
                const attaachmetresult=await addAttachment(id,Attachments,Article_UUID,DBConfig)
            }
            const elasticSearchJSON={
                "Content":Content,
                "Category_name":Category_Name,
                "id":id,
                "Name":Name,
                "Status":parseInt(Status)
            }

            DBConfig.commit();
            console.log("Elsatic Serach json",elasticSearchJSON);
            await elArticleService.addArticle(elasticSearchJSON)
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
async function addAttachment(id,attachments,Article_UUID,DBConfig){
    try{
        const attachmentsResults=new AttachmentsModel(attachments,id,DBConfig);
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

async function deleteArticle(req,res){
    try{
        let sql=`UPDATE knowledgebase.article SET STATUS=0 WHERE ID=`+req.params.id;
        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Article Deleted Sucessfully',
                    articles: results
                })
            }
        });

    }catch(err){

    }
}

async function uploadAttachements(req,res) {

    if(req.body!=undefined && req.body!={}) {
        res.status(200).json({
            success: true,
            message: 'Done',
        })
    }
}
async function editArticle(req,res){
    try{
        const {
            Name,
            Category_id,
            SubCategory_id,
            Created_by,
            Updated_by,
            Updated_date,
            Content,
            Attachments,
            Article_UUID,
            Status
            } = req.body
            const ID=req.params.id;
            DBConfig.beginTransaction()
            const article = new ArticleUpdate(ID,Name, Category_id, SubCategory_id, Created_by, Updated_by, Updated_date, Content,Status,DBConfig);
            const result = await article.update();
            const attaachmetresult=await editAttachment(ID,Attachments,Article_UUID,DBConfig)
            
            DBConfig.commit();
            res.status(200).json({
                success: true,
                message: 'article updated successfully',
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
async function editAttachment(id,attachments,Article_UUID,DBConfig){
    try{
        const attachmentsResults=new AttachmentsModel(attachments,id,DBConfig);
        const sql='DELETE FROM knowledgebase.Attachments where Article_id='+id;
        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.log("Error in knowlegebase.attachments",err)
                throw err;
            } else {
                console.log(results)
            }
        })
        fsExtra.emptyDirSync(process.env.PUBLIC_FOLDER_PATH+"/attachment_"+id);
        if(attachments.length>0){
            const result=await attachmentsResults.insert();
            const sourceFile = process.env.FILE_UPLOAD_PATH+"/"+Article_UUID+"/"; // Replace with your actual filename
            const destinationFile = process.env.PUBLIC_FOLDER_PATH+"/attachment_"+id;
            const copied=await fs.cp(sourceFile, destinationFile,{ recursive: true },(err) => {
            if (err) throw err;
                console.log('File copied successfully!');
            });
        }
        
    }catch(err){
        console.log("Error in addattachment function",err);
        throw Error("AttachMent Coundnt added",err)
    }
}


module.exports={getArticle,CreateArticle,deleteArticle,uploadAttachements,editArticle}