export type ExifTag = { label: string; value: string };

const TAGS: Record<number, string> = {
  0x010f: "Make",
  0x0110: "Model",
  0x0112: "Orientation",
  0x011a: "XResolution",
  0x011b: "YResolution",
  0x0128: "ResolutionUnit",
  0x0131: "Software",
  0x0132: "DateTime",
  0x013b: "Artist",
  0x0100: "ImageWidth",
  0x0101: "ImageHeight",
  0x829a: "ExposureTime",
  0x829d: "FNumber",
  0x8827: "ISO",
  0x9003: "DateTimeOriginal",
  0x9004: "DateTimeDigitized",
  0x920a: "FocalLength",
  0xa002: "ExifImageWidth",
  0xa003: "ExifImageHeight",
  0xa403: "WhiteBalance",
  0xa406: "SceneCaptureType",
  0x010e: "ImageDescription",
};

const GPS_TAGS: Record<number, string> = {
  0x0001: "GPSLatitudeRef",
  0x0002: "GPSLatitude",
  0x0003: "GPSLongitudeRef",
  0x0004: "GPSLongitude",
  0x0005: "GPSAltitudeRef",
  0x0006: "GPSAltitude",
};

function readStr(view: DataView, offset: number, len: number) {
  let s = "";
  for (let i = 0; i < len; i++) {
    const c = view.getUint8(offset + i);
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s.trim();
}

function readValue(
  view: DataView,
  le: boolean,
  type: number,
  count: number,
  valueOffset: number,
): string | number | number[] | null {
  const sizeOf = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] ?? 1;
  const size = sizeOf * count;
  let off = valueOffset;
  if (size <= 4) off = valueOffset;
  try {
    if (type === 2) return readStr(view, off, count);
    if (type === 3) {
      if (count === 1) return view.getUint16(off, le);
      const arr = [];
      for (let i = 0; i < Math.min(count, 8); i++) arr.push(view.getUint16(off + i * 2, le));
      return arr;
    }
    if (type === 4) {
      if (count === 1) return view.getUint32(off, le);
      return view.getUint32(off, le);
    }
    if (type === 5) {
      const nums = [];
      for (let i = 0; i < Math.min(count, 3); i++) {
        const n = view.getUint32(off + i * 8, le);
        const d = view.getUint32(off + i * 8 + 4, le) || 1;
        nums.push(n / d);
      }
      return count === 1 ? nums[0] : nums;
    }
    if (type === 10) {
      const n = view.getInt32(off, le);
      const d = view.getInt32(off + 4, le) || 1;
      return n / d;
    }
    if (type === 1 || type === 7) {
      if (count === 1) return view.getUint8(off);
      return view.getUint8(off);
    }
  } catch {
    return null;
  }
  return null;
}

function formatTag(name: string, value: string | number | number[]): string {
  if (name === "Orientation" && typeof value === "number") {
    const map: Record<number, string> = {
      1: "Normal",
      2: "Mirror horizontal",
      3: "Rotate 180°",
      4: "Mirror vertical",
      5: "Mirror horizontal and rotate 270°",
      6: "Rotate 90° CW",
      7: "Mirror horizontal and rotate 90°",
      8: "Rotate 270° CW",
    };
    return map[value] ?? String(value);
  }
  if (name === "ExposureTime" && typeof value === "number") {
    if (value > 0 && value < 1) return `1/${Math.round(1 / value)} s`;
    return `${value} s`;
  }
  if (name === "FNumber" && typeof value === "number") return `f/${value}`;
  if (name === "FocalLength" && typeof value === "number") return `${value} mm`;
  if (Array.isArray(value)) return value.map((n) => (Number.isInteger(n) ? n : n.toFixed(4))).join(", ");
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(4);
  return String(value);
}

function parseIfd(
  view: DataView,
  tiffStart: number,
  ifdOffset: number,
  le: boolean,
  names: Record<number, string>,
) {
  const out: Record<string, string | number | number[]> = {};
  const start = tiffStart + ifdOffset;
  if (start + 2 > view.byteLength) return out;
  const count = view.getUint16(start, le);
  for (let i = 0; i < count; i++) {
    const entry = start + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;
    const tag = view.getUint16(entry, le);
    const type = view.getUint16(entry + 2, le);
    const countVal = view.getUint32(entry + 4, le);
    const sizeOf = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] ?? 1;
    const valueOffset =
      sizeOf * countVal <= 4 ? entry + 8 : tiffStart + view.getUint32(entry + 8, le);
    const name = names[tag];
    if (!name) continue;
    const value = readValue(view, le, type, countVal, valueOffset);
    if (value !== null) out[name] = value;
  }
  return out;
}

export function parseJpegExif(buffer: ArrayBuffer): ExifTag[] {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return [];
  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1) {
      const start = offset + 4;
      if (readStr(view, start, 4) !== "Exif") return [];
      const tiffStart = start + 6;
      const le = view.getUint16(tiffStart) === 0x4949;
      const ifd0 = view.getUint32(tiffStart + 4, le);
      const tags = parseIfd(view, tiffStart, ifd0, le, TAGS);
      const ifd0Start = tiffStart + ifd0;
      const n = view.getUint16(ifd0Start, le);
      const next = view.getUint32(ifd0Start + 2 + n * 12, le);
      const gpsPtr = (() => {
        for (let i = 0; i < n; i++) {
          const entry = ifd0Start + 2 + i * 12;
          if (view.getUint16(entry, le) === 0x8825) {
            return view.getUint32(entry + 8, le);
          }
        }
        return 0;
      })();
      const exifPtr = (() => {
        for (let i = 0; i < n; i++) {
          const entry = ifd0Start + 2 + i * 12;
          if (view.getUint16(entry, le) === 0x8769) {
            return view.getUint32(entry + 8, le);
          }
        }
        return 0;
      })();
      if (exifPtr) Object.assign(tags, parseIfd(view, tiffStart, exifPtr, le, TAGS));
      if (gpsPtr) {
        const gps = parseIfd(view, tiffStart, gpsPtr, le, GPS_TAGS);
        const lat = gps.GPSLatitude;
        const lon = gps.GPSLongitude;
        if (Array.isArray(lat) && lat.length >= 3) {
          let deg = lat[0] + lat[1] / 60 + lat[2] / 3600;
          if (gps.GPSLatitudeRef === "S") deg = -deg;
          tags.GPSLatitude = deg;
        }
        if (Array.isArray(lon) && lon.length >= 3) {
          let deg = lon[0] + lon[1] / 60 + lon[2] / 3600;
          if (gps.GPSLongitudeRef === "W") deg = -deg;
          tags.GPSLongitude = deg;
        }
      }
      void next;
      return Object.entries(tags).map(([label, value]) => ({
        label,
        value: formatTag(label, value),
      }));
    }
    if (marker === 0xda) break;
    offset += 2 + size;
  }
  return [];
}
