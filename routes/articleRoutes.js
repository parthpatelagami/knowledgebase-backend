const express = require('express')
const { getArticle,CreateArticle,deleteArticle,uploadAttachements, editArticle,deleteAttachements,tranferFileOnEdit, searchArticle, getCategoryWiseArticleData, getArticlesData} = require('../controllers/articleController')
require('dotenv').config()
const fs = require('fs');

const router = express.Router()
const multer = require("multer");

const storage = multer.diskStorage({
    destination:function(req,file,cb) {
        const path = process.env.FILE_UPLOAD_PATH+"/"+req.params.uuid;
        fs.mkdirSync(path,{recursive:true})
        return cb(null,process.env.FILE_UPLOAD_PATH+"/"+req.params.uuid);
    },
    filename:function(req,file,cb) {
        return cb(null,`${file.originalname}`)
    }
})

const upload = multer({storage})

router.post('/getallarticle/:id', getArticle);
router.post('/create-new-article', CreateArticle);
router.post('/getallarticle', getArticle);
router.delete('/deletearticle/:id',deleteArticle);
router.post('/upload-attachements/:uuid',upload.single('file'), uploadAttachements);
router.post('/editarticle/:id',editArticle);
router.post('/delete-attachements', deleteAttachements);
router.post('/tranferfileOnEdit',tranferFileOnEdit)
router.get('/seracharticle/:article', searchArticle);
router.get('/getallcategorydata', getCategoryWiseArticleData);
router.get('/getarticlesdata/:id', getArticlesData);


module.exports = router