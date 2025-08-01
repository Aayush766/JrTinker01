const express = require("express");
const router = express.Router();
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

// Assuming this is your Mongoose model for blogs
// You must have this file defined for the code to work
const Blog = require("../models/blog.model.js"); 
const Course = require("../models/course.model.js"); // Assuming you have a Course model

router.get("/sitemap.xml", async (req, res) => {
  try {
    const hostname = "https://jrtinker.com"; // Your production domain

    // 1. Fetch dynamic URLs from the database
    // Fetch blog post slugs
    const blogs = await Blog.find({}, 'slug'); // Adjust to your schema if 'slug' is different
    const blogLinks = blogs.map(blog => ({
      url: `/blog/${blog.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Fetch course slugs (assuming a 'slug' field exists on your Course model)
    const courses = await Course.find({}, 'slug');
    const courseLinks = courses.map(course => ({
      url: `/course/${course.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // 2. Define your static URLs based on your React front-end routes
    // I've inferred these from the API routes you provided.
    // The sitemap should point to your front-end routes, not the API endpoints.
    const staticLinks = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/about", changefreq: "monthly", priority: 0.8 },
      { url: "/contact", changefreq: "monthly", priority: 0.8 },
      { url: "/login", changefreq: "monthly", priority: 0.6 },
      { url: "/register", changefreq: "monthly", priority: 0.6 },
      { url: "/courses", changefreq: "weekly", priority: 0.9 },
      { url: "/teachers", changefreq: "monthly", priority: 0.7 },
      { url: "/blogs", changefreq: "weekly", priority: 0.9 },
      // I'm assuming there's a blog and course list page on the front-end
      // and that the single blog and course pages are dynamic.
    ];

    // 3. Combine static and dynamic URLs
    const allLinks = [...staticLinks, ...blogLinks, ...courseLinks];

    // 4. Create and send the sitemap
    const stream = new SitemapStream({ hostname });
    res.header("Content-Type", "application/xml");

    streamToPromise(Readable.from(allLinks).pipe(stream)).then((data) => {
      res.send(data);
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).end();
  }
});

module.exports = router;