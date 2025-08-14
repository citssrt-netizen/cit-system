import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { VehicleDropdown } from "./VehicleDropdown";
import { ClientDropdown } from "./ClientDropdown";
import { TeamSelector } from "./TeamSelector";

type Props = {
  initialValues?: any;
  isEdit?: boolean;
  runId?: string;
};

export const RunForm: React.FC<Props> = ({ initialValues, isEdit, runId }) => {
  const [date, setDate] = useState("");
  const [type, setType] = useState("scheduled");
  const [vehicle, setVehicle] = useState("");
  const [client, setClient] = useState("");
  const [team, setTeam] = useState<string[]>([]);
  const [route, setRoute] = useState("");
  const [runCharges, setRunCharges] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set initial values on load
  useEffect(() => {
    if (!initialValues) return;
    setDate(initialValues.date || "");
    setType(initialValues.type || "scheduled");
    setVehicle(initialValues.vehicle_id || "");
    setClient(initialValues.client_id || "");
    setTeam(initialValues.assigned_team || []);
    setRoute(initialValues.route || "");
    setRunCharges(initialValues.run_charges ? initialValues.run_charges.toString() : "");
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    const values = {
      date,
      type,
      vehicle_id: vehicle,
      client_id: client,
      assigned_team: team,
      route,
      run_charges: runCharges ? parseFloat(runCharges) : null,
      status: "planned"
    };

    let error = null;
    if (isEdit && runId) {
      ({ error } = await supabase.from("runs").update(values).eq("id", runId));
    } else {
      ({ error } = await supabase.from("runs").insert(values));
    }

    setLoading(false);

    if (!error) {
      setSuccess(true);
      if (!isEdit) {
        setDate(""); setType("scheduled"); setVehicle(""); setClient(""); setTeam([]); setRoute(""); setRunCharges("");
      }
    } else {
      setErrorMsg(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Run Type:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="scheduled">Scheduled</option>
          <option value="adhoc">Ad-hoc</option>
        </select>
      </label>
      <br />
      <label>
        Vehicle: <VehicleDropdown value={vehicle} onChange={setVehicle} />
      </label>
      <br />
      <label>
        Client: <ClientDropdown value={client} onChange={setClient} />
      </label>
      <br />
      <label>
        Assigned Team: <TeamSelector value={team} onChange={setTeam} />
      </label>
      <br />
      <label>
        Route:{" "}
        <textarea
          value={route}
          onChange={e => setRoute(e.target.value)}
          placeholder="Describe route, stops, etc"
        />
      </label>
      <br />
      <label>
        Run Charges:{" "}
        <input
          type="number"
          value={runCharges}
          onChange={e => setRunCharges(e.target.value)}
          placeholder="Charges (if any)"
          min={0}
          step="0.01"
        />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Run")}
      </button>
      {success && <p style={{ color: "green" }}>{isEdit ? "Run updated!" : "Run created!"}</p>}
      {errorMsg && <p style={{ color: "red" }}>Error: {errorMsg}</p>}
    </form>
  );
};
