const express = require('express')
const { createNewTask, getAllTaskList, deleteTask, updateTask, getDashboardData } = require('../controllers/taskController')

//router object
const router = express.Router()

//CREATE NEW TASK || POST
router.post('/create_new_task', createNewTask)

//GET ALL TASK || POST
router.post('/get_all_task', getAllTaskList)

//UPDATE PARTICULAR TASK || POST
router.post('/update_task', updateTask)

//DELETE PARTICULAR TASK || POST
router.post('/delete_task', deleteTask)

//GET ALL TASK || POST
router.post('/get_dashboard_data', getDashboardData)

module.exports = router