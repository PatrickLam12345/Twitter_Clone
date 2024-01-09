-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "originalTweetId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "followerId" SERIAL NOT NULL,
    "followerUserId" INTEGER NOT NULL,
    "followingUserId" INTEGER NOT NULL,
    "followDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("followerId")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retweet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "originalTweetId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Retweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mention" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "mentionedUserId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_originalTweetId_fkey" FOREIGN KEY ("originalTweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingUserId_fkey" FOREIGN KEY ("followingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retweet" ADD CONSTRAINT "Retweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retweet" ADD CONSTRAINT "Retweet_originalTweetId_fkey" FOREIGN KEY ("originalTweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedPost" ADD CONSTRAINT "RecommendedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
