const { Router } = require("express");
const Blog = require("../Models/blog");
const multer = require("multer");
const path = require("path");
const Comment = require("../Models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    let fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/add-new", (req, res) => {
  res.render("add-blog", {
    userInfo: req.user,
  });
});

router.get("/:blogId", async (req, res) => {
  let blog = await Blog.findById(req.params.blogId).populate("writtenBy");
  let allComments = await Comment.find({ blogId: req.params.blogId }).populate(
    "commentedBy"
  );

  res.render("blog", {
    userInfo: req.user,
    theBlog: blog,
    comments: allComments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.create({
    content,
    blogId: req.params.blogId,
    commentedBy: req.user._id,
  });

  res.redirect(`/blog/${req.params.blogId}`);
});

// Here upload.single("coverImage") coverImage is the value that is passes in name property in file input field.
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    writtenBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
