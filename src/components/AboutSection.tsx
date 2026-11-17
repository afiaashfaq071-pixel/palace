import Reveal from "./Reveal";
import RatingStars from "./RatingStars";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SmartImage from "./SmartImage";
import { IMAGES, SITE } from "../data/site";

export default function AboutSection() {
  return (
    <Section id="about" labelledBy="about-title" tone="ivory">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <SectionHeading
            id="about-title"
            eyebrow="The Palace"
            title="An Elegant Destination for Your Special Moments"
            onLight
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80">
            Al-Rasheed Palace is a wedding and event venue on Daska Road in Sambrial, near
            Malkhanwala Bus Stop. For dates and event details, speak with the management team
            directly.
          </p>

          <div className="mt-8 border-t border-ink/15 pt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <RatingStars value={SITE.rating} />
              <p className="text-sm text-ink/85">
                <span className="font-medium">{SITE.rating} out of 5</span> on Google from{" "}
                {SITE.reviews} reviews
              </p>
            </div>
            {!SITE.ratingVerified && (
              <p className="mt-2 text-xs text-ink/65">
                As listed on Google Maps. Figures may change.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-2xl shadow-xl shadow-ink/15">
            <SmartImage
              image={IMAGES.about}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
