const https = require('https');

https.get('https://world-cup-2026-predictions.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    // Look for manifest.json reference
    const lines = data.split('\n');
    const headLines = lines.filter(l => 
      l.includes('manifest') || 
      l.includes('icon') || 
      l.includes('apple') ||
      l.includes('<link') ||
      l.includes('next-env')
    );
    console.log('=== Deployed HTML head references ===');
    headLines.forEach(l => console.log(l.trim()));
  });
}).on('error', e => {
  console.error('Error:', e.message);
});
