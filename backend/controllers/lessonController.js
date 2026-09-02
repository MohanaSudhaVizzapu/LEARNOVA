const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

const createLesson = async (req, res) => {
    try {
        const {
            title,
            description,
            videoUrl,
            resourceUrl,
            duration,
            order
        } = req.body;

        const module = await Module.findById(req.params.moduleId);

        if (!module) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        const course = await Course.findById(module.course);

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const lesson = await Lesson.create({
            title,
            description,
            videoUrl,
            resourceUrl,
            duration,
            order,
            module: req.params.moduleId
        });

        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create lesson",
            error: error.message
        });
    }
};

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            module: req.params.moduleId
        }).sort({ order: 1 });

        res.json(lessons);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch lessons",
            error: error.message
        });
    }
};

const getLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch lesson",
            error: error.message
        });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        const module = await Module.findById(lesson.module);
        const course = await Course.findById(module.course);

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await lesson.deleteOne();

        res.json({
            message: "Lesson deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lesson",
            error: error.message
        });
    }
};

module.exports = {
    createLesson,
    getLessons,
    getLesson,
    deleteLesson
};