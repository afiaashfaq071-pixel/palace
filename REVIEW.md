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

## 7. Mobile hero image (v1.2.0)

- `IMAGES.hero` in `src/data/site.ts` now has an optional `mobileSrc` (`/images/hero-mobile.webp`).
- `SmartImage` renders a `<picture>`: the portrait image below 768px, the unchanged `hero-night.jpg` from 768px up.
- If `hero-mobile.webp` is missing, phones fall back to `hero-night.jpg` instead of showing a placeholder.
- The hero box is fixed to the screen (`absolute inset-0`), so swapping images causes no layout shift.
- Phone-only tweaks in `HeroSection.tsx`: focal point `50% 35%` for the fallback crop, a slightly lighter tint and a shorter bottom scrim so more of the building shows. Desktop classes are unchanged.
- Export the portrait image at 4:5 or 3:4 (about 1080x1440) with the palace entrance centred in the upper two thirds; the text and buttons sit over the bottom third.

## 8. Mobile audit (v1.3.0)

Fixed:
- Hero heading was stuck at 16px on phones: `text-[clamp(...)]` is ambiguous in Tailwind. Now `text-[length:clamp(2.1rem,11vw,3.5rem)]` (35px at 320px up to 47px at 430px).
- Desktop nav links were 17px tall (too small to tap on tablets). Hit area is now 44px; their look is unchanged.
- Section spacing on phones reduced (`py-16`, desktop still `py-28`).
- Events grid: smaller text and padding below 400px so "Celebrations" never clips at 320px.
- Mobile menu cannot grow taller than the screen (scrolls inside if needed).
- Removed `viewport-fit=cover` so content never sits under a phone notch in landscape.
- Build now adds `<link rel="preload">` for the hero image actually used (portrait below 768px, landscape above) when the files exist, so the hero starts loading before React runs.

Desktop (768px and up) classes are unchanged apart from the invisible nav hit-area increase.

Tested in Chromium at 320, 360, 375, 390, 414, 430, 768, 1024, 1366, 1920px, rendering the real components with the project's CSS classes: no horizontal overflow, no element wider than the screen, no clipped text, no distorted images, no tap target under 44px, logo and menu button never overlap, correct hero image at each width, no script errors.
Interactions tested (390px, touch): menu open/close, Escape, outside tap, link closes menu and heading lands below the navbar; gallery open, counter, arrow keys, Next/Previous with wrap-around, swipe, Tab focus trap, close button, Escape, scroll lock and restore, focus returns to the tile; phone, WhatsApp and directions links; every in-page link has a target.

How the test differed from production: Framer Motion and Lucide were replaced by simple stand-ins (animations and icon drawings not tested), Tailwind 4 compiled the CSS (the project pins 3), fonts were the fallback fonts (Cormorant Garamond and Jost could not be downloaded), and the photos were plain coloured test images. `npm run build` was not run.

Not done / still needed:
- Real photographs, including the portrait `hero-mobile.webp` (1080x1350 or 1080x1440). Until then phones show `hero-night.jpg`, or a placeholder if that is missing too.
- The live site (palace-steel.vercel.app) could not be opened from this environment, so this was checked against the project files, not the deployed page.
- Social links: none are shown, because no official accounts are confirmed.
- Map: not embedded until the exact business location is verified; the Get Directions button works.

## 9. Code audit and bug fixes (v1.4.0)

### Bugs found and fixed
| # | Bug | Fix |
| --- | --- | --- |
| 1 | Lightbox gave focus back to the tile while the dialog was still fading out. | Focus is restored when the dialog is removed, after the exit animation. Verified: focus stays inside the dialog during the fade and lands on the tile afterwards. |
| 2 | Page behind the lightbox was still reachable by keyboard and screen readers. | Dialog is rendered in a portal on `<body>` and `#root` is set `inert` while open (released on close). |
| 3 | Mobile menu: choosing a link left focus on a link that had just been hidden. | Focus moves to the chosen section (sections are `tabIndex={-1}` focus targets, outline hidden). |
| 4 | Growing the window to desktop width could leave focus on the hidden menu or button; the browser drops focus before any handler runs. | Header remembers whether it held focus and moves focus to the logo link. Found by the new browser test (it failed once, then passed after the fix). |
| 5 | Resizing from desktop to phone width with `hero-mobile.webp` missing left a broken hero image and no placeholder (the browser does not report the failed file). | `SmartImage` checks the portrait file directly at phone width and falls back to `hero-night.jpg`. Found by the new browser test. |
| 6 | `npm run build` did not type-check the vite config, plugin or tests. | `typecheck` now also runs `tsconfig.node.json`; `build` runs `typecheck` first. |
| 7 | `vite.config.ts` needed `vitest/config` for its `test` section. | Fixed. |
| 8 | Fonts blocked first paint; unused font weights were downloaded. | Font stylesheet loads without blocking; dropped unused weights (Jost 300, Cormorant 600). |
| 9 | The map iframe accepted any URL. | Only `https://www.google.com/maps/embed...` is rendered, with a `sandbox` attribute. |
| 10 | `robots.txt` was static and there was no sitemap. | `robots.txt` and `sitemap.xml` are generated at build time from `siteUrl` in `site.ts`; the sitemap and the `Sitemap:` line appear only once `siteUrl` is set. |

### New files
`.gitignore`, `eslint.config.js`, `tsconfig.node.json`, `vite-plugins/seo.ts` (moved out of `vite.config.ts` so it can be tested), `tests/site.test.ts`, `tests/seo.test.ts`.

### Modified files
`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/data/site.ts`, `src/components/Lightbox.tsx`, `GallerySection.tsx`, `Navbar.tsx`, `SmartImage.tsx`, `Section.tsx`, `HeroSection.tsx`, `LocationSection.tsx`, `README.md`, this file. Removed: `public/robots.txt` (now generated).

### Checked, no change needed
No `dangerouslySetInnerHTML`, `innerHTML` or `eval`; every new-tab link has `rel="noopener noreferrer"`; no third-party scripts; every event listener has a matching cleanup; hook dependency lists are complete; no unused imports or variables (`noUnusedLocals` passes); no `any`.

### Test results (what was actually run)
- **Unit tests: 25 of 25 pass** (`tests/`). Vitest is not installed here, so they were run with a minimal stand-in for the Vitest functions. I broke the WhatsApp number on purpose and a test failed, so they can fail. Please run `npm test` for the real Vitest run.
- **Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`): no errors** for `src` and for the Node-side files. Real React, Framer Motion, Lucide, Vite and Vitest type packages are not installed here, so those were replaced by small hand-written type stand-ins. Treat as a partial check and run `npm run typecheck`.
- **Browser tests in Chromium: 36 of 36 pass**, run three times: lightbox isolation and focus timing, six menu-focus cases, hero image with and without each file at phone and desktop width, layout shift (0), and resize behaviour. Framer Motion was replaced by a stand-in that keeps the dialog on screen for 250ms after closing, to imitate the exit animation.
- **Layout at 320, 360, 375, 390, 414, 430, 768, 1024, 1366 and 1920px: clean** (no overflow, clipped text, distortion, small tap targets or overlap), plus the earlier 31 interaction checks.

### Not done or not verified
- **`package-lock.json` was not generated** and `npm audit` was not run: the npm registry is unreachable from here. Run `npm install` once, commit the lock file, then run `npm audit`.
- **`npm run build`, `npm run lint` and the real Vitest run were not executed** (packages cannot be installed here). The ESLint config is written but has never been run.
- **Real animations** (Framer Motion exit/entrance, reduced-motion behaviour), the icon drawings, the real fonts and Tailwind 3 output were not tested; screenshots used Tailwind 4 and fallback fonts.
- **Responsive image sizes:** one file per image is served; no multiple widths until real photos exist.
- **Core Web Vitals** were not measured. Hero preload, non-blocking fonts, lazy images and zero layout shift in the test are in place.
- Real photographs, including `hero-mobile.webp`, are still needed. Items in `CONFIRMATION_CHECKLIST` still need management confirmation.
