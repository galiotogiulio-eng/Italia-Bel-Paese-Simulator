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
