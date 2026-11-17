import Reveal from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { EVENTS } from "../data/site";

export default function VenueHighlights() {
  return (
    <Section id="events" labelledBy="events-title" tone="charcoal">
      <Reveal>
        <SectionHeading id="events-title" eyebrow="Occasions" title="Make Your Events Special" />
      </Reveal>

      <ul className="mt-12 grid grid-cols-2 border-l border-t border-gold/25 md:grid-cols-3">
        {EVENTS.map((event, i) => (
          <li
            key={event}
            className="group border-b border-r border-gold/25 px-4 py-9 transition-colors duration-500 hover:bg-gold/10 sm:px-6 sm:py-14"
          >
            <Reveal delay={(i % 3) * 0.08}>
              <p className="text-balance font-display text-xl text-ivory transition-colors group-hover:text-gold sm:text-3xl">
                {event}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-ivory/70">
        Ask the team which occasions and dates are available.
      </p>
    </Section>
  );
}
