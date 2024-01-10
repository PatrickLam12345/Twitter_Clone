/*
  Warnings:

  - You are about to drop the column `s3key` on the `Tweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "s3key",
ADD COLUMN     "s3Key" TEXT;
