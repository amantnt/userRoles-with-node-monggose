const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connnectDB = require("./config/db");
const User = require("./models/userModel");

const seedDB = async () => {
  connnectDB();
  const users = [
    { name: "Aman", email: "amansaini1435@gmail.com", password: "12345678" },
  ];
  for (let user of users) {
    const hashPassword = await bcrypt.hashSync(user.password, 10);
    const newUser = new User({
      ...user,
      password: hashPassword,
    });
    await newUser.save();
  }
  console.log("Users seeded successfully");

  mongoose.connection.close();
};
seedDB();
