const http = require('http');

const req = http.get('http://localhost:5000/api/heroes', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    console.log('Success:', parsed.success);
    console.log('Hero count:', parsed.data ? parsed.data.length : 0);
    if (parsed.data && parsed.data.length > 0) {
      console.log('First hero name:', parsed.data[0].name);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.setTimeout(15000, () => {
  console.error('Request timed out after 15s');
  req.destroy();
});
