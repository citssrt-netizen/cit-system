/** Mirror Supabase Storage from CLOUD → LOCAL (with ID fallback)
 *  Usage:
 *    node mirror-storage.js
 */

const CLOUD_URL = "https://jukgqeaonsspwbgsfela.supabase.co";
const CLOUD_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2dxZWFvbnNzcHdiZ3NmZWxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDM3OTU0NSwiZXhwIjoyMDY5OTU1NTQ1fQ.T-VoHDXzV-DUI01xmvjfT1Jtfl-H9CIYWFckvai63GA";

const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

// --- helpers ---
async function api(base, key, path, opt = {}) {
  const r = await fetch(`${base}${path}`, {
    method: opt.method || "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(opt.body ? { "Content-Type": "application/json" } : {}),
    },
    body: opt.body ? JSON.stringify(opt.body) : undefined,
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    const err = new Error(`${opt.method || "GET"} ${path} → ${r.status} ${txt}`);
    err.status = r.status;
    throw err;
  }
  const ct = r.headers.get("content-type") || "";
  return ct.includes("application/json") ? r.json() : r.arrayBuffer();
}

async function listBuckets(base, key) {
  return api(base, key, "/storage/v1/bucket");
}

// returns objects with fields: id, name, updated_at, metadata, etc.
async function listObjectsRecursive(base, key, bucket, prefix = "") {
  const out = [];
  const stack = [prefix];
  while (stack.length) {
    const p = stack.pop();
    const entries = await api(base, key, `/storage/v1/object/list/${bucket}`, {
      method: "POST",
      body: { prefix: p, limit: 1000, search: "" },
    });
    for (const e of entries || []) {
      if (!e?.name) continue;
      if (e.name.endsWith("/")) stack.push(e.name);
      else out.push(e);
    }
  }
  return out;
}

async function ensureBucket(base, key, { id, name, public: pub = false }) {
  try {
    await api(base, key, "/storage/v1/bucket", {
      method: "POST",
      body: { id, name, public: !!pub },
    });
  } catch (e) {
    if (!String(e).includes("already exists")) throw e;
  }
}

async function downloadByPath(base, key, bucket, path) {
  const buf = await api(base, key, `/storage/v1/object/${encodeURIComponent(bucket)}/${path}`);
  return Buffer.from(buf);
}
async function downloadById(base, key, id) {
  const buf = await api(base, key, `/storage/v1/object/id/${id}`);
  return Buffer.from(buf);
}
async function uploadObject(base, key, bucket, path, buf) {
  const r = await fetch(`${base}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`, {
    method: "PUT",
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    body: buf,
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`PUT ${bucket}/${path} → ${r.status} ${txt}`);
  }
}

(async () => {
  console.log("🔁 Mirroring Storage CLOUD → LOCAL");
  console.log("Cloud:", CLOUD_URL);
  console.log("Local:", LOCAL_URL);

  const buckets = await listBuckets(CLOUD_URL, CLOUD_SERVICE_KEY);

  for (const b of buckets) {
    console.log(`\n📦 Bucket: ${b.name} (public=${!!b.public})`);
    await ensureBucket(LOCAL_URL, LOCAL_SERVICE_KEY, b);

    const objects = await listObjectsRecursive(CLOUD_URL, CLOUD_SERVICE_KEY, b.name, "");
    console.log(`   Found ${objects.length} objects`);

    let i = 0;
    for (const obj of objects) {
      i++;
      const path = obj.name; // full key (may include folders)
      const id = obj.id;     // storage object id
      process.stdout.write(`   [${i}/${objects.length}] ${path}\r`);
      let buf;
      try {
        buf = await downloadByPath(CLOUD_URL, CLOUD_SERVICE_KEY, b.name, path);
      } catch (e) {
        // if 404 via path, try by id
        if (e?.status === 400 || e?.status === 404) {
          buf = await downloadById(CLOUD_URL, CLOUD_SERVICE_KEY, id);
        } else {
          throw e;
        }
      }
      await uploadObject(LOCAL_URL, LOCAL_SERVICE_KEY, b.name, path, buf);
    }
    process.stdout.write("\n");
    console.log(`   ✅ Done: ${b.name}`);
  }

  console.log("\n✨ All buckets mirrored to local.");
})().catch((err) => {
  console.error("\n❌ Mirror failed:", err.message || err);
  process.exit(1);
});

