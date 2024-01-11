/*
  Warnings:

  - You are about to drop the column `mentionedUsername` on the `Mention` table. All the data in the column will be lost.
  - Added the required column `mentionedUserId` to the `Mention` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_mentionedUsername_fkey";

-- AlterTable
ALTER TABLE "Mention" DROP COLUMN "mentionedUsername",
ADD COLUMN     "mentionedUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
