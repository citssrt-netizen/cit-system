import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Log = {
  id: string;
  event_time: string;
  event_type: string;
  notes: string;
  photo_url: string;
  user_id: string;
};

export default function RunLogList({ runId }: { runId: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("run_logs")
        .select("*")
        .eq("run_id", runId)
        .order("event_time", { ascending: false });

      // Debug log output
      console.log("Fetched run logs for runId:", runId, data, error);

      setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, [runId]);

  return (
    <div>
      <h3>Run Log History</h3>
      {loading ? <p>Loading logs...</p> : logs.length === 0 ? <p>No logs yet.</p> : (
        <ul>
          {logs.map(log => (
            <li key={log.id} style={{ marginBottom: 18 }}>
              <strong>{log.event_type}</strong> @ {new Date(log.event_time).toLocaleString()}
              <br />
              <span>{log.notes}</span>
              {log.photo_url && (
                <div style={{ marginTop: 6 }}>
                  <a href={log.photo_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={log.photo_url}
                      alt="Run log photo"
                      style={{ width: 100, height: "auto", borderRadius: 6, border: "1px solid #ccc", marginRight: 8 }}
                    />
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
