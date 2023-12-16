const express = require('express')
const { getArticle,CreateArticle } = require('../controllers/articleController')


const router = express.Router()

router.get('/getallarticle', getArticle);
router.post('/addarticle', CreateArticle);

module.exports = router