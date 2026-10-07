import About, { type AboutImages } from "@/components/about";
import HeroAboutTransition from "@/components/hero-about-transition";
import SelectedWork from "@/components/selected-work";
import Contact from "@/components/contact";
import { readFileSync } from "node:fs";

const source = readFileSync("maulana-portfolio.html", "utf8");
const portraitSrc = source.match(/<img src="(data:image\/jpeg;base64,[^"]+)" alt="Potret Maulana Rizky">/)?.[1];

if (!portraitSrc) throw new Error("The reference portrait could not be loaded.");
const referencePortraitSrc = portraitSrc;
const aboutImages: AboutImages = [
  referencePortraitSrc,
  "/selected-work/moments.jpg",
  "/selected-work/titik-balik.jpg",
  "/selected-work/echoes.jpg",
];

export default function HomePage() {
  return (
    <>
      <header data-site-header className="sticky top-0 z-50 flex items-center justify-between bg-transparent px-[clamp(18px,3.4vw,54px)] py-[20px_16px] text-ink motion-reduce:bg-paper">
        <a href="#top" className="text-[11px] font-bold uppercase tracking-[.14em]">Maulana Rizky</a>
        <nav aria-label="Primary navigation" className="flex items-center gap-[clamp(18px,3vw,46px)] text-[10.5px] font-medium uppercase tracking-[.16em]">
          <a href="#work" className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:[transition:width_.4s_cubic-bezier(.16,.8,.3,1)] hover:after:w-full">Work</a>
          <a href="#about" className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:[transition:width_.4s_cubic-bezier(.16,.8,.3,1)] hover:after:w-full">About</a>
          <a href="#contact" className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:[transition:width_.4s_cubic-bezier(.16,.8,.3,1)] hover:after:w-full">Contact</a>
          <a href="#top" aria-label="Back to top" className="size-3 rounded-full bg-current transition hover:scale-[1.35]" />
        </nav>
      </header>
      <main>
        <HeroAboutTransition portraitSrc={referencePortraitSrc} />
        <About images={aboutImages} />
        <SelectedWork />
        <Contact />
      </main>
    </>
  );
}
