"use client";

import { useEffect, useState } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat, TextInput } from "@/components/Dropzone";
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

export function ResizeTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [percent, setPercent] = useState(100);
  const [maxSide, setMaxSide] = useState("");
  const [format, setFormat] = useState<MimeType>("image/jpeg");
  const [quality, setQuality] = useState(0.86);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => revokeLoaded(img), [img]);

  async function onFiles(files: File[]) {
    setError(null);
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setWidth(next.width);
      setHeight(next.height);
      setPercent(100);
      setMaxSide("");
    } catch {
      setError("Could not read that file. Try JPG, PNG, WebP, GIF, or BMP.");
    }
  }

  function setW(n: number) {
    setWidth(n);
    if (lock && img) setHeight(Math.max(1, Math.round((n * img.height) / img.width)));
  }

  function setH(n: number) {
    setHeight(n);
    if (lock && img) setWidth(Math.max(1, Math.round((n * img.width) / img.height)));
  }

  function applyPercent(p: number) {
    if (!img) return;
    setPercent(p);
    setWidth(Math.max(1, Math.round((img.width * p) / 100)));
    setHeight(Math.max(1, Math.round((img.height * p) / 100)));
  }

  function applyMaxSide() {
    if (!img) return;
    const cap = Number(maxSide);
    if (!cap) return;
    const scale = cap / Math.max(img.width, img.height);
    if (scale >= 1) {
      setWidth(img.width);
      setHeight(img.height);
      return;
    }
    setWidth(Math.max(1, Math.round(img.width * scale)));
    setHeight(Math.max(1, Math.round(img.height * scale)));
  }

  async function run() {
    if (!img) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        width,
        height,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, quality);
      downloadBlob(blob, `${stem(img.name)}-${width}x${height}.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
          <img
            src={img.objectUrl}
            alt="Original"
            className="max-h-[420px] w-full rounded-2xl object-contain bg-[var(--cream)]"
          />
          <div className="grid gap-3 content-start">
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Original" value={`${img.width}×${img.height}`} />
              <Stat label="File" value={formatBytes(img.size)} />
            </div>
            <Field label="Width (px)">
              <TextInput
                type="number"
                min={1}
                value={width}
                onChange={(e) => setW(Number(e.target.value) || 1)}
              />
            </Field>
            <Field label="Height (px)">
              <TextInput
                type="number"
                min={1}
                value={height}
                onChange={(e) => setH(Number(e.target.value) || 1)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
              Lock aspect ratio
            </label>
            <Field label={`Scale ${percent}%`}>
              <input
                type="range"
                min={5}
                max={200}
                value={percent}
                onChange={(e) => applyPercent(Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label="Fit longest side">
              <div className="flex gap-2">
                <TextInput
                  type="number"
                  placeholder="e.g. 1920"
                  value={maxSide}
                  onChange={(e) => setMaxSide(e.target.value)}
                />
                <button
                  type="button"
                  className="rounded-[10px] border border-[var(--rule)] px-3 font-semibold"
                  onClick={applyMaxSide}
                >
                  Apply
                </button>
              </div>
            </Field>
            <Field label="Output">
              <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
            {format !== "image/png" ? (
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
            <button
              type="button"
              className="btn-primary px-5 py-3"
              disabled={busy || width < 1 || height < 1}
              onClick={run}
            >
              {busy ? "Working…" : `Download ${width}×${height}`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
