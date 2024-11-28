var express = require("express");
var router = express.Router();
const postController = require("../controllers/postController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

/* GET users listing. */
router.get(
  "/all",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  postController.getAll
);
router.get(
  "/:id",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  postController.getOne
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  postController.delete
);
router.post(
  "/create",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  postController.createPost
);
router.patch(
  "/:id",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  postController.updatePost
);
module.exports = router;
