import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type Vehicle = { id: string; number: string; model?: string };

export const VehicleDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, number, model");
      if (!error && data) setVehicles(data);
    }
    fetchVehicles();
  }, []);

  return (
    <select value={value} onChange={e => onChange(e.target.value)} required>
      <option value="">Select Vehicle</option>
      {vehicles.map(v => (
        <option key={v.id} value={v.id}>
          {v.number} {v.model ? `- ${v.model}` : ""}
        </option>
      ))}
    </select>
  );
};
