import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { SITE } from "./src/data/site";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Writes SEO tags and structured data into index.html at build time from src/data/site.ts,
 * so crawlers and link previews see them without running JavaScript.
 * Only verified-safe facts are included: no phone number, no rating, no review count.
 */
function seoPlugin(): Plugin {
  return {
    name: "al-rasheed-seo",
    transformIndexHtml(html) {
      const base = SITE.siteUrl ? SITE.siteUrl.replace(/\/+$/, "") : null;
      const ogFileExists = existsSync(
        resolve(process.cwd(), "public", SITE.ogImage.replace(/^\//, "")),
      );
      const imageUrl = base && ogFileExists ? `${base}${SITE.ogImage}` : null;

      const tags: string[] = [
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
      ];

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

      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(SITE.seoTitle)}</title>`)
        .replace("<!--SEO-->", tags.filter(Boolean).join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: { motion: ["framer-motion"] },
      },
    },
  },
});
