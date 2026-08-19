"use client";

import { useEffect, useMemo, useState } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat, TextInput } from "@/components/Dropzone";
import { FAVICON_SIZES, SOCIAL_PRESETS } from "@/lib/presets";
import { makeIco, zipBlobs } from "@/lib/zip";
import {
  ACCEPT_RASTER,
  canvasToBlob,
  coverCrop,
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

export function FaviconTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
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
      const crop = coverCrop(img.width, img.height, 1, 1);
      const pngs = [];
      for (const size of FAVICON_SIZES) {
        const canvas = drawImage(img.bitmap, img.width, img.height, {
          crop,
          width: size,
          height: size,
        });
        pngs.push({ size, blob: await canvasToBlob(canvas, "image/png") });
      }
      const ico = await makeIco(pngs.filter((p) => p.size <= 48));
      const zip = await zipBlobs([
        { name: "favicon.ico", blob: ico },
        ...pngs.map((p) => ({ name: `favicon-${p.size}.png`, blob: p.blob })),
      ]);
      downloadBlob(zip, `${stem(img.name)}-favicons.zip`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Favicon export failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} hint="A square logo works best. Non-square images are center-cropped." compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_240px]">
          <img src={img.objectUrl} alt="Favicon source" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-3 content-start">
            <Stat label="Sizes" value="16–512 + ICO" />
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download zip"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SocialTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [presetId, setPresetId] = useState(SOCIAL_PRESETS[0].id);
  const [format, setFormat] = useState<MimeType>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);
  const preset = SOCIAL_PRESETS.find((p) => p.id === presetId) ?? SOCIAL_PRESETS[0];
  const groups = useMemo(() => [...new Set(SOCIAL_PRESETS.map((p) => p.group))], []);

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
      const crop = coverCrop(img.width, img.height, preset.width, preset.height);
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        crop,
        width: preset.width,
        height: preset.height,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, 0.9);
      downloadBlob(blob, `${stem(img.name)}-${preset.id}.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
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
          <img src={img.objectUrl} alt="Social source" className="max-h-[420px] w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-3 content-start">
            <Field label="Preset">
              <Select value={presetId} onChange={(e) => setPresetId(e.target.value)}>
                {groups.map((group) => (
                  <optgroup key={group} label={group}>
                    {SOCIAL_PRESETS.filter((p) => p.group === group).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label} ({p.width}×{p.height})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </Field>
            <Stat label="Output" value={`${preset.width}×${preset.height}`} />
            <Field label="Format">
              <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BulkResizeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [maxSide, setMaxSide] = useState("1600");
  const [format, setFormat] = useState<MimeType>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const cap = Math.max(16, Number(maxSide) || 1600);
      const out: { name: string; blob: Blob }[] = [];
      let failed = 0;
      for (const file of files) {
        try {
          const img = await loadImageFile(file);
          const scale = Math.min(1, cap / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = drawImage(img.bitmap, img.width, img.height, {
            width: w,
            height: h,
            background: format === "image/jpeg" ? "#ffffff" : undefined,
          });
          const blob = await canvasToBlob(canvas, format, 0.86);
          out.push({ name: `${stem(img.name)}-${w}x${h}.${extFor(format)}`, blob });
          revokeLoaded(img);
        } catch {
          failed += 1;
        }
      }
      if (!out.length) throw new Error("None of those files could be resized.");
      downloadBlob(await zipBlobs(out), "resized-images.zip");
      if (failed) {
        setError(`${failed} file${failed === 1 ? "" : "s"} skipped. ${out.length} resized.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk resize failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone
        accept={ACCEPT_RASTER}
        multiple
        onFiles={setFiles}
        compact={files.length > 0}
        hint="Drop many photos. They are zipped after resize. Huge batches can strain memory."
      />
      <ErrorNote message={error} />
      {files.length ? (
        <div className="mt-5 grid gap-3">
          <Stat label="Files" value={files.length} />
          <Field label="Longest side (px)">
            <TextInput type="number" min={16} value={maxSide} onChange={(e) => setMaxSide(e.target.value)} />
          </Field>
          <Field label="Output">
            <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </Select>
          </Field>
          <ul className="max-h-40 overflow-auto text-sm text-[var(--muted)]">
            {files.map((f) => (
              <li key={f.name + f.size}>
                {f.name} · {formatBytes(f.size)}
              </li>
            ))}
          </ul>
          <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
            {busy ? "Working…" : "Download zip"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RotateTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
        rotate,
        flipH,
        flipV,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, 0.92);
      downloadBlob(blob, `${stem(img.name)}-rotated.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rotate failed.");
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
          <div className="flex min-h-[20rem] items-center justify-center overflow-hidden rounded-2xl bg-[var(--cream)] p-12">
            <img
              src={img.objectUrl}
              alt="Rotate source"
              className="max-h-64 max-w-full object-contain"
              style={{
                transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
            />
          </div>
          <div className="grid gap-2 content-start">
            <div className="flex flex-wrap gap-2">
              {([0, 90, 180, 270] as const).map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotate(deg)}
                  className={`chip px-3 py-1.5 text-sm ${rotate === deg ? "chip-on" : ""}`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} />
              Flip horizontal
            </label>
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} />
              Flip vertical
            </label>
            <Field label="Output">
              <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
