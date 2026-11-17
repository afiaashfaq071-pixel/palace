# Review, fixes and upgrade (v1.1.0)

## 1. Bugs found in v1.0

| # | Area | Problem |
| --- | --- | --- |
| 1 | Gallery | Placeholder tiles were clickable and opened an empty placeholder in the lightbox. |
| 2 | Lightbox | No focus management: focus was not moved in, trapped or restored on close. |
| 3 | Lightbox | Scroll lock reset `body.style.overflow` to an empty string instead of restoring the previous value; page shifted by the scrollbar width. |
| 4 | Lightbox | Image used a fixed 4:3 box with `max-h`, which could distort or overflow on short phones; prev/next arrows sat on the image edges and were hard to reach on mobile; no swipe. |
| 5 | About | Rating drew 4 filled stars and 1 empty star, so 4.5 looked like 4. |
| 6 | About / SEO | Rating and review count were shown as plain fact, and `aggregateRating` (4.5 / 135) was published in structured data and the meta description. |
| 7 | SEO | `og:image` pointed to a file that does not exist; structured data lived as hard-coded text in `index.html`, outside `site.ts`. |
| 8 | Hero | Heading `text-5xl` was too wide for 320px screens; three overlapping gradient layers hurt photo visibility. |
| 9 | Navigation | Mobile menu did not return focus on Escape, did not close on outside tap or when resizing to desktop; `aria-controls` pointed at an element that did not exist while closed; logo could overflow at 320px. |
| 10 | Motion | Framer Motion animations ignored `prefers-reduced-motion` (only CSS animations were covered). |
| 11 | Location | With no verified map, the section left an empty right column on desktop. |
| 12 | Contrast | Gold eyebrow text on ivory (about 2.2:1) and 40% ivory text on charcoal (about 3.6:1) failed WCAG AA. |
| 13 | Console | No favicon, so browsers requested `/favicon.ico` and logged a 404. |
| 14 | Contact / Footer | Footer links and buttons were below comfortable tap size; no skip link. |

## 2. Fixed

All of the above. Specifically:

- Gallery tiles are disabled until their real photo loads. The lightbox only lists loaded photos.
- Lightbox: Escape, Left and Right arrows, Tab focus trap, focus moves in and returns to the tile, scroll lock restores prior styles, swipe on touch, prev/next in a bottom bar, image sized with `svh` and `object-contain`.
- Rating shows a true half star (`RatingStars`), is labelled "as listed on Google Maps" until `ratingVerified` is set to `true`, and is no longer in structured data or meta tags.
- SEO tags and JSON-LD are generated from `site.ts` by a small plugin in `vite.config.ts`. They contain no phone number, rating or review count. `og:image`, canonical and `og:url` are written only when `siteUrl` is set and the image file exists.
- Hero heading uses a fluid size that fits 320px. One even tint plus one bottom scrim replaces three gradients.
- Navbar: Escape, outside tap and resize close the menu; focus returns to the toggle; menu stays mounted so `aria-controls` is valid.
- `MotionConfig reducedMotion="user"` covers all Framer Motion animation.
- Location is a left-aligned address block with a full-width mobile button; the map appears only when `mapEmbedUrl` is set.
- Darker gold (`gold-deep`) for small text on ivory; small light text raised to at least 60% opacity.
- Inline SVG favicon, skip-to-content link, 44px+ tap targets, `sr-only` "opens in a new tab" notes.

## 3. Design improvements

- New drawn arch placeholder (not a photo) with a clear caption, in the same box as the real image so nothing shifts.
- Gallery grid with no gaps: one large tile plus five squares on desktop; wide, two pairs and a wide tile on mobile.
- Shared `Section`, `SectionHeading` and `.btn` styles give identical spacing and buttons everywhere.
- Footer reorganised into brand, Explore and Contact columns with a separate copyright line.
- Events section kept to a hairline grid; added one line inviting visitors to ask the team about dates.

## 4. Information that needs management confirmation

See `CONFIRMATION_CHECKLIST` in `src/data/site.ts`:

- Phone / WhatsApp number +92 320 2752352
- Address wording
- Google rating 4.5 and 135 reviews (set `ratingVerified: true` once confirmed)
- Event categories (Mehndi, Baraat, Walima and others are suggestions)
- Exact Google Business Profile link, and map embed URL
- Official Instagram and LinkedIn accounts, if any
- Real photographs, including `og-image.jpg`
- Public website address (`siteUrl`)

No prices, capacity, packages, opening hours, owner names, email addresses or reviews appear anywhere.

## 5. Build and testing results

Package installs are blocked in the environment this was edited in, so these were NOT run:
`npm install`, `npm run build` (including `tsc` strict type-checking and the Vite production build), and any test in a real browser or at 320, 375, 430, tablet, laptop or desktop widths.

What was actually run:

- All source files bundled with esbuild (confirms every `.tsx`/`.ts` file parses and all imports resolve). Framer Motion and Lucide were replaced by simple stand-ins for this check.
- The whole app rendered to HTML on the server with React 19 (the project pins React 18) and checked: every `#` link has a matching id (`#main #top #about #gallery #events #location #contact`), one `h1`, seven `h2`, each section's `aria-labelledby` resolves, telephone and WhatsApp links are correctly formed, external links carry `rel="noopener"`, copyright year is current, half-star overlay is 50% wide, no forms or inputs, no Instagram/LinkedIn/map rendered, no `undefined` or `NaN` text.
- The SEO plugin was run against `index.html`: tags generated, no rating or phone, no `og:image` without `siteUrl` and a file.

## 6. Remaining limitations

- Run `npm install && npm run build` first. If TypeScript reports anything, it needs a quick fix; I could not check strict types here.
- Gallery open/close, focus trap, swipe, scroll lock, menu behaviour and animations are written but unverified in a browser.
- Images are used as supplied (no resizing pipeline). Export photos at the sizes in `public/images/README.txt`.
- Placeholders cannot be replaced by AI or stock photos; real venue photographs are still needed.
- Google Maps embed and exact directions link need the verified business listing.
