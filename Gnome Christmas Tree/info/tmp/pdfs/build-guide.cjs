const fs = require('fs');
const path = require('path');
const out = path.resolve('output/pdf');
fs.mkdirSync(out, {recursive:true});
const img = fs.readFileSync('tmp/pdfs/46-preview.jpg').toString('base64');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Christmas Gnome Painting Guide</title><style>
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; color: #242723; background: white; font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.36; }
.page { width: 8.5in; height: 11in; padding: .48in .52in .42in; }
.eyebrow { font-size: 8pt; letter-spacing: 1.9px; color: #52604c; font-weight: bold; margin: 0 0 5px; }
h1 { font-size: 26pt; line-height: 1.05; margin: 0 0 9px; color: black; letter-spacing: -.6px; }
.intro { font-size: 10.5pt; margin: 0 0 18px; }
.layout { display: grid; grid-template-columns: 1fr 2.25in; gap: .25in; }
h2 { font-size: 11.3pt; line-height: 1.2; margin: 0 0 5px; color: black; }
p { margin: 0; }
.step { margin-bottom: 12px; padding-left: 25px; position: relative; }
.num { position: absolute; left: 0; top: 0; font-size: 11.3pt; font-weight: bold; color: #52604c; }
.ref { width: 2.25in; height: 2.25in; object-fit: contain; display: block; }
.caption { font-size: 8.2pt; color: #62665e; margin-top: 6px; margin-bottom: 18px; }
.side-section { margin-bottom: 17px; }
.side-section p { font-size: 9.5pt; }
.palette { margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 5px; font-size: 9pt; }
.color { display: flex; align-items: center; gap: 6px; }
.dot { width: 13px; height: 13px; border: 1px solid #aaa; border-radius: 50%; flex-shrink: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
.mix { margin-top: 9px; }
.footer { margin-top: 9px; padding-top: 10px; border-top: 1px solid #d8dcd5; font-size: 9pt; }
strong { font-weight: bold; }
</style></head><body><main class="page">
<p class="eyebrow">CANVAS PAINT KIT · ACRYLIC PAINTING</p>
<h1>Paint your Christmas gnome</h1>
<p class="intro">Follow the printed outlines and build your colors in thin layers. Use the finished picture as a guide, or give your gnome your own colorful style.</p>
<div class="layout"><section>
<div class="step"><span class="num">1</span><h2>Get ready</h2><p>Cover your table. Set out water, a paper towel and a mixing plate. Use a larger brush for broad areas and a small brush for edges. Rinse and blot between colors; keep paint creamy, not watery.</p></div>
<div class="step"><span class="num">2</span><h2>Start with the snow and sky</h2><p>Leave the sky white, or brush on very pale blue. Paint the ground white with a few pale blue strokes under the trees and shoes. Work around the gnome and tree outlines. Let dry.</p></div>
<div class="step"><span class="num">3</span><h2>Paint the evergreen trees</h2><p>Fill the trees green, leaving the ornament circles open. Add a little black to green for darker branches. Use short, downward strokes; add a few lighter green strokes with green mixed with yellow.</p></div>
<div class="step"><span class="num">4</span><h2>Add the red hat and coat</h2><p>Paint the hat and the coat below the beard red. Leave the lights, nose, beard and pom-pom open. Once dry, add a second thin coat if needed. For shadows, mix a little brown into red along the hat folds and coat edges.</p></div>
<div class="step"><span class="num">5</span><h2>Color the nose and shoes</h2><p>Paint the nose peach and the shoes brown. Add a tiny touch of brown to peach for the bottom of the nose. Brush a lighter patch across the top of each shoe using brown mixed with white and a little yellow.</p></div>
<div class="step"><span class="num">6</span><h2>Make the beard fluffy</h2><p>Paint the beard, mustache and pom-pom white. Add a few pale blue-gray strokes, following the beard downward and the mustache outward. Let dry, then add fine white strokes over the shading.</p></div>
<div class="step"><span class="num">7</span><h2>Light up your gnome</h2><p>Paint the hat bulbs yellow and the tree ornaments blue or yellow. When dry, add a small white dot to each for shine. Use a fine brush and black paint to touch up the light cord and any outlines you want to show.</p></div>
<div class="step"><span class="num">8</span><h2>Finish and let dry</h2><p>Add a few white snow dots to the hat if you like. Let the canvas dry flat before handling or displaying. Wash brushes with soap and water, reshape the tips and close the paint pots.</p></div>
</section><aside>
<img class="ref" src="data:image/jpeg;base64,${img}" alt="Finished Christmas gnome with red hat, white beard, glowing yellow bulbs and evergreen trees">
<p class="caption">Your finished painting can look like this. Simple, solid colors work beautifully too.</p>
<div class="side-section"><h2>Suggested paint colors</h2><div class="palette">
${[['White','#ffffff'],['Black','#20211f'],['Red','#c81b20'],['Yellow','#ffe035'],['Blue','#247dc0'],['Green','#315745'],['Brown','#865529']].map(([name,c])=>`<div class="color"><span class="dot" style="background:${c}"></span>${name}</div>`).join('')}
</div></div>
<div class="side-section"><h2>Easy color mixes</h2><p><strong>Peach</strong><br>White + a little yellow + a tiny touch of red.</p><p class="mix"><strong>Pale blue</strong><br>White + a tiny touch of blue.</p><p class="mix"><strong>Blue-gray</strong><br>Pale blue + a speck of black.</p><p class="mix">Start with the light color and add darker paint a little at a time.</p></div>
<div class="side-section"><h2>Helpful painting tips</h2><p>Let neighboring wet colors dry before painting beside them.</p><p class="mix">For bright yellow lights, paint the circles white first and let dry.</p><p class="mix">Painted outside a line? Let it dry, then cover with the correct color.</p></div>
</aside></div>
<p class="footer"><strong>Make it yours.</strong> The printed lines are your guide. A few simple highlights are all you need to bring your gnome to life.</p>
</main></body></html>`;
fs.writeFileSync(path.join(out,'gnome-painting-guide.html'),html);
console.log(path.join(out,'gnome-painting-guide.html'));
