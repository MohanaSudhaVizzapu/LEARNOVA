const express = require("express");

const {
    createCourse,
    getCourses,
    getCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    publishCourse
} = require("../controllers/courseController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCourses);

router.get(
    "/instructor/my-courses",
    protect,
    authorize("instructor"),
    getMyCourses
);

router.get("/:id", getCourse);

router.post(
    "/",
    protect,
    authorize("instructor"),
    createCourse
);

router.put(
    "/:id",
    protect,
    authorize("instructor"),
    updateCourse
);

router.delete(
    "/:id",
    protect,
    authorize("instructor"),
    deleteCourse
);

router.patch(
    "/:id/publish",
    protect,
    authorize("instructor"),
    publishCourse
);

module.exports = router;