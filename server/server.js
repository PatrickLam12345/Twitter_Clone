require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);

app.get("/ping", (req, res) => {
  console.log("ping successful");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
  setInterval(() => {
    axios.get("https://twitterclonebackend2024.onrender.com/ping");
  }, 14 * 60 * 1000);
});
