import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET all users
export async function GET() {
  const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: roles } = await supabaseAdmin
    .from("users")
    .select("id, role, active, name, email");

  const merged = authUsers.users.map((u) => {
    const match = roles?.find((r) => r.id === u.id);
    return {
      id: u.id,
      email: u.email || match?.email || "",
      role: match?.role?.toLowerCase() || "driver", // ✅ normalized
      name: match?.name || "",
      active: match?.active ?? true,
    };
  });

  return NextResponse.json(merged);
}

// POST new user
export async function POST(req: Request) {
  const { email, password, role, name } = await req.json();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: dbError } = await supabaseAdmin.from("users").upsert({
    id: data.user?.id,
    email,
    role: role.toLowerCase(), // ✅ normalize
    name,
    active: true,
  });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ success: true, user: data.user });
}

// PATCH update role
export async function PATCH(req: Request) {
  const { id, role } = await req.json();

  const { error } = await supabaseAdmin
    .from("users")
    .update({ role: role.toLowerCase() }) // ✅ normalize
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// DELETE deactivate user
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from("users")
    .update({ active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
