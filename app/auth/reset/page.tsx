"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetAuthPage() {
  const supabase = createClientComponentClient();
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut();
      } catch {}
      setDone(true);
    })();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      {done ? (
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold">Auth reset complete</h1>
          <p className="text-sm text-gray-600">
            You can now go back to <a className="underline" href="/login">/login</a> and sign in again.
          </p>
        </div>
      ) : (
        <p>Resetting…</p>
      )}
    </main>
  );
}
