const express = require('express')
const { getArticle,CreateArticle,deleteArticle,uploadAttachements } = require('../controllers/articleController')
require('dotenv').config()

const router = express.Router()
const multer = require("multer");

const storage = multer.diskStorage({
    destination:function(req,file,cb) {
        return cb(null,process.env.FILE_UPLOAD_PATH);
    },
    filename:function(req,file,cb) {
        return cb(null,`${file.originalname}`)
    }
})

const upload = multer({storage})

router.get('/getallarticle/:id', getArticle);
router.post('/create-new-article', CreateArticle);
router.get('/getallarticle', getArticle);
router.delete('/deletearticle/:id',deleteArticle);
router.post('/upload-attachements',upload.single('file'), uploadAttachements);

module.exports = router