const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true
        },

        videoUrl: {
            type: String,
            default: ""
        },

        resourceUrl: {
            type: String,
            default: ""
        },

        duration: {
            type: String,
            default: ""
        },

        order: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);