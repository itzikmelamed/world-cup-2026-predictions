const fs = require('fs');
const zlib = require('zlib');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ b) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const chunkData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(chunkData), 0);
  return Buffer.concat([len, chunkData, crc]);
}

function createBuffer(width, height, bgColor) {
  const rowBytes = width * 3 + 1;
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 3;
      raw[idx] = bgColor[0];
      raw[idx + 1] = bgColor[1];
      raw[idx + 2] = bgColor[2];
    }
  }
  return raw;
}

function setPixel(raw, width, height, x, y, color) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const rowBytes = width * 3 + 1;
  const idx = y * rowBytes + 1 + x * 3;
  raw[idx] = color[0];
  raw[idx + 1] = color[1];
  raw[idx + 2] = color[2];
}

function fillCircle(raw, width, height, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let dy = -radius; dy <= radius; dy++) {
    const y = cy + dy;
    const dxLimit = Math.floor(Math.sqrt(r2 - dy * dy));
    for (let dx = -dxLimit; dx <= dxLimit; dx++) {
      setPixel(raw, width, height, cx + dx, y, color);
    }
  }
}

function drawLine(raw, width, height, x0, y0, x1, y1, color) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;
  while (true) {
    setPixel(raw, width, height, x, y, color);
    if (x === x1 && y === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

function drawThickLine(raw, width, height, x0, y0, x1, y1, thickness, color) {
  for (let offset = -thickness; offset <= thickness; offset++) {
    const ox = offset;
    const oy = offset;
    drawLine(raw, width, height, x0 + ox, y0, x1 + ox, y1, color);
    drawLine(raw, width, height, x0, y0 + oy, x1, y1 + oy, color);
  }
}

function writePNG(path, width, height, raw) {
  const header = Buffer.from('\x89PNG\r\n\x1a\n', 'binary');
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat = zlib.deflateSync(raw);
  const png = Buffer.concat([
    header,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path, png);
}

function createIcon(width, height) {
  const bg = [15, 23, 42];
  const raw = createBuffer(width, height, bg);
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const radius = Math.floor(width * 0.38);
  const white = [245, 245, 245];
  const black = [18, 18, 18];
  const gold = [251, 191, 36];

  fillCircle(raw, width, height, cx, cy, radius + 2, [12, 18, 34]);
  fillCircle(raw, width, height, cx, cy, radius, white);
  fillCircle(raw, width, height, cx, cy, radius - 8, [235, 235, 235]);
  drawThickLine(raw, width, height, cx - radius + 12, cy, cx + radius - 12, cy, 3, black);
  drawThickLine(raw, width, height, cx, cy - radius + 12, cx, cy + radius - 12, 3, black);
  drawThickLine(raw, width, height, cx - radius + 18, cy - radius + 18, cx + radius - 18, cy + radius - 18, 3, black);
  drawThickLine(raw, width, height, cx - radius + 18, cy + radius - 18, cx + radius - 18, cy - radius + 18, 3, black);

  fillCircle(raw, width, height, cx, cy, Math.floor(radius * 0.18), black);
  fillCircle(raw, width, height, cx, cy, Math.floor(radius * 0.12), gold);

  fillCircle(raw, width, height, cx + Math.floor(radius * 0.55), cy - Math.floor(radius * 0.55), Math.floor(radius * 0.18), gold);
  fillCircle(raw, width, height, cx + Math.floor(radius * 0.55), cy - Math.floor(radius * 0.55), Math.floor(radius * 0.08), black);

  drawLine(raw, width, height, cx - radius + 10, cy + radius - 18, cx + radius - 10, cy - radius + 22, gold);
  drawLine(raw, width, height, cx - radius + 14, cy + radius - 14, cx + radius - 14, cy - radius + 14, gold);

  return raw;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
writePNG('public/icon-192x192.png', 192, 192, createIcon(192, 192));
writePNG('public/icon-512x512.png', 512, 512, createIcon(512, 512));
console.log('icons written');
