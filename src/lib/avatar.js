// Local avatar fallback: initials on a coloured circle as an inline SVG data
// URI. Unlike the DiceBear API it needs no network, so the picture always
// renders even when the real photo is missing or fails to load.
export function initialAvatar(name) {
  const letters =
    (name || "")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const esc = letters.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#0f766e"/><text x="32" y="33" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="26" font-weight="700" fill="#ffffff">${esc}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function avatarImageUrl(url) {
  if (!/^https?:\/\//i.test(url || "")) return url;

  try {
    const parsed = new URL(url);
    if (
      /(^|\.)googleusercontent\.com$/i.test(parsed.hostname) &&
      !/=s\d+(?:-[a-z]+)?$/i.test(parsed.pathname)
    ) {
      parsed.pathname += "=s256-c";
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

// <img> onError handler for avatars: retry the original photo URL once with a
// cache-busting param (a single transient network blip must not stick the
// fallback forever), then fall back to the local initial avatar.
export function onAvatarError(e, originalUrl, name) {
  const el = e.currentTarget;
  const fb = initialAvatar(name);
  if (el.src === fb) return; // already showing the final fallback
  if (/^https?:/.test(originalUrl || "") && el.dataset.tried !== originalUrl) {
    el.dataset.tried = originalUrl;
    el.src = originalUrl + (originalUrl.includes("?") ? "&" : "?") + "retry=" + Date.now();
    return;
  }
  el.src = fb;
}

// Decode a picked photo into something drawable (ImageBitmap honours EXIF
// rotation where available; the <img> path covers older browsers).
async function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { /* fall through */ }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("Could not read that photo."));
      img.src = url;
    });
  } finally { URL.revokeObjectURL(url); }
}

// Crop a picked photo to a square and re-encode it as a compact JPEG data URL
// (256px @ quality 0.82 ≈ 15–30KB) — small enough for the POST /avatar route.
export async function fileToAvatar(file, size = 256) {
  if (!file.type?.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 15 * 1024 * 1024) throw new Error("That photo is larger than 15MB.");
  const src = await loadBitmap(file);
  const w = src.width, h = src.height, side = Math.min(w, h);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff"; // JPEG has no alpha — flatten transparency onto white
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(src, (w - side) / 2, (h - side) / 2, side, side, 0, 0, size, size);
  src.close?.(); // ImageBitmap only
  return c.toDataURL("image/jpeg", 0.82);
}
