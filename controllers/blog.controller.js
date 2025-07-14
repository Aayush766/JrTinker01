// controllers/blog.controller.js
const Blog = require("../models/blog.model.js");

// Helper function to validate content blocks
const validateContentBlocks = (contentBlocks) => {
    if (!contentBlocks || !Array.isArray(contentBlocks) || contentBlocks.length === 0) {
        return { isValid: false, message: "Content blocks array is required and cannot be empty." };
    }

    for (const block of contentBlocks) {
        if (typeof block !== 'object' || !block.type) { // 'value' might not exist for list blocks initially
            return { isValid: false, message: "Each content block must be an object with a 'type'." };
        }

        // Specific validation based on type
        switch (block.type) {
            case 'image':
                if (typeof block.value !== 'string' || (!block.value.startsWith('http://') && !block.value.startsWith('https://'))) {
                    return { isValid: false, message: `Image block 'value' must be a valid URL. Invalid value: ${block.value}` };
                }
                break;
            case 'heading':
                if (typeof block.value !== 'string' || block.value.trim() === '') {
                    return { isValid: false, message: "Heading block 'value' cannot be empty." };
                }
                if (typeof block.level !== 'number' || block.level < 1 || block.level > 6) {
                    return { isValid: false, message: "Heading block 'level' must be a number between 1 and 6." };
                }
                break;
            case 'list':
                if (!Array.isArray(block.items) || block.items.length === 0) {
                    return { isValid: false, message: "List block must have a non-empty 'items' array." };
                }
                if (block.items.some(item => typeof item !== 'string' || item.trim() === '')) {
                    return { isValid: false, message: "All list items must be non-empty strings." };
                }
                break;
            case 'paragraph': // Added explicit case for paragraph for clarity
            // Add more cases for 'quote', 'code' if specific validations are needed
            default:
                // For paragraph, quote, code, value is just text string
                if (typeof block.value !== 'string' || block.value.trim() === '') {
                    return { isValid: false, message: `'${block.type}' block 'value' cannot be empty.` };
                }
                break;
        }
    }
    return { isValid: true };
};

// @desc        Create a new blog post
// @route       POST /api/blogs
// @access      Admin (or Authenticated User)
const createBlog = async (req, res) => {
    try {
        const {
            title,
            slug,
            category,
            author,
            publishDate,
            contentBlocks, // We'll process this
            faqs,
            metaDescription,
            metaKeywords,
            metaTitle,
        } = req.body;

        // Basic required field validation (excluding imageUrl and description here)
        if (!title || !category || !author) { // publishDate can be defaulted
            return res.status(400).json({ message: "Please fill all required fields: title, category, author." });
        }

        // Validate content blocks using the helper
        const { isValid, message: contentBlocksValidationMessage } = validateContentBlocks(contentBlocks);
        if (!isValid) {
            return res.status(400).json({ error: contentBlocksValidationMessage });
        }

        // --- Derive imageUrl and description from contentBlocks ---
        const mainImageUrl = contentBlocks.find(block => block.type === 'image' && block.value)?.value;
        // Concatenate text from paragraph blocks for a short description/preview
        const shortDescription = contentBlocks
            .filter(block => block.type === 'paragraph' && block.value && block.value.trim() !== '')
            .map(block => block.value.trim())
            .join(' '); // Join paragraphs with a space

        // Validate that there's at least one image if it's considered mandatory for the blog overall
        if (!mainImageUrl) {
            return res.status(400).json({ message: "A main image is required for the blog post." });
        }
        // Validate that there's at least some description content
        if (!shortDescription.trim()) {
            return res.status(400).json({ message: "At least one paragraph is required for the blog content." });
        }
        // If you still want a more specific 'description' on the model,
        // you can assign it here, e.g., blog.description = shortDescription.substring(0, 500)

        // Optional: Validate SEO fields if present
        if (metaDescription && typeof metaDescription !== 'string') {
            return res.status(400).json({ error: "Meta description must be a string." });
        }
        if (metaKeywords && typeof metaKeywords !== 'string') {
            return res.status(400).json({ error: "Meta keywords must be a string." });
        }
        if (metaTitle && typeof metaTitle !== 'string') {
            return res.status(400).json({ error: "Meta title must be a string." });
        }

        const newBlog = await Blog.create({
            title,
            slug, // Mongoose pre-save hook will handle if empty/duplicate
            imageUrl: mainImageUrl, // Use the derived image URL
            category,
            author,
            publishDate: publishDate || Date.now(), // Use provided date or default
            description: shortDescription.substring(0, 500), // Use derived short description (truncate if needed)
            contentBlocks, // Store the entire array of rich content
            faqs,
            metaDescription,
            metaKeywords,
            metaTitle,
        });

        return res.status(201).json({ message: "Blog post created successfully", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog post:", error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: "Validation failed", errors });
        }
        if (error.code === 11000) { // Duplicate key error for slug
            return res.status(409).json({ message: "A blog post with this title/slug already exists." });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc        Update a blog post
// @route       PUT /api/blogs/:id
// @access      Admin (or Authenticated User)
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            slug,
            category,
            author,
            publishDate,
            contentBlocks, // Accept this
            faqs,
            metaDescription,
            metaKeywords,
            metaTitle,
        } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        // Basic required field validation (excluding imageUrl and description here)
        if (!title || !category || !author) {
            return res.status(400).json({ message: "Required fields cannot be empty: title, category, author." });
        }

        // Validate content blocks using the helper
        const { isValid, message: contentBlocksValidationMessage } = validateContentBlocks(contentBlocks);
        if (!isValid) {
            return res.status(400).json({ error: contentBlocksValidationMessage });
        }

        // --- Derive imageUrl and description from contentBlocks for update ---
        const mainImageUrl = contentBlocks.find(block => block.type === 'image' && block.value)?.value;
        const shortDescription = contentBlocks
            .filter(block => block.type === 'paragraph' && block.value && block.value.trim() !== '')
            .map(block => block.value.trim())
            .join(' ');

        // Optional: Validate that there's at least one image if it's considered mandatory for the blog overall
        if (!mainImageUrl) {
            return res.status(400).json({ message: "A main image is required for the blog post." });
        }
        // Optional: Validate that there's at least some description content
        if (!shortDescription.trim()) {
            return res.status(400).json({ message: "At least one paragraph is required for the blog content." });
        }


        // Prepare update object
        const updateFields = {
            title,
            category,
            author,
            publishDate,
            imageUrl: mainImageUrl, // Use the derived image URL
            description: shortDescription.substring(0, 500), // Use derived short description
            contentBlocks, // Store the array as is
            faqs,
            metaDescription,
            metaKeywords,
            metaTitle,
        };

        // Conditionally add slug if provided (only if you want to allow manual slug changes)
        if (slug !== undefined) updateFields.slug = slug;


        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true, context: 'query' } // `context: 'query'` for unique validators on update
        );

        return res.status(200).json({ message: "Blog post updated successfully", blog: updatedBlog });
    } catch (error) {
        console.error("Error updating blog post:", error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: "Validation failed", errors });
        }
        if (error.code === 11000) { // Duplicate key error for slug
            return res.status(409).json({ message: "Another blog post with this slug already exists." });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc        Get all blog posts
// @route       GET /api/blogs
// @access      Public
const getAllBlogs = async (req, res) => {
    try {
        // You might want to add pagination, filtering, sorting here
        const blogs = await Blog.find({}).sort({ publishDate: -1 }); // Sort by newest first
        return res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc        Get a single blog post by slug
// @route       GET /api/blogs/:slug
// @access      Public
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        return res.status(200).json(blog);
    } catch (error) {
        console.error("Error fetching single blog post:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc        Delete a blog post
// @route       DELETE /api/blogs/:id
// @access      Admin (or Authenticated User)
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        return res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
};