// Builds the deployable site into _site/ (run by .github/workflows/pages.yml; usage: node scripts/build.mjs).
// GitHub Pages answers unknown paths with 404.html and HTTP 404, which search engines do not index. This writes a real
// index.html for every view and every award, each with its own title, description and canonical URL, plus sitemap.xml.
// The page itself is unchanged: the script in index.html reads the path and shows the right view.
import fs from "node:fs";import path from "node:path";
const SITE="https://nirajbhusal.github.io/scholio/";const OUT="_site";
const html=fs.readFileSync("index.html","utf8");
const awards=JSON.parse(fs.readFileSync("data/awards.json","utf8"));
const TITLES=new Function("return "+html.match(/const TITLES=(\{.*?\});/)[1])();
const PRIVATE=["course","cert","compare","tracker","locker"]; // work from browser storage: built so they load, kept out of the sitemap
const DESC={map:"Every Master's and PhD scholarship in the Scholio index on a world map.",countries:"Browse Master's and PhD scholarships by destination country and see who funds study there.",rank:"QS, THE and ARWU positions for universities in the Scholio index, with the scholarships each one offers.",assess:"Fourteen questions give you a Scholio Score, per-award eligibility by nationality and age, and what to fix first.",score:"How the Scholio Score is computed: six components, public weights, four bands, reproducible by ID.",academy:"Short courses for scholarship applicants with quizzes and a certificate, plus official English test links.",resources:"English test guides, sample letters, a free academic CV designer and practice papers.",events:"Every open scholarship deadline on one calendar, with .ics export, plus annual application windows.",funders:"List a scholarship on Scholio: one template, a verification check, applications stay on your own site.",about:"What Scholio is, how listings are verified, and how it compares with other scholarship directories.",signup:"Your saved awards and certificates on Scholio."};
const esc=t=>String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const one=(s,re,to)=>{if(!re.test(s))throw new Error("build: pattern not found "+re);return s.replace(re,()=>to)};
function page(route,title,desc){const url=SITE+route;let s=html;
  s=one(s,/<title>.*?<\/title>/,`<title>${esc(title)}</title>`);
  s=one(s,/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${url}">`);
  s=one(s,/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${url}">`);
  s=one(s,/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(title)}">`);
  if(desc){s=one(s,/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(desc)}">`);s=one(s,/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(desc)}">`)}
  fs.mkdirSync(path.join(OUT,route),{recursive:true});fs.writeFileSync(path.join(OUT,route,"index.html"),s)}
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT);
for(const f of ["index.html","404.html","favicon.svg","icon-192.png","icon-512.png","og.png","manifest.webmanifest","sw.js","robots.txt",".nojekyll","data/awards.json","vendor/leaflet.js"]){fs.mkdirSync(path.dirname(path.join(OUT,f)),{recursive:true});fs.copyFileSync(f,path.join(OUT,f))}
const urls=[""];
for(const v of Object.keys(TITLES)){page(v+"/",TITLES[v]+" · Scholio",DESC[v]);if(!PRIVATE.includes(v))urls.push(v+"/")}
for(const a of awards){const when=a.deadline?"Deadline "+a.deadline:"Typical window: "+a.window;
  page("award/"+a.id+"/",a.name+" · Scholio",`${a.name}: ${a.funding==="Full"?"fully funded":"partial funding"}, ${a.levels.join(" and ")}, ${a.host}, ${a.country}. ${when}. ${a.checked?"Verified on the official page "+a.checked:"Confirm on the official page"}.`);urls.push("award/"+a.id+"/")}
fs.writeFileSync(path.join(OUT,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${SITE}${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}\n</urlset>\n`);
console.log(`built ${OUT}/: ${Object.keys(TITLES).length} view pages, ${awards.length} award pages, ${urls.length} sitemap URLs`);
