export async function api(path, { method = "GET", body, auth } = {}) {
  const headers = { Accept: "application/json" };
  const options = { method, headers };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  if (auth) {
    const r = await fetch("/api/token");
    if (!r.ok) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${(await r.json()).token}`;
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, options);
  const data = res.status === 204 ? null : await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Try again.");
  return data;
}
