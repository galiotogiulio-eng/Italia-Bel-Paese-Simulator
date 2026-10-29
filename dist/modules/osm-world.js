import * as THREE from '../vendor/three.module.js';
import {MILAN} from './geography.js';
const CENTER={lat:MILAN.lat,lon:MILAN.lon};
const ENDPOINT='https://overpass-api.de/api/interpreter';
const cacheKey='ibps-osm-milano-center-v1';
export function projectPoint(lon,lat){return [(lon-CENTER.lon)*111320*Math.cos(CENTER.lat*Math.PI/180)+73,-(lat-CENTER.lat)*111320];}
export function convertOsmElements(elements){
 const buildings=[],roads=[];
 for(const e of elements||[]){
  if(!Array.isArray(e.geometry)||e.geometry.length<2)continue;
  const points=e.geometry.map(p=>projectPoint(p.lon,p.lat));
  if(e.tags?.building&&points.length>=4){
   const levels=parseFloat(e.tags['building:levels']);
   const measured=parseFloat(e.tags.height);
   const height=Number.isFinite(measured)&&measured>2?Math.min(125,measured):Number.isFinite(levels)&&levels>0?Math.min(100,levels*3.15):17;
   buildings.push({id:e.id,points,height});
  }else if(e.tags?.highway&&!['steps','footway'].includes(e.tags.highway)){
   roads.push({id:e.id,points,kind:e.tags.highway});
  }else if(e.tags?.highway==='footway'||e.tags?.highway==='pedestrian'){
   roads.push({id:e.id,points,kind:e.tags.highway});
  }
 }
 return {buildings,roads};
}
export async function loadMilanOsm({signal}={}){
 try{const stored=sessionStorage.getItem(cacheKey);if(stored){const data=JSON.parse(stored);if(Date.now()-data.at<24*3600000)return data.value;}}catch{}
 // One small query per session; no city-wide bulk request. Cached on client.
 const q='[out:json][timeout:20];(way[building](45.4625,9.1868,45.4660,9.1933);way[highway](45.4625,9.1868,45.4660,9.1933););out geom;';
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),18000);
 if(signal)signal.addEventListener('abort',()=>controller.abort(),{once:true});
 try{
  const response=await fetch(ENDPOINT,{method:'POST',body:new URLSearchParams({data:q}),signal:controller.signal});
  if(!response.ok)throw Error('OSM HTTP '+response.status);
  const json=await response.json();const value=convertOsmElements(json.elements);
  try{sessionStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),value}));}catch{}
  return value;
 }finally{clearTimeout(timer);}
}
export function buildOsmMeshes(THREE,data,{maxBuildings=350,maxRoads=300}={}){
 const group=new THREE.Group();group.name='OpenStreetMap · Milano centro';
 const palette=['#c9b59c','#d8c8ad','#e6d8c2','#b5b0a3','#dfc9ad'];
 const mats=palette.map(color=>new THREE.MeshStandardMaterial({color,roughness:.88}));
 const roadMat=new THREE.MeshStandardMaterial({color:'#99968b',roughness:1});
 for(const b of data.buildings.slice(0,maxBuildings)){
  const pts=b.points.slice(0,-1).map(p=>new THREE.Vector2(p[0],-p[1]));
  if(pts.length<3)continue;
  const shape=new THREE.Shape(pts);const geo=new THREE.ExtrudeGeometry(shape,{depth:b.height,bevelEnabled:false,curveSegments:1});
  // x/y shape -> world x/z; local depth -> world y.
  geo.rotateX(-Math.PI/2);
  const mesh=new THREE.Mesh(geo,mats[Math.abs(b.id||0)%mats.length]);
  mesh.position.y=.08;mesh.castShadow=false;mesh.receiveShadow=true;group.add(mesh);
 }
 for(const road of data.roads.slice(0,maxRoads)){
  const pts=road.points;const vertices=[];const width=road.kind==='primary'?4.5:road.kind==='pedestrian'?3:2.8;
  for(let i=1;i<pts.length;i++){
   const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
   if(len<.05)continue;
   const nx=-dz/len*width,nz=dx/len*width;
   vertices.push(a[0]+nx,.035,a[1]+nz,a[0]-nx,.035,a[1]-nz,b[0]+nx,.035,b[1]+nz,
     a[0]-nx,.035,a[1]-nz,b[0]-nx,.035,b[1]-nz,b[0]+nx,.035,b[1]+nz);
  }
  if(!vertices.length)continue;
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,roadMat);mesh.receiveShadow=true;group.add(mesh);
 }
 return group;
}

/** Historic Milan coverage: roughly the area within the Cerchia dei Navigli,
 * with extra room for Brera, Castello, Sant'Ambrogio and Porta Venezia.
 * Lazy loaded as small independent 450-metre square tiles.
 */
export const MILANO_CENTRO={minX:-1900,maxX:1900,minZ:-1900,maxZ:1900,tileSize:450};
export function tileIdFor(x,z){return [Math.floor((x-73)/MILANO_CENTRO.tileSize),Math.floor(z/MILANO_CENTRO.tileSize)];}
export function tileBounds(tx,tz){
 const x0=tx*MILANO_CENTRO.tileSize+73,z0=tz*MILANO_CENTRO.tileSize;
 const x1=x0+MILANO_CENTRO.tileSize,z1=z0+MILANO_CENTRO.tileSize;
 const lon0=CENTER.lon+(x0-73)/(111320*Math.cos(CENTER.lat*Math.PI/180));
 const lon1=CENTER.lon+(x1-73)/(111320*Math.cos(CENTER.lat*Math.PI/180));
 const lat0=CENTER.lat-z1/111320,lat1=CENTER.lat-z0/111320;
 return [lat0,lon0,lat1,lon1];
}
export async function loadMilanTile(tx,tz,{signal}={}){
 const key='ibps-osm-tile-v2-'+tx+'-'+tz;
 try{const value=sessionStorage.getItem(key);if(value){const parsed=JSON.parse(value);if(Date.now()-parsed.at<7*86400000)return parsed.data;}}catch{}
 const [a,b,c,d]=tileBounds(tx,tz);
 const q=`[out:json][timeout:20];(way[building](${a},${b},${c},${d});way[highway](${a},${b},${c},${d}););out geom;`;
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 if(signal)signal.addEventListener('abort',()=>controller.abort(),{once:true});
 try{
  const response=await fetch(ENDPOINT,{method:'POST',body:new URLSearchParams({data:q}),signal:controller.signal});
  if(!response.ok)throw Error('OSM tile HTTP '+response.status);
  const json=await response.json();const data=convertOsmElements(json.elements);
  try{sessionStorage.setItem(key,JSON.stringify({at:Date.now(),data}));}catch{}
  return data;
 }finally{clearTimeout(timer);}
}

/** Immediate offline placeholder around Milano. This is procedural scenery,
 * deliberately NOT represented as genuine city geometry.
 * It is replaced as soon as geographic data is available.
 */
export function makeProceduralTile(tx,tz){
 const size=MILANO_CENTRO.tileSize,ox=tx*size+73,oz=tz*size;
 const buildings=[],roads=[];
 let seed=((tx+101)*73856093 ^ (tz+101)*19349663)>>>0;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const x=ox+col*110+17,z=oz+row*110+17;
  const w=60+rand()*22,d=58+rand()*20;
  const corners=[[x,z],[x+w,z],[x+w,z+d],[x,z+d],[x,z]];
  const points=corners;
  if(points.some(p=>p[0]>-112&&p[0]<122&&p[1]>-90&&p[1]<90))continue;
  buildings.push({id:1000+row*4+col,points,height:12+Math.floor(rand()*6)*3});
 }
 for(let i=0;i<5;i++){
  const shift=i*110+8;
  roads.push({id:500+i,kind:'residential',points:[[ox+shift,oz],[ox+shift,oz+size]]});
  roads.push({id:510+i,kind:'residential',points:[[ox,oz+shift],[ox+size,oz+shift]]});
 }
 return {buildings,roads,approximate:true};
}
