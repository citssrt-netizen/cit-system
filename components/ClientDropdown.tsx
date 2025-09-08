import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // ✅ fixed import

type Client = { id: string; name: string };

export const ClientDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from("clients").select("id, name");
      if (!error && data) setClients(data);
    }
    fetchClients();
  }, []);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required>
      <option value="">Select Client</option>
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
};
