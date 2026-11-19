import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { IMAGES, SITE } from "../src/data/site";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Site address without a trailing slash, or null until `siteUrl` is set in site.ts. */
export const siteBase = () => (SITE.siteUrl ? SITE.siteUrl.replace(/\/+$/, "") : null);

export const robotsTxt = () => {
  const base = siteBase();
  return `User-agent: *\nAllow: /\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ""}`;
};

/** A one-page site: the sitemap lists only the home page. Null until the address is known. */
export const sitemapXml = () => {
  const base = siteBase();
  if (!base) return null;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(base)}/</loc></url>\n</urlset>\n`;
};

/**
 * Builds the head tags and JSON-LD. Only facts that are safe to publish are included:
 * no phone number, no rating, no review count.
 */
export function buildSeoHead(publicDir: string): string {
  const base = siteBase();
  const exists = (src: string) => existsSync(resolve(publicDir, src.replace(/^\//, "")));
  const hero = IMAGES.hero;
  const hasMobileHero = Boolean(hero.mobileSrc && exists(hero.mobileSrc));
  const imageUrl = base && exists(SITE.ogImage) ? `${base}${SITE.ogImage}` : null;

  const tags: string[] = [];
  if (hero.mobileSrc && hasMobileHero) {
    tags.push(
      `<link rel="preload" as="image" href="${hero.mobileSrc}" media="(max-width: 767px)" fetchpriority="high" />`,
    );
  }
  if (exists(hero.src)) {
    const media = hasMobileHero ? ' media="(min-width: 768px)"' : "";
    tags.push(`<link rel="preload" as="image" href="${hero.src}"${media} fetchpriority="high" />`);
  }
  tags.push(
    `<meta name="description" content="${esc(SITE.seoDescription)}" />`,
    base ? `<link rel="canonical" href="${base}/" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Al-Rasheed Palace" />`,
    `<meta property="og:title" content="${esc(SITE.seoTitle)}" />`,
    `<meta property="og:description" content="${esc(SITE.seoDescription)}" />`,
    `<meta property="og:locale" content="en_PK" />`,
    base ? `<meta property="og:url" content="${base}/" />` : "",
    imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : "",
    `<meta name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${esc(SITE.seoTitle)}" />`,
    `<meta name="twitter:description" content="${esc(SITE.seoDescription)}" />`,
    imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : "",
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Al-Rasheed Palace",
    description: SITE.seoDescription,
    address: { "@type": "PostalAddress", ...SITE.addressStructured },
    ...(base ? { url: `${base}/` } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
  };
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>`,
  );

  return tags.filter(Boolean).join("\n    ");
}

/** Writes SEO tags into index.html at build time and emits robots.txt and sitemap.xml. */
export function seoPlugin(publicDir = resolve(process.cwd(), "public")): Plugin {
  return {
    name: "al-rasheed-seo",
    transformIndexHtml(html) {
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(SITE.seoTitle)}</title>`)
        .replace("<!--SEO-->", buildSeoHead(publicDir));
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });
      const sitemap = sitemapXml();
      if (sitemap) this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
    },
  };
}
