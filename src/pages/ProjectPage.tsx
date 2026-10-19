// Level 5 builds the full detail layout. This stub proves routing + data lookup.
import { Link, useParams } from "react-router-dom";
import { getProject } from "@/data/projects";
import { STATUS_LABEL } from "@/data/types";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const p = getProject(slug);
  if (!p) return <NotFound />;
  return (
    <main className="wrap" style={{ paddingBlock: "var(--s5)", display: "grid", gap: "var(--s3)" }}>
      <Link to="/" className="eyebrow">← Back</Link>
      <h1 className="display" style={{ fontSize: "var(--fs-h1)" }}>{p.title}</h1>
      <p>{STATUS_LABEL[p.status]} · {p.stack.join(" · ")}</p>
      <p style={{ maxWidth: "60ch", color: "var(--muted)" }}>{p.description}</p>
    </main>
  );
}
