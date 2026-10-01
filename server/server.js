require("dotenv").config({ quiet: true });
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const notesRouter = require("./routes/notes");

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_app";

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  res.on("finish", () => console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`));
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api/notes", notesRouter);

// Serve the built React client (client/dist) when it exists
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api).*/, (req, res, next) => {
  res.sendFile(path.join(clientDist, "index.html"), (err) => err && next());
});

// Central error handler: turns Mongoose validation errors into 400 responses
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: errors.join(", ") });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => console.log(`Notes API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
