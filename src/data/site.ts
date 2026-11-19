/**
 * Single source of truth for all business content, SEO tags and structured data.
 * Items marked CONFIRM must be verified with management before publishing.
 * The vite.config.ts SEO plugin also reads this file, so keep it free of browser-only code.
 */

export const SITE = {
  name: "AL-RASHEED PALACE",
  tagline: "Where Every Celebration Becomes a Beautiful Memory.",
  locationShort: "Sambrial, Punjab, Pakistan",
  addressLines: "Malkhanwala Bus Stop, Daska Road, Sambrial, Sialkot, Punjab, Pakistan.",

  // Used for structured data only (CONFIRM with management).
  addressStructured: {
    streetAddress: "Malkhanwala Bus Stop, Daska Road",
    addressLocality: "Sambrial",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },

  // CONFIRM: taken from the Google listing, not verified with management.
  // Shown on the page with a "as listed on Google Maps" note while ratingVerified is false.
  // Never added to structured data.
  rating: 4.5,
  reviews: 135,
  ratingVerified: false,

  // CONFIRM with management: publicly listed number, not yet verified.
  phoneDisplay: "+92 320 2752352",
  phoneTel: "+923202752352",
  whatsappNumber: "923202752352",
  whatsappMessage:
    "Assalam-o-Alaikum! I would like to know more about Al-Rasheed Palace and your event booking details.",

  // Directions use a Maps search for the listing.
  // CONFIRM: replace with the exact Google Business Profile link ("Share" > "Copy link").
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Al-Rasheed+Palace+Malkhanwala+Bus+Stop+Daska+Road+Sambrial",

  // Set to the Google Maps "Embed a map" iframe src only after the pin is verified.
  // While null, the embedded map is hidden and only the directions button shows.
  mapEmbedUrl: null as string | null,

  // Only set when an official account is found. null = button is not rendered.
  instagramUrl: null as string | null,
  linkedinUrl: null as string | null,

  // SEO. Set siteUrl (for example "https://alrasheedpalace.example") once the domain is known.
  // Canonical, og:url and the social image tags are only written when siteUrl is set AND the
  // file at ogImage exists in /public.
  siteUrl: null as string | null,
  ogImage: "/images/og-image.jpg", // 1200x630 recommended
  seoTitle: "Al-Rasheed Palace | Wedding & Event Venue in Sambrial, Punjab",
  seoDescription:
    "Al-Rasheed Palace is a wedding and event venue on Daska Road, Sambrial, Sialkot, Punjab. Call or message the management team on WhatsApp to ask about your event.",
};

/** Only Google Maps embed URLs are ever put into the page's iframe. */
export const isSafeMapEmbed = (url: string | null): url is string =>
  typeof url === "string" && url.startsWith("https://www.google.com/maps/embed");

export const whatsappLink = () =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export const telLink = () => `tel:${SITE.phoneTel}`;

export interface ImageAsset {
  /** Drop the real photo at this path inside /public to replace the placeholder. */
  src: string;
  /**
   * Optional portrait crop used below 768px wide (phones). If the file is missing,
   * phones fall back to `src`, so the page never breaks.
   */
  mobileSrc?: string;
  /** Describe what is actually in the photo once the real file is added. */
  alt: string;
  /** Shown on the placeholder so it is clearly not a real photo. */
  label: string;
}

export const IMAGES = {
  hero: {
    src: "/images/hero-night.jpg",
    mobileSrc: "/images/hero-mobile.webp", // portrait 4:5 or 3:4, about 1080x1440
    alt: "Al-Rasheed Palace illuminated at night",
    label: "Palace exterior at night",
  },
  about: {
    src: "/images/about.jpg",
    alt: "Al-Rasheed Palace exterior",
    label: "Palace exterior",
  },
  gallery: [
    { src: "/images/gallery-1.jpg", alt: "Palace exterior", label: "Palace exterior" },
    { src: "/images/gallery-2.jpg", alt: "Illuminated building", label: "Illuminated building" },
    { src: "/images/gallery-3.jpg", alt: "Wedding decorations", label: "Wedding decorations" },
    { src: "/images/gallery-4.jpg", alt: "Event stage", label: "Event stage" },
    { src: "/images/gallery-5.jpg", alt: "Dining setup", label: "Dining setup" },
    { src: "/images/gallery-6.jpg", alt: "Interior", label: "Interior" },
  ] as ImageAsset[],
};

/** CONFIRM with management: suggested categories, not confirmed services. */
export const EVENTS = [
  "Wedding Celebrations",
  "Mehndi",
  "Baraat",
  "Walima",
  "Engagements",
  "Family Events",
];

export const NAV = [
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#events", label: "Events" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
];

/** Everything management must confirm before the site goes live. */
export const CONFIRMATION_CHECKLIST = [
  "Phone and WhatsApp number (+92 320 2752352)",
  "Address wording",
  "Google rating (4.5) and review count (135); set ratingVerified to true once confirmed",
  "Event categories shown in the Occasions section",
  "Exact Google Business Profile link for directions, and the map embed URL",
  "Official Instagram and LinkedIn accounts, if any",
  "Real photographs for the hero (landscape and portrait mobile crop), about section, gallery and social share image",
  "Public website address (siteUrl)",
];
