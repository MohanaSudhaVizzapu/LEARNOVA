const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

const createAssignment = async (req, res) => {
    try {
        const {
            title,
            description,
            deadline,
            maxMarks,
            attachmentUrl
        } = req.body;

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

        const assignment = await Assignment.create({
            title,
            description,
            deadline,
            maxMarks,
            attachmentUrl,
            course: req.params.courseId,
            instructor: req.user.id
        });

        res.status(201).json({
            message: "Assignment created successfully",
            assignment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create assignment",
            error: error.message
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            course: req.params.courseId
        }).sort({ deadline: 1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignments",
            error: error.message
        });
    }
};

const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("course", "title")
            .populate("instructor", "name");

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignment",
            error: error.message
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await assignment.deleteOne();

        res.json({
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete assignment",
            error: error.message
        });
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignment,
    deleteAssignment
};