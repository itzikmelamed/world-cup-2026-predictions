const https = require('https');

const urls = [
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.png',
  '/favicon.ico'
];

let done = 0;

urls.forEach(u => {
  https.get('https://world-cup-2026-predictions.vercel.app' + u, res => {
    console.log(u, res.statusCode);
    done++;
    if (done === urls.length) process.exit(0);
  }).on('error', e => {
    console.log(u, 'ERROR:', e.message);
    done++;
    if (done === urls.length) process.exit(1);
  });
});

setTimeout(() => {
  console.log('Timeout waiting for responses');
  process.exit(1);
}, 30000);
