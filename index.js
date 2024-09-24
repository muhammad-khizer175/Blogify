const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const { connectToMongo } = require("./connect");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationToken } = require("./middleware/auth");
const blogRouter = require("./routes/blog");
const Blog = require("./Models/blog");

const app = express();
const PORT = 8004;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationToken("token"));
// In this middleware we say to express to server all the things in public folder statically.
app.use(express.static(path.resolve("./public")));

connectToMongo("mongodb://127.0.0.1:27017/blogify-db")
  .then(() => console.log("mongodb connected!"))
  .catch((err) => console.log("error", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  let allBlogs = await Blog.find({});
  res.render("home", {
    userInfo: req.user,
    blogs: allBlogs,
  });
});

app.listen(PORT, () => console.log(`server running on port:${PORT}`));
