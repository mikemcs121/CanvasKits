const fs=require('fs');let p=fs.readFileSync('Owl/info/src/guide-pdf.cjs','utf8');
p=p.replace('>Owl</text>','>Sea Turtle</text>').replace('font-size="188"','font-size="150"').replace('owl-painting-guide','turtle-painting-guide').replaceAll('#FFF0D9','#F3F9D5').replaceAll('#E9F3F7','#E3F4FC').replace('Ready-to-use paints: light blue, tan, cream, brown, green,','Ready-to-use paints: blue, lime green, green, dark green,').replace('yellow, pink, black, and white. No mixing needed.','yellow, light blue, black, and white. No mixing needed.');
fs.writeFileSync('turtle/info/src/guide-pdf.cjs',p);
