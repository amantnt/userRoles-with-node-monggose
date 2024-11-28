const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsyncError = require("../middleware/catchAsyncError");
require("dotenv").config();

exports.signup = catchAsyncError(async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    res.json({ message: " password nd confirmPassword npt match" });
  }
  const isExit = await User.findOne({ email });
  if (isExit) {
    res.json({ message: "  Email is Allready exits" });
  }
  const hashPassword = await bcrypt.hashSync(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashPassword,
    phone,
    role,
  });
  await newUser.save();
  res.json({ message: " User register succussfuly" });
});

exports.login = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.send({ message: "User not Found" });
  }
  const isVeryfyPassword = await bcrypt.compareSync(password, user.password);
  if (!isVeryfyPassword) {
    res.send({ message: "Password not matach" });
  }

  const token = await jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.AUTH_SECCET,
    { expiresIn: "24h" }
  );
  res.status(200).send({ message: "User logged", token });
});

exports.logout = catchAsyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send({ message: "LogOut" });
});

exports.getAll = catchAsyncError(async (req, res) => {
  const user = await User.find();
  if (!user) {
    res.send({ message: "User not Found" });
  }
  res.send({ user });
});
exports.getUser = catchAsyncError(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  res.send({ user });
});
exports.updateUser = catchAsyncError(async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      phone,
    },
    { new: true }
  );
  await user.save();
  res.status(201).send({ message: "user Update ", user });
});

exports.changePassword = catchAsyncError(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.send({ message: "password not match" });
  }
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully", user });
});
