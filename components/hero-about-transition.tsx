"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import Hero from "@/components/hero";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAboutTransition({ portraitSrc }: { portraitSrc: string }) {
  const scene = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = scene.current;
    const fullBackground = backdrop.current;
    const bg = background.current;
    const aboutPin = document.querySelector<HTMLElement>("[data-about-pin]");
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!root || !fullBackground || !bg || !aboutPin) return;

    const syncHeaderHeight = () => root.style.setProperty("--site-header-height", `${header?.offsetHeight ?? 0}px`);
    const syncAboutPreview = (progress: number) => {
      const opacity = Math.min(1, Math.max(0, (progress - 0.38) / 0.56));
      document.documentElement.style.setProperty("--about-intro-opacity", String(opacity));
      syncAboutHandoff(progress);
    };
    const syncAboutHandoff = (progress: number) => {
      if (progress < 1 || aboutPin.getBoundingClientRect().top > 0) document.documentElement.dataset.aboutIntro = "true";
      else delete document.documentElement.dataset.aboutIntro;
    };
    syncHeaderHeight();
    syncAboutPreview(0);
    ScrollTrigger.addEventListener("refreshInit", syncHeaderHeight);

    const context = gsap.context(() => {
      gsap.set(fullBackground, { autoAlpha: 0 });
      gsap.set(bg, { scaleY: 0, transformOrigin: "center center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "hero-about-wipe",
          trigger: root,
          start: () => `top top+=${header?.offsetHeight ?? 0}`,
          // End exactly where the same About stage switches from fixed to sticky.
          end: () => aboutPin.getBoundingClientRect().top + window.scrollY,
          pin: true,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (trigger) => syncAboutPreview(trigger.progress),
          onRefresh: (trigger) => syncAboutPreview(trigger.progress),
        },
      });

      timeline
        .to(bg, { scaleY: 0.33, duration: 30, ease: "none" }, 0)
        .to(bg, { scaleY: 1, duration: 15, ease: "power2.inOut" }, 30)
        .set(fullBackground, { autoAlpha: 1 }, 44.8)
        .to(header, { color: "#f2f0ea", duration: 4 }, 43);

    }, root);

    let active = true;
    document.fonts?.ready.then(() => { if (active) ScrollTrigger.refresh(); });

    return () => {
      active = false;
      ScrollTrigger.removeEventListener("refreshInit", syncHeaderHeight);
      document.documentElement.style.removeProperty("--about-intro-opacity");
      delete document.documentElement.dataset.aboutIntro;
      context.revert();
    };
  }, []);

  return <div ref={scene} className="relative isolate h-[calc(100svh-var(--site-header-height,0px))] bg-paper">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-[var(--site-header-height,0px)] bg-paper" />
    <div className="relative z-[1] h-full"><Hero portraitSrc={portraitSrc} /></div>
    <div ref={backdrop} aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-[calc(-1*var(--site-header-height,0px))] z-[2] h-[100svh] bg-ink opacity-0" />
    <div ref={background} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[calc(-1*var(--site-header-height,0px))] z-[3] h-[100svh] origin-center bg-ink [transform:scaleY(0)] will-change-transform" />
  </div>;
}
