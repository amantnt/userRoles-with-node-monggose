const mongoose = require("mongoose");
const userSchma = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: ["Admin", "subAdmin"],
      default: "Admin",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchma);

module.exports = User;
