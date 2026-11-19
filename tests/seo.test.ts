import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { SITE } from "../src/data/site";
import { buildSeoHead, robotsTxt, sitemapXml } from "../vite-plugins/seo";

const original = SITE.siteUrl;
afterEach(() => {
  SITE.siteUrl = original;
});

/** A throwaway public/ folder containing only the named files. */
const publicDirWith = (...files: string[]) => {
  const dir = mkdtempSync(join(tmpdir(), "palace-public-"));
  mkdirSync(join(dir, "images"));
  for (const f of files) writeFileSync(join(dir, "images", f), "x");
  return dir;
};

const jsonLd = (head: string) => {
  const match = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(match).not.toBeNull();
  return JSON.parse(match![1]) as Record<string, unknown>;
};

describe("structured data", () => {
  it("is valid JSON describing an EventVenue in Sambrial", () => {
    const data = jsonLd(buildSeoHead(publicDirWith()));
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("EventVenue");
    expect(data.name).toBe("Al-Rasheed Palace");
    expect((data.address as Record<string, string>).addressLocality).toBe("Sambrial");
  });

  it("never publishes the unverified rating, review count or phone number", () => {
    SITE.siteUrl = "https://example.test";
    const head = buildSeoHead(publicDirWith("og-image.jpg"));
    expect(head).not.toMatch(/aggregateRating|ratingValue|reviewCount|telephone|2752352|135 reviews/);
  });
});

describe("meta tags", () => {
  it("has a description, Open Graph and Twitter tags", () => {
    const head = buildSeoHead(publicDirWith());
    expect(head).toContain('<meta name="description"');
    expect(head).toContain('property="og:title"');
    expect(head).toContain('property="og:description"');
    expect(head).toContain('name="twitter:card" content="summary"');
  });

  it("writes canonical and og:url only when siteUrl is set", () => {
    SITE.siteUrl = null;
    expect(buildSeoHead(publicDirWith())).not.toMatch(/canonical|og:url/);
    SITE.siteUrl = "https://example.test/";
    const head = buildSeoHead(publicDirWith());
    expect(head).toContain('<link rel="canonical" href="https://example.test/" />');
    expect(head).toContain('property="og:url" content="https://example.test/"');
  });

  it("adds the social image only when the file exists and the address is known", () => {
    SITE.siteUrl = "https://example.test";
    expect(buildSeoHead(publicDirWith())).not.toContain("og:image");
    const head = buildSeoHead(publicDirWith("og-image.jpg"));
    expect(head).toContain('property="og:image" content="https://example.test/images/og-image.jpg"');
    expect(head).toContain("summary_large_image");
    SITE.siteUrl = null;
    expect(buildSeoHead(publicDirWith("og-image.jpg"))).not.toContain("og:image");
  });
});

describe("hero preload", () => {
  it("preloads nothing when no photos exist", () => {
    expect(buildSeoHead(publicDirWith())).not.toContain('rel="preload"');
  });

  it("preloads only the desktop image when there is no portrait file", () => {
    const head = buildSeoHead(publicDirWith("hero-night.jpg"));
    expect(head).toContain('href="/images/hero-night.jpg" fetchpriority="high"');
    expect(head).not.toContain("media=");
  });

  it("splits the preload by screen width when both files exist", () => {
    const head = buildSeoHead(publicDirWith("hero-night.jpg", "hero-mobile.webp"));
    expect(head).toContain('href="/images/hero-mobile.webp" media="(max-width: 767px)"');
    expect(head).toContain('href="/images/hero-night.jpg" media="(min-width: 768px)"');
  });
});

describe("robots.txt and sitemap.xml", () => {
  it("allows crawling and omits the sitemap line until the address is known", () => {
    SITE.siteUrl = null;
    expect(robotsTxt()).toBe("User-agent: *\nAllow: /\n");
    expect(sitemapXml()).toBeNull();
  });

  it("points robots.txt at a sitemap that lists the home page", () => {
    SITE.siteUrl = "https://example.test/";
    expect(robotsTxt()).toContain("Sitemap: https://example.test/sitemap.xml");
    const xml = sitemapXml();
    expect(xml).toContain("<loc>https://example.test/</loc>");
    expect(xml).toContain("http://www.sitemaps.org/schemas/sitemap/0.9");
  });
});
