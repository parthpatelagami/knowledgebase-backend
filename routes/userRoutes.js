const express = require('express')
const { createUser, getUsers, checkEmail, checkRole, editUsers, deleteUsers, userSuspended, userCheckIn, userCheckOut, userCheckInOutStatus } = require('../controllers/userController')

//router object
const router = express.Router()

//CREATE NEW USER || POST
router.post('/add_new_user', createUser)

// SELECT || POST - Retrieve list of users
router.post('/get_all_users', getUsers)

//CHECK EMAIL || POST
router.post('/check_email', checkEmail)

//CHECK EMAIL || POST
router.post('/check_role', checkRole)

//EDIT USER || POST
router.post('/edit_users', editUsers)

//DELETE USER || POST
router.post('/delete_users', deleteUsers)

//SUSPENDED  USER || POST
router.post('/suspend_users', userSuspended)

//CHECK IN  USER || POST
router.post('/checkin_users', userCheckIn)

//CHECK IN  USER || POST
router.post('/checkout_users', userCheckOut)

//CHECK IN  USER || POST
router.post('/get_users_status', userCheckInOutStatus)

module.exports = router