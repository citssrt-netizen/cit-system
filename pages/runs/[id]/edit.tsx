import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import { RunForm } from "../../../components/RunForm";

export default function EditRunPage() {
  const router = useRouter();
  const { id } = router.query;
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchRun() {
      const { data } = await supabase.from("runs").select("*").eq("id", id).single();
      setInitial(data || null);
      setLoading(false);
    }
    fetchRun();
  }, [id]);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Edit Run</h2>
      {loading ? <p>Loading...</p> : (
        <RunForm initialValues={initial} isEdit runId={id as string} />
      )}
    </div>
  );
}
