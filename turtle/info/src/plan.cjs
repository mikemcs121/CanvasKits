const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
const colors=JSON.parse(fs.readFileSync(path.join(root,'turtle/info/assets/paint-plan.json'))).colors;
const steps=[
 ['Blue water','Start on the preprinted canvas. Brush thin blue coats around the turtle, plants, starfish, and bubbles. Leave those shapes white. Use broad strokes. Rinse and blot your brush. Let dry.','Only water painted; all enclosed subjects remain white.'],
 ['Lime turtle and coral','Paint the head, neck, all flippers, and coral lime green. Keep the eye and oval spots white. The cheek stays lime green too. Use a small brush at the edges. Let dry.','Lime regions painted; eye, spots, shell, seaweed, star and bubbles unpainted.'],
 ['Greens and spots','Paint the shell plates and all turtle and starfish spots green. Paint the shell rim and tall seaweed dark green. Follow each shape with your brush. Rinse and blot between colors. Let dry.','Green plates/spots and dark-green rim/seaweed painted; yellow bands/star and bubbles remain white.'],
 ['Yellow shell bands','Paint the wide shell bands and starfish yellow. Use the small brush around the green dots. Keep the spaces between shell plates neat. Use thin coats and let each coat dry.','Yellow shell bands and starfish added; bubble and black eye details still unpainted.'],
 ['Bubbles and face','Paint bubbles light blue. Add white rims and shines. Paint the eye, eyebrow, nostrils, and smile black; keep the eye shines white. Use dark green to neaten outlines. Let dry.','Final face and bubbles painted; final target complete.'],
 ['Dry and tidy','Check for missed spots. Add a thin second coat if needed. Keep cheeks lime green. Lay the canvas flat to dry. Wash your brushes, wipe your palette, and tidy your space.','Exact finished reference lies flat to dry with closed paints and clean brushes.']
];
const plan={slug:'turtle',title:'Sea Turtle',builder:'turtle/info/src/build.cjs',audience:'Children ages 8-14',layout:'six steps, two columns and three rows',suppliedPaints:Object.entries(colors).map(([name,hex])=>({name:name==='lime'?'lime green':name.replaceAll('-',' '),hex})),steps:steps.map(([heading,caption,state],i)=>({heading,caption,state,image:`turtle/info/assets/stage-${String(i+1).padStart(2,'0')}.png`}))};
const file=path.join(root,'assets/tools/guide-template/kits.json'),kits=JSON.parse(fs.readFileSync(file));const i=kits.findIndex(k=>k.slug==='turtle');if(i>=0)kits[i]=plan;else kits.push(plan);fs.writeFileSync(file,JSON.stringify(kits,null,2)+'\n');
console.log('Turtle shared guide plan saved.');
