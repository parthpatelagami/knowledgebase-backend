const express = require('express')
const DBConfig = require('../configs/connection')
const SubCategory = require('../models/subCategoryModel')
const SubCategoryModelUpdate = require('../models/subCategoryModelUpdate')

async function createSubCategory(req, res) {
    try {
        const { category_id, subcategory_name, description, status, created_date, created_by } = req.body
        console.log(subcategory_name)

        const subCategory = new SubCategory(category_id, subcategory_name, description, status, created_date, created_by)
        console.log(subCategory)

        const result = await subCategory.insertSubCategory()
        res.status(201).json({
            success: true,
            message: 'SubCategory created successfully',
            user: result,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function getAllSubCategory(req, res) {
    try {
        const { } = req.body

        // const sql = `SELECT * FROM subcategory_mst where isdeleted = 'N'`
        const sql = "select sm.*, cm.name from subcategory_mst sm " +
            "LEFT JOIN category_mst cm ON sm.category_id = cm.category_id where sm.isdeleted = 'N'"

        // Execute the SQL query
        DBConfig.query(sql, (err, results) => {

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Sub Category send successfully',
                    task: results
                })
            }
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function subCategoryUpdate(req, res) {
    try {
        const { subcategory_id, subcategory_name, description, status, updated_date, updated_by } = req.body
        const subCategory = new SubCategoryModelUpdate(subcategory_id, subcategory_name, description, status, updated_date, updated_by)
        console.log(subCategory)

        const result = await subCategory.SubCategoryUpdate()

        res.status(200).json({
            success: true,
            message: 'Sub Category updated successfully'
        })
    }
    catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function SubCategoryDelete(req, res) {
    try {
        const { subcategory_id } = req.body

        const sql = "update subcategory_mst set isdeleted ='Y' where subcategory_id = ?"

        DBConfig.query(sql, [subcategory_id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to SubCategory',
                })
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'SubCategory not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'SubCategory Deleted successfully',
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

module.exports = { createSubCategory, getAllSubCategory, subCategoryUpdate, SubCategoryDelete }
