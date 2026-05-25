const https = require('https');
https.get('https://arena-of-valor.fandom.com/th/api.php?action=parse&page=%E0%B9%84%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B8%A1&prop=wikitext&format=json', {headers: {'User-Agent': 'Mozilla/5.0'}}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const wiki = JSON.parse(data).parse.wikitext['*'];
    const row = wiki.split('|-').find(r => r.includes('Orb of the Magi'));
    if (!row) { console.log('not found'); return; }

    const lines = row.split('\n');
    const cells = [];
    let currentCell = null;
    for (const line of lines) {
      if (line.startsWith('|') && !line.startsWith('|-')) {
        if (currentCell !== null) cells.push(currentCell);
        currentCell = line.slice(1);
      } else if (line.startsWith('*') || line.startsWith(' *')) {
        currentCell = (currentCell || '') + '\n' + line;
      } else if (currentCell !== null) {
        currentCell += (currentCell ? ' ' : '') + line;
      }
    }
    if (currentCell !== null) cells.push(currentCell);

    console.log("Raw cells:");
    cells.forEach((c, i) => console.log(`[${i}]: ${c}`));

    let cellIdx = 0;
    for (let ci = 0; ci < cells.length; ci++) {
      const cell = cells[ci].trim();
      if (cell.includes('โกลด์') || cell.match(/^\d+$/)) {
        cellIdx = ci;
        break;
      }
    }
    console.log("Price cell index:", cellIdx);
    console.log("Expected Passive (cellIdx + 2):", cells[cellIdx + 2]);
    console.log("Expected Components (cellIdx + 3):", cells[cellIdx + 3]);
  });
});
