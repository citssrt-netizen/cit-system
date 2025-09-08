import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = { id: string; name: string; role: string };

export const TeamSelector = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, role")
        .in("role", ["driver", "guard"]);
      if (!error && data) setUsers(data);
    }
    fetchTeam();
  }, []);

  const handleChange = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(x => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {users.map(user => (
        <label key={user.id}>
          <input
            type="checkbox"
            checked={value.includes(user.id)}
            onChange={() => handleChange(user.id)}
          />
          {user.name} ({user.role})
        </label>
      ))}
    </div>
  );
};
