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

function writePNG(path, width, height, color) {
  const [r, g, b] = color;
  const header = Buffer.from('\x89PNG\r\n\x1a\n', 'binary');
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const rowBytes = width * 3 + 1;
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 3;
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
    }
  }
  const idat = zlib.deflateSync(raw);
  const png = Buffer.concat([
    header,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path, png);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
writePNG('public/icon-192x192.png', 192, 192, [251, 191, 36]);
writePNG('public/icon-512x512.png', 512, 512, [251, 191, 36]);
console.log('icons written');
