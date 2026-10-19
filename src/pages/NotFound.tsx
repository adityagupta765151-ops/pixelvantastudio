import { Link } from "react-router-dom";
import { PixelMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="wrap" style={{ paddingBlock: "var(--s6)", display: "grid", gap: "var(--s3)", justifyItems: "start" }}>
      <PixelMark size={64} />
      <h1 className="display" style={{ fontSize: "var(--fs-h2)" }}>This pixel is <em>missing.</em></h1>
      <p style={{ color: "var(--muted)" }}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to home →</Link>
    </main>
  );
}
