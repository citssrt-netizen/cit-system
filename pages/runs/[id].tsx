import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";
import RdnSlipUpload from "../../components/RdnSlipUpload";
import RdnSlipList from "../../components/RdnSlipList";
import FuelReceiptUpload from "../../components/FuelReceiptUpload";
import FuelReceiptList from "../../components/FuelReceiptList";

type Run = {
  id: string;
  date: string;
  type: string;
  status: string;
  vehicle_id: string;
  client_id: string;
  assigned_team: string[];
  route: string;
  run_charges: number;
};

type Vehicle = { id: string; number: string; model?: string };
type Client = { id: string; name: string };
type User = { id: string; name: string; role: string };

export default function RunDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [run, setRun] = useState<Run | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const { data: runData } = await supabase.from("runs").select("*").eq("id", id).single();
      setRun(runData);

      if (runData?.vehicle_id) {
        const { data: vehicleData } = await supabase
          .from("vehicles")
          .select("id, number, model")
          .eq("id", runData.vehicle_id)
          .single();
        setVehicle(vehicleData);
      }
      if (runData?.client_id) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("id, name")
          .eq("id", runData.client_id)
          .single();
        setClient(clientData);
      }
      if (runData?.assigned_team && runData.assigned_team.length > 0) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, name, role")
          .in("id", runData.assigned_team);
        setTeam(usersData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link href="/runs">← Back to All Runs</Link>
        {run && (
          <Link href={`/runs/${run.id}/logs`}>
            <button>View Logs & Photos</button>
          </Link>
        )}
      </div>
      <h2>Run Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : run ? (
        <div>
          <p><strong>Date:</strong> {run.date}</p>
          <p><strong>Type:</strong> {run.type}</p>
          <p><strong>Status:</strong> {run.status}</p>
          <p><strong>Vehicle:</strong> {vehicle ? `${vehicle.number}${vehicle.model ? " (" + vehicle.model + ")" : ""}` : "-"}</p>
          <p><strong>Client:</strong> {client ? client.name : "-"}</p>
          <p><strong>Team:</strong> {team.length > 0 ? team.map(u => `${u.name} (${u.role})`).join(", ") : "-"}</p>
          <p><strong>Route:</strong> {run.route}</p>
          <p><strong>Charges:</strong> {run.run_charges}</p>
        </div>
      ) : (
        <p>Run not found.</p>
      )}

      {/* === RDN Upload & History Section === */}
      {run && (
        <div style={{ marginTop: 32 }}>
          <h2>RDN Upload & History</h2>
          {/* Simulate user_id, replace with auth user id in prod */}
          <RdnSlipUpload runId={run.id} userId="00000000-0000-0000-0000-000000000000" onUploaded={() => {}} />
          <RdnSlipList runId={run.id} />
        </div>
      )}

      {/* === Fuel Receipt Upload & History Section === */}
      {run && (
        <div style={{ marginTop: 32 }}>
          <h2>Fuel Receipt Upload & History</h2>
          <FuelReceiptUpload runId={run.id} userId="00000000-0000-0000-0000-000000000000" onUploaded={() => {}} />
          <FuelReceiptList runId={run.id} />
        </div>
      )}
    </div>
  );
}
