const express = require('express')
const { createSubCategory, getAllSubCategory } = require('../controllers/subCategoryController')

//router object
const router = express.Router()

//CREATE NEW TASK || POST
router.post('/create_new_subcategory', createSubCategory)

//GET ALL TASK || POST
router.post('/get_all_subcategory', getAllSubCategory)

module.exports = router