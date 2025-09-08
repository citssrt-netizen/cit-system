import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";

type Run = {
  id: string;
  date: string;
  type: string;
  status: string;
  vehicle_id: string;
  client_id: string;
};

type Vehicle = { id: string; number: string; model?: string };
type Client = { id: string; name: string };

export default function RunsListPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    const [{ data: runsData }, { data: vehiclesData }, { data: clientsData }] = await Promise.all([
      supabase.from("runs").select("id, date, type, status, vehicle_id, client_id").order("date", { ascending: false }),
      supabase.from("vehicles").select("id, number, model"),
      supabase.from("clients").select("id, name"),
    ]);
    setRuns(runsData || []);
    setVehicles(vehiclesData || []);
    setClients(clientsData || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function vehicleLabel(id: string) {
    const v = vehicles.find(v => v.id === id);
    return v ? v.number + (v.model ? ` (${v.model})` : "") : "-";
  }

  function clientLabel(id: string) {
    const c = clients.find(c => c.id === id);
    return c ? c.name : "-";
  }

  async function handleDelete(runId: string) {
    if (!confirm("Are you sure you want to delete this run?")) return;
    await supabase.from("runs").delete().eq("id", runId);
    fetchAll(); // Refresh list after delete
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>All CIT Runs</h2>
      <Link href="/runs/create"><button>Create New Run</button></Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Vehicle</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <tr key={run.id}>
                <td>{run.date}</td>
                <td>{run.type}</td>
                <td>{run.status}</td>
                <td>{vehicleLabel(run.vehicle_id)}</td>
                <td>{clientLabel(run.client_id)}</td>
                <td>
                  <Link href={`/runs/${run.id}`}>
                    <button>View</button>
                  </Link>
                  <Link href={`/runs/${run.id}/edit`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(run.id)} style={{ color: "red" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
