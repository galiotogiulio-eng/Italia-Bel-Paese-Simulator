export const MILAN={lat:45.4642,lon:9.1900,timeZone:'Europe/Rome'};
export const PIAZZA={id:'piazza-duomo',title:'Piazza Duomo',approximate:true,
  note:'Geometrie procedurali provvisorie. Disposizione orientativa, non un rilievo o una ricostruzione fedele.',
  // x east; z south. One scene unit is approximately one metre.
  bounds:{minX:-72,maxX:61,minZ:-48,maxZ:48},
  landmarks:[{id:'duomo',x:69,z:0},{id:'galleria',x:0,z:-57},{id:'monumento',x:-18,z:0}],
  sources:[{title:'Lombardia Beni Culturali — impianto della piazza',url:'https://www.lombardiabeniculturali.it/blog/percorsi/piazza-del-duomo-e-la-galleria/'},{title:'Italia.it — Piazza Duomo',url:'https://www.italia.it/it/lombardia/milano/piazza-duomo'}]};
export const ITALY_VIEW={lon:12.5,lat:42,scale:28};
// Natural Earth topology: delta-decode arcs, then stitch polygons.
export function decodeCountries(topology){const t=topology.transform;const arcs=topology.arcs.map(a=>{let x=0,y=0;return a.map(p=>{x+=p[0];y+=p[1];return [x*t.scale[0]+t.translate[0],y*t.scale[1]+t.translate[1]];});});
 const ring=ids=>ids.flatMap((id,i)=>{const pts=id<0?[...arcs[~id]].reverse():arcs[id];return i?pts.slice(1):pts;});
 return topology.objects.countries.geometries.map(g=>({id:String(g.id),name:g.properties.name,polygons:(g.type==='Polygon'?[g.arcs]:g.arcs).map(poly=>poly.map(ring))}));}

/**
 * Reusable urban geometry recipe. Coordinates are local metres (east, south).
 * This initial dataset is APPROXIMATE, not imported survey data.
 * Later an OSM importer can supply the same footprints with true coordinates.
 */
export const MILAN_URBAN_BLOCKS=[
 {id:'north-west',x:-45,z:-62,width:67,depth:20,height:29,rotation:Math.PI,kind:'historic'},
 {id:'north-east',x:46,z:-62,width:56,depth:20,height:29,rotation:Math.PI,kind:'historic'},
 {id:'south',x:-13,z:64,width:132,depth:23,height:28,rotation:0,kind:'historic'},
 {id:'west',x:-88,z:3,width:108,depth:20,height:29,rotation:-Math.PI/2,kind:'historic'}
];
export function normalizeUrbanFootprints(input){
 if(!Array.isArray(input))return [];
 return input.filter(b=>Number.isFinite(b.x)&&Number.isFinite(b.z)&&Number.isFinite(b.width)&&Number.isFinite(b.depth)&&b.width>0&&b.depth>0)
  .map((b,i)=>({id:String(b.id??'block-'+i),x:b.x,z:b.z,width:b.width,depth:b.depth,height:Math.max(4,Number(b.height)||15),rotation:Number(b.rotation)||0,kind:b.kind||'generic'}));
}

/** Convert building polygons from an OSM/GeoJSON FeatureCollection into local game blocks.
 * Real polygons are simplified to oriented bounding rectangles for low-end devices.
 * The output coordinates are metres relative to the chosen centre.
 * Geometry coverage/detail depends entirely on the external geographic dataset.
 */
export function blocksFromGeoJSON(featureCollection,{lat=MILAN.lat,lon=MILAN.lon,maxBlocks=250}={}){
 if(featureCollection?.type!=='FeatureCollection'||!Array.isArray(featureCollection.features))return [];
 const east=111320*Math.cos(lat*Math.PI/180), north=111320;
 const blocks=[];
 for(const f of featureCollection.features){
  if(blocks.length>=maxBlocks)break;
  const polygon=f.geometry?.type==='Polygon'?f.geometry.coordinates?.[0]:f.geometry?.type==='MultiPolygon'?f.geometry.coordinates?.[0]?.[0]:null;
  if(!Array.isArray(polygon)||polygon.length<4||!(f.properties?.building||f.properties?.['building:levels']))continue;
  const coords=polygon.filter(p=>Array.isArray(p)&&Number.isFinite(p[0])&&Number.isFinite(p[1])).map(p=>[(p[0]-lon)*east,-(p[1]-lat)*north]);
  if(coords.length<4)continue;
  const xs=coords.map(p=>p[0]),zs=coords.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
  const width=maxX-minX,depth=maxZ-minZ;
  if(width<2||depth<2||width>250||depth>250)continue;
  const height=Number(f.properties.height)||Math.max(6,(Number(f.properties['building:levels'])||4)*3.1);
  blocks.push({id:String(f.id||f.properties['@id']||'osm-'+blocks.length),x:(minX+maxX)/2,z:(minZ+maxZ)/2,width,depth,height,rotation:0,kind:'osm'});
 }
 return normalizeUrbanFootprints(blocks);
}
