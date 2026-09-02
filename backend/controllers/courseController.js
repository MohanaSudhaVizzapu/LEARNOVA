const Course = require("../models/Course");

const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            level,
            thumbnail,
            duration,
            price
        } = req.body;

        const course = await Course.create({
            title,
            description,
            category,
            level,
            thumbnail,
            duration,
            price,
            instructor: req.user.id
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create course",
            error: error.message
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email");

        res.json(courses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};

const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name email");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch course",
            error: error.message
        });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            instructor: req.user.id
        }).sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your courses",
            error: error.message
        });
    }
};


const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        Object.assign(course, req.body);

        await course.save();

        res.json({
            message: "Course updated successfully",
            course
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update course",
            error: error.message
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await course.deleteOne();

        res.json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete course",
            error: error.message
        });
    }
};

const publishCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        course.status = "published";

        await course.save();

        res.json({
            message: "Course published successfully",
            course
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to publish course",
            error: error.message
        });
    }
};


module.exports = {
    createCourse,
    getCourses,
    getCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    publishCourse
};