const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const authControllers = require('../controllers/authControllers')

router.post('/register', authControllers.register)
router.post('/login', authControllers.login)
router.get('/getUserInfo', authMiddleware.authenticateToken, authControllers.getUserInfo)
module.exports = router