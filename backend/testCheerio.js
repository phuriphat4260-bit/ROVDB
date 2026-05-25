const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('amily.html', 'utf8');
const $ = cheerio.load(html);

console.log('Role:', $('.overviewRole__info--role').text().trim());

const skills = [];
$('.overviewList__wrapper').each((i, el) => {
  skills.push({
    name: $(el).find('.text--yellow').text().trim(),
    desc: $(el).find('.overviewList__info p').text().trim(),
    icon: $(el).find('img').attr('src')
  });
});
console.log('Skills:', skills);

const items = [];
$('.recommendItems__column img').each((i, el) => {
  items.push($(el).attr('src'));
});
console.log('Items:', items);

const runes = [];
$('.recommendRune__column').each((i, el) => {
  runes.push({
    name: $(el).find('h3').text().trim(),
    icon: $(el).find('.rune-icon img').attr('src') || $(el).find('img').attr('src')
  });
});
console.log('Runes:', runes);

const spell = $('.recommendSpell__column img').attr('src');
console.log('Spell:', spell);

const enchantmentsMain = [];
$('.tree-main img').each((i, el) => enchantmentsMain.push($(el).attr('src')));
const enchantmentsSub = [];
$('.tree-sub img').each((i, el) => enchantmentsSub.push($(el).attr('src')));
console.log('Enchantments:', { main: enchantmentsMain, sub: enchantmentsSub });
