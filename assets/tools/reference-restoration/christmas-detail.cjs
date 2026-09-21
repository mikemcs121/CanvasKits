const sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const p='Gnome Christmas Tree/info/';
(async()=>{for(const [src,dst] of [['assets/reference-restoration/candidate-02.png','tree-edit-base.jpg'],['assets/reference-restoration/geometry-view.png','tree-edit-geometry.png']]){const b=await sharp(p+src).resize(800,1000,{fit:'fill'}).toBuffer();await sharp(b).extract({left:580,top:300,width:220,height:610}).resize(660,1830).toFile(p+'tmp/reference-restoration/'+dst);}})();
