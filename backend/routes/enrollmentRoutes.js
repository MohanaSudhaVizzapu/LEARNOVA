const express = require("express");

const {
    enrollCourse,
    getMyCourses,
    updateProgress,
    completeLesson,
    getCourseStudents
} = require("../controllers/enrollmentController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:courseId",
    protect,
    authorize("student"),
    enrollCourse
);

router.get(
    "/my-courses",
    protect,
    authorize("student"),
    getMyCourses
);

router.patch(
    "/:courseId/progress",
    protect,
    authorize("student"),
    updateProgress
);

router.patch(
    "/lesson/:lessonId/complete",
    protect,
    authorize("student"),
    completeLesson
);

router.get(
    "/:courseId/students",
    protect,
    authorize("instructor"),
    getCourseStudents
);

module.exports = router;