const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const upload = multer();
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});
const s3 = new AWS.S3();

const getUserProfileByUsername = async (req, res, next) => {
  const { username } = req.query;

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        registrationDate: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFollowerCount = async (req, res, next) => {
  const { userId } = req.query;
  try {
    const count = await prisma.follower.count({
      where: {
        followingId: Number(userId),
      },
    });

    res.status(200).json({ followerCount: count });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFollowingCount = async (req, res, next) => {
  const { userId } = req.query;
  try {
    const count = await prisma.follower.count({
      where: {
        followerId: Number(userId),
      },
    });
    res.status(200).json({ followingCount: count });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFollowers = async (req, res, next) => {
  const { userId, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const followers = await prisma.follower.findMany({
      where: {
        followingId: Number(userId),
      },
      orderBy: {
        followDate: "desc",
      },
      include: {
        followingUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const updatedFollowers = await Promise.all(
      followers.map(async (follower) => {
        const isFollowing = await prisma.follower.findFirst({
          where: {
            followerId: Number(userId),
            followingId: follower.followerId,
          },
        });

        return {
          ...follower,
          followingUser: {
            ...follower.followingUser,
            isFollowing: !!isFollowing,
          },
        };
      })
    );

    res.json(updatedFollowers);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFollowing = async (req, res, next) => {
  const { userId, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const following = await prisma.follower.findMany({
      where: {
        followerId: Number(userId),
      },
      orderBy: {
        followDate: "desc",
      },
      include: {
        followingUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
            followers: true,
          },
        },
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const updatedFollowing = following.map((follow) => {
      const isFollowing = follow.followingUser.followers.some(
        (follower) => follower.followerId === Number(userId)
      );
      return {
        ...follow,
        followingUser: {
          ...follow.followingUser,
          isFollowing,
        },
      };
    });

    res.json(updatedFollowing);
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTweetsByUser = async (req, res, next) => {
  const { userId, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        registrationDate: true,
        followers: true,
        tweets: {
          orderBy: {
            date: "desc",
          },
          take: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        },
      },
    });

    const tweetsWithUser = user.tweets.map((tweet) => ({
      ...tweet,
      user: {
        username: user.username,
        displayName: user.displayName,
      },
    }));

    const modifiedUser = {
      ...user,
      tweets: tweetsWithUser,
    };

    res.status(200).json(modifiedUser);
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRepliesByUser = async (req, res, next) => {
  const { userId, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        registrationDate: true,
        followers: true,
        tweets: {
          where: {
            isPost: false,
          },
          orderBy: {
            date: "desc",
          },
          take: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        },
      },
    });

    const repliesWithUser = user.tweets.map((tweet) => ({
      ...tweet,
      user: {
        username: user.username,
        displayName: user.displayName,
      },
    }));

    const modifiedUser = {
      ...user,
      tweets: repliesWithUser,
    };

    res.status(200).json(modifiedUser);
  } catch (error) {
    console.error("Error fetching user replies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLikesByUser = async (req, res, next) => {
  const { userId, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        registrationDate: true,
        followers: true,
        likes: {
          select: {
            tweet: {
              select: {
                id: true,
                originalTweetId: true,
                text: true,
                date: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          take: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        },
      },
    });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTweetDetails = async (req, res, next) => {
  const { id } = req.query;
  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        likes: true,
        retweets: true,
      },
    });

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    res.status(200).json(tweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTweetReplies = async (req, res, next) => {
  const { id, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const tweet = await prisma.tweet.findMany({
      where: {
        originalTweetId: Number(id),
      },
      orderBy: {
        date: "desc",
      },
      include: {
        user: true,
        likes: true,
        retweets: true,
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    res.status(200).json(tweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postTweet = async (req, res, next) => {
  try {
    const upload = multer().single("file");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer Error" });
      } else if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const file = req.file;
      console.log(req.body);
      const { description } = req.body;
      const descriptionObject = JSON.parse(description);
      const { userId, text } = descriptionObject;

      if (file) {
        const s3Key = uuidv4();
        const uploadParams = {
          Bucket: "twitterclonebucket2024",
          Key: s3Key,
          Body: file.buffer,
        };

        try {
          const uploadResult = await s3.upload(uploadParams).promise();

          const newReply = await prisma.tweet.create({
            data: {
              userId,
              text,
              s3Key,
              isPost: true,
            },
          });

          res.status(201).json(newReply);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        try {
          const newReply = await prisma.tweet.create({
            data: {
              userId,
              text,
              isPost: true,
            },
          });

          res.status(201).json(newReply);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTweetMedia = async (req, res, next) => {};

const getMoreTweets = async (req, res, next) => {
  const { searchQuery, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const tweetResults =
      (await prisma.tweet.findMany({
        where: {
          text: { contains: searchQuery, mode: "insensitive" },
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          text: true,
          date: true,
          resultType: "tweet",
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },
          retweets: {
            select: {
              id: true,
            },
          },
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      })) || [];

    res.json(tweetResults);
  } catch (error) {
    console.error("Error fetching more tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMoreUsers = async (req, res, next) => {
  const { searchQuery, currentPage, userId } = req.query;
  const itemsPerPage = 8;
  try {
    const userResults =
      (await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: "insensitive" } },
            { displayName: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          resultType: "user",
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      })) || [];

    const usersWithFollowStatus = await Promise.all(
      userResults.map(async (user) => {
        const isFollowing = await prisma.follower.findFirst({
          where: {
            followerId: Number(userId),
            followingId: user.id,
          },
        });
        const isFollowingValue = !!isFollowing || user.id === Number(userId);
        return { ...user, isFollowing: isFollowingValue };
      })
    );
    res.json(usersWithFollowStatus);
  } catch (error) {
    console.error("Error fetching more users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postReply = async (req, res, next) => {
  try {
    const upload = multer().single("file");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer Error" });
      } else if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const file = req.file;
      console.log(req.body);
      const { description } = req.body;
      const descriptionObject = JSON.parse(description);
      const { userId, originalTweetId, text } = descriptionObject;

      if (file) {
        const s3Key = uuidv4();
        const uploadParams = {
          Bucket: "twitterclonebucket2024",
          Key: s3Key,
          Body: file.buffer,
        };

        try {
          const uploadResult = await s3.upload(uploadParams).promise();

          const newReply = await prisma.tweet.create({
            data: {
              userId,
              originalTweetId,
              text,
              s3Key,
            },
          });

          res.status(201).json(newReply);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        try {
          const newReply = await prisma.tweet.create({
            data: {
              userId,
              originalTweetId,
              text,
            },
          });

          res.status(201).json(newReply);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getReplyCount = async (req, res, next) => {
  const { tweetId } = req.query;
  try {
    const tweetRepliesCount = await prisma.tweet.count({
      where: {
        originalTweetId: Number(tweetId),
      },
    });

    res.status(200).json({ replyCount: tweetRepliesCount });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const hasLiked = async (req, res, next) => {
  const { userId, tweetId } = req.query;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: Number(userId),
          tweetId: Number(tweetId),
        },
      },
    });

    const userHasLiked = !!existingLike;

    res.json({ hasLiked: userHasLiked });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLikeCount = async (req, res, next) => {
  const { tweetId } = req.query;

  try {
    const likeCount = await prisma.like.count({
      where: {
        tweetId: Number(tweetId),
      },
    });

    res.json({ likeCount });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const like = async (req, res, next) => {
  const { userId, tweetId } = req.body;
  try {
    const newLike = await prisma.like.create({
      data: {
        userId,
        tweetId,
      },
    });
    res.status(201).json(newLike);
  } catch (error) {
    console.log(error);
  }
};

const dislike = async (req, res, next) => {
  const { userId, tweetId } = req.body;
  try {
    const deletedLike = await prisma.like.delete({
      where: {
        userId_tweetId: {
          userId: Number(userId),
          tweetId: Number(tweetId),
        },
      },
    });

    res.status(200).json(deletedLike);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const hasRetweeted = async (req, res, next) => {
  const { userId, tweetId } = req.query;

  try {
    const existingRetweet = await prisma.retweet.findUnique({
      where: {
        userId_tweetId: {
          userId: Number(userId),
          tweetId: Number(tweetId),
        },
      },
    });

    const userHasRetweeted = !!existingRetweet;

    res.json({ hasRetweeted: userHasRetweeted });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRetweetCount = async (req, res, next) => {
  const { tweetId } = req.query;

  try {
    const retweetCount = await prisma.retweet.count({
      where: {
        tweetId: Number(tweetId),
      },
    });

    res.json({ retweetCount });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const retweet = async (req, res, next) => {
  const { userId, tweetId } = req.body;
  try {
    const newRetweet = await prisma.retweet.create({
      data: {
        userId,
        tweetId,
      },
    });
    res.status(201).json(newRetweet);
  } catch (error) {
    console.log(error);
  }
};

const deleteRetweet = async (req, res, next) => {
  const { userId, tweetId } = req.body;
  try {
    const deletedRetweet = await prisma.retweet.delete({
      where: {
        userId_tweetId: {
          userId: Number(userId),
          tweetId: Number(tweetId),
        },
      },
    });

    res.status(200).json(deletedRetweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const follow = async (req, res, next) => {
  const { followerId, followingId } = req.body;
  const existingFollow = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    return res.status(400).json({ error: "Already following this user." });
  }

  const newFollow = await prisma.follower.create({
    data: {
      followerId,
      followingId,
    },
  });

  res.status(201).json(newFollow);
};

const unfollow = async (req, res, user) => {
  try {
    const { followerId, followingId } = req.body;

    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.status(200).json({ message: "Successfully unfollowed the user." });
  } catch (error) {
    console.error("Error during unfollow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFollowingFeed = async (req, res, next) => {
  const { userId, startIndex } = req.query;

  try {
    const following = await prisma.follower.findMany({
      where: {
        followerId: Number(userId),
      },
      orderBy: {
        followDate: "desc",
      },
      select: {
        followingId: true,
      },
    });

    const followingSet = new Set(following.map((follow) => follow.followingId));

    const tweets = [];
    const total = 8;
    let totalTweets = 0;
    while (totalTweets < total) {
      const userTweets = await prisma.tweet.findMany({
        where: {
          userId: {
            in: [...followingSet],
          },
          isPost: true,
        },

        orderBy: {
          date: "desc",
        },
        skip: totalTweets + Number(startIndex),
        take: 8,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
      });

      if (userTweets.length === 0) {
        break;
      }

      tweets.push(
        ...userTweets.filter((tweet) => followingSet.has(tweet.userId))
      );
      totalTweets += userTweets.length;
    }

    res.json({ tweets, startIndex: startIndex + totalTweets });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUserProfileByUsername,
  getFollowerCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
  getTweetsByUser,
  getRepliesByUser,
  getLikesByUser,

  postTweet,
  getTweetDetails,
  getTweetReplies,
  getTweetMedia,
  getMoreTweets,
  getMoreUsers,

  postReply,
  getReplyCount,

  hasLiked,
  getLikeCount,
  like,
  dislike,

  hasRetweeted,
  getRetweetCount,
  retweet,
  deleteRetweet,

  follow,
  unfollow,

  getFollowingFeed,
};
