import { NAV, SITE, telLink, whatsappLink } from "../data/site";

const linkClass = "inline-flex min-h-[2.75rem] items-center transition-colors hover:text-gold";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-charcoal pb-[calc(2rem+env(safe-area-inset-bottom))] pt-14">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl tracking-[0.16em]">
            AL-RASHEED <span className="text-gold">PALACE</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/70">
            {SITE.addressLines}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-gold">Explore</h2>
          <ul className="mt-3 text-sm text-ivory/80">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-gold">Contact</h2>
          <ul className="mt-3 text-sm text-ivory/80">
            <li>
              <a href={telLink()} className={linkClass}>
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {SITE.instagramUrl && (
              <li>
                <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                </a>
              </li>
            )}
            {SITE.linkedinUrl && (
              <li>
                <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 w-full max-w-6xl border-t border-ivory/10 px-5 pt-6 text-xs text-ivory/60 sm:px-8">
        © {year} {SITE.name}. All rights reserved.
      </p>
    </footer>
  );
}
