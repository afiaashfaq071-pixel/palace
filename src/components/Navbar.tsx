import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "../data/site";

const DESKTOP_QUERY = "(min-width: 768px)";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  // Browsers drop focus to <body> the moment CSS hides the element that had it, which can
  // happen before any resize handler runs. So remember whether focus was inside the header.
  const focusInHeader = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // True when keyboard focus is somewhere that is about to be hidden.
  const focusIsInMenu = useCallback(
    () => !!menuRef.current?.contains(document.activeElement),
    [],
  );

  // Choosing a link: close the menu and move focus to the section that was chosen, so focus is
  // never left on a link that has just been hidden.
  const handleLink = useCallback((href: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(href)?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    // Escape: close and give focus to the menu button, which stays visible on phones.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // Tapping outside: close. The tap itself decides where focus goes.
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        focusInHeader.current = false;
        setOpen(false);
      }
    };
    // Growing to desktop width hides both the menu and its button, so move focus to the logo.
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (!e.matches) return;
      const active = document.activeElement;
      const focusLost = active === document.body && focusInHeader.current;
      if (focusLost || focusIsInMenu() || active === toggleRef.current) {
        logoRef.current?.focus();
      }
      setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, focusIsInMenu]);

  return (
    <header
      ref={headerRef}
      onFocus={() => {
        focusInHeader.current = true;
      }}
      onBlur={(e) => {
        const next = e.relatedTarget;
        if (next instanceof Node && !e.currentTarget.contains(next)) focusInHeader.current = false;
      }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8"
      >
        <a
          ref={logoRef}
          href="#top"
          className="min-w-0 whitespace-nowrap font-display text-[0.95rem] tracking-[0.12em] text-ivory sm:text-xl sm:tracking-[0.18em]"
        >
          AL-RASHEED <span className="text-gold">PALACE</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-[2.75rem] items-center text-sm tracking-wide text-ivory/80 transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="icon-btn -mr-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      <ul
        id="mobile-menu"
        ref={menuRef}
        className={`max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-gold/20 px-5 pb-6 sm:px-8 md:hidden ${open ? "block" : "hidden"}`}
      >
        {NAV.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={() => handleLink(item.href)}
              className="flex min-h-[3.5rem] items-center border-b border-ivory/10 font-display text-2xl text-ivory"
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className="pt-4 text-xs uppercase tracking-[0.25em] text-ivory/60">
          {SITE.locationShort}
        </li>
      </ul>
    </header>
  );
}
