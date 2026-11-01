export async function api(path, { method = "GET", body, auth } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const r = await fetch("/api/token");
    if (!r.ok) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${(await r.json()).token}`;
  }
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, { method, headers, body: body && JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Try again.");
  return data;
}
