import Link from "next/link";
import { Children } from "react";

// Splits text into grapheme-ish chunks so emoji variation selectors (☀️ 🛠️)
// stay attached to their base character when each chunk gets its own <span>.
function chunks(text) {
  const out = [];
  for (const ch of Array.from(text)) {
    const last = out[out.length - 1];
    if (last && (/[\uFE0E\uFE0F\u200D]/.test(ch) || last.endsWith("\u200D"))) {
      out[out.length - 1] = last + ch;
    } else {
      out.push(ch);
    }
  }
  return out;
}

/**
 * Button styled after https://uiverse.io/doniaskima/happy-turtle-32
 * Resting state shows the "original" face; on hover it slides away and the
 * letters fly in one by one. Renders a Next <Link> when `href` is given.
 *
 * size:   "sm" | "xs" | "circle"  (default = the reference's chunky padding)
 * variant:"dark" | "error" | "success" | "secondary" | "neutral"
 */
export default function Btn({ href, className = "", size, variant, children, ...rest }) {
  const cls = ["btn-53", size && `btn-53-${size}`, variant && `btn-53-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  const items = Children.toArray(children);
  const letters = items.map((child, i) =>
    typeof child === "string"
      ? chunks(child).map((c, j) => <span key={`${i}-${j}`}>{c === " " ? "\u00A0" : c}</span>)
      : child
  );

  const Tag = href ? Link : "button";
  return (
    <Tag {...(href ? { href } : {})} className={cls} {...rest}>
      <span className="original">{items}</span>
      <span className="letters">{letters}</span>
    </Tag>
  );
}
