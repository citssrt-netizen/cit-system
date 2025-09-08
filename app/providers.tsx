"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient<Database>();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
