"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Observer, ScrollTrigger);

export type AboutImages = readonly [string, string, string, string];

// Tuning knobs for the step machine.
const STEP_COOLDOWN = 700; // ms between points; also the pace of a long, held scroll
// Scroll length the stage stays pinned over. The wheel never traverses it (the
// Observer swallows it) -- it only has to be far wider than one wheel tick so
// entering and leaving can never be skipped in a single frame.
const LOCK_LENGTH = "100%";

type Step = { number: string; label: ReactNode; caption: string };

const steps: readonly Step[] = [
  {
    number: "01",
    label: (
      <>
        Photo
        <br />
        graphy
      </>
    ),
    caption: "Photography",
  },
  {
    number: "02",
    label: (
      <>
        Image
        <br />
        Making
      </>
    ),
    caption: "Image Making",
  },
  {
    number: "03",
    label: (
      <>
        GRAPHIC
        <br />
        DESIGN
      </>
    ),
    caption: "Graphic Design",
  },
  {
    number: "04",
    label: (
      <>
        Motion
        <br />
        Film
      </>
    ),
    caption: "Motion / Film",
  },
];

const facts = [
  ["Based in", "Indonesia"],
  ["Disciplines", "Graphic Design, Photography, Photo Editing, Motion / Video"],
  ["Tools", "Photoshop, Illustrator, Premiere Pro, CapCut"],
  ["Education", "Universitas Indraprasta PGRI — Visual Communication Design"],
  ["Available for", "Freelance, Commission, Collaboration"],
] as const;

function Label({
  step,
  active,
  side = "left",
}: {
  step: Step;
  active: boolean;
  side?: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col gap-[clamp(10px,1.8vh,18px)] ${side === "left" ? "items-end text-right origin-right" : "items-start text-left origin-left"} ${active ? "scale-[1.4] text-paper" : "scale-100 text-paper/25"} transition-[color,transform] duration-700 ease-out motion-reduce:transform-none`}
    >
      <span
        className={`flex items-center gap-2 text-[9.5px] tracking-[.1em] ${side === "right" ? "flex-row-reverse" : ""}`}
      >
        <b className="font-normal">{step.number}</b>
        <i
          className={`h-px bg-current transition-[width] duration-700 ${active ? "w-12" : "w-[26px]"}`}
        />
      </span>
      <div className="font-display text-[clamp(1.5rem,3.9vw,3.2rem)] leading-none tracking-[.005em]">
        {step.label}
      </div>
    </div>
  );
}

function MobileLabel({
  step,
  image,
  active,
}: {
  step: Step;
  image: string;
  active: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div
        className={`font-display leading-none tracking-[.005em] transition-[color,transform] duration-700 ${active ? "scale-[1.26] text-[clamp(1.7rem,7vw,2.75rem)] text-paper" : "scale-100 text-[clamp(1.35rem,6vw,2.2rem)] text-paper/20"} motion-reduce:transform-none`}
      >
        {step.label}
      </div>
      {active && (
        <figure className="mt-3 w-[min(54vw,220px)] animate-[img-in_.8s_cubic-bezier(.16,.8,.3,1)_both]">
          <div className="aspect-[1/1.12] overflow-hidden bg-paper/10">
            <img
              src={image}
              alt=""
              className="size-full object-cover grayscale contrast-[1.06]"
            />
          </div>
          <figcaption className="mt-2.5 text-[9px] uppercase tracking-[.16em] text-paper/45">
            {step.number} — {step.caption}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

export default function About({ images }: { images: AboutImages }) {
  const pinWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const bio = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!bio.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 }, scrollTrigger: { trigger: bio.current, start: "top 65%", once: true } })
        .from("[data-bio-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.6 })
        .from("[data-bio-text]", { autoAlpha: 0, y: 24 }, "<0.2")
        .from("[data-bio-fact]", { autoAlpha: 0, y: 16, duration: 1.2, stagger: 0.1 }, "<0.15");
    }, bio);
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const pin = pinWrap.current;
    if (!pin) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Touch: iOS momentum keeps scrolling after the finger lifts and can't be
    // preventDefault-ed, so the step lock gets flung straight through. Drive the
    // steps from native scroll progress instead, snapping to each one.
    if (window.matchMedia("(pointer: coarse)").matches) {
      const last = steps.length - 1;
      const touchLock = ScrollTrigger.create({
        id: "about-steps",
        trigger: pin,
        start: "top top",
        end: `+=${steps.length * 75}%`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power2.inOut" },
        onUpdate: (self) => setActive(Math.round(self.progress * last)),
      });
      return () => touchLock.kill();
    }

    const cooldown = motion.matches ? 0 : STEP_COOLDOWN;
    let current = 0;
    let readyAt = 0;
    let bypassUntil = 0;
    let anchor = 0;

    // Step past either end: hand scrolling back by moving clear of the pin.
    const leave = (direction: number) => {
      observer.disable();
      window.scrollTo({
        top: direction > 0 ? lock.end + 2 : lock.start - 2,
        behavior: "instant",
      });
      ScrollTrigger.update();
    };
    // Gated by a clock and nothing else. The previous version also held a
    // "one step per gesture" latch that every wheel event kept re-arming, so with
    // the wheel already preventDefault-ed the page could freeze outright.
    const advance = (direction: number) => {
      if (!observer.isEnabled) return;
      const now = performance.now();
      if (now < readyAt) return;
      readyAt = now + cooldown;
      const next = current + direction;
      if (next < 0 || next >= steps.length) return leave(direction);
      current = next;
      setActive(current);
    };
    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      preventDefault: true,
      allowClicks: true,
      lockAxis: true,
      tolerance: 12,
      wheelSpeed: -1,
      ignoreCheck: (event) => event instanceof WheelEvent && event.ctrlKey,
      onUp: () => advance(1),
      onDown: () => advance(-1),
    });
    observer.disable();

    // ScrollTrigger owns the boundary; measuring it by hand was unreliable because
    // the hero wipe pins with pinSpacing:false, which moves this stage's offset.
    const lock = ScrollTrigger.create({
      id: "about-steps",
      trigger: pin,
      start: "top top",
      end: `+=${LOCK_LENGTH}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (!self.isActive) return observer.disable();
        if (performance.now() < bypassUntil) return;
        current = self.direction < 0 ? steps.length - 1 : 0;
        setActive(current);
        // Park just inside the edge we came through; the stage is pinned, so
        // this is invisible.
        anchor = self.direction < 0 ? self.end - 1 : self.start + 1;
        self.scroll(anchor);
        // Let the gesture that carried us in finish before the first step.
        readyAt = performance.now() + cooldown;
        observer.enable();
      },
      // Chrome keeps animating a smooth-scroll from wheel ticks that landed
      // before the lock engaged; a fast flick could drift through the whole pin
      // and drop the remaining steps. Hold the page still while locked.
      onUpdate: (self) => {
        if (observer.isEnabled && Math.abs(self.scroll() - anchor) > 1) self.scroll(anchor);
      },
    });

    // Preserve anchor navigation and keyboard control.
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest?.('a[href*="#"]')) {
        bypassUntil = performance.now() + 1500;
        observer.disable();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (!observer.isEnabled || (event.target as Element).closest?.("a,button,input,textarea,select,[contenteditable]")) return;
      if (event.key === "Escape") return leave(1);
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1)
        : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      if (!event.repeat) { readyAt = 0; advance(direction); }
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      observer.kill();
      lock.kill();
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <section
        id="about"
        aria-labelledby="about-title"
        className="bg-ink px-[clamp(18px,3.4vw,54px)] text-paper"
      >
        <h2 id="about-title" className="sr-only">
          About Maulana Rizky
        </h2>
        <div
          ref={pinWrap}
          data-about-pin
          className="relative h-[100svh]"
        >
          <div className="about-stage sticky top-0 flex h-[100svh] items-center justify-center py-[clamp(54px,8vh,86px)_clamp(18px,4vh,46px)]">
            <div className="grid w-full max-w-[1160px] grid-cols-[1fr_auto_1fr] items-center gap-x-[clamp(14px,3vw,46px)] gap-y-[clamp(14px,3.2vh,44px)] max-[860px]:hidden">
              <div className="col-start-1 row-start-1 justify-self-end">
                <Label step={steps[0]} active={active === 0} />
              </div>
              <div className="col-start-3 row-start-1 justify-self-start">
                <Label step={steps[1]} active={active === 1} side="right" />
              </div>
              <div className="col-start-1 row-start-2 justify-self-end">
                <Label
                  step={{ ...steps[2], label: <>GRAPHIC</> }}
                  active={active === 2}
                />
              </div>
              <div className="col-start-3 row-start-2 justify-self-start">
                <Label
                  step={{ ...steps[2], label: <>DESIGN</> }}
                  active={active === 2}
                  side="right"
                />
              </div>
              <div className="col-start-1 row-start-3 justify-self-end">
                <Label step={steps[3]} active={active === 3} />
              </div>
              <div className="relative col-start-2 row-span-3 row-start-1 aspect-[1/1.12] w-[min(300px,23vw)] overflow-hidden bg-paper/10">
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt=""
                    className={`absolute inset-0 size-full object-cover grayscale contrast-[1.06] transition-opacity duration-500 ${active === index ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full max-w-[260px] flex-col items-center gap-[clamp(8px,1.6vh,18px)] min-[861px]:hidden">
              {steps.map((step, index) => (
                <MobileLabel
                  key={step.caption}
                  step={step}
                  image={images[index]}
                  active={active === index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        ref={bio}
        aria-labelledby="about-biography"
        className="relative bg-ink px-[clamp(18px,3.4vw,54px)] pb-[clamp(72px,10vw,150px)] pt-[clamp(56px,8vw,110px)] text-paper"
      >
        <h2 id="about-biography" className="sr-only">
          About Maulana Rizky
        </h2>
        <div className="relative mx-auto grid max-w-[1160px] gap-[clamp(42px,7vw,90px)] pt-[clamp(30px,4vw,52px)] min-[821px]:grid-cols-[1.06fr_1fr]">
          <i data-bio-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-paper/15" />
          <p data-bio-text className="m-0 max-w-[680px] font-display text-[clamp(1.5rem,2.5vw,2.15rem)] leading-[1.42] tracking-[-.012em] text-paper/90">
            Maulana Rizky is a visual designer and photographer based in
            Indonesia. His practice moves between graphic design, photography,
            image-making and motion. He is interested in creating work that is
            visually considered, emotionally resonant, and rooted in story.
          </p>
          <dl className="border-t border-paper/15">
            {facts.map(([label, value]) => (
              <div
                key={label}
                data-bio-fact
                className="grid gap-2 border-b border-paper/15 py-4 min-[481px]:grid-cols-[118px_1fr] min-[481px]:gap-4"
              >
                <dt className="pt-0.5 text-[10px] uppercase tracking-[.16em] text-paper/45">
                  {label}
                </dt>
                <dd className="m-0 text-[clamp(13.5px,1vw,15.5px)] leading-[1.55] text-paper/85">
                  {value}
                </dd>
              </div>
            ))}
            <div data-bio-fact className="grid gap-2 border-b border-paper/15 py-4 min-[481px]:grid-cols-[118px_1fr] min-[481px]:gap-4">
              <dt className="pt-0.5 text-[10px] uppercase tracking-[.16em] text-paper/45">
                Email
              </dt>
              <dd className="m-0 text-[clamp(13.5px,1vw,15.5px)] leading-[1.55]">
                <a
                  href="mailto:maulanarizkyy26@gmail.com"
                  className="border-b border-paper/25 pb-0.5 text-paper/85 transition-colors hover:border-paper"
                >
                  maulanarizkyy26@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
