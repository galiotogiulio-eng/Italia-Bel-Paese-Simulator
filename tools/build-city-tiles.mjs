// Fetch the SAME standardized OSM data for Milan and Palermo and produce local static tiles.
// Run via GitHub Actions. No personal API token, no fake building data.
import {mkdir,writeFile} from 'node:fs/promises';
const cities={milano:[45.4642,9.1900],palermo:[38.1157,13.3615]};
const size=450;const pause=ms=>new Promise(r=>setTimeout(r,ms));
const bbox=(lat,lon,tx,tz)=>{const x0=tx*size,x1=x0+size,z0=tz*size,z1=z0+size,scale=111320*Math.cos(lat*Math.PI/180);return [lat-z1/111320,lon+x0/scale,lat-z0/111320,lon+x1/scale];};
const project=(lon,lat,clat,clon)=>[(lon-clon)*111320*Math.cos(clat*Math.PI/180)+73,-(lat-clat)*111320];
async function fetchTile(city,tx,tz){
 const [lat,lon]=cities[city],b=bbox(lat,lon,tx,tz);
 const q='[out:json][timeout:55];(way[building]('+b.join(',')+');way[highway]('+b.join(',')+');nwr[shop][name]('+b.join(',')+'););out center geom;';
 for(let attempt=0;attempt<3;attempt++){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),70000);
  try{
   const resp=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:q}),signal:controller.signal});
   if(!resp.ok)throw Error('HTTP '+resp.status);
   const js=await resp.json();
   const out={schema:1,city,tile:[tx,tz],source:'© OpenStreetMap contributors ODbL',buildings:[],roads:[],shops:[]};
   for(const e of js.elements||[]){
    if((e.tags?.shop||e.tags?.amenity)&&e.tags?.name){const p=e.center||((e.lat!=null&&e.lon!=null)?e:null);if(p)out.shops.push({id:e.id,name:e.tags.name,category:e.tags.shop||e.tags.amenity,position:project(p.lon,p.lat,lat,lon)});}
    if(!Array.isArray(e.geometry)||e.geometry.length<2)continue;
    const points=e.geometry.map(p=>project(p.lon,p.lat,lat,lon));
    if(e.tags?.building&&points.length>=4){
     let h=Number.parseFloat(e.tags.height),levels=Number.parseFloat(e.tags['building:levels']);
     const measured=Number.isFinite(h)&&h>2;
     if(!measured)h=Number.isFinite(levels)&&levels>0?levels*3.15:17;
     out.buildings.push({id:e.id,points,height:Math.min(125,h),heightEstimated:!measured});
    }else if(e.tags?.highway)out.roads.push({id:e.id,points,kind:e.tags.highway});
   }
   return out;
  }catch(e){console.warn(city,tx,tz,'attempt',attempt+1,e.message);if(attempt===2)throw e;await pause(3000*(attempt+1));}
  finally{clearTimeout(timer);}
 }
}
for(const city of Object.keys(cities)){
 for(let tz=-2;tz<=1;tz++)for(let tx=-2;tx<=1;tx++){
  const data=await fetchTile(city,tx,tz);
  const path='dist/assets/cities/'+city+'/tiles';
  await mkdir(path,{recursive:true});
  await writeFile(path+'/'+tx+'_'+tz+'.json',JSON.stringify(data));
  console.log(city,tx,tz,data.buildings.length,'buildings',data.roads.length,'roads',data.shops.length,'shops');
  await pause(800);
 }
}
