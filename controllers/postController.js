const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = catchAsyncError(async (req, res) => {
  const { title, age, salery, content, user } = req.body;
  const newPost = await new Post({
    title,
    age,
    salery,
    content,
    user,
  });
  await newPost.save();
  const postWithUser = await Post.findById(newPost._id).populate(
    "user",
    "name"
  );
  res.send({
    message: "post create Successfully",
    newPost: postWithUser,
  });
});

exports.getAll = catchAsyncError(async (req, res) => {
  // const posts = await Post.find();
  const posts = await Post.aggregate([
    // { $match: { age: { $lte: 24 } } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project: {
        user: {
          $arrayElemAt: ["$userDetails.name", 0],
        },
        content: 1,
        _id: 0,
      },
    },
  ]).exec();
  res.send({ posts });
});

exports.updatePost = catchAsyncError(async (req, res) => {
  const { title, age, salery, content } = req.body;
  const userId = req.params.id;
  const user = await Post.findById(userId);
  if (!user) {
    res.send({ message: "User not Found" });
  }

  const updateUser = await Post.findByIdAndUpdate(
    user,
    {
      title,
      salery,
      age,
      content,
    },
    { new: true }
  );
  await updateUser.save();
  res.send({ Message: " Post is Update ", updateUser });
});

exports.getOne = catchAsyncError(async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.findById(userId);
  res.send({ posts });
});

exports.delete = catchAsyncError(async (req, res) => {
  const userId = req.params.id;
  await Post.findOneAndDelete(userId);
  res.send({ message: "Post Delete successfully" });
});
