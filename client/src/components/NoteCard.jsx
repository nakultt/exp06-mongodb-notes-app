export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const updated = new Date(note.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <article className={`note bg-${note.color} ${note.pinned ? "pinned" : ""}`}>
      <div className="note-head">
        <h3>{note.title}</h3>
        <button className={`icon ${note.pinned ? "on" : ""}`} title={note.pinned ? "Unpin" : "Pin"} onClick={onTogglePin}>
          &#128204;
        </button>
      </div>
      <p className="note-body">{note.content}</p>
      <div className="note-foot">
        <small>Edited {updated}</small>
        <div className="note-actions">
          <button className="icon" title="Edit" onClick={onEdit}>&#9998;</button>
          <button className="icon danger" title="Delete" onClick={onDelete}>&#128465;</button>
        </div>
      </div>
    </article>
  );
}
