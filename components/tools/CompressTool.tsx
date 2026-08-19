"use client";

import { useEffect, useState } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat, TextInput } from "@/components/Dropzone";
import {
  ACCEPT_RASTER,
  canvasToBlob,
  downloadBlob,
  drawImage,
  encodeToMaxBytes,
  extFor,
  formatBytes,
  loadImageFile,
  revokeLoaded,
  stem,
  type LoadedImage,
  type MimeType,
} from "@/lib/image";

export function CompressTool({
  forceFormat,
  accept = ACCEPT_RASTER,
  defaultQuality = 0.75,
  defaultFormat = "image/jpeg",
  allowTarget = false,
}: {
  forceFormat?: MimeType;
  accept?: string;
  defaultQuality?: number;
  defaultFormat?: MimeType;
  allowTarget?: boolean;
}) {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [format, setFormat] = useState<MimeType>(forceFormat ?? defaultFormat);
  const [quality, setQuality] = useState(defaultQuality);
  const [targetKb, setTargetKb] = useState("200");
  const [preview, setPreview] = useState<{ url: string; size: number } | null>(null);
  const [bg, setBg] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => revokeLoaded(img), [img]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);

  async function onFiles(files: File[]) {
    setError(null);
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setPreview(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  async function previewNow() {
    if (!img) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        background: format === "image/jpeg" ? bg : undefined,
      });
      let blob: Blob;
      if (allowTarget && format !== "image/png") {
        const max = Math.max(8, Number(targetKb) || 200) * 1024;
        blob = (await encodeToMaxBytes(canvas, format, max)).blob;
      } else {
        blob = await canvasToBlob(canvas, format, quality);
      }
      if (preview) URL.revokeObjectURL(preview.url);
      setPreview({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compress failed.");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        background: format === "image/jpeg" ? bg : undefined,
      });
      let blob: Blob;
      if (allowTarget && format !== "image/png") {
        const max = Math.max(8, Number(targetKb) || 200) * 1024;
        blob = (await encodeToMaxBytes(canvas, format, max)).blob;
      } else {
        blob = await canvasToBlob(canvas, format, quality);
      }
      downloadBlob(blob, `${stem(img.name)}-compressed.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={accept} onFiles={onFiles} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
              Original
            </p>
            <img src={img.objectUrl} alt="Original" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
              Preview
            </p>
            {preview ? (
              <img src={preview.url} alt="Compressed preview" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
            ) : (
              <div className="grid h-48 place-items-center rounded-2xl bg-[var(--cream)] text-sm text-[var(--muted)]">
                Hit Preview to encode in this tab
              </div>
            )}
          </div>
          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-4">
            <Stat label="Original size" value={formatBytes(img.size)} />
            <Stat label="Pixels" value={`${img.width}×${img.height}`} />
            <Stat label="New size" value={preview ? formatBytes(preview.size) : "—"} />
            <Stat
              label="Saved"
              value={
                preview
                  ? preview.size >= img.size
                    ? "Same or larger"
                    : `${Math.round((1 - preview.size / img.size) * 100)}%`
                  : "—"
              }
            />
          </div>
          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-2">
            {!forceFormat ? (
              <Field label="Output format">
                <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                </Select>
              </Field>
            ) : null}
            {format === "image/jpeg" && !img.type.includes("jpeg") ? (
              <Field label="JPEG background">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="control h-10"
                />
              </Field>
            ) : null}
            {allowTarget ? (
              <Field label="Target size (KB)">
                <TextInput
                  type="number"
                  min={8}
                  value={targetKb}
                  onChange={(e) => setTargetKb(e.target.value)}
                />
              </Field>
            ) : format !== "image/png" ? (
              <Field label={`Quality ${Math.round(quality * 100)}%`}>
                <input
                  type="range"
                  min={0.2}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </Field>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                PNG has no quality slider in the browser. Use WebP or JPEG for a
                smaller file, or shrink dimensions on the image resizer.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button type="button" className="rounded-[10px] border border-[var(--rule)] px-5 py-3 font-semibold" disabled={busy} onClick={previewNow}>
              Preview
            </button>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={download}>
              {busy ? "Working…" : "Download"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
