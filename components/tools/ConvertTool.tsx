"use client";

import { useEffect, useState } from "react";
import { Dropzone, ErrorNote, Field, Stat, TextInput } from "@/components/Dropzone";
import {
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

export function ConvertTool({
  accept,
  output,
  background = "#ffffff",
  hint,
}: {
  accept: string;
  output: MimeType;
  background?: string;
  hint?: string;
}) {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [bg, setBg] = useState(background);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    setError(null);
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
    } catch {
      setError("Could not decode that file. Check the format this page accepts.");
    }
  }

  async function run() {
    if (!img) return;
    setBusy(true);
    setError(null);
    try {
      const needsBg = output === "image/jpeg";
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        background: needsBg ? bg : undefined,
      });
      const blob = await canvasToBlob(canvas, output, quality);
      downloadBlob(blob, `${stem(img.name)}.${extFor(output)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Convert failed.");
    } finally {
      setBusy(false);
    }
  }

  const needsQuality = output !== "image/png";
  const needsBg = output === "image/jpeg";

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={accept} onFiles={onFiles} hint={hint} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
          <img
            src={img.objectUrl}
            alt="To convert"
            className="max-h-[420px] w-full rounded-2xl object-contain bg-[var(--cream)]"
          />
          <div className="grid gap-3 content-start">
            <Stat label="Source" value={`${img.width}×${img.height}`} />
            <Stat label="Size" value={formatBytes(img.size)} />
            {needsBg ? (
              <Field label="Background (for transparency)">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="control h-10"
                />
              </Field>
            ) : null}
            {needsQuality ? (
              <Field label={`Quality ${Math.round(quality * 100)}%`}>
                <input
                  type="range"
                  min={0.4}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </Field>
            ) : null}
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : `Download .${extFor(output)}`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SvgToPngTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState("1024");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const text = await file.text();
      const svgUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not render this SVG."));
        image.src = svgUrl;
      });
      const w = Math.max(1, Number(width) || 1024);
      const scale = w / (image.naturalWidth || w);
      const h = Math.max(1, Math.round((image.naturalHeight || w) * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable.");
      ctx.drawImage(image, 0, 0, w, h);
      URL.revokeObjectURL(svgUrl);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed."))), "image/png");
      });
      downloadBlob(blob, `${stem(file.name)}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "SVG convert failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept="image/svg+xml,.svg" onFiles={onFiles} hint="SVG only. Fonts and remote images inside the file may not render." compact={!!file} />
      <ErrorNote message={error} />
      {file && preview ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_240px]">
          <img src={preview} alt="SVG preview" className="max-h-80 w-full rounded-2xl object-contain bg-white" />
          <div className="grid gap-3 content-start">
            <Field label="Output width (px)">
              <TextInput type="number" min={16} value={width} onChange={(e) => setWidth(e.target.value)} />
            </Field>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download PNG"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
