const http = require('http');
const tests = [
  'http://localhost:5000/api/items/fenrir-s-tooth',
  'http://localhost:5000/api/items/sonic-boots',
  'http://localhost:5000/api/items/spear-of-longinus',
  'http://localhost:5000/api/items/shield-of-the-lost',
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.success && parsed.data) {
          const item = parsed.data;
          console.log(`✅ ${item.name}: ${item.category} | ${item.price} Gold | stats: ${item.stats?.slice(0,40)}... | passive: ${item.passive?.slice(0,50)}...`);
        } else {
          console.log(`❌ Not found for URL: ${url}`);
        }
        resolve();
      });
    }).on('error', (e) => { console.error(`Error: ${e.message}`); resolve(); });
  });
}

async function main() {
  console.log('Testing Item API endpoints...\n');
  for (const url of tests) {
    await testEndpoint(url);
  }
}

main();
