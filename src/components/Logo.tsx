import "./logo.css";

// 5×5 pixel grid forming a "P". Cobalt "eye" inside the bowl, coral cursor pixel bottom-right.
const P_CELLS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 0],
  [0, 1], [4, 1],
  [0, 2], [1, 2], [2, 2], [3, 2],
  [0, 3],
  [0, 4],
];

export function PixelMark({ size = 32, tile = true, title }: { size?: number; tile?: boolean; title?: string }) {
  const cell = (c: number) => 7 + c * 4;
  return (
    <svg
      className="pv-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {tile && <rect width="32" height="32" rx="6" fill="var(--vanta)" />}
      <g fill={tile ? "var(--fog)" : "currentColor"}>
        {P_CELLS.map(([x, y], i) => (
          <rect key={i} className="pv-px" style={{ animationDelay: `${i * 40}ms` }} x={cell(x)} y={cell(y)} width="3.6" height="3.6" />
        ))}
      </g>
      <rect className="pv-eye" x={cell(1)} y={cell(1)} width="3.6" height="3.6" fill="var(--cobalt)" />
      <rect className="pv-cursor" x={cell(4)} y={cell(4)} width="3.6" height="3.6" fill="var(--coral)" />
    </svg>
  );
}

export function Logo({ dark = false, size = 30 }: { dark?: boolean; size?: number }) {
  return (
    <span className={`pv-logo${dark ? " is-dark" : ""}`}>
      <PixelMark size={size} />
      <span className="pv-word">
        pixelvanta<span className="pv-studio">studio</span>
      </span>
    </span>
  );
}
