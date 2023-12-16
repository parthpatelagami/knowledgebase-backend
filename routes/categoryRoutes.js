const express = require("express")
const {
  getAllCategory,
  createCategory,
  checkCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/categoryController")

//router object
const router = express.Router()

//CREATE NEW USER || POST
router.post("/add_new_category", createCategory)

// SELECT || POST - Retrieve list of users
router.post("/get_all_category", getAllCategory)

//CHECK EMAIL || POST
router.post("/check_category", checkCategory)

//EDIT USER || POST
router.post("/edit_category", editCategory)

//DELETE USER || POST
router.post("/delete_category", deleteCategory)

module.exports = router
