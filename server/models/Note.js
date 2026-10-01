const mongoose = require("mongoose");

// Schema describing a single note document in the "notes" collection
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"]
    },
    color: {
      type: String,
      enum: ["yellow", "green", "blue", "pink", "purple", "white"],
      default: "white"
    },
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Text index so notes can be searched by title and content
noteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);
