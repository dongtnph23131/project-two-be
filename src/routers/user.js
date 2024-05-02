const express = require("express");
const { signup, signin, searchUser } = require("../controllers/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/users/search-name", searchUser);
module.exports = router;
