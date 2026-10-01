import { useState } from "react";
import ColorPicker from "./ColorPicker.jsx";

export default function EditModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }
    try {
      await onSave({ title, content, color });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className={`modal bg-${color}`} onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
        <h2>Edit note</h2>
        <input value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />
        <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
        {error && <span className="error">{error}</span>}
        <div className="form-footer">
          <ColorPicker value={color} onChange={setColor} />
          <div className="modal-actions">
            <button type="button" className="btn light" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
