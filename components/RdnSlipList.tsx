import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type RdnSlip = {
  id: string;
  image_url: string;
  uploaded_by: string;
  uploaded_at: string;
};

export default function RdnSlipList({ runId }: { runId: string }) {
  const [slips, setSlips] = useState<RdnSlip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlips() {
      const { data, error } = await supabase
        .from("rdn_slips")
        .select("*")
        .eq("run_id", runId)
        .order("uploaded_at", { ascending: false });
      setSlips(data || []);
      setLoading(false);
    }
    fetchSlips();
  }, [runId]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3>RDN Slips</h3>
      {loading ? <p>Loading...</p> : slips.length === 0 ? <p>No RDN slips uploaded yet.</p> : (
        <ul>
          {slips.map(slip => (
            <li key={slip.id} style={{ marginBottom: 12 }}>
              <a href={slip.image_url} target="_blank" rel="noopener noreferrer">
                {slip.image_url.endsWith(".pdf") ? (
                  <span>PDF File</span>
                ) : (
                  <img src={slip.image_url} alt="RDN slip" style={{ width: 120, borderRadius: 5, border: "1px solid #ccc" }} />
                )}
              </a>
              <br />
              Uploaded at: {new Date(slip.uploaded_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
