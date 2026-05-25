const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('amily.html', 'utf8');
const $ = cheerio.load(html);

console.log('Story 1:', $('#story').text().trim().substring(0, 100));
console.log('Story 2:', $('#story p').text().trim().substring(0, 100));
console.log('Story 3:', $('.storyContent').text().trim().substring(0, 100));
console.log('Story 4:', $('.overviewRole__info--role').text().trim());
