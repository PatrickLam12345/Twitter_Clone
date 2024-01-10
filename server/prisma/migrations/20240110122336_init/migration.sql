/*
  Warnings:

  - You are about to drop the `RecommendedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecommendedPost" DROP CONSTRAINT "RecommendedPost_userId_fkey";

-- DropTable
DROP TABLE "RecommendedPost";
