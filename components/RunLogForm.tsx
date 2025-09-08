import React, { useState } from "react";
import { supabase } from "../utils/supabase";

const eventTypes = [
  "start", "stop", "checkpoint", "incident", "fuel", "other"
];

// Utility to sanitize file names for Supabase
function sanitizeFileName(name: string) {
  const ext = name.substring(name.lastIndexOf("."));
  const base = name.substring(0, name.lastIndexOf("."));
  return base
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_") + ext;
}

export default function RunLogForm({ runId }: { runId: string }) {
  const [eventType, setEventType] = useState("checkpoint");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate logged-in user
    const user_id = null; // Replace with real user id from auth if needed

    let photo_url = "";
    if (photo) {
      const cleanName = sanitizeFileName(photo.name);
      const filePath = `${runId}/${Date.now()}-${cleanName}`;
      // UPLOAD
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("run-logs")
        .upload(filePath, photo, { upsert: true });
      if (uploadError) {
        alert("Upload error: " + uploadError.message);
      } else {
        const { data } = supabase.storage.from("run-logs").getPublicUrl(filePath);
        photo_url = data.publicUrl;
        if (!photo_url) {
          alert("Photo upload succeeded, but public URL could not be retrieved.");
        }
      }
    }

    const { error } = await supabase.from("run_logs").insert({
      run_id: runId,
      event_time: new Date().toISOString(),
      event_type: eventType,
      user_id: user_id,
      notes,
      photo_url,
    });

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setNotes(""); setPhoto(null);
    } else {
      alert("Database error: " + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <label>
        Event Type:{" "}
        <select value={eventType} onChange={e => setEventType(e.target.value)}>
          {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <br />
      <label>
        Notes:{" "}
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} />
      </label>
      <br />
      <label>
        Photo:{" "}
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Add Log"}
      </button>
      {success && <span style={{ color: "green", marginLeft: 12 }}>Log added!</span>}
    </form>
  );
}
