import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Desktop-only effects (pins, parallax) — phones and touch get the plain layout. */
export const DESKTOP = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
