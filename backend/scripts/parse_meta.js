const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('C:\\\\Users\\\\ASUS\\\\.gemini\\\\antigravity\\\\brain\\\\84a9a87b-38ce-478e-8a42-953a11de59f9\\\\.system_generated\\\\steps\\\\827\\\\content.md', 'utf8');
const $ = cheerio.load(html);

// Dump all text
const text = $('body').text().replace(/\s+/g, ' ');
fs.writeFileSync('richmanshop_text.txt', text);
console.log("Wrote richmanshop_text.txt");
