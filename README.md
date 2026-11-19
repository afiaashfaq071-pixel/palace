# Al-Rasheed Palace website

React + TypeScript + Tailwind CSS + Framer Motion + Lucide, built with Vite. Single page, no forms.
See `REVIEW.md` for what changed in v1.1.0, what was tested and what was not.

## Run

```bash
npm install        # also creates package-lock.json: commit it
npm run dev        # local preview
npm run typecheck  # strict TypeScript check (site and build files)
npm run lint       # ESLint
npm test           # unit tests (Vitest)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm audit          # check dependencies for known vulnerabilities
```

## Replace the photos

Drop real photographs into `public/images/` using the names in `public/images/README.txt`.
Until a file exists, a labelled placeholder is shown instead and cannot be opened in the gallery viewer.
Only use photographs of Al-Rasheed Palace itself.

## Business information

Everything lives in `src/data/site.ts`: name, address, phone, rating, links, SEO text, image paths,
event categories. `CONFIRMATION_CHECKLIST` in that file lists what management must confirm before launch.

- `mapEmbedUrl` is `null`: no embedded map until the exact pin is verified.
- `instagramUrl` / `linkedinUrl` are `null`: those buttons stay hidden until official accounts are confirmed.
- `ratingVerified` is `false`: the page notes the rating is "as listed on Google Maps".
- `siteUrl` is `null`: set it to the live address to enable canonical, social-share image tags and
  `sitemap.xml` (also add `public/images/og-image.jpg`, 1200x630). `robots.txt` is generated at build time.

No prices, capacity, packages, opening hours, owner names, email addresses or reviews appear anywhere.
