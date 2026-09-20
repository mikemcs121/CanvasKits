const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../..');
const kits=[
 ['Flowers in Vase','flowers-in-vase','Existing full-portrait reference and guide reviewed; unchanged.','assets/portrait-rebuild/ and tmp/portrait-rebuild/; tmp/8x10/ remains a builder dependency.'],
 ['Gnome Halloween','gnome-halloween','Existing corrected full-height reference and guide reviewed; unchanged.','assets/full-portrait/ and tmp/full-portrait/; tmp/vector-8x10/ remains a dependency.'],
 ['Fox Fall','fox-fall','Existing matching centered composition preserved; children’s transfer gray.','assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.'],
 ['Ghost Fall','ghost-fall','Existing matching centered composition preserved.','assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.'],
 ['Cat in Pumpkin','cat-in-pumpkin','Existing matching centered composition preserved; children’s transfer gray.','assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.'],
 ['Pumpkin','pumpkin','Guide repaired to restore clipped header, materials and step numbers; centered composition preserved.','assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.'],
 ['Gnome Christmas Tree','gnome-christmas-tree','Portrait reference and guide rebuilt against existing SVG; see organization audit.','tmp/organization/ (see project organization-audit-gnomes.md for entrypoints).'],
 ['Gnome Fall','gnome-fall','Portrait reference and guide rebuilt against existing SVG; see organization audit.','tmp/organization/ (see project organization-audit-gnomes.md for entrypoints).'],
 ['fall view','fall-view','Portrait reference and guide rebuilt against existing SVG; see organization audit.','tmp/organization-repair/ (see project organization-audit-landscape.md for entrypoints).'],
 ['Starry-night Sunflower','starry-night-sunflower','Portrait reference and guide rebuilt against existing SVG; original square kit archived intact.','tmp/organization-repair/ (see project organization-audit-landscape.md for entrypoints).']
];
const selections=kits.map(([folder,slug,review,build])=>({folder,slug,review,build,outline:`output/svg/8x10/${slug}-outline-8x10.svg`,guide:`output/pdf/8x10/${slug}-painting-guide-8x10.pdf`,reference:`output/pdf/8x10/${slug}-finished-reference-8x10.pdf`}));
fs.writeFileSync(path.join(__dirname,'selections.json'),JSON.stringify(selections,null,2));
console.log('Prepared 10 production selections; verify audits before applying.');
