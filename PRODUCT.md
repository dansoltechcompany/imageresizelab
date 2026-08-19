# ImageResizeLab

Image resizer first, then the rest of the photo toolkit. Separate product from WordHuntLab.

Brand: **ImageResizeLab**. Domain to buy: `imageresizelab.com` (confirm on a registrar).

Resize is the front door. Compressors, converters, croppers, and inspectors live in the same lab. Do not hide them.

## Why this exists

High-search-intent image tools with real content, so AdSense has a chance. Not a random toolbox of clone pages.

## Product rule

Few real engines. Many SEO entry pages that are presets of those engines.

Users get a short nav of tools that do different jobs. Google gets dedicated URLs for search intent.

Every tool runs in the browser. Images never upload to an ImageResizeLab server. That is the privacy pitch and the hosting bill.

## Real tools (different jobs)

| Nav name | Job | Engine |
|---|---|---|
| Image Resizer | Width / height / percent / max side | Canvas resize |
| JPG / PNG compressor | Quality, target KB, format | Canvas export |
| Format converters | JPG ↔ PNG ↔ WebP | Canvas export |
| Cropper / round / social / passport | Frame + aspect presets | Canvas crop |
| Dimension / EXIF / color / Base64 | Inspect or encode, not rewrite | File + EXIF parse |
| Favicon / watermark / placeholder | Generate new assets | Canvas generate |

## V1 (build this first)

1. Image Resizer — homepage. Pixels, percent, lock aspect, JPEG/PNG/WebP out.
2. JPG Compressor and PNG Compressor — quality slider; PNG is honest about browser limits.
3. WebP Converter plus JPG ↔ PNG ↔ WebP pair pages.
4. Image Cropper, Social Media Image Resizer, Favicon Generator.
5. Dimension checker, EXIF viewer, Image ↔ Base64.
6. Unique copy + FAQ on every indexable page.

## Stack

Next.js (App Router) + TypeScript + Tailwind. Static export for Cloudflare Pages. Canvas + FileReader only. No image upload API.

## AdSense / SEO notes

- Tool + unique content on every indexable page. Ads must not drown the tool.
- Technical SEO first (titles, internal links, sitemap, fast LCP).
- Page titles carry keywords: `JPG Compressor | ImageResizeLab`, `PNG to JPG | ImageResizeLab`.
- Traffic will take months. Entry keywords: image resizer, jpg compressor, png to jpg, webp converter.

## Do not

- Build this inside WordHuntLab or any fitness repo
- Ship 40 nav items that are the same form
- Claim TinyPNG-class lossless PNG when the browser cannot do that
- Upload user photos to a server
- Mass-produce near-identical pages without unique copy
