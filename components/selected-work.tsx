"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Titik Balik", category: "Poster Design", year: "2026", place: "Indonesia", image: "/selected-work/titik-balik.jpg" },
  { title: "Kōra Coffee", category: "Brand Identity", year: "2025", place: "Jakarta, Indonesia", image: "/selected-work/kora-coffee.jpg" },
  { title: "West Sumba", category: "Photography", year: "2025", place: "Indonesia", image: "/selected-work/west-sumba.jpg" },
  { title: "Every Frame", category: "Photography Series", year: "2025", place: "Jakarta, Indonesia", image: "/selected-work/every-frame.jpg" },
  { title: "Moments", category: "Photo Editing", year: "2024", place: "Indonesia", image: "/selected-work/moments.jpg" },
  { title: "Echoes", category: "Short Film", year: "2024", place: "Jakarta, Indonesia", image: "/selected-work/echoes.jpg" },
] as const;

const projectNumber = (index: number) => String(index + 1).padStart(2, "0");

function Preview({ index, floating = false }: { index: number; floating?: boolean }) {
  const project = projects[index];
  return (
    <div className={`relative flex aspect-[4/3.1] overflow-hidden bg-ink p-[clamp(16px,2.4vw,32px)] text-paper ${floating ? "w-48 shadow-2xl" : "w-full"}`}>
      <img key={index} src={project.image} alt={floating ? "" : project.title} className={`absolute inset-0 size-full object-cover ${floating ? "" : "animate-[img-in_1.2s_cubic-bezier(.16,.8,.3,1)_both] motion-reduce:animate-none"}`} />
      <i aria-hidden="true" className="absolute inset-0 bg-ink/30" />
      <span className="relative text-[9px] uppercase tracking-[.16em] text-paper/80">{project.category}</span>
      <span className="absolute bottom-[clamp(12px,2vw,28px)] right-[clamp(14px,2.4vw,32px)] font-display text-[clamp(3.8rem,10vw,8rem)] leading-none tracking-[-.06em] text-paper/90">{projectNumber(index)}</span>
      <i aria-hidden="true" className="absolute inset-[clamp(10px,1.6vw,20px)] border border-paper/15" />
    </div>
  );
}

export default function SelectedWork() {
  const [active, setActive] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const selected = projects[active];
  const list = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!list.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("li", { autoAlpha: 0, y: 16, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: list.current, start: "top 65%", once: true } });
    }, list);
    return () => context.revert();
  }, []);

  function movePeek(event: MouseEvent<HTMLUListElement>) {
    setPointer({ x: event.clientX, y: event.clientY });
  }

  return (
    <section id="work" aria-labelledby="selected-work-title" className="scroll-mt-16 bg-ink px-[clamp(18px,3.4vw,54px)] py-[clamp(72px,10vw,150px)] text-paper">
      <div className="mb-[clamp(30px,4.5vw,60px)] flex items-baseline justify-between gap-4 border-t border-paper/15 pt-4">
        <h2 id="selected-work-title" className="text-[10px] font-medium uppercase tracking-[.16em]">Selected Work</h2>
        <span className="text-[10px] uppercase tracking-[.16em] text-muted">01 — Index</span>
      </div>

      <div className="grid items-start gap-[clamp(24px,4.4vw,64px)] min-[901px]:grid-cols-[1.02fr_1fr]">
        <Preview index={active} />

        <div>
          <ul ref={list} aria-label="Projects" onMouseMove={movePeek} onMouseLeave={() => setPeek(null)} className="border-t border-paper/15">
            {projects.map((project, index) => {
              const isActive = index === active;
              return (
                <li key={project.title} className="border-b border-paper/15">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setPeek(index)}
                    className={`group relative grid w-full grid-cols-[20px_1fr_auto] items-center gap-[clamp(8px,2vw,22px)] py-[15px] text-left transition-[padding] duration-300 ease-out hover:pl-2 min-[621px]:grid-cols-[22px_1fr_auto_46px] ${isActive ? "text-paper" : "text-paper/45"}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span aria-hidden="true" className={`absolute -left-6 text-[13px] transition-all duration-300 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0"}`}>→</span>
                    <span className="text-[10.5px] text-paper/35">{projectNumber(index)}</span>
                    <span className="text-[clamp(11.5px,1.4vw,13px)] font-bold uppercase tracking-[.1em] text-paper">{project.title}</span>
                    <span className="hidden text-[11px] min-[621px]:block">{project.category}</span>
                    <span className="text-right text-[11px]">{project.year}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-[clamp(22px,3.6vw,40px)] flex items-baseline gap-2.5 overflow-hidden pt-1">
            <span key={active} className="animate-[rise_1.1s_cubic-bezier(.16,.8,.3,1)_both] motion-reduce:animate-none text-[clamp(3.4rem,8vw,6.4rem)] font-light leading-[.85] tracking-[-.03em]">{projectNumber(active)}</span>
            <span className="text-[clamp(1.1rem,2vw,1.6rem)] font-light text-paper/35">/ {projectNumber(projects.length - 1)}</span>
          </div>

          <div className="mt-[clamp(18px,3vw,30px)] border-t border-paper/15 pt-[18px]">
            <span className="block text-[10px] uppercase tracking-[.16em] text-paper/45">Selected Project</span>
            <div className="mt-2.5 overflow-hidden">
              <h3 key={active} className="animate-[rise_1.1s_.1s_cubic-bezier(.16,.8,.3,1)_both] text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold uppercase leading-none tracking-[.005em] motion-reduce:animate-none">{selected.title}</h3>
            </div>
            <p className="mt-1 text-[clamp(1rem,1.8vw,1.25rem)]">{selected.category}</p>
            <p className="mt-5 text-[11px] leading-5 text-paper/45">{selected.place}<br />{selected.year}</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-3 border-b border-paper pb-1 text-[10px] font-medium uppercase tracking-[.14em] transition-opacity hover:opacity-55">
              View project <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="mt-8 flex items-center gap-5">
            <span className="text-[10px] tracking-[.1em]"><b className="font-medium">{projectNumber(active)}</b> / {projectNumber(projects.length - 1)}</span>
            <span aria-label={`${active + 1} of ${projects.length} projects selected`} className="flex flex-1 gap-1.5">
              {projects.map((project, index) => <i key={project.title} className={`h-px flex-1 ${index <= active ? "bg-paper" : "bg-paper/15"}`} />)}
            </span>
          </div>
        </div>
      </div>

      {peek !== null && (
        <div aria-hidden="true" className="pointer-events-none fixed z-50 hidden -translate-x-1/2 -translate-y-1/2 min-[901px]:block" style={{ left: pointer.x, top: pointer.y }}>
          <Preview index={peek} floating />
        </div>
      )}
    </section>
  );
}
