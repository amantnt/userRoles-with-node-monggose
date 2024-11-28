var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  s;
  res.render("index", { title: "Express" });
});
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get(
  "/all",
  verifyToken,
  checkRole(["Admin", "subAdmin"]),
  userController.getAll
);
router.get("/:id", verifyToken, checkRole(["Admin"]), userController.getUser);
router.post("/changePassword", verifyToken, userController.changePassword);
router.put("/:id", verifyToken, userController.updateUser);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);
module.exports = router;
