require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const register = async (req, res, next) => {
  const { email, username, displayName, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      return res.status(409).send({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: username,
        displayName: displayName,
        password: hashedPassword,
        email: email,
        s3Key: "3d169697-a654-4daf-839c-5f566d2f609d"
      },
    });
    const token = jwt.sign(newUser, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(409).send({ message: "User does not exist" });
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (isCorrectPassword) {
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
      res.send(token);
    } else {
      res.status(401).send({ message: "Incorrect Password" });
    }
  } catch (error) {
    next(error);
  }
};

const getUserInfo = (req, res) => {
  const user = req.user;
  const userInfo = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    registrationDate: user.registrationDate,
  };
  res.send(userInfo);
};

module.exports = {
  register,
  login,
  getUserInfo,
};
