import { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm.jsx";
import NoteCard from "./components/NoteCard.jsx";
import EditModal from "./components/EditModal.jsx";
import * as api from "./api.js";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Reload notes whenever the search text changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .getNotes(search)
        .then((data) => {
          setNotes(data);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const sortNotes = (list) =>
    [...list].sort((a, b) => b.pinned - a.pinned || new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleCreate = async (note) => {
    const created = await api.createNote(note);
    setNotes((prev) => sortNotes([created, ...prev]));
  };

  const handleUpdate = async (id, changes) => {
    const updated = await api.updateNote(id, changes);
    setNotes((prev) => sortNotes(prev.map((n) => (n._id === id ? updated : n))));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await api.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>&#128221; Notes</h1>
          <p className="muted">React + Express + MongoDB</p>
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <NoteForm onCreate={handleCreate} />

      {error && <div className="alert">{error}</div>}
      {!loading && notes.length === 0 && !error && (
        <p className="empty">{search ? "No notes match your search." : "No notes yet. Create your first note above."}</p>
      )}

      <p className="count">{notes.length} note{notes.length === 1 ? "" : "s"}</p>
      <div className="grid">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={() => setEditing(note)}
            onDelete={() => handleDelete(note._id)}
            onTogglePin={() => handleUpdate(note._id, { pinned: !note.pinned })}
          />
        ))}
      </div>

      {editing && (
        <EditModal
          note={editing}
          onClose={() => setEditing(null)}
          onSave={async (changes) => {
            await handleUpdate(editing._id, changes);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
