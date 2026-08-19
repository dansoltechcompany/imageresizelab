"use client";

import { useEffect, useState } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat, TextInput } from "@/components/Dropzone";
import {
  ACCEPT_RASTER,
  canvasToBlob,
  coverCrop,
  downloadBlob,
  drawImage,
  extFor,
  loadImageFile,
  makeCanvas,
  revokeLoaded,
  stem,
  type LoadedImage,
  type MimeType,
} from "@/lib/image";

const POSITIONS = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
] as const;

export function WatermarkTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [text, setText] = useState("ImageResizeLab");
  const [pos, setPos] = useState<(typeof POSITIONS)[number]>("bottom-right");
  const [size, setSize] = useState(6);
  const [opacity, setOpacity] = useState(0.55);
  const [color, setColor] = useState("#ffffff");
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
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable.");
      const fontSize = Math.max(12, Math.round((img.width * size) / 100));
      ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      const pad = Math.round(img.width * 0.03);
      const metrics = ctx.measureText(text);
      const tw = metrics.width;
      const th = fontSize;
      const xMap = { left: pad, center: (img.width - tw) / 2, right: img.width - tw - pad };
      const yMap = { top: pad + th, center: (img.height + th) / 2, bottom: img.height - pad };
      const horiz = pos.includes("left") ? "left" : pos.includes("right") ? "right" : "center";
      const vert = pos.includes("top") ? "top" : pos.includes("bottom") ? "bottom" : "center";
      ctx.fillText(text, xMap[horiz], yMap[vert]);
      ctx.globalAlpha = 1;
      const blob = await canvasToBlob(canvas, format, 0.9);
      downloadBlob(blob, `${stem(img.name)}-watermark.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Watermark failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_260px]">
          <div
            className="relative overflow-hidden rounded-2xl bg-[var(--cream)]"
            style={{ containerType: "inline-size" }}
          >
            <img src={img.objectUrl} alt="Watermark source" className="max-h-80 w-full object-contain" />
            <span
              className={`pointer-events-none absolute whitespace-nowrap font-bold ${
                pos === "top-left"
                  ? "top-[6%] left-[4%]"
                  : pos === "top"
                    ? "top-[6%] left-1/2 -translate-x-1/2"
                    : pos === "top-right"
                      ? "top-[6%] right-[4%]"
                      : pos === "left"
                        ? "left-[4%] top-1/2 -translate-y-1/2"
                        : pos === "center"
                          ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          : pos === "right"
                            ? "right-[4%] top-1/2 -translate-y-1/2"
                            : pos === "bottom-left"
                              ? "bottom-[6%] left-[4%]"
                              : pos === "bottom"
                                ? "bottom-[6%] left-1/2 -translate-x-1/2"
                                : "bottom-[6%] right-[4%]"
              }`}
              style={{
                color,
                opacity,
                fontSize: `${size}cqw`,
                textShadow: "0 1px 8px rgba(0,0,0,0.35)",
              }}
            >
              {text}
            </span>
          </div>
          <div className="grid gap-3 content-start">
            <Field label="Text">
              <TextInput value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label="Position">
              <Select value={pos} onChange={(e) => setPos(e.target.value as (typeof POSITIONS)[number])}>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p.replace("-", " ")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={`Size ${size}% of width`}>
              <input type="range" min={2} max={18} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Opacity ${Math.round(opacity * 100)}%`}>
              <input type="range" min={0.15} max={1} step={0.01} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="control h-10" />
            </Field>
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

const PASSPORTS = [
  { id: "us", label: "US 2×2 in (600×600 @ 300 dpi)", w: 600, h: 600 },
  { id: "eu", label: "35×45 mm (413×531 @ 300 dpi)", w: 413, h: 531 },
  { id: "in", label: "India 2×2 in (600×600)", w: 600, h: 600 },
];

export function PassportTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [preset, setPreset] = useState(PASSPORTS[0].id);
  const [bg, setBg] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => revokeLoaded(img), [img]);
  const spec = PASSPORTS.find((p) => p.id === preset) ?? PASSPORTS[0];

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
      const crop = coverCrop(img.width, img.height, spec.w, spec.h);
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        crop,
        width: spec.w,
        height: spec.h,
        background: bg,
      });
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
      downloadBlob(blob, `${stem(img.name)}-passport.jpg`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Passport export failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} hint="Crop helper only — not an official passport studio." compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_260px]">
          <img src={img.objectUrl} alt="Passport source" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-3 content-start">
            <Field label="Size">
              <Select value={preset} onChange={(e) => setPreset(e.target.value)}>
                {PASSPORTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Background">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="control h-10" />
            </Field>
            <Stat label="Pixels" value={`${spec.w}×${spec.h}`} />
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : "Download JPEG"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BorderTool() {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [thickness, setThickness] = useState(24);
  const [color, setColor] = useState("#1c1420");
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
      const t = Math.max(1, thickness);
      const { canvas, ctx } = makeCanvas(img.width + t * 2, img.height + t * 2);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img.bitmap, t, t, img.width, img.height);
      const blob = await canvasToBlob(canvas, format, 0.92);
      downloadBlob(blob, `${stem(img.name)}-border.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Border failed.");
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
          <img src={img.objectUrl} alt="Border source" className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]" />
          <div className="grid gap-3 content-start">
            <Field label={`Thickness ${thickness}px`}>
              <input type="range" min={4} max={120} value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="control h-10" />
            </Field>
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

export function FilterTool({
  filter,
  label,
}: {
  filter: string;
  label: string;
}) {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [amount, setAmount] = useState(100);
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

  const css =
    filter === "grayscale"
      ? `grayscale(${amount}%)`
      : `blur(${Math.round((amount / 100) * 18)}px)`;

  async function run() {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        filter: css,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, 0.92);
      downloadBlob(blob, `${stem(img.name)}-${label.toLowerCase()}.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Filter failed.");
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
          <img
            src={img.objectUrl}
            alt={label}
            className="max-h-80 w-full rounded-2xl object-contain bg-[var(--cream)]"
            style={{ filter: css }}
          />
          <div className="grid gap-3 content-start">
            <Field label={`${label} ${amount}%`}>
              <input type="range" min={10} max={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
            </Field>
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

export function PlaceholderTool() {
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("630");
  const [bg, setBg] = useState("#4a1040");
  const [fg, setFg] = useState("#f5a524");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const w = Math.max(16, Number(width) || 1200);
      const h = Math.max(16, Number(height) || 630);
      const { canvas, ctx } = makeCanvas(w, h);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.max(18, Math.round(w / 14))}px Fraunces, serif`;
      ctx.fillText(label || `${w} × ${h}`, w / 2, h / 2);
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `placeholder-${w}x${h}.png`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Width">
          <TextInput type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        </Field>
        <Field label="Height">
          <TextInput type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
        <Field label="Background">
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="control h-10" />
        </Field>
        <Field label="Text color">
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="control h-10" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Label (optional)">
            <TextInput value={label} placeholder="Leave blank to print the size" onChange={(e) => setLabel(e.target.value)} />
          </Field>
        </div>
      </div>
      <div
        className="mt-4 grid place-items-center rounded-2xl text-lg font-display"
        style={{
          background: bg,
          color: fg,
          aspectRatio: `${Math.max(1, Number(width) || 1200)} / ${Math.max(1, Number(height) || 630)}`,
          maxHeight: 280,
        }}
      >
        {label || `${width} × ${height}`}
      </div>
      <button type="button" className="btn-primary mt-4 px-5 py-3" disabled={busy} onClick={run}>
        {busy ? "Working…" : "Download PNG"}
      </button>
    </div>
  );
}
