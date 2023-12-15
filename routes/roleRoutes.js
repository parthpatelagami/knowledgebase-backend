const express = require('express')
const { createRole, checkRoleByName, deleteRole, editRole } = require('../controllers/roleController')

//router object
const router = express.Router()

//NEW ROLE || POST
router.post('/create_new_role', createRole)

//CHECK ROLE BY NAME || POST
router.post('/check_role_by_name', checkRoleByName)

//DELETE ROLE || POST
router.post('/delete_role', deleteRole)

//EDIT ROLE || POST
router.post('/edit_role', editRole)

module.exports = router
