function crc32(buf: Uint8Array) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function u16(n: number) {
  return new Uint8Array([n & 255, (n >>> 8) & 255]);
}

function u32(n: number) {
  return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
}

function concat(parts: Uint8Array[]) {
  const len = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function dosDate(d = new Date()) {
  const time =
    (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const date =
    ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}

export async function zipBlobs(files: { name: string; blob: Blob }[]) {
  const { time, date } = dosDate();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const name = new TextEncoder().encode(file.name);
    const crc = crc32(data);
    const local = concat([
      new Uint8Array([0x50, 0x4b, 0x03, 0x04, 20, 0, 0, 8, 0, 0]),
      u16(time),
      u16(date),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
      data,
    ]);
    const central = concat([
      new Uint8Array([0x50, 0x4b, 0x01, 0x02, 20, 0, 20, 0, 0, 8, 0, 0]),
      u16(time),
      u16(date),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }

  const centralDir = concat(centrals);
  const end = concat([
    new Uint8Array([0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0]),
    u16(files.length),
    u16(files.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ]);
  return new Blob([concat([...locals, centralDir, end])], { type: "application/zip" });
}

export async function makeIco(pngs: { size: number; blob: Blob }[]) {
  const entries = [];
  let offset = 6 + pngs.length * 16;
  const payloads: Uint8Array[] = [];
  for (const item of pngs) {
    const data = new Uint8Array(await item.blob.arrayBuffer());
    const size = item.size >= 256 ? 0 : item.size;
    entries.push(
      concat([
        new Uint8Array([size, size, 0, 0, 1, 0, 32, 0]),
        u32(data.length),
        u32(offset),
      ]),
    );
    payloads.push(data);
    offset += data.length;
  }
  const header = concat([new Uint8Array([0, 0, 1, 0]), u16(pngs.length)]);
  return new Blob([concat([header, ...entries, ...payloads])], {
    type: "image/x-icon",
  });
}
