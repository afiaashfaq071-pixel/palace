import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONFIRMATION_CHECKLIST,
  EVENTS,
  IMAGES,
  NAV,
  SITE,
  isSafeMapEmbed,
  telLink,
  whatsappLink,
} from "../src/data/site";

const digits = (value: string) => value.replace(/\D/g, "");

describe("contact links", () => {
  it("uses the same number everywhere", () => {
    expect(digits(SITE.phoneDisplay)).toBe(digits(SITE.phoneTel));
    expect(digits(SITE.phoneDisplay)).toBe(SITE.whatsappNumber);
  });

  it("builds a valid tel: link", () => {
    expect(telLink()).toMatch(/^tel:\+\d{10,15}$/);
  });

  it("builds a WhatsApp link that carries the prefilled message", () => {
    const url = new URL(whatsappLink());
    expect(url.origin + url.pathname).toBe(`https://wa.me/${SITE.whatsappNumber}`);
    expect(url.searchParams.get("text")).toBe(SITE.whatsappMessage);
    expect(SITE.whatsappMessage.startsWith("Assalam-o-Alaikum")).toBe(true);
  });

  it("only uses https for directions and social links", () => {
    for (const url of [SITE.mapsUrl, SITE.instagramUrl, SITE.linkedinUrl]) {
      if (url !== null) expect(url.startsWith("https://")).toBe(true);
    }
  });
});

describe("map embed safety", () => {
  it("accepts only Google Maps embed URLs", () => {
    expect(isSafeMapEmbed("https://www.google.com/maps/embed?pb=abc")).toBe(true);
    expect(isSafeMapEmbed("https://evil.example/maps/embed")).toBe(false);
    expect(isSafeMapEmbed("http://www.google.com/maps/embed")).toBe(false);
    expect(isSafeMapEmbed("javascript:alert(1)")).toBe(false);
    expect(isSafeMapEmbed(null)).toBe(false);
  });

  it("has no map until the location is verified", () => {
    expect(SITE.mapEmbedUrl === null || isSafeMapEmbed(SITE.mapEmbedUrl)).toBe(true);
  });
});

describe("business information integrity", () => {
  it("flags the unverified rating", () => {
    expect(SITE.ratingVerified).toBe(false);
    expect(SITE.rating).toBeGreaterThan(0);
    expect(SITE.rating).toBeLessThanOrEqual(5);
    expect(Number.isInteger(SITE.reviews)).toBe(true);
  });

  it("lists event categories and a confirmation checklist", () => {
    expect(EVENTS.length).toBeGreaterThan(0);
    expect(new Set(EVENTS).size).toBe(EVENTS.length);
    expect(CONFIRMATION_CHECKLIST.length).toBeGreaterThan(0);
  });

  it("does not invent prices, capacity or email addresses in the site data", () => {
    const text = JSON.stringify({ SITE, EVENTS, IMAGES });
    expect(text).not.toMatch(/\bRs\.?\s?\d|PKR|\$\d|capacity|guests|@[\w-]+\.\w+/i);
  });
});

describe("images", () => {
  const gallery = IMAGES.gallery;

  it("has six unique gallery photos inside /images", () => {
    expect(gallery).toHaveLength(6);
    expect(new Set(gallery.map((g) => g.src)).size).toBe(6);
    for (const img of [IMAGES.hero, IMAGES.about, ...gallery]) {
      expect(img.src.startsWith("/images/")).toBe(true);
      expect(img.alt.length).toBeGreaterThan(3);
      expect(img.label.length).toBeGreaterThan(3);
    }
  });

  it("keeps the separate portrait hero for phones", () => {
    expect(IMAGES.hero.mobileSrc).toBe("/images/hero-mobile.webp");
    expect(IMAGES.hero.mobileSrc).not.toBe(IMAGES.hero.src);
  });
});

describe("navigation", () => {
  const componentsDir = join(__dirname, "..", "src", "components");
  const source = readdirSync(componentsDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => readFileSync(join(componentsDir, f), "utf8"))
    .join("\n");
  const ids = new Set([...source.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]));

  it("points every nav link at a section that exists", () => {
    for (const item of NAV) {
      expect(item.href.startsWith("#")).toBe(true);
      expect(ids.has(item.href.slice(1))).toBe(true);
    }
    expect(ids.has("top")).toBe(true);
    expect(ids.has("main") || readFileSync(join(componentsDir, "..", "App.tsx"), "utf8").includes('id="main"')).toBe(true);
  });

  it("never links to social accounts or mailto in the components", () => {
    expect(source).not.toMatch(/mailto:|instagram\.com|linkedin\.com/);
  });
});

describe("external links and unsafe HTML", () => {
  const dir = join(__dirname, "..", "src");
  const files: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|html)$/.test(entry.name)) files.push(full);
    }
  };
  walk(dir);
  const all = files.map((f) => readFileSync(f, "utf8")).join("\n");

  it("renders no raw HTML", () => {
    expect(all).not.toMatch(/dangerouslySetInnerHTML|\.innerHTML\s*=|\beval\(/);
  });

  it("opens every new-tab link with noopener", () => {
    const lines = all.split("\n");
    const newTabLinks = lines.flatMap((line, i) => (line.includes("_blank") ? [i] : []));
    expect(newTabLinks.length).toBeGreaterThan(0);
    for (const i of newTabLinks) {
      // rel="noopener noreferrer" sits on the same line or within the next two
      expect(lines.slice(i, i + 3).join(" ")).toContain("noopener noreferrer");
    }
  });
});
