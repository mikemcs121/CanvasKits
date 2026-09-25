const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../../..');
const { Resvg } = require(path.join(
  root,
  'assets/tools/vector-tools/node_modules/@resvg/resvg-js'
));
const source = path.join(root, 'Fox Fall/fox-fall-outline-8x10.svg');
const destination = path.join(__dirname, 'unchanged-outline-render.png');
const svg = fs.readFileSync(source);
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 2400 } }).render().asPng();
fs.writeFileSync(destination, png);
