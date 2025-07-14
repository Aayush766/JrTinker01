// scripts/generateSlugs.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/course.model'); // Adjust path as needed
const slugify = require('slugify');

const dbConnection = require('../utils/db'); // Your existing DB connection

async function generateSlugsForAllCourses() {
    try {
        await dbConnection(); // Connect to your database

        console.log('Generating slugs for existing courses...');
        const courses = await Course.find({ slug: { $exists: false } }); // Find courses without a slug

        for (const course of courses) {
            const newSlug = slugify(course.courseName, { lower: true, strict: true, trim: true });
            // Check for uniqueness. If slugify doesn't guarantee it, you might need more complex logic.
            // For simplicity here, we assume unique course names lead to unique slugs.
            // For true uniqueness, you might check if the slug already exists and append a counter.
            // const existingCourseWithSlug = await Course.findOne({ slug: newSlug });
            // if (existingCourseWithSlug && existingCourseWithSlug._id.toString() !== course._id.toString()) {
            //     console.warn(`Duplicate slug "${newSlug}" for "${course.courseName}". Consider a more robust slug generation strategy.`);
            //     // You could append a hash or a number here:
            //     // course.slug = `${newSlug}-${course._id.toString().substring(0, 5)}`;
            // } else {
                course.slug = newSlug;
            // }

            await course.save(); // Save the updated course
            console.log(`Generated slug for "${course.courseName}": ${course.slug}`);
        }

        console.log('Slug generation complete!');
    } catch (error) {
        console.error('Error generating slugs:', error);
    } finally {
        mongoose.disconnect(); // Disconnect from DB
    }
}

generateSlugsForAllCourses();