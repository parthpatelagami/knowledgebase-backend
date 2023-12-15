const express = require('express')
const { createTeam, getUserByEmployee, getUserByManager, getAllUsers, getTeam, deleteTeam, editTeam } = require('../controllers/teamController')

//router object
const router = express.Router()

//CREATE TEAM || POST
router.post('/create_new_team', createTeam)

//GET USER BY EMPLOYEE || POST
router.post('/get_user_by_employee', getUserByEmployee)

//GET USER BY MANAGER || POST
router.post('/get_user_by_manager', getUserByManager)

//GET ALL USER
router.post('/get_all_users', getAllUsers)

//GET ALL TEAM || POST
router.post('/get_all_team', getTeam)

//DELETE TEAM || POST
router.post('/delete_team', deleteTeam)

//EDIT TEAM || POST
router.post('/edit_team', editTeam)

module.exports = router
