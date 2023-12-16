const express = require('express')
const DBConfig = require('../configs/connection')
const SubCategory = require('../models/subCategoryModel')

async function createSubCategory(req, res) {
    try {
        const { subcategory_name, description, status, created_date, created_by } = req.body
        console.log(subcategory_name)

        const subCategory = new SubCategory(subcategory_name, description, status, created_date, created_by)
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

        const sql = `SELECT * FROM subcategory_mst`

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


module.exports = { createSubCategory, getAllSubCategory }
