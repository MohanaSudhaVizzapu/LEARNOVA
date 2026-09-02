const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const submitAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(
            req.params.assignmentId
        );

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const existingSubmission = await Submission.findOne({
            assignment: req.params.assignmentId,
            student: req.user.id
        });

        if (existingSubmission) {
            return res.status(400).json({
                message: "Assignment already submitted"
            });
        }

        const result = await uploadToCloudinary(req.file);

        const status =
            new Date() > assignment.deadline
                ? "late"
                : "submitted";

        const submission = await Submission.create({
            assignment: req.params.assignmentId,
            student: req.user.id,
            fileUrl: result.secure_url,
            status
        });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submission
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit assignment",
            error: error.message
        });
    }
};
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user.id
        })
            .populate("assignment", "title deadline maxMarks")
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch submissions",
            error: error.message
        });
    }
};

const getMySubmission = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            assignment: req.params.assignmentId,
            student: req.user.id
        }).populate(
            "assignment",
            "title deadline maxMarks"
        );

        if (!submission) {
            return res.status(404).json({
                message: "No submission found"
            });
        }

        res.json(submission);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch submission",
            error: error.message
        });
    }
};

const getAssignmentSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(
            req.params.assignmentId
        );

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

        const submissions = await Submission.find({
            assignment: req.params.assignmentId
        })
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch submissions",
            error: error.message
        });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback } = req.body;

        const submission = await Submission.findById(
            req.params.id
        ).populate("assignment");

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        if (
            submission.assignment.instructor.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (
            marks < 0 ||
            marks > submission.assignment.maxMarks
        ) {
            return res.status(400).json({
                message: "Invalid marks"
            });
        }

        submission.marks = marks;
        submission.feedback = feedback || "";
        submission.status = "graded";

        await submission.save();

        res.json({
            message: "Submission graded successfully",
            submission
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to grade submission",
            error: error.message
        });
    }
};

module.exports = {
    submitAssignment,
    getMySubmissions,
    getMySubmission,
    getAssignmentSubmissions,
    gradeSubmission
};