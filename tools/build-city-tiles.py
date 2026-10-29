#!/usr/bin/env python3
"""Universal geographic ingest: regional OSM extract -> city-local static tiles."""
import json,math,os,sys
import osmium
CITIES={'milano':(45.4642,9.1900),'palermo':(38.1157,13.3615)}
SIZE=450
def xy(lon,lat,clat,clon):return [(lon-clon)*111320*math.cos(math.radians(clat))+73,-(lat-clat)*111320]
class Importer(osmium.SimpleHandler):
 def __init__(self,city,lat,lon):
  super().__init__();self.city=city;self.lat=lat;self.lon=lon;self.tiles={};self.count=0
 def way(self,w):
  tags=w.tags
  building=tags.get('building')
  highway=tags.get('highway')
  if not building and not highway:return
  try: coords=[xy(n.lon,n.lat,self.lat,self.lon) for n in w.nodes]
  except osmium.InvalidLocationError:return
  if len(coords)<2:return
  centre=[sum(p[i] for p in coords)/len(coords) for i in (0,1)]
  tx=math.floor((centre[0]-73)/SIZE);tz=math.floor(centre[1]/SIZE)
  if not(-2<=tx<=1 and -2<=tz<=1):return
  key=(tx,tz)
  tile=self.tiles.setdefault(key,{'schema':1,'city':self.city,'tile':[tx,tz],'source':'© OpenStreetMap contributors ODbL','buildings':[],'roads':[],'shops':[]})
  if building and len(coords)>=4 and w.is_closed():
   h=tags.get('height');levels=tags.get('building:levels')
   try:h=float(h);measured=h>2
   except (TypeError,ValueError):measured=False;h=None
   if not measured:
    try:h=float(levels)*3.15
    except (TypeError,ValueError):h=17
   tile['buildings'].append({'id':int(w.id),'points':coords,'height':min(125,h),'heightEstimated':not measured})
  elif highway:tile['roads'].append({'id':int(w.id),'points':coords,'kind':highway})
  self.count+=1
 def node(self,n):
  if 'shop' not in n.tags and n.tags.get('amenity') not in ('restaurant','cafe','bar','pharmacy'):return
  name=n.tags.get('name')
  if not name:return
  x,z=xy(n.lon,n.lat,self.lat,self.lon)
  tx=math.floor((x-73)/SIZE);tz=math.floor(z/SIZE)
  if not(-2<=tx<=1 and -2<=tz<=1):return
  tile=self.tiles.setdefault((tx,tz),{'schema':1,'city':self.city,'tile':[tx,tz],'source':'© OpenStreetMap contributors ODbL','buildings':[],'roads':[],'shops':[]})
  tile['shops'].append({'id':int(n.id),'name':name,'category':n.tags.get('shop') or n.tags.get('amenity'),'position':[x,z]})
def main():
 for city,(lat,lon) in CITIES.items():
  src='data-source/'+city+'.osm.pbf'
  if not os.path.exists(src):raise SystemExit('missing '+src)
  handler=Importer(city,lat,lon)
  handler.apply_file(src,locations=True)
  root='dist/assets/cities/'+city+'/tiles';os.makedirs(root,exist_ok=True)
  total=0
  for tz in range(-2,2):
   for tx in range(-2,2):
    value=handler.tiles.get((tx,tz),{'schema':1,'city':city,'tile':[tx,tz],'source':'© OpenStreetMap contributors ODbL','buildings':[],'roads':[],'shops':[]})
    total+=len(value['buildings'])
    with open(f'{root}/{tx}_{tz}.json','w') as f:json.dump(value,f,separators=(',',':'))
  print(city,'buildings',total,'features',handler.count,flush=True)
  if total<10:raise SystemExit('insufficient buildings in '+city)
if __name__=='__main__':main()
