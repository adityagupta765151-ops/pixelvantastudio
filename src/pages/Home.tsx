import { Hero } from "@/sections/Hero";
import { Marquee } from "@/sections/Marquee";
import { Categories } from "@/sections/Categories";
import { About } from "@/sections/About";
import { Museum } from "@/sections/Museum";
import { Skills } from "@/sections/Skills";
import { Process } from "@/sections/Process";
import { Contact } from "@/sections/Contact";
import { useReveal } from "@/lib/useReveal";

export default function Home() {
  useReveal();
  return (
    <main>
      <Hero />
      <Marquee />
      <Categories />
      <About />
      <Museum />
      <Skills />
      <Process />
      <Contact />
    </main>
  );
}
