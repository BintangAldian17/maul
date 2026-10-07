"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const email = "maulanarizkyy26@gmail.com";
const lines = ["Let’s make", "something worth", "remembering."];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "expo.out", duration: 1.6 }, scrollTrigger: { trigger: root.current, start: "top 55%", once: true } })
        .from("[data-line]", { yPercent: 105, stagger: 0.18 })
        .from("[data-cta]", { autoAlpha: 0, y: 12, duration: 1.2 }, "-=1")
        .from("[data-cta-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.4 }, "<0.2")
        .from("[data-fade]", { autoAlpha: 0, duration: 1.2 }, "<");
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="scroll-mt-16 bg-ink px-[clamp(18px,3.4vw,54px)] pt-[clamp(72px,10vw,150px)] text-paper">
      <div data-fade className="flex items-baseline justify-between gap-4 border-t border-paper/15 pt-4">
        <span className="text-[10px] font-medium uppercase tracking-[.16em]">Contact</span>
        <span className="text-[10px] uppercase tracking-[.16em] text-muted">02 — Contact</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-[clamp(28px,4vw,48px)] py-[clamp(56px,9vw,130px)]">
        <h2 id="contact-title" aria-label={lines.join(" ")} className="m-0 font-display text-[clamp(2.4rem,7vw,6rem)] font-normal uppercase leading-[1.02] tracking-[.005em]">
          {lines.map((line) => (
            <span key={line} aria-hidden="true" className="block overflow-hidden pb-[.06em]">
              <span data-line className="block">{line}</span>
            </span>
          ))}
        </h2>
        <a data-cta href={`mailto:${email}`} className="group relative inline-flex items-center gap-3.5 pb-1.5 text-[10.5px] uppercase tracking-[.22em]">
          Get in touch
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-3.5 transition-transform duration-400 ease-[cubic-bezier(.16,.8,.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
            <path d="M2 12L12 2M12 2H4.5M12 2v7.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <i data-cta-rule aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-paper/45 transition-colors group-hover:bg-paper" />
        </a>
      </div>

      <footer data-fade className="flex flex-wrap justify-between gap-4 border-t border-paper/15 py-[22px] text-[10px] uppercase tracking-[.1em] text-muted">
        <span>© 2026 Maulana Rizky. All rights reserved.</span>
        <a href={`mailto:${email}`} className="transition-colors hover:text-paper">{email}</a>
      </footer>
    </section>
  );
}
