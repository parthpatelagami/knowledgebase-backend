const express = require('express')
const { createSubCategory, getAllSubCategory, subCategoryUpdate, SubCategoryDelete } = require('../controllers/subCategoryController')

//router object
const router = express.Router()

//CREATE NEW TASK || POST
router.post('/create_new_subcategory', createSubCategory)

//GET ALL TASK || POST
router.post('/get_all_subcategory', getAllSubCategory)

//UPDATE ALL TASK || POST
router.post('/update_all_subcategory', subCategoryUpdate)

//UPDATE ALL TASK || POST
router.post('/delete_all_subcategory', SubCategoryDelete)

module.exports = router