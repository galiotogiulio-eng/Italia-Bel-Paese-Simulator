// Universal, reproducible photographic availability audit.
// Usage: node tools/photo-coverage-audit.mjs
// Network required. No API keys needed for Panoramax and KartaView public endpoints.
// Counts only metadata returned, NEVER labels a facade as verified.
import {writeFile,mkdir} from 'node:fs/promises';
const cities={Milano:[45.4642,9.1900],Palermo:[38.1157,13.3615],Roma:[41.8933,12.4829]};
const radius=400;const step=400;
const offset=(lat,lon,dy,dx)=>[lat+dy/111320,lon+dx/(111320*Math.cos(lat*Math.PI/180))];
const json=async(url)=>{const c=new AbortController(),timer=setTimeout(()=>c.abort(),14000);try{const r=await fetch(url,{signal:c.signal,headers:{'accept':'application/json','user-agent':'ItaliaBelPaeseSimulator-photo-audit/1.0 (public research)'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(timer)}};
const points=[[-step,-step],[-step,0],[-step,step],[0,-step],[0,0],[0,step],[step,-step],[step,0],[step,step]];
const sources={
 Panoramax:async(lat,lon)=>{
  const [south,west]=offset(lat,lon,-radius,-radius),[north,east]=offset(lat,lon,radius,radius);
  const url='https://api.panoramax.xyz/api/search?bbox='+[west,south,east,north].join(',')+'&limit=100';
  const data=await json(url);const features=data.features||[];
  return {sampleCount:features.length,capped:features.length>=100,uniqueIds:features.map(x=>x.id).filter(Boolean),licenses:[...new Set(features.map(x=>x.properties?.license||x.properties?.['license']).filter(Boolean))]};
 },
 KartaView:async(lat,lon)=>{
  const url='https://api.openstreetcam.org/2.0/photo/?lat='+lat+'&lng='+lon+'&radius='+radius+'&page=1&itemsPerPage=100';
  const data=await json(url);const rows=Array.isArray(data.result?.data)?data.result.data:Array.isArray(data.result)?data.result:Array.isArray(data.data)?data.data:[];
  return {sampleCount:rows.length,capped:rows.length>=100,uniqueIds:rows.map(x=>x.id||x.photoId).filter(Boolean)};
 }
};
const output={schema:1,generatedAt:new Date().toISOString(),radiusMetres:radius,gridPoints:points.length,limitations:['Sample counts are NOT unique building coverage','A photograph near a building is NOT proof that its facade is visible','Images have not been downloaded or licensed for derivative texturing','Counts can be capped or incomplete due to pagination','Network failure is unknown coverage, not zero'],cities:{}};
for(const [city,[lat,lon]] of Object.entries(cities)){
 const record={centre:{lat,lon},sources:{}};
 for(const [name,fn] of Object.entries(sources)){
  const samples=[];const ids=new Set();let errors=0;
  for(const [dy,dx] of points){
   const [y,x]=offset(lat,lon,dy,dx);
   try{const v=await fn(y,x);for(const id of v.uniqueIds)ids.add(String(id));samples.push({offsetMetres:[dy,dx],count:v.sampleCount,capped:v.capped,licenses:v.licenses||[]});}
   catch(e){errors++;samples.push({offsetMetres:[dy,dx],error:String(e.message)});}
  }
  record.sources[name]={status:errors===points.length?'unavailable':errors?'partial':'sampled',uniqueImagesInSamples:errors===points.length?null:ids.size,errorCount:errors,samples};
  console.log(city,name,record.sources[name].status,record.sources[name].uniqueImagesInSamples??'not measurable');
 }
 record.sources.Mapillary={status:'requires_access_token',uniqueImagesInSamples:null};
 output.cities[city]=record;
}
await mkdir('audit-results',{recursive:true});await writeFile('audit-results/photo-coverage.json',JSON.stringify(output,null,2));
console.log('Wrote audit-results/photo-coverage.json');
