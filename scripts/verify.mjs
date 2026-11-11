// Verification helper: fetches every official URL in data/awards.json, reports status, and flags listings whose page content changed since the last run.
// Usage (from the repo root): node scripts/verify.mjs   (writes scripts/verify-state.json; commit it so the next run can compare)
// A changed hash only means "look at this page again"; many pages change on every request. A human still confirms and logs the check in VERIFY.md.
import fs from "node:fs";import crypto from "node:crypto";
const awards=JSON.parse(fs.readFileSync("data/awards.json","utf8"));
const statePath="scripts/verify-state.json";const prev=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,"utf8")):{};const next={};
const TIMEOUT_MS=20000,PARALLEL=6;
async function check(a){let status="ERR",hash="",note="";
  try{const r=await fetch(a.apply,{redirect:"follow",signal:AbortSignal.timeout(TIMEOUT_MS),headers:{"user-agent":"Scholio-verify/1.0 (+https://github.com/nirajbhusal/scholio)"}});status=String(r.status);
    const t=(await r.text()).replace(/\s+/g," ");hash=crypto.createHash("sha1").update(t).digest("hex").slice(0,12);
    if(!r.ok)note="HTTP "+r.status;
    if(a.deadline&&!t.includes(a.deadline.slice(0,4)))note=(note?note+"; ":"")+"year of deadline not found on page";
    if(prev[a.id]&&prev[a.id]!==hash)note=(note?note+"; ":"")+"page changed since last run";
  }catch(e){note=e.name==="TimeoutError"?"timed out after "+TIMEOUT_MS/1000+" s":e.message}
  next[a.id]=hash||prev[a.id]||"";return[a.id,status,a.checked||"-",note||"ok"];
}
const rows=[];
for(let i=0;i<awards.length;i+=PARALLEL)rows.push(...await Promise.all(awards.slice(i,i+PARALLEL).map(check)));
fs.writeFileSync(statePath,JSON.stringify(next,null,1));
console.log(["id","status","checked","note"].join("\t"));rows.forEach(r=>console.log(r.join("\t")));
