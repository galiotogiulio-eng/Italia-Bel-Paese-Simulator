import * as THREE from '../vendor/three.module.js';

// Minimal GLB reader tailored to freely licensed scanned landmark meshes.
// No third-party CDN and no fabricated facade fallback.
export async function loadDuomoModel(url='assets/landmarks/duomo-milano-web.glb'){
 const response=await fetch(url);
 if(!response.ok)throw new Error('Modello reale non pubblicato: HTTP '+response.status);
 const bytes=await response.arrayBuffer(),dv=new DataView(bytes);
 if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw new Error('GLB non valido');
 const jsonLength=dv.getUint32(12,true),json=JSON.parse(new TextDecoder().decode(new Uint8Array(bytes,20,jsonLength)));
 const binChunk=20+jsonLength,binStart=binChunk+8;
 const getFloat=(index)=>{
  const accessor=json.accessors[index],view=json.bufferViews[accessor.bufferView];
  if(accessor.componentType!==5126)throw new Error('Attributo GLB non supportato');
  const width=accessor.type==='VEC3'?3:accessor.type==='VEC2'?2:1;
  const start=binStart+(view.byteOffset||0)+(accessor.byteOffset||0);
  return new Float32Array(bytes.slice(start,start+accessor.count*width*4));
 };
 const primitive=json.meshes[0].primitives[0],geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.BufferAttribute(getFloat(primitive.attributes.POSITION),3));
 if(primitive.attributes.TEXCOORD_0!==undefined)geo.setAttribute('uv',new THREE.BufferAttribute(getFloat(primitive.attributes.TEXCOORD_0),2));
 if(primitive.attributes.NORMAL!==undefined)geo.setAttribute('normal',new THREE.BufferAttribute(getFloat(primitive.attributes.NORMAL),3));
 else geo.computeVertexNormals();
 const image=json.images[json.textures[0].source],view=json.bufferViews[image.bufferView];
 const start=binStart+(view.byteOffset||0),blob=new Blob([bytes.slice(start,start+view.byteLength)],{type:image.mimeType||'image/jpeg'});
 const src=URL.createObjectURL(blob);
 try{
  const texture=await new THREE.TextureLoader().loadAsync(src);
  texture.colorSpace=THREE.SRGBColorSpace;
  // glTF UVs use a different image vertical origin than Three.js textures.
  texture.flipY=false;
  const model=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:texture,roughness:.92,metalness:0,side:THREE.DoubleSide}));
  model.name='Duomo di Milano — scansione fotografica';
  // Original scan bounds: width 602, height 1062, length 2238 source units.
  // Scale aligns the cathedral's roughly 112 m length and 53 m height.
  model.scale.setScalar(.05);
  model.rotation.y=Math.PI/2;
  model.position.set(73,0,0);
  model.receiveShadow=true;
  model.castShadow=false;
  return model;
 }finally{URL.revokeObjectURL(src);}
}
