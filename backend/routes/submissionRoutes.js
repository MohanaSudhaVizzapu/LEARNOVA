const upload = require("../middleware/uploadMiddleware");
const express = require("express");

const {
    submitAssignment,
    getMySubmissions,
    getMySubmission,
    getAssignmentSubmissions,
    gradeSubmission
} = require("../controllers/submissionController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/assignment/:assignmentId",
    protect,
    authorize("student"),
    upload.single("file"),
    submitAssignment
);

router.get(
    "/my",
    protect,
    authorize("student"),
    getMySubmissions
);

router.get(
    "/assignment/:assignmentId/my",
    protect,
    authorize("student"),
    getMySubmission
);

router.get(
    "/assignment/:assignmentId",
    protect,
    authorize("instructor"),
    getAssignmentSubmissions
);

router.patch(
    "/:id/grade",
    protect,
    authorize("instructor"),
    gradeSubmission
);

module.exports = router;