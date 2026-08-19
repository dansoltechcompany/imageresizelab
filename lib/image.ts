export type MimeType = "image/jpeg" | "image/png" | "image/webp";

export type LoadedImage = {
  file: File;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  bitmap: ImageBitmap;
  objectUrl: string;
  buffer: ArrayBuffer;
};

export const ACCEPT_RASTER =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp";

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function stem(name: string) {
  return name.replace(/\.[^.]+$/, "") || "image";
}

export function extFor(type: MimeType) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}

export async function loadImageFile(file: File): Promise<LoadedImage> {
  const type = file.type || mimeFromName(file.name);
  const bitmap = await createImageBitmap(file);
  const objectUrl = URL.createObjectURL(file);
  return {
    file,
    name: file.name,
    type,
    size: file.size,
    width: bitmap.width,
    height: bitmap.height,
    bitmap,
    objectUrl,
    buffer: await file.arrayBuffer(),
  };
}

function mimeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "bmp") return "image/bmp";
  if (ext === "svg") return "image/svg+xml";
  return "image/jpeg";
}

export function revokeLoaded(img: LoadedImage | null) {
  if (!img) return;
  URL.revokeObjectURL(img.objectUrl);
  img.bitmap.close();
}

export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  return { canvas, ctx };
}

export type DrawOpts = {
  width?: number;
  height?: number;
  crop?: { x: number; y: number; w: number; h: number };
  rotate?: 0 | 90 | 180 | 270;
  flipH?: boolean;
  flipV?: boolean;
  background?: string;
  filter?: string;
  circle?: boolean;
};

export function drawImage(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  opts: DrawOpts = {},
) {
  const crop = opts.crop ?? { x: 0, y: 0, w: srcW, h: srcH };
  const rotate = opts.rotate ?? 0;
  const outW = opts.width ?? crop.w;
  const outH = opts.height ?? crop.h;
  const swapped = rotate === 90 || rotate === 270;
  const canvasW = swapped ? outH : outW;
  const canvasH = swapped ? outW : outH;
  if (canvasW > 8192 || canvasH > 8192) {
    throw new Error("That output is too large for this browser (max 8192 px on a side).");
  }
  const { canvas, ctx } = makeCanvas(canvasW, canvasH);

  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  ctx.save();
  if (opts.filter) ctx.filter = opts.filter;
  ctx.translate(canvasW / 2, canvasH / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1);
  if (opts.circle) {
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(outW, outH) / 2, 0, Math.PI * 2);
    ctx.clip();
  }
  ctx.drawImage(
    source,
    crop.x,
    crop.y,
    crop.w,
    crop.h,
    -outW / 2,
    -outH / 2,
    outW,
    outH,
  );
  ctx.restore();
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: MimeType,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Could not encode this image."));
        else resolve(blob);
      },
      type,
      type === "image/png" ? undefined : quality,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function fitWithin(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number,
  cover = false,
) {
  const scale = cover
    ? Math.max(maxW / srcW, maxH / srcH)
    : Math.min(maxW / srcW, maxH / srcH);
  return {
    width: Math.max(1, Math.round(srcW * scale)),
    height: Math.max(1, Math.round(srcH * scale)),
  };
}

export function coverCrop(srcW: number, srcH: number, outW: number, outH: number) {
  const scale = Math.max(outW / srcW, outH / srcH);
  const w = outW / scale;
  const h = outH / scale;
  return {
    x: (srcW - w) / 2,
    y: (srcH - h) / 2,
    w,
    h,
  };
}

export async function encodeAtQuality(
  canvas: HTMLCanvasElement,
  type: MimeType,
  quality: number,
) {
  const blob = await canvasToBlob(canvas, type, quality);
  return blob;
}

export async function encodeToMaxBytes(
  canvas: HTMLCanvasElement,
  type: Exclude<MimeType, "image/png">,
  maxBytes: number,
) {
  let lo = 0.08;
  let hi = 0.98;
  let best = await canvasToBlob(canvas, type, hi);
  if (best.size <= maxBytes) return { blob: best, quality: hi };
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, type, mid);
    if (blob.size <= maxBytes) {
      best = blob;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (best.size > maxBytes) {
    const tiny = await canvasToBlob(canvas, type, 0.08);
    return { blob: tiny.size < best.size ? tiny : best, quality: 0.08 };
  }
  return { blob: best, quality: lo };
}

export function supportsWebp() {
  try {
    return document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}
