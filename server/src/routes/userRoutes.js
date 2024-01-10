const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userControllers = require('../controllers/userControllers')

router.get('/getProfileData', authMiddleware.authenticateToken, userControllers.getProfileData)

router.post('/postTweet', authMiddleware.authenticateToken, userControllers.postTweet)
router.get('/getTweetDetails', authMiddleware.authenticateToken, userControllers.getTweetDetails)
router.get('/getTweetReplies', authMiddleware.authenticateToken, userControllers.getTweetReplies)
router.get('/getMoreTweets', authMiddleware.authenticateToken, userControllers.getMoreTweets)
router.get('/getMoreUsers', authMiddleware.authenticateToken, userControllers.getMoreUsers)

router.post('/postReply', authMiddleware.authenticateToken, userControllers.postReply)
router.get('/getReplyCount', authMiddleware.authenticateToken, userControllers.getReplyCount)

router.get('/hasLiked', authMiddleware.authenticateToken, userControllers.hasLiked)
router.get('/getLikeCount', authMiddleware.authenticateToken, userControllers.getLikeCount)
router.post('/like', authMiddleware.authenticateToken, userControllers.like)
router.delete('/dislike', authMiddleware.authenticateToken, userControllers.dislike)

router.get('/hasRetweeted', authMiddleware.authenticateToken, userControllers.hasRetweeted)
router.get('/getRetweetCount', authMiddleware.authenticateToken, userControllers.getRetweetCount)
router.post('/retweet', authMiddleware.authenticateToken, userControllers.retweet)
router.delete('/deleteRetweet', authMiddleware.authenticateToken, userControllers.deleteRetweet)

router.post('/follow', authMiddleware.authenticateToken, userControllers.follow)
router.delete('/unfollow', authMiddleware.authenticateToken, userControllers.unfollow)


module.exports = router