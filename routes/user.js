const { Router } = require("express");
const User = require("../Models/user");

const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  let newUser = await User.create({
    fullName,
    email,
    password,
  });

  res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
//   remember to use await with static function
  try {
    let token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid email or password!" });
  }
});

router.get("/logout" , (req,res) =>{
  res.clearCookie("token").redirect("/")
})

module.exports = router;
