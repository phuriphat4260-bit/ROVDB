const axios = require('axios');
const fs = require('fs');

async function extractClasses() {
  const { data } = await axios.get('https://rov.in.th/hero');
  const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
  if (match) {
    const json = JSON.parse(match[1]);
    console.log("props:", Object.keys(json.props));
    if (json.props.initialProps) console.log("initialProps:", Object.keys(json.props.initialProps));
    if (json.props.initialProps && json.props.initialProps.pageProps) console.log("pageProps:", Object.keys(json.props.initialProps.pageProps));
    fs.writeFileSync('next_data.json', JSON.stringify(json, null, 2));
    console.log('Saved to next_data.json');
  } else {
    console.log('No NEXT_DATA found');
  }
}

extractClasses();
