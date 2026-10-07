"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Shot = {
  id: string;
  number: string;
  label: ReactNode;
  frame?: "portrait";
  ratio?: "poster" | "wide";
  className: string;
  depth: number;
  float: CSSProperties;
};

const shots: readonly Shot[] = [
  {
    id: "portrait",
    number: "01",
    label: "Portrait / 01",
    frame: "portrait",
    className: "left-[5%] top-0 z-[4] w-[54%] -rotate-[9.5deg] min-[561px]:w-1/2 min-[861px]:inset-auto min-[861px]:col-start-1 min-[861px]:row-start-1 min-[861px]:w-auto min-[861px]:rotate-0",
    depth: 9,
    float: { "--hero-float-duration": "7.5s", "--hero-float-delay": "0s" } as CSSProperties,
  },
  {
    id: "poster",
    number: "02",
    label: <>Poster<br />01</>,
    ratio: "poster",
    className: "right-[3%] top-[5%] z-[3] w-[44%] rotate-[11deg] min-[561px]:w-[40%] min-[861px]:inset-auto min-[861px]:col-start-3 min-[861px]:row-start-1 min-[861px]:w-auto min-[861px]:rotate-0",
    depth: 15,
    float: { "--hero-float-duration": "9.4s", "--hero-float-delay": ".9s", "--hero-float-wobble": "-.5deg" } as CSSProperties,
  },
  {
    id: "wide-one",
    number: "03",
    label: <>Photography<br />02</>,
    ratio: "wide",
    className: "bottom-[15%] left-[4%] z-[5] w-[60%] rotate-[6deg] min-[561px]:w-[56%] min-[861px]:inset-auto min-[861px]:col-span-2 min-[861px]:col-start-1 min-[861px]:row-start-2 min-[861px]:w-auto min-[861px]:max-w-full min-[861px]:justify-self-start min-[861px]:aspect-[16/9.2] min-[861px]:rotate-0",
    depth: 7,
    float: { "--hero-float-duration": "8.3s", "--hero-float-delay": ".45s", "--hero-float-wobble": ".35deg" } as CSSProperties,
  },
  {
    id: "wide-two",
    number: "04",
    label: <>Brand Identity<br />03</>,
    ratio: "wide",
    className: "bottom-[3%] right-[2%] z-[6] w-[56%] -rotate-[12deg] min-[561px]:w-[52%] min-[861px]:inset-auto min-[861px]:col-span-2 min-[861px]:col-start-3 min-[861px]:row-start-2 min-[861px]:w-auto min-[861px]:max-w-full min-[861px]:justify-self-end min-[861px]:aspect-[16/9.2] min-[861px]:rotate-0",
    depth: 12,
    float: { "--hero-float-duration": "10.2s", "--hero-float-delay": "1.3s", "--hero-float-wobble": "-.4deg" } as CSSProperties,
  },
];

function Slot({ label, ratio, front }: { label: ReactNode; ratio: Shot["ratio"]; front: boolean }) {
  return (
    <div data-hero-wipe className={`relative flex w-full items-center justify-center overflow-hidden border border-ink/15 bg-transparent min-[861px]:min-h-0 min-[861px]:flex-1 min-[861px]:aspect-auto max-[860px]:border-ink/25 max-[860px]:bg-paper/65 ${ratio === "poster" ? "aspect-[3/4.2]" : "aspect-[16/9.2]"} ${front ? "shadow-[0_20px_44px_rgba(21,19,15,.16)]" : ""}`}>
      <span className="absolute inset-x-3 top-1/2 h-px bg-ink/[.09]" />
      <span className="absolute inset-y-3 left-1/2 w-px bg-ink/[.09]" />
      <span className="relative z-10 bg-paper px-2.5 py-[5px] text-center text-[9px] uppercase tracking-[.16em] text-faint max-[860px]:text-[8.5px]">
        {label}
      </span>
    </div>
  );
}

function Portrait({ src, front }: { src: string; front: boolean }) {
  return (
    <div data-hero-wipe className={`relative aspect-[3/4] overflow-hidden bg-[#e8e5dd] min-[861px]:min-h-0 min-[861px]:flex-1 min-[861px]:aspect-auto ${front ? "shadow-[0_20px_44px_rgba(21,19,15,.16)]" : ""}`}>
      <img src={src} alt="Potret Maulana Rizky" className="size-full object-cover grayscale contrast-[1.04] brightness-[1.02] transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(.16,.8,.3,1)] hover:scale-[1.04] max-[860px]:opacity-[.66]" />
    </div>
  );
}

export default function Hero({ portraitSrc }: { portraitSrc: string }) {
  const root = useRef<HTMLElement>(null);
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  const topZ = useRef(10);
  const [front, setFront] = useState<string | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from("[data-hero-reveal]", {
          autoAlpha: 0,
          y: 14,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
        });
        gsap.from("[data-hero-wipe]", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
        });
      }
    }, root);
    return () => context.revert();
  }, []);

  function moveLayers(event: PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX / bounds.width - bounds.left / bounds.width - 0.5;
    const y = event.clientY / bounds.height - bounds.top / bounds.height - 0.5;
    shots.forEach(({ id, depth }) => {
      const layer = layers.current[id];
      if (layer) gsap.to(layer, { x: -x * depth, y: -y * depth * 0.7, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    });
  }

  function resetLayers() {
    Object.values(layers.current).forEach((layer) => {
      if (layer) gsap.to(layer, { x: 0, y: 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    });
  }

  function bringToFront(id: string) {
    topZ.current += 1;
    setFront(id);
    setZIndexes((current) => ({ ...current, [id]: topZ.current }));
  }

  return (
      <section id="top" ref={root} onPointerMove={moveLayers} onPointerLeave={resetLayers} className="relative flex h-full min-h-0 flex-col overflow-hidden px-[clamp(18px,3.4vw,54px)] pt-[clamp(10px,2vw,26px)]">
        <div className="absolute -left-[calc(clamp(18px,3.4vw,54px)-4px)] top-[120px] bottom-[90px] hidden w-4 flex-col items-center justify-between min-[1101px]:flex">
          <span className="rotate-180 whitespace-nowrap text-[9.5px] tracking-[.14em] text-muted [writing-mode:vertical-rl]">Based in Indonesia</span>
          <span className="rotate-180 whitespace-nowrap text-[9.5px] tracking-[.14em] text-muted [writing-mode:vertical-rl]">© 2026 Maulana Rizky</span>
        </div>

        <div className="relative mb-[58px] mt-1 min-h-0 flex-1 min-[861px]:mb-0 min-[861px]:grid min-[861px]:grid-cols-[clamp(180px,20vw,264px)_minmax(260px,1fr)_clamp(200px,23vw,300px)_clamp(110px,11vw,150px)] min-[861px]:grid-rows-[minmax(0,1.05fr)_minmax(0,.72fr)] min-[861px]:items-stretch min-[861px]:gap-x-[clamp(16px,2.6vw,38px)] min-[861px]:gap-y-[clamp(18px,3vh,36px)]">
          {shots.map((shot) => (
            <button
              type="button"
              key={shot.id}
              onClick={() => bringToFront(shot.id)}
              className={`absolute cursor-pointer text-left outline-none [transition:transform_.6s_cubic-bezier(.16,.8,.3,1)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink min-[861px]:relative min-[861px]:h-full min-[861px]:min-h-0 ${shot.className} ${front === shot.id ? "scale-[1.04]" : ""}`}
              style={{ zIndex: zIndexes[shot.id] }}
              aria-label={`Bring ${shot.number} to front`}
              data-hero-reveal
            >
              <div style={shot.float} className="[animation:float_var(--hero-float-duration,8s)_ease-in-out_var(--hero-float-delay,0s)_infinite] motion-reduce:animate-none min-[861px]:h-full">
                <div ref={(node) => { layers.current[shot.id] = node; }} className="will-change-transform min-[861px]:flex min-[861px]:h-full min-[861px]:min-h-0 min-[861px]:flex-col">
                  <p className="mb-1.5 text-[10px] tracking-[.1em] text-muted min-[861px]:mb-[9px]">{shot.number}</p>
                  {shot.frame === "portrait" ? <Portrait src={portraitSrc} front={front === shot.id} /> : <Slot label={shot.label} ratio={shot.ratio} front={front === shot.id} />}
                </div>
              </div>
            </button>
          ))}

          <div data-hero-reveal className="pointer-events-none absolute inset-x-0 top-[53%] z-20 -translate-y-1/2 min-[861px]:relative min-[861px]:inset-auto min-[861px]:col-start-2 min-[861px]:row-start-1 min-[861px]:self-center min-[861px]:translate-y-0 min-[861px]:py-[clamp(6px,3vw,40px)]">
            <h1 className="font-display text-[clamp(2.3rem,10.8vw,3.4rem)] leading-[.96] tracking-[-.015em] text-balance min-[861px]:text-[clamp(2.7rem,7.4vw,6.6rem)]">Visual<br />Designer &amp;<br />Photographer</h1>
          </div>

          <div data-hero-reveal className="absolute left-0 right-0 top-full z-20 mt-3.5 min-[861px]:relative min-[861px]:inset-auto min-[861px]:col-start-4 min-[861px]:row-start-1 min-[861px]:mt-0 min-[861px]:self-center min-[861px]:pt-[clamp(40px,8vw,120px)]">
            <ul className="flex flex-wrap gap-x-2.5 text-[11.5px] leading-6 min-[861px]:block min-[861px]:text-xs">
              {["Graphic Design", "Photography", "Motion & Video", "Photo Editing"].flatMap((item, index) => [
                <li key={item} className="py-0.5 min-[861px]:py-[7px]">{item}</li>,
                index < 3 && <li key={`${item}-separator`} aria-hidden="true" className="py-0.5 text-faint min-[861px]:py-0">—</li>,
              ])}
            </ul>
          </div>
        </div>

        <div data-hero-reveal className="flex flex-none flex-col items-center gap-2.5 py-[clamp(14px,2.5vh,28px)_clamp(18px,3vh,32px)]">
          <span className="text-[10px] font-medium uppercase tracking-[.16em] text-muted">Scroll to explore</span>
          <svg aria-hidden="true" viewBox="0 0 15 44" fill="none" className="h-[30px] w-[15px] [animation:drift_2.6s_ease-in-out_infinite] motion-reduce:animate-none min-[561px]:h-11">
            <path d="M7.5 0v40M1 34l6.5 8 6.5-8" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </section>
  );
}
