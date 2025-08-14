import React from "react";
import { useRouter } from "next/router";
import RunLogForm from "../../../components/RunLogForm";
import RunLogList from "../../../components/RunLogList";
import Link from "next/link";

export default function RunLogsPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <Link href={`/runs/${id}`}>← Back to Run Details</Link>
      <h2>Run Logs & Photos</h2>
      <RunLogForm runId={id as string} />
      <hr />
      <RunLogList runId={id as string} />
    </div>
  );
}
