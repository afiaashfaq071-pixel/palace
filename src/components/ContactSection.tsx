import { Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { SITE, telLink, whatsappLink } from "../data/site";

interface ButtonProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  primary?: boolean;
  external?: boolean;
}

function ContactButton({ href, icon, children, primary = false, external = false }: ButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`btn w-full sm:w-auto sm:min-w-[12rem] ${primary ? "btn-gold" : "btn-outline"}`}
    >
      {icon}
      {children}
    </a>
  );
}

export default function ContactSection() {
  return (
    <Section id="contact" labelledBy="contact-title" tone="ink">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Let's Make Your Celebration Special"
            align="center"
          />
          <p className="mx-auto mt-6 max-w-md text-base text-ivory/75">
            Speak with the management team directly about dates and booking details.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <ContactButton href={telLink()} primary icon={<Phone size={17} aria-hidden="true" />}>
              Call {SITE.phoneDisplay}
            </ContactButton>
            <ContactButton
              href={whatsappLink()}
              external
              icon={<MessageCircle size={17} aria-hidden="true" />}
            >
              WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </ContactButton>
            {SITE.instagramUrl && (
              <ContactButton
                href={SITE.instagramUrl}
                external
                icon={<Instagram size={17} aria-hidden="true" />}
              >
                Instagram
              </ContactButton>
            )}
            {SITE.linkedinUrl && (
              <ContactButton
                href={SITE.linkedinUrl}
                external
                icon={<Linkedin size={17} aria-hidden="true" />}
              >
                LinkedIn
              </ContactButton>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
