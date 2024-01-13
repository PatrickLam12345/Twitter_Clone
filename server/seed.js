const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: "user1",
      displayName: "User One",
      password: await bcrypt.hash("password1", 10),
      email: "user1@example.com",
      s3Key: "3d169697-a654-4daf-839c-5f566d2f609d",
      tweets: {
        create: [
          { text: "Tweet 1 by User One" },
          { text: "Tweet 2 by User One" },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "user2",
      displayName: "User Two",
      password: await bcrypt.hash("password2", 10),
      email: "user2@example.com",
      s3Key: "3d169697-a654-4daf-839c-5f566d2f609d",
      tweets: {
        create: [
          { text: "Tweet 1 by User Two" },
          { text: "Tweet 2 by User Two" },
        ],
      },
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
