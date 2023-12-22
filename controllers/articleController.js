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
           // SubCategory_id,
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
            const article = new Article(Name, Category_id, Created_by, Updated_by, Updated_date, Content,Status,Article_UUID,DBConfig);
            const result = await article.insert()
            const id=result.insertId;
            if(Attachments.length>0){
                const attaachmetresult=await addAttachment(id,Attachments,Article_UUID,DBConfig)
            }
            const elasticSearchJSON={
                "Content":Content,
                "Category_name":Category_Name,
                "Category_id":Category_id,
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
        const id=req.params.id;
        let sql=`UPDATE knowledgebase.article SET STATUS=0 WHERE ID=`+req.params.id;
        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                //elArticleService.deleteArticleById(parseInt(id));
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
            Created_by,
            Updated_by,
            Updated_date,
            Content,
            Attachments,
            Article_UUID,
            Status,
            Category_Name
            } = req.body
            const ID=req.params.id;
            DBConfig.beginTransaction()
            const article = new ArticleUpdate(ID,Name, Category_id, Created_by, Updated_by, Updated_date, Content,Status,DBConfig);
            const result = await article.update();
            const attaachmetresult=await editAttachment(ID,Attachments,Article_UUID,DBConfig)
            const elasticSearchJSON={
                "Content":Content,
                "Category_name":Category_Name,
                "id":parseInt(ID),
                "Name":Name,
                "Status":parseInt(Status)
            }
            console.log("Edit Elatic Search JSON",elasticSearchJSON);
            elArticleService.updateArticleById(ID,elasticSearchJSON);

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
async function deleteAttachements(req,res) {
    const {fileName, uuid} = req.body;
    const filePath = process.env.FILE_UPLOAD_PATH+"/"+uuid+"/"+fileName;

    fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Error checking file existence:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({
            success: true,
            message: 'Done',
        })
    })
});

}

 async function tranferFileOnEdit(req,res){
    const {uuid,id}=req.body;
    console.log("Tranfer File on Edit",req.body);
    fsExtra.emptyDirSync( process.env.FILE_UPLOAD_PATH+"/"+uuid);
    const destinationFile = process.env.FILE_UPLOAD_PATH+"/"+uuid+"/"; // Replace with your actual filename
    const sourceFile = process.env.PUBLIC_FOLDER_PATH+"/attachment_"+id;
    if(fs.existsSync(sourceFile)){
        const copied=await fs.cp(sourceFile, destinationFile,{ recursive: true },(err) => {
            if (err) throw err;
            console.log('File copied successfully!');
        });
    }
    
    res.status(201).json({
        success: true,
        message: 'Done',
    })
 }

 async function searchArticle(req, res){

    try{
        const event = req.params.article;
        const response = await elArticleService.searchArticle(event);
        console.log("response: ", response);
        if (response != undefined) {
            res.status(200).json({
                success: true,
                message: 'Article Search Sucessfully',
                articles: response
            })
            
        } else {
            //elArticleService.deleteArticleById(parseInt(id));
            console.error('Error:', err)
            res.status(500).json({
                success: false,
                message: 'Oops! Something Went Wrong.',
            })
        }

        // let sql=`SELECT * From knowledgebase.article WHERE Name Like "${event}%"`;
        // DBConfig.query(sql, (err, results) => {
        //     if (err) {
        //         console.error('Error:', err)
        //         res.status(500).json({
        //             success: false,
        //             message: 'Oops! Something Went Wrong.',
        //         })
        //     } else {
        //         //elArticleService.deleteArticleById(parseInt(id));
        //         res.status(200).json({
        //             success: true,
        //             message: 'Article Search Sucessfully',
        //             articles: results
        //         })
        //     }
        // });

    }catch(err){

    }
} 

async function getCategoryWiseArticleData(req, res){

    try{
        var sql = `SELECT category_id, name FROM knowledgebase.category_mst WHERE status = 1`;       
        const categoryresult = await new Promise((resolve, reject) => {
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
        var sqlarticle=`SELECT Name, Category_id, ID FROM knowledgebase.article`;
        
        const articlesResult = await new Promise((resolve, reject) => {
            DBConfig.query(sqlarticle, (err, articleResults) => {
                if (err) {
                    console.error('Error fetching Artcles:', err);
                    reject(err);
                } else {
                   // console.log(attachmentResults);
                    resolve(articleResults);
                }
            });
        });
        const categorysWithArticle = categoryresult.map(category => {
            const articles = articlesResult.filter(article => article.Category_id === category.category_id)
            .map((article, index) => {
                return (
                    {
                        name:article.Name,
                        id:index+1,
                        articleid: article.ID
                    })
            });
            return {
                ...category,
                article: articles
            };
        });

        
        res.status(200).json({
            success: true,
            message: 'Article With Category Send Successfully',
            articles: categorysWithArticle
        })
    }catch(error){
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function getArticlesData(req, res){
    const id = req.params.id
    try{
        var sql = `SELECT name, category_id FROM knowledgebase.category_mst Where category_id=${id}`;
       
        const categoryresult = await new Promise((resolve, reject) => {
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
        var sqlarticle=`SELECT * FROM knowledgebase.article`;
        
        const articlesResult = await new Promise((resolve, reject) => {
            DBConfig.query(sqlarticle, (err, articlesResults) => {
                if (err) {
                    console.error('Error fetching Artcles:', err);
                    reject(err);
                } else {
                   // console.log(attachmentResults);
                    resolve(articlesResults);
                }
            });
        });
        const categoryWithArticles = categoryresult.map(category => {
            const articles = articlesResult.filter(article => 
                article.Category_id === category.category_id)
                .map((article, index)=> {
                    return ({
                        name: article.Name,
                        id : index+1,
                        content: article.Content,
                        updated_date: article.Updated_date,
                        article_id: article.ID   
                })})
            return {
                ...category,
                articledata: articles
            };
        });

        
        res.status(200).json({
            success: true,
            message: 'Articles Data Send Successfully',
            articlesdata: categoryWithArticles
        })
    }catch(error){
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}


module.exports={getArticle,CreateArticle,deleteArticle,uploadAttachements,editArticle,deleteAttachements,tranferFileOnEdit, searchArticle, getCategoryWiseArticleData, getArticlesData}