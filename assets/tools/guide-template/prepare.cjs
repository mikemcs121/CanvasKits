const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
const kitList=JSON.parse(read('assets/tools/organization/selections.json'));
const autumn=require(path.join(root,'Fox Fall/info/tmp/new-kits.cjs'));
const palettes={
 'flowers-in-vase':{ink:'#19484b',accent:'#3c9895',wash:'#e1f1ed',second:'#cf7590',ribbon:'#f3e8dd'},
 'gnome-halloween':{ink:'#422b42',accent:'#78576e',wash:'#eee6ed',second:'#bd783f',ribbon:'#eadfea'},
 'fox-fall':{ink:'#4f3b26',accent:'#ba773a',wash:'#f6ebd6',second:'#738748',ribbon:'#f7e4bd'},
 'ghost-fall':{ink:'#4f3b53',accent:'#8b7088',wash:'#f0e9ef',second:'#c4824c',ribbon:'#eee4ee'},
 'cat-in-pumpkin':{ink:'#343e4a',accent:'#c77b47',wash:'#faecdc',second:'#798595',ribbon:'#f4e4d0'},
 'pumpkin':{ink:'#513922',accent:'#c9813e',wash:'#f7ead8',second:'#7e7947',ribbon:'#f5e3c3'},
 'gnome-christmas-tree':{ink:'#21493e',accent:'#729691',wash:'#e8f1ee',second:'#b34336',ribbon:'#e7f0e8'},
 'gnome-fall':{ink:'#154b50',accent:'#45989c',wash:'#e4f1ed',second:'#c88338',ribbon:'#e3f0e9'},
 'fall-view':{ink:'#193f60',accent:'#669abd',wash:'#e4f0f7',second:'#d79340',ribbon:'#e2eff6'},
 'starry-night-sunflower':{ink:'#193e62',accent:'#4e83b0',wash:'#e4eef7',second:'#cc9e38',ribbon:'#f2e8ba'}
};
function csArray(s,name){const m=s.match(new RegExp('string\\[\\] '+name+'=\\{([\\s\\S]*?)\\};'));if(!m)throw Error('Missing '+name);return JSON.parse('['+m[1]+']');}
const configs=[];
for(const k of kitList){const b=k.folder+'/info',cfg={folder:k.folder,slug:k.slug,palette:palettes[k.slug],reference:b+'/output/pdf/8x10/'+k.slug+'-finished-reference-8x10.png',title:'',paints:[],steps:[]};
 if(autumn.some(a=>a.slug===k.slug)){const a=autumn.find(a=>a.slug===k.slug);cfg.title=a.title;cfg.paints=a.paints;cfg.steps=a.steps.map((s,i)=>({heading:s.heading,caption:s.caption,image:i===a.steps.length-1?null:b+'/tmp/8x10-artwork/step-'+(i+1)+'.png',detail:!!s.crop,cue:!!s.crop}));}
 else if(['gnome-fall','gnome-christmas-tree'].includes(k.slug)){const a=JSON.parse(read(b+'/tmp/organization/step-plan.json'));cfg.title=k.slug==='gnome-fall'?'Gnome Fall':'Christmas Gnome';cfg.paints=a.palette.split(/,\s*/);cfg.steps=a.steps.map((s,i)=>({heading:s[0],caption:s[1],image:i===11?null:b+'/tmp/organization/step-'+(i+1)+'.png',detail:!!s[3],cue:!!s[3]}));}
 else if(['fall-view','starry-night-sunflower'].includes(k.slug)){const a=JSON.parse(read(b+'/tmp/organization-repair/kit.json'));cfg.title=a.title;cfg.paints=a.paints;cfg.steps=a.steps.map((s,i)=>({heading:s.heading,caption:s.caption,image:i===11?null:b+'/tmp/organization-repair/step-'+(i+1)+'.png',detail:!!s.crop,cue:!!s.crop}));}
 else {const flowers=k.slug==='flowers-in-vase',edition=flowers?'portrait-rebuild':'full-portrait',a=read(b+'/tmp/'+edition+'/build-guide.cs'),titles=csArray(a,'titles'),captions=csArray(a,'captions');cfg.title=flowers?'Flowers in Vase':'Gnome Halloween';cfg.paints=flowers?['white','black','turquoise','blue','green','rose red','yellow','orange','brown']:['white','black','red','yellow','blue','green','brown'];cfg.steps=titles.map((heading,i)=>({heading,caption:captions[i],image:i===11?null:b+'/assets/'+edition+'/'+(i<8?'stage-'+String(i+1).padStart(2,'0'):'panel-'+(i+1))+'.png',detail:i>=8,cue:false}));}
 cfg.steps.at(-1).dry=true;
 const work=b+'/tmp/template-refactor',asset=b+'/assets/template-refactor';fs.mkdirSync(path.join(root,work),{recursive:true});fs.mkdirSync(path.join(root,asset),{recursive:true});cfg.work=work;cfg.assets=asset;cfg.logo=asset+'/river-and-ridge-logo.png';
 const archive=b+'/archive/before-fall-view-template';fs.mkdirSync(path.join(root,archive),{recursive:true});
 for(const [from,to]of [[k.folder+'/'+k.slug+'-painting-guide-8x10.pdf',archive+'/'+k.slug+'-painting-guide-8x10.pdf'],[b+'/output/pdf/8x10/'+k.slug+'-painting-guide-8x10.png',archive+'/'+k.slug+'-painting-guide-8x10.png']])if(!fs.existsSync(path.join(root,to)))fs.copyFileSync(path.join(root,from),path.join(root,to));
 cfg.unchanged={};for(const role of ['outline','finished-reference']){const file=k.folder+'/'+k.slug+'-'+role+'-8x10.'+(role==='outline'?'svg':'pdf');cfg.unchanged[file]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');}
 for(const s of cfg.steps)if(s.image&&!fs.existsSync(path.join(root,s.image)))throw Error('Missing art '+s.image);
 fs.writeFileSync(path.join(root,work,'plan.json'),JSON.stringify(cfg,null,2));configs.push(cfg);
}
fs.writeFileSync(path.join(__dirname,'kits.json'),JSON.stringify(configs,null,2));console.log('Prepared all 10 templates from current captions/stages; previous guides archived.');
