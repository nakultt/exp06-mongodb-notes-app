// Thin wrapper around fetch for the notes REST API
const BASE = "/api/notes";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const getNotes = (search = "") =>
  request(search ? `${BASE}?search=${encodeURIComponent(search)}` : BASE);
export const createNote = (note) => request(BASE, { method: "POST", body: JSON.stringify(note) });
export const updateNote = (id, note) => request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(note) });
export const deleteNote = (id) => request(`${BASE}/${id}`, { method: "DELETE" });
