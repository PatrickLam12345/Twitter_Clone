-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_mentionedUserId_fkey";

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
