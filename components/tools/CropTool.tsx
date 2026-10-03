"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dropzone, ErrorNote, Field, Select, Stat } from "@/components/Dropzone";
import {
  ACCEPT_RASTER,
  canvasToBlob,
  downloadBlob,
  drawImage,
  extFor,
  loadImageFile,
  revokeLoaded,
  stem,
  type LoadedImage,
  type MimeType,
} from "@/lib/image";

const ASPECTS = [
  { id: "free", label: "Free", value: 0 },
  { id: "1-1", label: "1:1", value: 1 },
  { id: "4-3", label: "4:3", value: 4 / 3 },
  { id: "3-4", label: "3:4", value: 3 / 4 },
  { id: "16-9", label: "16:9", value: 16 / 9 },
  { id: "9-16", label: "9:16", value: 9 / 16 },
];

export function CropTool({
  lockedAspect,
  circle = false,
  outSize,
  outSizes,
  filenameSuffix = "cropped",
}: {
  lockedAspect?: number;
  circle?: boolean;
  outSize?: number;
  outSizes?: number[];
  filenameSuffix?: string;
}) {
  const [img, setImg] = useState<LoadedImage | null>(null);
  const [aspect, setAspect] = useState(lockedAspect ?? 0);
  const [crop, setCrop] = useState({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [sizeOut, setSizeOut] = useState(outSize ?? outSizes?.[0] ?? 0);
  const [drag, setDrag] = useState<"move" | "br" | null>(null);
  const [format, setFormat] = useState<MimeType>(circle ? "image/png" : "image/jpeg");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const dragOff = useRef({ x: 0, y: 0 });

  useEffect(() => () => revokeLoaded(img), [img]);

  function fitAspectBox(nextAspect: number, srcW: number, srcH: number) {
    if (!nextAspect) return { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
    const imgA = srcW / srcH;
    if (imgA > nextAspect) {
      const h = 0.9;
      const w = (h * nextAspect * srcH) / srcW;
      return { x: (1 - w) / 2, y: 0.05, w, h };
    }
    const w = 0.9;
    const h = (w / nextAspect) * (srcW / srcH);
    return { x: 0.05, y: (1 - h) / 2, w, h };
  }

  async function onFiles(files: File[]) {
    setError(null);
    try {
      const next = await loadImageFile(files[0]);
      revokeLoaded(img);
      setImg(next);
      setCrop(fitAspectBox(lockedAspect ?? aspect, next.width, next.height));
    } catch {
      setError("Could not read that image.");
    }
  }

  const px = useMemo(() => {
    if (!img) return { x: 0, y: 0, w: 0, h: 0 };
    return {
      x: Math.round(crop.x * img.width),
      y: Math.round(crop.y * img.height),
      w: Math.round(crop.w * img.width),
      h: Math.round(crop.h * img.height),
    };
  }, [img, crop]);

  function clientToNorm(clientX: number, clientY: number) {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (clientY - box.top) / box.height)),
    };
  }

  useEffect(() => {
    if (!drag) return;
    function move(e: PointerEvent) {
      const p = clientToNorm(e.clientX, e.clientY);
      setCrop((c) => {
        const next = { ...c };
        if (drag === "move") {
          next.x = Math.min(1 - c.w, Math.max(0, p.x - dragOff.current.x));
          next.y = Math.min(1 - c.h, Math.max(0, p.y - dragOff.current.y));
        }
        if (drag === "br") {
          next.w = Math.max(0.05, p.x - c.x);
          next.h = Math.max(0.05, p.y - c.y);
          if (img && aspect) {
            const imgA = img.width / img.height;
            const target = aspect / imgA;
            next.h = next.w / target;
            if (next.y + next.h > 1) {
              next.h = 1 - next.y;
              next.w = next.h * target;
            }
          }
        }
        next.w = Math.min(next.w, 1 - next.x);
        next.h = Math.min(next.h, 1 - next.y);
        return next;
      });
    }
    function up() {
      setDrag(null);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, aspect, img]);

  async function run() {
    if (!img || px.w < 1 || px.h < 1) return;
    setBusy(true);
    try {
      const side = sizeOut || undefined;
      const width = side ?? px.w;
      const height = side ?? px.h;
      const canvas = drawImage(img.bitmap, img.width, img.height, {
        crop: px,
        width: circle ? Math.min(width, height) : width,
        height: circle ? Math.min(width, height) : height,
        circle,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });
      const blob = await canvasToBlob(canvas, format, 0.92);
      downloadBlob(blob, `${stem(img.name)}-${filenameSuffix}.${extFor(format)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Crop failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-5 sm:p-7">
      <Dropzone accept={ACCEPT_RASTER} onFiles={onFiles} compact={!!img} />
      <ErrorNote message={error} />
      {img ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_240px]">
          <div
            ref={frame}
            className="relative touch-none overflow-hidden rounded-2xl bg-[var(--cream)] select-none"
          >
            <img src={img.objectUrl} alt="Crop source" className="block w-full" draggable={false} />
            <div
              className={`absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(28,10,24,0.45)] ${circle ? "rounded-full" : ""}`}
              style={{
                left: `${crop.x * 100}%`,
                top: `${crop.y * 100}%`,
                width: `${crop.w * 100}%`,
                height: `${crop.h * 100}%`,
              }}
              onPointerDown={(e) => {
                const p = clientToNorm(e.clientX, e.clientY);
                dragOff.current = { x: p.x - crop.x, y: p.y - crop.y };
                setDrag("move");
              }}
            >
              <button
                type="button"
                aria-label="Resize crop"
                className="absolute bottom-1 right-1 size-4 cursor-nwse-resize rounded-full bg-[#f5a524]"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDrag("br");
                }}
              />
            </div>
          </div>
          <div className="grid gap-3 content-start">
            <Stat label="Crop" value={`${px.w}×${px.h}`} />
            {lockedAspect == null ? (
              <Field label="Aspect">
                <Select
                  value={String(aspect)}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setAspect(next);
                    setCrop(fitAspectBox(next, img.width, img.height));
                  }}
                >
                  {ASPECTS.map((a) => (
                    <option key={a.id} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}
            {outSizes?.length ? (
              <Field label="Export size">
                <Select value={String(sizeOut)} onChange={(e) => setSizeOut(Number(e.target.value))}>
                  {outSizes.map((n) => (
                    <option key={n} value={n}>
                      {n}×{n}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}
            {!circle ? (
              <Field label="Output">
                <Select value={format} onChange={(e) => setFormat(e.target.value as MimeType)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </Select>
              </Field>
            ) : null}
            <p className="text-sm text-[var(--muted)]">
              Drag the box to move. Drag the gold handle to resize.
            </p>
            <button type="button" className="btn-primary px-5 py-3" disabled={busy} onClick={run}>
              {busy ? "Working…" : circle ? "Download circle PNG" : "Download crop"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
