import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

// Helper to sanitize file names
function sanitizeFileName(name: string) {
  const ext = name.substring(name.lastIndexOf("."));
  const base = name.substring(0, name.lastIndexOf("."));
  return base.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_") + ext;
}

export default function RdnSlipUpload({ runId, userId, onUploaded }: { runId: string, userId: string, onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    let image_url = "";
    if (file) {
      const cleanName = sanitizeFileName(file.name);
      const filePath = `${runId}/${Date.now()}-${cleanName}`;
      const { error: uploadError } = await supabase.storage.from("rdn-slips").upload(filePath, file, { upsert: true });
      if (uploadError) {
        alert("Upload error: " + uploadError.message);
      } else {
        const { data } = supabase.storage.from("rdn-slips").getPublicUrl(filePath);
        image_url = data.publicUrl;
        if (!image_url) alert("Could not get public URL for RDN slip.");
      }
    }
    if (image_url) {
      const { error } = await supabase.from("rdn_slips").insert({
        run_id: runId,
        image_url,
        uploaded_by: userId,
      });
      if (!error) {
        setSuccess(true);
        setFile(null);
        onUploaded();
      } else {
        alert("Database error: " + error.message);
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} style={{ marginBottom: 18 }}>
      <label>
        RDN Slip:&nbsp;
        <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />
      </label>
      <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload RDN"}</button>
      {success && <span style={{ color: "green", marginLeft: 8 }}>Uploaded!</span>}
    </form>
  );
}
