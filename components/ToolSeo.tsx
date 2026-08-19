import type { ReactNode } from "react";
import { SeoLink } from "@/components/SeoLink";

type ToolCopy = {
  h2: string;
  links: readonly string[];
  body: ReactNode;
};

const COPY: Record<string, ToolCopy> = {
  "/": {
    h2: "How this image resizer changes width and height",
    links: ["/bulk-image-resizer", "/social-media-image-resizer"],
    body: (
      <p>
        It redraws your photo on a canvas at the size you type — pixels, a
        percent of the original, or a longest-side cap with aspect locked. Output
        can be JPEG, PNG, or WebP. A whole folder at once is the{" "}
        <SeoLink href="/bulk-image-resizer">bulk image resizer</SeoLink>. Platform
        frames (Instagram, YouTube, LinkedIn) belong on the{" "}
        <SeoLink href="/social-media-image-resizer">social media image resizer</SeoLink>.
      </p>
    ),
  },
  "/jpg-compressor": {
    h2: "What a JPG compressor actually does in the browser",
    links: ["/compress-image-to-size", "/png-compressor"],
    body: (
      <p>
        JPEG is already lossy. This free JPG compressor re-encodes at the quality
        you pick, which is how file size drops. It does not upload the photo. A
        target in kilobytes
        is <SeoLink href="/compress-image-to-size">compress image to size</SeoLink>.
        Transparency or screenshots are usually a job for the{" "}
        <SeoLink href="/png-compressor">PNG compressor</SeoLink>.
      </p>
    ),
  },
  "/png-compressor": {
    h2: "PNG compression in a browser, without false promises",
    links: ["/png-to-webp", "/jpg-compressor"],
    body: (
      <p>
        Canvas cannot run TinyPNG-style lossless quantization. This page shrinks a
        PNG by reducing dimensions or by converting to WebP or JPEG. Keep
        transparency with <SeoLink href="/png-to-webp">PNG to WebP</SeoLink>. Photos
        without alpha compress better as a{" "}
        <SeoLink href="/jpg-compressor">JPG compressor</SeoLink> pass.
      </p>
    ),
  },
  "/webp-converter": {
    h2: "Why convert images to WebP",
    links: ["/jpg-to-webp", "/png-to-webp"],
    body: (
      <p>
        WebP is usually smaller than JPEG at a similar look, and it can keep PNG
        transparency. Drop any raster image and pick a quality. A JPEG-only path is{" "}
        <SeoLink href="/jpg-to-webp">JPG to WebP</SeoLink>. A PNG-only path is{" "}
        <SeoLink href="/png-to-webp">PNG to WebP</SeoLink>.
      </p>
    ),
  },
  "/jpg-to-png": {
    h2: "JPG to PNG does not restore lost detail",
    links: ["/png-to-jpg", "/"],
    body: (
      <p>
        JPEG artifacts stay in the pixels. This converter wraps them in a PNG
        container — useful for tools that refuse JPEG, not for “repairing” a
        photo. Going the other way is <SeoLink href="/png-to-jpg">PNG to JPG</SeoLink>.
        Changing size at the same time is the{" "}
        <SeoLink href="/">image resizer</SeoLink>.
      </p>
    ),
  },
  "/png-to-jpg": {
    h2: "PNG to JPG flattens transparency",
    links: ["/jpg-to-png", "/webp-converter"],
    body: (
      <p>
        JPEG has no alpha channel. Transparent pixels are painted onto the
        background color you pick, then encoded as JPEG. Need the alpha back as a
        file? Use <SeoLink href="/jpg-to-png">JPG to PNG</SeoLink> only if you still
        have the original PNG. Smaller files with alpha:{" "}
        <SeoLink href="/webp-converter">WebP converter</SeoLink>.
      </p>
    ),
  },
  "/webp-to-jpg": {
    h2: "Convert WebP to JPG when a site will not accept WebP",
    links: ["/webp-to-png", "/jpg-compressor"],
    body: (
      <p>
        Some email clients and printers still want JPEG. This page decodes WebP in
        the browser and writes a JPEG. Keep transparency with{" "}
        <SeoLink href="/webp-to-png">WebP to PNG</SeoLink>. Shrink the JPEG further
        with the <SeoLink href="/jpg-compressor">JPG compressor</SeoLink>.
      </p>
    ),
  },
  "/jpg-to-webp": {
    h2: "Re-encode JPEG as WebP",
    links: ["/webp-converter", "/png-to-webp"],
    body: (
      <p>
        Same pixels, newer container. Quality is a slider because both formats are
        lossy. Mixed inputs belong on the{" "}
        <SeoLink href="/webp-converter">WebP converter</SeoLink>. PNG sources use{" "}
        <SeoLink href="/png-to-webp">PNG to WebP</SeoLink>.
      </p>
    ),
  },
  "/png-to-webp": {
    h2: "PNG to WebP for logos and screenshots",
    links: ["/png-compressor", "/webp-to-png"],
    body: (
      <p>
        WebP often beats PNG on file size while keeping a transparent background.
        This is the realistic “PNG compressor” for the web. Undo it with{" "}
        <SeoLink href="/webp-to-png">WebP to PNG</SeoLink>. Dimension-only shrinking
        stays on the <SeoLink href="/png-compressor">PNG compressor</SeoLink>.
      </p>
    ),
  },
  "/webp-to-png": {
    h2: "WebP to PNG when you need a lossless raster",
    links: ["/webp-to-jpg", "/png-to-jpg"],
    body: (
      <p>
        PNG is the interchange format editors still expect. Transparency is kept.
        A photo headed to a printer may prefer{" "}
        <SeoLink href="/webp-to-jpg">WebP to JPG</SeoLink>. Flattening PNG later is{" "}
        <SeoLink href="/png-to-jpg">PNG to JPG</SeoLink>.
      </p>
    ),
  },
  "/image-cropper": {
    h2: "Crop without uploading the photo",
    links: ["/round-image", "/profile-picture-resizer"],
    body: (
      <p>
        Drag the handles, lock 1:1 / 4:3 / 16:9 / 9:16, then download the cut.
        A circle with a transparent PNG is <SeoLink href="/round-image">round image</SeoLink>.
        Avatar-sized squares are the{" "}
        <SeoLink href="/profile-picture-resizer">profile picture resizer</SeoLink>.
      </p>
    ),
  },
  "/image-dimension-checker": {
    h2: "Read width, height, and file size locally",
    links: ["/exif-viewer", "/"],
    body: (
      <p>
        The checker loads the file in your tab and reports pixels, megapixels,
        aspect ratio, MIME type, and bytes. Camera tags are the{" "}
        <SeoLink href="/exif-viewer">EXIF viewer</SeoLink>. Changing those pixels is
        the <SeoLink href="/">image resizer</SeoLink>.
      </p>
    ),
  },
  "/image-to-base64": {
    h2: "Image to Base64 for CSS, HTML, or JSON",
    links: ["/base64-to-image", "/favicon-generator"],
    body: (
      <p>
        Encodes the file you drop as a data URI or raw Base64. Large photos bloat
        HTML — this is for icons and tiny assets. Reverse it with{" "}
        <SeoLink href="/base64-to-image">Base64 to image</SeoLink>. Site icons are
        better as files from the{" "}
        <SeoLink href="/favicon-generator">favicon generator</SeoLink>.
      </p>
    ),
  },
  "/base64-to-image": {
    h2: "Paste Base64 and download a real image",
    links: ["/image-to-base64", "/image-dimension-checker"],
    body: (
      <p>
        Accepts a data URI or naked Base64. The preview is decoded in the browser,
        then you download PNG/JPEG/WebP according to the header. Encoding the other
        way is <SeoLink href="/image-to-base64">image to Base64</SeoLink>. Check
        pixels with the{" "}
        <SeoLink href="/image-dimension-checker">dimension checker</SeoLink>.
      </p>
    ),
  },
  "/exif-viewer": {
    h2: "EXIF is JPEG metadata, not the pixels",
    links: ["/remove-exif", "/image-dimension-checker"],
    body: (
      <p>
        Camera make, date, orientation, and GPS live in APP1 on many JPEGs. PNGs
        and WebPs often have none. This viewer never sends the file away. Strip
        tags by re-encoding with <SeoLink href="/remove-exif">remove EXIF</SeoLink>.
        Pixel size only is the{" "}
        <SeoLink href="/image-dimension-checker">dimension checker</SeoLink>.
      </p>
    ),
  },
  "/favicon-generator": {
    h2: "Favicon sizes from one square source",
    links: ["/round-image", "/"],
    body: (
      <p>
        Crops to a square, then writes 16, 32, 48, 180, 192, and 512 PNGs plus a
        multi-size ICO. Rounded marks start as a{" "}
        <SeoLink href="/round-image">round image</SeoLink>. Arbitrary pixel sizes
        use the <SeoLink href="/">image resizer</SeoLink>.
      </p>
    ),
  },
  "/social-media-image-resizer": {
    h2: "Social presets are cover-crops, not stretch",
    links: ["/image-cropper", "/profile-picture-resizer"],
    body: (
      <p>
        Each preset covers the frame (Instagram 1080×1080, YouTube 1280×720, and
        so on) so the photo is not squashed. Fine-tune the cut on the{" "}
        <SeoLink href="/image-cropper">image cropper</SeoLink>. Avatars are the{" "}
        <SeoLink href="/profile-picture-resizer">profile picture resizer</SeoLink>.
      </p>
    ),
  },
  "/bulk-image-resizer": {
    h2: "Resize a batch of photos in one pass",
    links: ["/", "/compress-image-to-size"],
    body: (
      <p>
        Same width, height, or max side for every file, then a zip download.
        Still in the browser — large batches can tax RAM. One photo at a time is
        the <SeoLink href="/">image resizer</SeoLink>. Hitting a KB
        cap uses{" "}
        <SeoLink href="/compress-image-to-size">compress image to size</SeoLink>.
      </p>
    ),
  },
  "/compress-image-to-size": {
    h2: "Compress until the file fits a kilobyte budget",
    links: ["/jpg-compressor", "/webp-converter"],
    body: (
      <p>
        Binary-searches JPEG or WebP quality until the blob is at or under your
        KB target. PNG is the wrong format for this job. Manual quality is the{" "}
        <SeoLink href="/jpg-compressor">JPG compressor</SeoLink>. Switching format
        first is the <SeoLink href="/webp-converter">WebP converter</SeoLink>.
      </p>
    ),
  },
  "/remove-exif": {
    h2: "Removing EXIF means re-encoding the pixels",
    links: ["/exif-viewer", "/jpg-compressor"],
    body: (
      <p>
        Canvas export writes a new JPEG/PNG/WebP without the original APP1 block,
        so GPS and camera tags drop out. Preview tags first on the{" "}
        <SeoLink href="/exif-viewer">EXIF viewer</SeoLink>. Combine with a quality
        pass on the <SeoLink href="/jpg-compressor">JPG compressor</SeoLink>.
      </p>
    ),
  },
  "/image-color-picker": {
    h2: "Pick a pixel color from a photo",
    links: ["/image-dimension-checker", "/grayscale-image"],
    body: (
      <p>
        Click the preview. The lab reads that pixel from an in-memory canvas and
        shows hex plus RGB. Dimensions are the{" "}
        <SeoLink href="/image-dimension-checker">dimension checker</SeoLink>. A
        black-and-white version is{" "}
        <SeoLink href="/grayscale-image">grayscale image</SeoLink>.
      </p>
    ),
  },
  "/round-image": {
    h2: "Circle crop as a transparent PNG",
    links: ["/image-cropper", "/favicon-generator"],
    body: (
      <p>
        Clips to a circle and exports PNG so the corners stay transparent. Square
        crops without rounding are the{" "}
        <SeoLink href="/image-cropper">image cropper</SeoLink>. Icon sets are the{" "}
        <SeoLink href="/favicon-generator">favicon generator</SeoLink>.
      </p>
    ),
  },
  "/rotate-image": {
    h2: "Rotate and flip without a photo editor",
    links: ["/image-cropper", "/remove-exif"],
    body: (
      <p>
        90° steps, 180°, and horizontal or vertical flip, then a new file.
        Crops after rotation belong on the{" "}
        <SeoLink href="/image-cropper">image cropper</SeoLink>. A JPEG that only
        looked rotated because of EXIF orientation should go through{" "}
        <SeoLink href="/remove-exif">remove EXIF</SeoLink> after you bake the
        pixels.
      </p>
    ),
  },
  "/watermark-image": {
    h2: "Text watermark on a photo, in the tab",
    links: ["/add-image-border", "/compress-image-to-size"],
    body: (
      <p>
        Draws your text at a corner or center with opacity and size controls.
        A simple frame instead is{" "}
        <SeoLink href="/add-image-border">add image border</SeoLink>. Email-size
        output uses{" "}
        <SeoLink href="/compress-image-to-size">compress image to size</SeoLink>.
      </p>
    ),
  },
  "/passport-photo-maker": {
    h2: "Passport photo sizes, not a studio guarantee",
    links: ["/profile-picture-resizer", "/image-cropper"],
    body: (
      <p>
        US 2×2 in at 300 dpi (600×600) and 35×45 mm at 300 dpi, with a solid
        background. This is a crop helper, not official passport acceptance.
        Square avatars are the{" "}
        <SeoLink href="/profile-picture-resizer">profile picture resizer</SeoLink>.
        Free framing is the <SeoLink href="/image-cropper">image cropper</SeoLink>.
      </p>
    ),
  },
  "/profile-picture-resizer": {
    h2: "Square profile pictures at common avatar sizes",
    links: ["/social-media-image-resizer", "/round-image"],
    body: (
      <p>
        Cover-crops to 400×400 or 800×800. Round versions for some apps need{" "}
        <SeoLink href="/round-image">round image</SeoLink>. Feed and story sizes
        live on the{" "}
        <SeoLink href="/social-media-image-resizer">social media image resizer</SeoLink>.
      </p>
    ),
  },
  "/add-image-border": {
    h2: "Add a solid border around an image",
    links: ["/watermark-image", "/"],
    body: (
      <p>
        Expands the canvas by the thickness you set and fills the new strip with
        a color. Text on top is <SeoLink href="/watermark-image">watermark image</SeoLink>.
        Changing the inner photo size first is the{" "}
        <SeoLink href="/">image resizer</SeoLink>.
      </p>
    ),
  },
  "/grayscale-image": {
    h2: "Convert a photo to grayscale",
    links: ["/blur-image", "/png-to-jpg"],
    body: (
      <p>
        CSS-style grayscale on the canvas, then export. Soft-focus instead is{" "}
        <SeoLink href="/blur-image">blur image</SeoLink>. Flattening a gray PNG to
        JPEG is <SeoLink href="/png-to-jpg">PNG to JPG</SeoLink>.
      </p>
    ),
  },
  "/blur-image": {
    h2: "Blur a photo for backgrounds or privacy",
    links: ["/grayscale-image", "/image-cropper"],
    body: (
      <p>
        Uses the browser’s canvas blur. Strong blur on huge images can be slow.
        Black and white is <SeoLink href="/grayscale-image">grayscale image</SeoLink>.
        Cut the subject first with the{" "}
        <SeoLink href="/image-cropper">image cropper</SeoLink>.
      </p>
    ),
  },
  "/svg-to-png": {
    h2: "Rasterize SVG to PNG at a chosen width",
    links: ["/png-to-jpg", "/favicon-generator"],
    body: (
      <p>
        Reads the SVG, draws it at the width you type, and writes a PNG. Complex
        fonts or external images inside the SVG may not render. Flatten to JPEG
        with <SeoLink href="/png-to-jpg">PNG to JPG</SeoLink>. Icons at many sizes:
        the <SeoLink href="/favicon-generator">favicon generator</SeoLink>.
      </p>
    ),
  },
  "/placeholder-image": {
    h2: "Generate a placeholder image by size",
    links: ["/add-image-border", "/"],
    body: (
      <p>
        No upload. Pick width, height, background, and optional label text.
        Framing a real photo is{" "}
        <SeoLink href="/add-image-border">add image border</SeoLink>. Resizing a
        real photo is the <SeoLink href="/">image resizer</SeoLink>.
      </p>
    ),
  },
};

export function toolSeoLinks(path: string): readonly string[] {
  return COPY[path]?.links ?? [];
}

export function ToolSeo({ path }: { path: string }) {
  const copy = COPY[path];
  if (!copy) return null;
  return (
    <section className="mt-12 max-w-3xl text-[var(--muted)]">
      <h2 className="font-display text-3xl text-[var(--ink)]">{copy.h2}</h2>
      <div className="mt-3 text-sm leading-relaxed sm:text-base">{copy.body}</div>
    </section>
  );
}
