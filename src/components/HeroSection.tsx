import { m } from "framer-motion";
import { MapPin } from "lucide-react";
import SmartImage from "./SmartImage";
import { IMAGES, SITE } from "../data/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      {/* Slow, gentle zoom on the background photograph. */}
      <m.div
        className="absolute inset-0 -z-20"
        style={{ willChange: "transform" }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 20, ease: "linear" }}
      >
        <SmartImage
          image={IMAGES.hero}
          loading="eager"
          fetchPriority="high"
          placeholderVariant="hero"
          sizes="100vw"
          className="h-full w-full"
        />
      </m.div>

      {/* One even tint plus a bottom scrim keeps the text readable on any photograph. */}
      <div className="absolute inset-0 -z-10 bg-ink/35" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink via-ink/70 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
        <m.p
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <MapPin size={14} aria-hidden="true" /> {SITE.locationShort}
        </m.p>

        <m.h1
          id="hero-title"
          className="mt-5 font-display text-[clamp(2.1rem,11vw,3.5rem)] leading-[1.05] tracking-[0.03em] text-ivory sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
        >
          AL-RASHEED
          <span className="block text-gold">PALACE</span>
        </m.h1>

        <m.p
          className="mt-6 max-w-xl text-balance font-display text-xl italic text-ivory/90 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
        >
          “{SITE.tagline}”
        </m.p>

        <m.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
        >
          <a href="#about" className="btn btn-gold sm:min-w-[11rem]">
            Explore Our Venue
          </a>
          <a href="#contact" className="btn btn-outline sm:min-w-[11rem]">
            Contact Us
          </a>
        </m.div>
      </div>
    </section>
  );
}
