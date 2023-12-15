const express = require('express')
const { loginController } = require('../controllers/authController')

//router object
const router = express.Router()

//LOGIN || POST
router.post('/login', loginController)

module.exports = router