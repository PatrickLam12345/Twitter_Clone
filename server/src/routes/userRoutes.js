const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userControllers = require('../controllers/userControllers')
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10
  });

router.get('/getUserProfileAndIsFollowingByUsername', authMiddleware.authenticateToken, userControllers.getUserProfileAndIsFollowingByUsername)
router.get('/getUserProfileByUsername', authMiddleware.authenticateToken, userControllers.getUserProfileByUsername)
router.get('/getFollowerCount', authMiddleware.authenticateToken, userControllers.getFollowerCount)
router.get('/getFollowingCount', authMiddleware.authenticateToken, userControllers.getFollowingCount)
router.get('/getFollowers', authMiddleware.authenticateToken, userControllers.getFollowers)
router.get('/getFollowing', authMiddleware.authenticateToken, userControllers.getFollowing)

router.get('/getTweetsByUser', authMiddleware.authenticateToken, userControllers.getTweetsByUser)
router.get('/getRetweetsByUser', authMiddleware.authenticateToken, userControllers.getRetweetsByUser)
router.get('/getMentionsByUser', authMiddleware.authenticateToken, userControllers.getMentionsByUser)
router.get('/getRepliesByUser', authMiddleware.authenticateToken, userControllers.getRepliesByUser)
router.get('/getLikesByUser', authMiddleware.authenticateToken, userControllers.getLikesByUser)

router.post('/postTweet', limiter, authMiddleware.authenticateToken, userControllers.postTweet)
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

router.get('/getForYouFeed', authMiddleware.authenticateToken, userControllers.getForYouFeed)
router.get('/getForYouFeedAllTime', authMiddleware.authenticateToken, userControllers.getForYouFeedAllTime)
router.get('/getFollowingFeed', authMiddleware.authenticateToken, userControllers.getFollowingFeed)

router.get('/getS3Media', authMiddleware.authenticateToken, userControllers.getS3Media)
router.patch('/editUserProfile', authMiddleware.authenticateToken, userControllers.editUserProfile)

module.exports = router