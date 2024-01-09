const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userControllers = require('../controllers/userControllers')

router.post('/postTweet', authMiddleware.authenticateToken, userControllers.postTweet)
router.get('/getMoreTweets', authMiddleware.authenticateToken, userControllers.getMoreTweets)
router.get('/getMoreUsers', authMiddleware.authenticateToken, userControllers.getMoreUsers)
router.post('/follow', authMiddleware.authenticateToken, userControllers.follow)
router.delete('/unfollow', authMiddleware.authenticateToken, userControllers.unfollow)

module.exports = router