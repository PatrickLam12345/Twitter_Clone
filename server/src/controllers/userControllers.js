const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      const tweetResults = await prisma.tweet.findMany({
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
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      }) || [];
  
      res.json(tweetResults);
    } catch (error) {
      console.error("Error fetching more tweets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const getMoreUsers = async (req, res, next) => {
    const { searchQuery, currentPage } = req.query;
    const itemsPerPage = 8;
    try {
      const userResults = await prisma.user.findMany({
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
      }) || [];
  
      res.json(userResults);
    } catch (error) {
      console.error("Error fetching more users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = {
  postTweet,
  getMoreTweets,
  getMoreUsers
};
