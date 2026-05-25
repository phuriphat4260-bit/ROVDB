const https = require('https');
https.get('https://content.richmanshop.com/how-to-play-rov/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const headings = [...data.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('--- HEADINGS ---');
    console.log(headings.join('\n'));
    
    const imgs = [...data.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
    console.log('--- IMAGES ---');
    console.log(imgs.slice(0, 15).join('\n'));
  });
});
