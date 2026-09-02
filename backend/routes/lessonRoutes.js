const express = require("express");

const {
    createLesson,
    getLessons,
    getLesson,
    deleteLesson
} = require("../controllers/lessonController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/module/:moduleId",
    protect,
    authorize("instructor"),
    createLesson
);

router.get(
    "/module/:moduleId",
    getLessons
);

router.get(
    "/:id",
    getLesson
);

router.delete(
    "/:id",
    protect,
    authorize("instructor"),
    deleteLesson
);

module.exports = router;