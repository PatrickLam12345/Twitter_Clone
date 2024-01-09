const { PrismaClient } = require("@prisma/client");
const { userInfo } = require("os");
const prisma = new PrismaClient();

const getTweetDetails = async (req, res, next) => {
  const { id } = req.query;
  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        replies: true,
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

const postTweet = async (req, res, next) => {
  try {
    const { text, userId } = req.body;
    const tweet = await prisma.tweet.create({
      data: {
        userId,
        text,
      },
    });
    res.status(201).json(tweet);
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMoreTweets = async (req, res, next) => {
  const { searchQuery, currentPage } = req.query;
  const itemsPerPage = 8;
  try {
    const tweetResults =
      (await prisma.tweet.findMany({
        where: {
          text: { contains: searchQuery, mode: "insensitive" },
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
  const { userId, originalTweetId, text } = req.body;
  try {
    const newReply = await prisma.reply.create({
      data: {
        userId,
        originalTweetId,
        text,
        isPost: false,
      },
    });

    res.status(201).json(newReply);
  } catch (error) {
    console.log(error);
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

    // Send a DELETE request to the server
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

module.exports = {
  postTweet,
  getTweetDetails,
  getMoreTweets,
  getMoreUsers,
  postReply,
  follow,
  unfollow,
};
