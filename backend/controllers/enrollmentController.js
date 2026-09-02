const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.status !== "published") {
            return res.status(400).json({
                message: "Course is not available for enrollment"
            });
        }

        const existingEnrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this course"
            });
        }

        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: req.params.courseId
        });

        res.status(201).json({
            message: "Enrolled successfully",
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to enroll",
            error: error.message
        });
    }
};


const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id
        })
            .populate(
                "course",
                "title description category level thumbnail duration"
            )
            .sort({ enrolledAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch enrolled courses",
            error: error.message
        });
    }
};


const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;

        if (progress < 0 || progress > 100) {
            return res.status(400).json({
                message: "Progress must be between 0 and 100"
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.courseId
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        enrollment.progress = progress;

        if (progress === 100) {
            enrollment.completed = true;
        }

        await enrollment.save();

        res.json({
            message: "Progress updated successfully",
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update progress",
            error: error.message
        });
    }
};


const completeLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        const module = await Module.findById(lesson.module);

        if (!module) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: module.course
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "You are not enrolled in this course"
            });
        }

        if (!enrollment.completedLessons.includes(lesson._id)) {
            enrollment.completedLessons.push(lesson._id);
        }

        const modules = await Module.find({
            course: module.course
        });

        const moduleIds = modules.map(m => m._id);

        const totalLessons = await Lesson.countDocuments({
            module: { $in: moduleIds }
        });

        const completedCount = enrollment.completedLessons.length;

        const progress = totalLessons === 0
            ? 0
            : Math.round((completedCount / totalLessons) * 100);

        enrollment.progress = progress;

        if (progress === 100) {
            enrollment.completed = true;
        }

        await enrollment.save();

        res.json({
            message: "Lesson completed successfully",
            progress,
            enrollment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete lesson",
            error: error.message
        });
    }
};


const getCourseStudents = async (req, res) => {
    try {
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

        const enrollments = await Enrollment.find({
            course: req.params.courseId
        }).populate(
            "student",
            "name email profileImage"
        );

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

const getInstructorStudents = async (req, res) => {
    try {
        const courses = await Course.find({
            instructor: req.user.id
        }).select("_id");

        const courseIds = courses.map(course => course._id);

        const students = await Enrollment.countDocuments({
            course: { $in: courseIds }
        });

        res.json({
            students
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};


module.exports = {
    enrollCourse,
    getMyCourses,
    updateProgress,
    completeLesson,
    getCourseStudents,
    getInstructorStudents
};