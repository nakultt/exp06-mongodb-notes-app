const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

// Reject malformed ObjectIds before they reach MongoDB
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  next();
});

// READ all: GET /api/notes?search=word
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }] }
      : {};
    const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// READ one: GET /api/notes/:id
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// CREATE: POST /api/notes
router.post("/", async (req, res, next) => {
  try {
    const { title, content, color, pinned } = req.body;
    const note = await Note.create({ title, content, color, pinned });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// UPDATE: PUT /api/notes/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { title, content, color, pinned } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color, pinned },
      { returnDocument: "after", runValidators: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// DELETE: DELETE /api/notes/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted", id: note._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
