import { Navigation } from "lucide-react";
import Reveal from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { SITE, isSafeMapEmbed } from "../data/site";

export default function LocationSection() {
  const mapUrl = isSafeMapEmbed(SITE.mapEmbedUrl) ? SITE.mapEmbedUrl : null;
  const hasMap = mapUrl !== null;

  return (
    <Section id="location" labelledBy="location-title" tone="ivory">
      <div className={hasMap ? "grid items-center gap-12 md:grid-cols-2" : "max-w-2xl"}>
        <Reveal>
          <SectionHeading
            id="location-title"
            eyebrow="Location"
            title="Find Us in Sambrial"
            onLight
          />
          <address className="mt-8 border-l-2 border-gold pl-5 not-italic">
            <p className="font-display text-2xl tracking-wide sm:text-3xl">{SITE.name}</p>
            <p className="mt-2 max-w-sm text-base leading-relaxed text-ink/80">
              {SITE.addressLines}
            </p>
          </address>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark mt-8 w-full sm:w-auto"
          >
            <Navigation size={16} aria-hidden="true" /> Get Directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </Reveal>

        {/* Renders only after the exact pin is verified (see data/site.ts). */}
        {mapUrl && (
          <Reveal delay={0.15}>
            <iframe
              title="Map showing Al-Rasheed Palace in Sambrial"
              src={mapUrl}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl border-0 shadow-xl shadow-ink/15"
            />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
