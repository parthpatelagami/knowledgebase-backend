const Category = require("../models/categoryModel");
const CategoryUpdate = require("../models/categoryUpdateModel");
const DBConfig = require("../configs/connection");

async function getAllCategory(req, res) {
  try {
    const {} = req.body;

    const sql = `SELECT * FROM category_mst ORDER BY name`;

    DBConfig.query(sql, (err, results) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({
          success: false,
          message: "Oops! Something Went Wrong.",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Category Send Successfully",
          category: results,
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function createCategory(req, res) {
  try {
    const { category_id, name, description, status, created_date, created_by } =
      req.body;

    const category = new Category(
      category_id,
      name,
      description,
      status,
      created_date,
      created_by
    );
    const result = await category.insert();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: result,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Edit Category
async function editCategory(req, res) {
  try {
    const { category_id, name, description, status, updated_date, updated_by } =
      req.body;
    const category = new CategoryUpdate(
      category_id,
      name,
      description,
      status,
      updated_date,
      updated_by
    );
    const result = await category.update();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Delete Category
async function deleteCategory(req, res) {
  try {
    const { category_id } = req.body;
    const sql = "UPDATE category_mst SET status = 0 WHERE category_id = ?";

    DBConfig.query(sql, [category_id], (err, results) => {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update category",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category Deleted successfully",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Example function to check Category existence in the database
async function checkCategory(req, res) {
  const name = req.body.category.name;
  const id = req.body.category.id;
  var sql = "SELECT * FROM category_mst WHERE name = ? ";
  if (id) {
    sql += "AND category_id NOT IN (?)";
  }
  DBConfig.query(sql, [name, id], (err, results) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        message: "Oops! Something Went Wrong.",
      });
    } else {
      if (results.length > 0) {
        res.status(200).json({
          success: true,
          message: "Category Already Exists.",
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Category Does Not Exists.",
        });
      }
    }
  });
}
module.exports = {
  createCategory,
  getAllCategory,
  checkCategory,
  editCategory,
  deleteCategory,
};
