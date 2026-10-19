import { useEffect, useRef } from "react";

type Img = { src: string; caption?: string };

/** Accessible image viewer built on <dialog>. Arrow keys move, Esc closes. */
export function Lightbox({ images, index, onClose, onMove, title }: {
  images: Img[]; index: number | null; onClose: () => void; onMove: (i: number) => void; title: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onMove((index + 1) % images.length);
      if (e.key === "ArrowLeft") onMove((index - 1 + images.length) % images.length);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [index, images.length, onMove]);

  const img = index !== null ? images[index] : null;
  return (
    <dialog ref={ref} className="lightbox" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label={`${title} screenshots`}>
      {img && (
        <figure>
          <img src={img.src} alt={img.caption || `${title} screenshot ${index! + 1}`} />
          <figcaption>
            <span>{img.caption}</span>
            <span className="lightbox-count">{index! + 1} / {images.length}</span>
          </figcaption>
        </figure>
      )}
      <div className="lightbox-ctrl">
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => onMove((index! - 1 + images.length) % images.length)} aria-label="Previous screenshot">←</button>
            <button type="button" onClick={() => onMove((index! + 1) % images.length)} aria-label="Next screenshot">→</button>
          </>
        )}
        <button type="button" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </dialog>
  );
}
