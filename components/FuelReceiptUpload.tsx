import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

// Clean file names for supabase
function sanitizeFileName(name: string) {
  const ext = name.substring(name.lastIndexOf("."));
  const base = name.substring(0, name.lastIndexOf("."));
  return base.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_") + ext;
}

export default function FuelReceiptUpload({
  runId,
  userId,
  onUploaded,
}: {
  runId: string;
  userId: string;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
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
      const { error: uploadError } = await supabase.storage
        .from("fuel-receipts")
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        alert("Upload error: " + uploadError.message);
        setLoading(false);
        return;
      } else {
        const { data } = supabase.storage
          .from("fuel-receipts")
          .getPublicUrl(filePath);
        image_url = data.publicUrl;
        if (!image_url) {
          alert("Could not get public URL for fuel receipt.");
          setLoading(false);
          return;
        }
      }
    }
    if (image_url) {
      const { error } = await supabase.from("fuel_receipts").insert({
        run_id: runId,
        image_url,
        amount: amount ? parseFloat(amount) : null,
        uploaded_by: userId,
      });
      if (!error) {
        setSuccess(true);
        setFile(null);
        setAmount("");
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
        Fuel Receipt:&nbsp;
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </label>
      <br />
      <label>
        Amount:&nbsp;
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
        {loading ? "Uploading..." : "Upload Receipt"}
      </button>
      {success && <span style={{ color: "green", marginLeft: 8 }}>Uploaded!</span>}
    </form>
  );
}
