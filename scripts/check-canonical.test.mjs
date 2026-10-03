import assert from "node:assert/strict";
import test from "node:test";
import { resolveCanonical } from "../public/_worker.js";

function expectRedirect(from, to) {
  const decision = resolveCanonical(from);
  assert.equal(decision.redirect, true, from);
  assert.equal(decision.url, to, from);
}

function expectStay(url) {
  const decision = resolveCanonical(url);
  assert.equal(decision.redirect, false, url);
  assert.equal(decision.url, url);
}

test("www and pages.dev collapse to the apex in one hop", () => {
  expectRedirect("https://www.imageresizelab.com/", "https://imageresizelab.com/");
  expectRedirect("https://www.imageresizelab.com/about", "https://imageresizelab.com/about/");
  expectRedirect("https://www.imageresizelab.com/about/", "https://imageresizelab.com/about/");
  expectRedirect("https://www.imageresizelab.com/png-to-jpg", "https://imageresizelab.com/png-to-jpg/");
  expectRedirect("https://www.imageresizelab.com/jpg-to-webp/", "https://imageresizelab.com/jpg-to-webp/");
  expectRedirect("http://www.imageresizelab.com/about", "https://imageresizelab.com/about/");
  expectRedirect("https://imageresizelab.pages.dev/about/", "https://imageresizelab.com/about/");
  expectRedirect("http://imageresizelab.com/", "https://imageresizelab.com/");
});

test("slashless tool URLs from Search Console redirect once to the canonical path", () => {
  for (const path of [
    "/compress-image-to-size",
    "/contact",
    "/watermark-image",
    "/placeholder-image",
    "/jpg-to-png",
    "/webp-converter",
    "/image-color-picker",
  ]) {
    expectRedirect(`https://imageresizelab.com${path}`, `https://imageresizelab.com${path}/`);
  }
});

test("crawled metadata routes become real image files", () => {
  expectRedirect(
    "https://imageresizelab.com/opengraph-image?33739cb65479b2f3",
    "https://imageresizelab.com/og.png",
  );
  expectRedirect(
    "https://imageresizelab.com/icon?fb668092cce59eb3",
    "https://imageresizelab.com/icon.png",
  );
  expectRedirect("https://www.imageresizelab.com/icon/", "https://imageresizelab.com/icon.png");
});

test("canonical pages and static files are not redirected", () => {
  expectStay("https://imageresizelab.com/");
  expectStay("https://imageresizelab.com/about/");
  expectStay("https://imageresizelab.com/og.png");
  expectStay("https://imageresizelab.com/icon.png");
  expectStay("https://imageresizelab.com/favicon.ico");
  expectStay("https://imageresizelab.com/sitemap.xml");
  expectStay("https://imageresizelab.com/robots.txt");
  expectStay("https://imageresizelab.com/_next/static/chunks/app.js");
});

test("legacy aliases and index.html files resolve to the canonical page", () => {
  expectRedirect("https://imageresizelab.com/image-resizer", "https://imageresizelab.com/");
  expectRedirect("https://imageresizelab.com/image-resizer/", "https://imageresizelab.com/");
  expectRedirect("https://imageresizelab.com/about/index.html", "https://imageresizelab.com/about/");
  expectRedirect("https://imageresizelab.com/index.html", "https://imageresizelab.com/");
});

test("preview hosts keep their hostname and only fix the path", () => {
  expectRedirect(
    "https://abc.imageresizelab.pages.dev/about",
    "https://abc.imageresizelab.pages.dev/about/",
  );
  expectStay("https://abc.imageresizelab.pages.dev/about/");
});
