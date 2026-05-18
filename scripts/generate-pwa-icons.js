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

function fillRect(raw, width, height, x, y, w, h, color) {
  for (let yi = y; yi < y + h; yi++) {
    for (let xi = x; xi < x + w; xi++) {
      setPixel(raw, width, height, xi, yi, color);
    }
  }
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

function fillRoundedRect(raw, width, height, x, y, w, h, radius, color) {
  if (radius <= 0) {
    fillRect(raw, width, height, x, y, w, h, color);
    return;
  }

  fillRect(raw, width, height, x + radius, y, w - radius * 2, h, color);
  fillRect(raw, width, height, x, y + radius, radius, h - radius * 2, color);
  fillRect(raw, width, height, x + w - radius, y + radius, radius, h - radius * 2, color);
  fillCircle(raw, width, height, x + radius, y + radius, radius, color);
  fillCircle(raw, width, height, x + w - radius - 1, y + radius, radius, color);
  fillCircle(raw, width, height, x + radius, y + h - radius - 1, radius, color);
  fillCircle(raw, width, height, x + w - radius - 1, y + h - radius - 1, radius, color);
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
  const bg = [9, 15, 30];
  const raw = createBuffer(width, height, bg);
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const cupWidth = Math.floor(width * 0.36);
  const cupHeight = Math.floor(height * 0.28);
  const stemWidth = Math.floor(width * 0.08);
  const stemHeight = Math.floor(height * 0.18);
  const baseWidth = Math.floor(width * 0.42);
  const baseHeight = Math.floor(height * 0.08);
  const handleOffsetX = Math.floor(cupWidth * 0.55);
  const handleRadius = Math.floor(cupHeight * 0.45);

  const gold = [246, 179, 0];
  const goldDark = [176, 120, 18];
  const goldLight = [255, 225, 110];
  const accent = [255, 220, 90];

  fillCircle(raw, width, height, cx, cy, Math.floor(width * 0.45), [6, 16, 30]);
  fillCircle(raw, width, height, cx, cy, Math.floor(width * 0.35), [10, 18, 34]);

  fillRoundedRect(
    raw,
    width,
    height,
    cx - Math.floor(cupWidth / 2),
    cy - Math.floor(cupHeight * 0.92),
    cupWidth,
    cupHeight,
    Math.floor(width * 0.04),
    gold
  );
  fillRect(
    raw,
    width,
    height,
    cx - Math.floor(stemWidth / 2),
    cy - Math.floor(cupHeight * 0.08),
    stemWidth,
    stemHeight,
    gold
  );
  fillRect(
    raw,
    width,
    height,
    cx - Math.floor(baseWidth / 2),
    cy + Math.floor(stemHeight * 0.7),
    baseWidth,
    baseHeight,
    goldDark
  );
  fillRect(
    raw,
    width,
    height,
    cx - Math.floor(baseWidth * 0.2),
    cy + Math.floor(stemHeight * 0.7) - Math.floor(baseHeight * 0.45),
    Math.floor(baseWidth * 0.4),
    Math.floor(baseHeight * 0.5),
    gold
  );

  fillCircle(
    raw,
    width,
    height,
    cx - handleOffsetX,
    cy - Math.floor(cupHeight * 0.24),
    handleRadius,
    goldDark
  );
  fillCircle(
    raw,
    width,
    height,
    cx + handleOffsetX,
    cy - Math.floor(cupHeight * 0.24),
    handleRadius,
    goldDark
  );
  fillCircle(
    raw,
    width,
    height,
    cx - handleOffsetX,
    cy - Math.floor(cupHeight * 0.24),
    Math.floor(handleRadius * 0.7),
    bg
  );
  fillCircle(
    raw,
    width,
    height,
    cx + handleOffsetX,
    cy - Math.floor(cupHeight * 0.24),
    Math.floor(handleRadius * 0.7),
    bg
  );

  fillRect(
    raw,
    width,
    height,
    cx - Math.floor(cupWidth / 2) - 2,
    cy - Math.floor(cupHeight * 0.56),
    4,
    Math.floor(cupHeight * 0.42),
    gold
  );
  fillRect(
    raw,
    width,
    height,
    cx + Math.floor(cupWidth / 2) - 2,
    cy - Math.floor(cupHeight * 0.56),
    4,
    Math.floor(cupHeight * 0.42),
    gold
  );

  fillRoundedRect(
    raw,
    width,
    height,
    cx - Math.floor(cupWidth * 0.42),
    cy - Math.floor(cupHeight * 0.82),
    Math.floor(cupWidth * 0.84),
    Math.floor(cupHeight * 0.22),
    Math.floor(width * 0.015),
    goldLight
  );

  drawLine(
    raw,
    width,
    height,
    cx - Math.floor(cupWidth * 0.24),
    cy - Math.floor(cupHeight * 0.25),
    cx + Math.floor(cupWidth * 0.24),
    cy - Math.floor(cupHeight * 0.25),
    accent
  );
  drawLine(
    raw,
    width,
    height,
    cx - Math.floor(cupWidth * 0.2),
    cy + Math.floor(cupHeight * 0.08),
    cx + Math.floor(cupWidth * 0.2),
    cy + Math.floor(cupHeight * 0.08),
    accent
  );

  fillCircle(raw, width, height, cx, cy - Math.floor(cupHeight * 0.32), Math.floor(width * 0.04), accent);
  fillCircle(raw, width, height, cx, cy + Math.floor(cupHeight * 0.02), Math.floor(width * 0.02), accent);
  fillCircle(raw, width, height, cx, cy + Math.floor(cupHeight * 0.14), Math.floor(width * 0.012), accent);

  return raw;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
writePNG('public/icon-192x192.png', 192, 192, createIcon(192, 192));
writePNG('public/icon-512x512.png', 512, 512, createIcon(512, 512));
console.log('icons written');
