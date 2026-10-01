import { useState } from "react";
import ColorPicker from "./ColorPicker.jsx";

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("white");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }
    try {
      await onCreate({ title, content, color });
      setTitle("");
      setContent("");
      setColor("white");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className={`note-form bg-${color}`} onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Take a note..." rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
      {error && <span className="error">{error}</span>}
      <div className="form-footer">
        <ColorPicker value={color} onChange={setColor} />
        <button type="submit" className="btn">Add Note</button>
      </div>
    </form>
  );
}
