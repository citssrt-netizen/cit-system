import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type FuelReceipt = {
  id: string;
  image_url: string;
  amount: number;
  uploaded_by: string;
  uploaded_at: string;
};

export default function FuelReceiptList({ runId }: { runId: string }) {
  const [receipts, setReceipts] = useState<FuelReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceipts() {
      const { data, error } = await supabase
        .from("fuel_receipts")
        .select("*")
        .eq("run_id", runId)
        .order("uploaded_at", { ascending: false });
      setReceipts(data || []);
      setLoading(false);
    }
    fetchReceipts();
  }, [runId]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Fuel Receipts</h3>
      {loading ? <p>Loading...</p> : receipts.length === 0 ? <p>No fuel receipts uploaded yet.</p> : (
        <ul>
          {receipts.map(receipt => (
            <li key={receipt.id} style={{ marginBottom: 12 }}>
              <a href={receipt.image_url} target="_blank" rel="noopener noreferrer">
                {receipt.image_url.endsWith(".pdf") ? (
                  <span>PDF File</span>
                ) : (
                  <img src={receipt.image_url} alt="Fuel receipt" style={{ width: 120, borderRadius: 5, border: "1px solid #ccc" }} />
                )}
              </a>
              <br />
              Amount: <strong>{receipt.amount}</strong>
              <br />
              Uploaded at: {new Date(receipt.uploaded_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
