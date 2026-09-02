const express = require("express");

const {
    createModule,
    getModules,
    deleteModule
} = require("../controllers/moduleController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/course/:courseId",
    protect,
    authorize("instructor"),
    createModule
);

router.get(
    "/course/:courseId",
    getModules
);

router.delete(
    "/:id",
    protect,
    authorize("instructor"),
    deleteModule
);

module.exports = router;