"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat } from "@/components/Dropzone";
import { parseJpegExif } from "@/lib/exif";
import {
  ACCEPT_RASTER,
  canvasToBlob,
  downloadBlob,
  drawImage,
  extFor,
  formatBytes,
  loadImageFile,
  revokeLoaded,
  stem,
  type LoadedImage,
  type MimeType,
} from "@/lib/image";

export function DimensionTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  const gcd = img ? greatest(img.width, img.height) : 1;

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} hint="Nothing is resized. This page only reports facts about the file." compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
          <img src={img.objectUrl} alt="Inspect" className="max-h-[420px] w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-2 content-start">
            <Stat label="Width" value={`${img.width} px`} />
            <Stat label="Height" value={`${img.height} px`} />
            <Stat label="Megapixels" value={(img.width * img.height / 1_000_000).toFixed(2)} />
            <Stat label="Aspect" value={`${img.width / gcd}:${img.height / gcd}`} />
            <Stat label="Type" value={img.type || "unknown"} />
            <Stat label="File size" value={formatBytes(img.size)} />
            <Stat label="Name" value={img.name} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function greatest(a: number, b: number): number {
  return b === 0 ? a : greatest(b, a % b);
}

export function ExifTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setTags(parseJpegExif(next.buffer));
      setError(null);
    } catch {
      setError("Could not read that file.");
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept="image/jpeg,image/jpg" onFiles={onFiles} hint="JPEG only. Most PNG and WebP files have no EXIF." compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <img src={img.objectUrl} alt="EXIF source" className="max-h-96 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          {tags.length ? (
            <table className="h-fit w-full text-sm">
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.label} className="border-b border-[var(--plum)]/20">
                    <th className="py-2 pr-3 text-left font-semibold">{tag.label}</th>
                    <td className="py-2 font-mono">{tag.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[var(--muted)]">No EXIF tags found in this JPEG.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function StripExifTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [format, setFormat] = useState<MimeType>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  async function run() {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, 0.92);
      downloadBlob(blob, `${stem(img.name)}-no-exif.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Strip failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_240px]">
          <img src={img.objectUrl} alt="Source" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-3 content-start">
            <Stat label="Original" value={formatBytes(img.size)} />
            <Field label="Clean output">
              <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download without EXIF"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Base64EncodeTool() {
  const [text, setText] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    const file = files[0];
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      const mime = file.type || "application/octet-stream";
      setText(b64);
      setDataUri(`data:${mime};base64,${b64}`);
      setError(null);
    } catch {
      setError("Could not encode that file.");
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} compact={!!dataUri} />
      <ErrorNote message={error} />
      {dataUri ? (
        <div className="mt-5 grid gap-3">
          <img src={dataUri} alt="Encoded" className="max-h-48 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <Field label="Data URI">
            <textarea readOnly value={dataUri} className="control h-28 font-mono text-xs" />
          </Field>
          <Field label="Raw Base64">
            <textarea readOnly value={text} className="control h-28 font-mono text-xs" />
          </Field>
          <div className="flex gap-2">
            <button type="button" className="btn-primary px-5 py-2.5" onClick={() => navigator.clipboard.writeText(dataUri)}>
              Copy data URI
            </button>
            <button
              type="button"
              className="rounded-[10px] border border-[var(--rule)] px-5 py-2.5 font-semibold"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              Copy Base64
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Base64DecodeTool() {
  const [raw, setRaw] = useState("");
  const [out, setOut] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (out) URL.revokeObjectURL(out.url); }, [out]);

  function decode() {
    try {
      const trimmed = raw.trim();
      const match = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const b64 = match ? match[2] : trimmed.replace(/\s/g, "");
      const mime = match?.[1] ?? "image/png";
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      if (out) URL.revokeObjectURL(out.url);
      const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
      setOut({ url: URL.createObjectURL(blob), name: `decoded-image.${ext}` });
      setError(null);
    } catch {
      setError("That string is not valid Base64 / data URI.");
    }
  }

  function download() {
    if (!out) return;
    const a = document.createElement("a");
    a.href = out.url;
    a.download = out.name;
    a.click();
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Field label="Paste Base64 or a data URI">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="control h-40 font-mono text-xs"
          placeholder="data:image/png;base64,..."
        />
      </Field>
      <button type="button" className="btn-primary mt-3 px-5 py-2.5" onClick={decode}>
        Decode
      </button>
      <div className="mt-3">
        <ErrorNote message={error} />
      </div>
      {out ? (
        <div className="mt-5 grid gap-3">
          <img src={out.url} alt="Decoded" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <button type="button" className="btn-primary w-fit px-5 py-2.5" onClick={download}>
            Download image
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ColorPickerTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [color, setColor] = useState<{ hex: string; r: number; g: number; b: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  function onClick(e: MouseEvent<HTMLImageElement>) {
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = Math.min(rect.width / img.width, rect.height / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const ox = (rect.width - dw) / 2;
    const oy = (rect.height - dh) / 2;
    const lx = e.clientX - rect.left - ox;
    const ly = e.clientY - rect.top - oy;
    if (lx < 0 || ly < 0 || lx > dw || ly > dh) return;
    const x = Math.min(img.width - 1, Math.max(0, Math.floor((lx / dw) * img.width)));
    const y = Math.min(img.height - 1, Math.max(0, Math.floor((ly / dh) * img.height)));
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img.bitmap, 0, 0);
    const px = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${[px[0], px[1], px[2]].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
    setColor({ hex, r: px[0], g: px[1], b: px[2] });
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} hint="Click the preview to sample a pixel." compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_240px]">
          <img
            src={img.objectUrl}
            alt="Pick a color"
            className="max-h-[420px] w-full cursor-crosshair rounded-2xl object-contain bg-[var(--cream)]"
            onClick={onClick}
          />
          <div className="grid gap-3 content-start">
            {color ? (
              <>
                <div className="h-20 rounded-xl border border-[var(--rule)]" style={{ background: color.hex }} />
                <Stat label="Hex" value={color.hex} />
                <Stat label="RGB" value={`${color.r}, ${color.g}, ${color.b}`} />
                <button
                  type="button"
                  className="btn-primary px-5 py-2.5"
                  onClick={() => navigator.clipboard.writeText(color.hex)}
                >
                  Copy hex
                </button>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Click the image.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
