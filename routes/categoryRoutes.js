const express = require("express");
const {
  getAllCategory,
  createCategory,
  checkCategory,
  editCategory,
  deleteCategory,
  checkCategoryMapping,
} = require("../controllers/categoryController");

//router object
const router = express.Router();

// SELECT || POST - Retrieve list of CATEGORY
router.post("/get_all_category", getAllCategory);

//CREATE CATEGORY || POST
router.post("/add_new_category", createCategory);

//EDIT CATEGORY || POST
router.post("/edit_category", editCategory);

//DELETE CATEGORY || POST
router.post("/delete_category", deleteCategory);

//CHECK CATEGORY || POST
router.post("/check_category", checkCategory);

//CHECK CATEGORY MAPPING || POST
router.post("/check_category_mapping", checkCategoryMapping);

module.exports = router;
