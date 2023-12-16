const express = require('express')
const { getArticle,CreateArticle,deleteArticle } = require('../controllers/articleController')


const router = express.Router()

router.get('/getallarticle/:id', getArticle);
router.post('/addarticle', CreateArticle);
router.get('/getallarticle', getArticle);
router.delete('/deletearticle/:id',deleteArticle);

module.exports = router