const Module = require("../models/Module");
const Course = require("../models/Course");

const createModule = async (req, res) => {
    try {
        const { title, description, order } = req.body;

        const course = await Course.findById(req.params.courseId);

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

        const module = await Module.create({
            title,
            description,
            order,
            course: req.params.courseId
        });

        res.status(201).json({
            message: "Module created successfully",
            module
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create module",
            error: error.message
        });
    }
};

const getModules = async (req, res) => {
    try {
        const modules = await Module.find({
            course: req.params.courseId
        }).sort({ order: 1 });

        res.json(modules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch modules",
            error: error.message
        });
    }
};

const deleteModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

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

        await module.deleteOne();

        res.json({
            message: "Module deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete module",
            error: error.message
        });
    }
};

module.exports = {
    createModule,
    getModules,
    deleteModule
};