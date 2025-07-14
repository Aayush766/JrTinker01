// routes/blog.route.js
const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller.js");

const router = express.Router();

// Public routes
router.get("/", getAllBlogs); // Get all blogs
router.get("/:slug", getBlogBySlug); // Get single blog by slug

// Admin routes (you might add authentication/authorization middleware here later)
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;