const express = require('express')
const DBConfig = require('../configs/connection')
const Task = require('../models/taskModel')
const Task_Update = require('../models/taskModelUpdate')

async function createNewTask(req, res) {
    try {
        const { task_user_id, title, description, due_date, priority, status, created_date, created_by, file } = req.body

        // Ensure that due_date is an array
        const formattedDueDate = Array.isArray(due_date) ? JSON.stringify(due_date) : JSON.stringify([due_date])

        const newTask = new Task(task_user_id, title, description, formattedDueDate, priority, status, created_date, created_by, file)

        const result = await newTask.insertNewTask()

        res.status(201).json({
            success: true,
            message: 'Task has been created.',
            task: result,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function getAllTaskList(req, res) {
    try {
        const { } = req.body

        const sql = "select tm.*, um.firstName, um.lastName from task_mst tm " +
            "LEFT JOIN user_mst um ON tm.task_user_id = um.user_id where tm.isdeleted = 'N'"

        // Execute the SQL query
        DBConfig.query(sql, (err, results) => {
            console.log("mm", results)

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Task List Data had sended successfully',
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

async function updateTask(req, res) {
    try {
        const { task_id, task_user_id, title, description, due_date, priority, status, updated_date, updated_by, file } = req.body

        // Ensure that due_date is an array
        const formattedDueDate = Array.isArray(due_date) ? JSON.stringify(due_date) : JSON.stringify([due_date])

        const updateTaskQuery = new Task_Update(task_id, task_user_id, title, description, formattedDueDate, priority, status, updated_date, updated_by, file)

        const result = await updateTaskQuery.updateTaskFunction()

        res.status(200).json({
            success: true,
            message: 'Task has been updated.',
            task: result,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function deleteTask(req, res) {
    try {
        const { task_id } = req.body
        const sql = "update task_mst set isdeleted ='Y' where task_id = ?"

        DBConfig.query(sql, [task_id], (err, results) => {
            if (err) {
                console.error('Error deleting task :', err)
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete task',
                })
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Task ID not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'Task Deleted Successfully',
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

async function getDashboardData(req, res) {
    try {
        const { } = req.body

        const sql = `SELECT * FROM task_mst WHERE isdeleted = 'N'`

        // Execute the SQL query
        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                // Calculate the counts of completed and pending tasks
                const completed = results.filter(result => result.status === 'completed').length
                const pending = results.filter(result => result.status === 'pending').length

                const total = completed + pending

                // Send the counts in the response
                res.status(200).json({
                    success: true,
                    message: 'Dashboard data sent successfully',
                    data: { completed, pending, total }
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

module.exports = { createNewTask, getAllTaskList, updateTask, deleteTask, getDashboardData }
