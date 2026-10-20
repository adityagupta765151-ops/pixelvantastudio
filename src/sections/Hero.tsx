import { Link } from "react-router-dom";
import { SITE } from "@/data/site";
import { PixelField } from "@/components/PixelField";
import { useMagnetic } from "@/lib/useMagnetic";
import "./hero.css";

export function Hero() {
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const { hero } = SITE;

  return (
    <section id="home" className="hero">
      <PixelField />
      <div className="wrap">
        <p className="eyebrow rise">{hero.eyebrow}</p>
        <h1 className="display hero-title">
          {hero.lines.map((line, i) => (
            <span key={line} className="ln">
              <span style={{ animationDelay: `${i * 0.12}s` }}>
                {i === hero.accentLine ? <em className="sheen">{line}</em> : line}
              </span>
            </span>
          ))}
        </h1>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-lead rise d2">{hero.lead}</p>
            <div className="hero-ctas rise d3">
              <Link ref={ctaRef} to={{ hash: "projects" }} className="btn btn-primary">
                Explore my work <span aria-hidden="true">→</span>
              </Link>
              <Link to={{ hash: "contact" }} className="btn btn-ghost">Get in touch</Link>
            </div>
            <p className="hero-note rise d4">
              <svg width="46" height="22" viewBox="0 0 46 22" aria-hidden="true">
                <path className="hero-arrow" d="M2 18c10-2 22-6 38-15m0 0-8 1m8-1-2 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              from first sketch to deployed product
            </p>
          </div>
          <figure className="scene hero-scene rise d2">
            <img
              src="/images/hero-workspace.webp"
              alt="A bright desk by a window with a laptop, a desktop monitor and a small plant"
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Photo · Unsplash</figcaption>
          </figure>
        </div>

        <dl className="hero-meta">
          <div><dt>Builds</dt><dd>Websites · Apps · Games · Experiments</dd></div>
          <div><dt>Stack</dt><dd>MERN · Python / FastAPI · Next.js</dd></div>
          <div><dt>Based in</dt><dd>{SITE.location}</dd></div>
        </dl>
      </div>
    </section>
  );
}
