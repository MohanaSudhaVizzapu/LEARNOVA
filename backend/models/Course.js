const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true
        },

        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },

        thumbnail: {
            type: String,
            default: ""
        },

        duration: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);