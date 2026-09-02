const express = require("express");

const {
    createAssignment,
    getAssignments,
    getAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/course/:courseId",
    protect,
    authorize("instructor"),
    createAssignment
);

router.get(
    "/course/:courseId",
    protect,
    getAssignments
);

router.get(
    "/:id",
    protect,
    getAssignment
);

router.delete(
    "/:id",
    protect,
    authorize("instructor"),
    deleteAssignment
);

module.exports = router;