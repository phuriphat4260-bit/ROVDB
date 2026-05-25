const html = require('fs').readFileSync('wiki.html', 'utf8'); const cheerio = require('cheerio'); const $ = cheerio.load(html); console.log($('body').text().replace(/\s+/g, ' ').substring(0, 5000));
