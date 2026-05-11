import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/* ═══ JS NOISE (for patterns) ═══ */
const perm=new Uint8Array(512),pm12=new Uint8Array(512);
const G3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
(()=>{const p=Array.from({length:256},(_,i)=>i);let s=42;for(let i=255;i>0;i--){s=(s*16807)%2147483647;const j=s%(i+1);[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++){perm[i]=p[i&255];pm12[i]=perm[i]%12;}})();
const F2=0.5*(Math.sqrt(3)-1),G2c=(3-Math.sqrt(3))/6;
function n2d(x,y){const s=(x+y)*F2,i=Math.floor(x+s),j=Math.floor(y+s),t=(i+j)*G2c;const x0=x-(i-t),y0=y-(j-t),i1=x0>y0?1:0,j1=x0>y0?0:1;const x1=x0-i1+G2c,y1=y0-j1+G2c,x2=x0-1+2*G2c,y2=y0-1+2*G2c;const ii=i&255,jj=j&255;let n0=0,n1=0,n2=0;let t0=0.5-x0*x0-y0*y0;if(t0>0){t0*=t0;const g=G3[pm12[ii+perm[jj]]];n0=t0*t0*(g[0]*x0+g[1]*y0);}let t1=0.5-x1*x1-y1*y1;if(t1>0){t1*=t1;const g=G3[pm12[ii+i1+perm[jj+j1]]];n1=t1*t1*(g[0]*x1+g[1]*y1);}let t2=0.5-x2*x2-y2*y2;if(t2>0){t2*=t2;const g=G3[pm12[ii+1+perm[jj+1]]];n2=t2*t2*(g[0]*x2+g[1]*y2);}return 70*(n0+n1+n2);}
function fbm(x,y,o=4){let v=0,a=0.5,f=1;for(let i=0;i<o;i++){v+=a*n2d(x*f,y*f);a*=0.5;f*=2;}return v;}
function hash2(x,y){return[Math.abs(Math.sin(x*127.1+y*311.7)*43758.5453)%1,Math.abs(Math.sin(x*269.5+y*183.3)*43758.5453)%1];}

/* ═══ PATTERNS ═══ */
function patOrganic(u,v,p){const{density=5,smoothness=0.3,scale=1,randomness=0.4}=p;const sx=u*scale*density,sy=v*scale*density;let h=0,a=1,f=1,w=1;for(let i=0;i<6;i++){let sig=n2d(sx*f+i*7.3,sy*f+i*3.7);sig=1-Math.abs(sig);sig*=sig*w;w=Math.min(1,Math.max(0,sig*2.5));h+=sig*a;a*=0.5;f*=2.1;}h*=0.33;const sm=fbm(sx*0.7,sy*0.7,5)*0.5+0.5;h=h*(1-smoothness)+sm*smoothness;if(randomness>0){const wr=fbm(sx*0.5+50,sy*0.5+50,3)*randomness*2;const h2=fbm(sx+wr,sy+wr,4)*0.5+0.5;h=h*0.6+h2*0.4;}return Math.max(0,Math.min(1,h));}
function patFaceted(u,v,p){const{density=5,sharpness=0.7,variation=0.8,rotation=0}=p;const rot=rotation*Math.PI/180,cu=u-0.5,cv=v-0.5;const ru=cu*Math.cos(rot)-cv*Math.sin(rot)+0.5,rv=cu*Math.sin(rot)+cv*Math.cos(rot)+0.5;const sc=density,su=ru*sc,sv=rv*sc,ci=Math.floor(su),cj=Math.floor(sv);let minD=999,minD2=999,cellVal=0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ni=ci+di,nj=cj+dj;const[hx,hy]=hash2(ni,nj);const cx=ni+0.3+hx*0.4,cy=nj+0.3+hy*0.4,dx=su-cx,dy=sv-cy,d=dx*dx+dy*dy;if(d<minD){minD2=minD;minD=d;const[h1,h2]=hash2(ni+100,nj+100);cellVal=hash2(ni+200,nj+200)[0]*variation+(1-variation)*0.5+dx*(h1-0.5)*variation*0.3+dy*(h2-0.5)*variation*0.3;}else if(d<minD2)minD2=d;}const edge=Math.sqrt(minD2)-Math.sqrt(minD);return Math.max(0,Math.min(1,cellVal*Math.min(edge*sc*sharpness*3,1)));}
function patDunes(u,v,p){const{frequency=3,layers=3,direction=30,curl=0.3,erosion=0}=p;const dir=direction*Math.PI/180,dx=Math.cos(dir),dy=Math.sin(dir);let h=0;for(let i=0;i<Math.round(layers);i++){const f=frequency*(1+i*0.7),ph=i*1.7;const wx=fbm(u*3+i*10,v*3+i*10,3)*curl,wy=fbm(u*3+i*10+50,v*3+i*10+50,3)*curl;h+=(Math.sin(((u+wx)*dx+(v+wy)*dy)*f*Math.PI*2+ph)+1)/2/(i+1);}h/=1.8;if(erosion>0)h=Math.pow(h,1+erosion);return Math.max(0,Math.min(1,h));}
function patVoronoi(u,v,p){const{cellCount=6,wallWidth=0.5,depth2=0.7,jitter=0.8,style=0}=p;const sc=cellCount,su=u*sc,sv=v*sc,ci=Math.floor(su),cj=Math.floor(sv);let d1=999,d2=999,cH=0;for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const ni=ci+di,nj=cj+dj;const[hx,hy]=hash2(ni,nj);const cx=ni+0.5+(hx-0.5)*jitter,cy=nj+0.5+(hy-0.5)*jitter;const dist=Math.sqrt((su-cx)**2+(sv-cy)**2);if(dist<d1){d2=d1;d1=dist;cH=hash2(ni+50,nj+50)[0];}else if(dist<d2)d2=dist;}const edge=d2-d1,wt=wallWidth*0.3;let h;if(style<0.5){const wH=1-Math.min(edge/wt,1);h=wH*(1-depth2*0.3)+(1-wH)*cH*depth2;}else{const dome=1-d1*2;h=Math.max(0,dome)*Math.min(edge/wt,1)*cH*depth2+(1-Math.min(edge/wt,1))*0.1;}return Math.max(0,Math.min(1,h));}
function patPlateau(u,v,p){const{levels=4,scale=3,sharpness=0.7,warp=0.3}=p;const wx=fbm(u*4+200,v*4+200,3)*warp,wy=fbm(u*4+300,v*4+300,3)*warp;let raw=fbm((u+wx)*scale,(v+wy)*scale,6)*0.5+0.5;const cx=u-0.5,cy=v-0.5;raw=raw*0.5+(1-Math.min(Math.sqrt(cx*cx+cy*cy)*2.5,1))*0.5;const lvl=Math.max(2,Math.round(levels));const stepped=Math.floor(raw*lvl)/lvl,next=Math.ceil(raw*lvl)/lvl,frac=(raw-stepped)*lvl;const ease=sharpness>0.5?(frac<(1-sharpness)*2?frac/((1-sharpness)*2):1):frac*sharpness*2;return Math.max(0,Math.min(1,stepped+(next-stepped)*Math.min(ease,1)));}

/* ═══ GEOMETRY with CORNER FILLETS ═══ */
function buildPanel(wCm,hCm,borderMm,thickCm,ampCm,patFn,pp){
  const RES=100;
  const W=wCm/100,H=hCm/100,B=borderMm/1000;
  const BASE=thickCm/100,REL=ampCm/100;
  const CR=0.008; // 8mm corner radius
  const hw=W/2,hh=H/2;

  const iW=Math.max(0.001,W-B*2),iH=Math.max(0.001,H-B*2);
  const hf=new Float32Array(RES*RES);

  // Signed distance to rounded rectangle
  function sdfRoundRect(px,py){
    const dx=Math.abs(px)-hw+CR;
    const dy=Math.abs(py)-hh+CR;
    const outside=Math.sqrt(Math.max(dx,0)**2+Math.max(dy,0)**2)-CR;
    const inside=Math.min(Math.max(dx,dy),0)-CR;
    return -(outside+inside); // positive inside
  }

  for(let j=0;j<RES;j++)for(let i=0;i<RES;i++){
    const u=i/(RES-1),v=j/(RES-1);
    const px=(u-0.5)*W,py=(v-0.5)*H;
    const sdf=sdfRoundRect(px,py);
    if(sdf<=0){hf[j*RES+i]=-1;continue;} // outside rounded rect — mark as outside

    if(B>0.001){
      const dMin=Math.min(px+hw-B,hw-B-px,py+hh-B,hh-B-py);
      if(dMin<=0){hf[j*RES+i]=0;continue;}
      let val=patFn((px+hw-B)/iW,(py+hh-B)/iH,pp);
      const t=Math.min(dMin/(B*0.4+0.003),1);val*=t*t*(3-2*t);
      hf[j*RES+i]=val*REL;
    }else{
      hf[j*RES+i]=patFn(u,v,pp)*REL;
    }
    // Fade at rounded corners
    const edgeFade=Math.min(sdf/0.008,1);
    hf[j*RES+i]*=edgeFade*edgeFade*(3-2*edgeFade);
  }

  // Smooth
  for(let pass=0;pass<3;pass++){
    const tmp=new Float32Array(RES*RES),kr=pass===0?2:1;
    for(let j=0;j<RES;j++)for(let i=0;i<RES;i++){
      if(hf[j*RES+i]<0){tmp[j*RES+i]=-1;continue;}
      let s=0,c=0;
      for(let dj=-kr;dj<=kr;dj++)for(let di=-kr;di<=kr;di++){
        const ni=i+di,nj=j+dj;
        if(ni>=0&&ni<RES&&nj>=0&&nj<RES&&hf[nj*RES+ni]>=0){
          const w=1/(1+Math.abs(di)+Math.abs(dj));s+=hf[nj*RES+ni]*w;c+=w;
        }
      }tmp[j*RES+i]=c>0?s/c:0;
    }hf.set(tmp);
  }

  const getH=(i,j)=>{const v=hf[Math.max(0,Math.min(RES-1,j))*RES+Math.max(0,Math.min(RES-1,i))];return v<0?0:v;};
  const isInside=(i,j)=>hf[Math.max(0,Math.min(RES-1,j))*RES+Math.max(0,Math.min(RES-1,i))]>=0;
  const pos=[],uv=[],idx=[];

  // Vertex index map (-1 = outside)
  const vMap=new Int32Array(RES*RES).fill(-1);

  // Top surface — only inside rounded rect
  for(let j=0;j<RES;j++)for(let i=0;i<RES;i++){
    if(!isInside(i,j))continue;
    const u=i/(RES-1),v=j/(RES-1);
    vMap[j*RES+i]=pos.length/3;
    pos.push((u-0.5)*W,(v-0.5)*H,BASE+getH(i,j));
    uv.push(u,v);
  }
  for(let j=0;j<RES-1;j++)for(let i=0;i<RES-1;i++){
    const a=vMap[j*RES+i],b=vMap[j*RES+i+1];
    const c=vMap[(j+1)*RES+i],d=vMap[(j+1)*RES+i+1];
    if(a<0||b<0||c<0||d<0)continue;
    idx.push(a,b,c,b,d,c);
  }

  // Bottom face — rounded rectangle
  const cornerSegs=8;
  const bottomCenter=pos.length/3;
  pos.push(0,0,0);uv.push(0.5,0.5);
  // Build perimeter points
  const perimVerts=[];
  function addArc(cx,cy,startAng,endAng){
    for(let s=0;s<=cornerSegs;s++){
      const a=startAng+(endAng-startAng)*s/cornerSegs;
      const px=cx+CR*Math.cos(a),py=cy+CR*Math.sin(a);
      const vi=pos.length/3;
      pos.push(px,py,0);uv.push(px/W+0.5,py/H+0.5);
      perimVerts.push(vi);
    }
  }
  // Bottom-left, bottom-right, top-right, top-left corners
  addArc(-hw+CR,-hh+CR, Math.PI, Math.PI*1.5);
  addArc(hw-CR,-hh+CR, Math.PI*1.5, Math.PI*2);
  addArc(hw-CR,hh-CR, 0, Math.PI*0.5);
  addArc(-hw+CR,hh-CR, Math.PI*0.5, Math.PI);
  // Close
  perimVerts.push(perimVerts[0]);
  // Fan triangles
  for(let i=0;i<perimVerts.length-1;i++){
    idx.push(bottomCenter,perimVerts[i+1],perimVerts[i]);
  }

  // Side faces — connect perimeter bottom to top surface edge
  // Walk the perimeter and find closest top surface vertex
  for(let i=0;i<perimVerts.length-1;i++){
    const bi0=perimVerts[i],bi1=perimVerts[i+1];
    const bx0=pos[bi0*3],by0=pos[bi0*3+1];
    const bx1=pos[bi1*3],by1=pos[bi1*3+1];
    // Find closest top surface vertices
    const findTop=(bx,by)=>{
      let bestD=999,bestI=-1;
      const gi=Math.round((bx/W+0.5)*(RES-1));
      const gj=Math.round((by/H+0.5)*(RES-1));
      for(let dj=-3;dj<=3;dj++)for(let di=-3;di<=3;di++){
        const ni=gi+di,nj=gj+dj;
        if(ni<0||ni>=RES||nj<0||nj>=RES)continue;
        const vi=vMap[nj*RES+ni];if(vi<0)continue;
        const dx=pos[vi*3]-bx,dy=pos[vi*3+1]-by;
        const d=dx*dx+dy*dy;if(d<bestD){bestD=d;bestI=vi;}
      }
      return bestI;
    };
    const ti0=findTop(bx0,by0),ti1=findTop(bx1,by1);
    if(ti0<0||ti1<0)continue;
    const s=pos.length/3;
    pos.push(bx0,by0,0, bx1,by1,0,
             pos[ti0*3],pos[ti0*3+1],pos[ti0*3+2],
             pos[ti1*3],pos[ti1*3+1],pos[ti1*3+2]);
    uv.push(0,0,1,0,0,1,1,1);
    idx.push(s,s+1,s+2,s+1,s+3,s+2);
  }

  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ═══ GLSL MYCELIUM SHADER ═══ */
const MYCELIUM_GLSL = `
// Simplex 2D noise
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289v2(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1;i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
  i=mod289v2(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

float fbmTex(vec2 p,int oct){
  float v=0.0,a=0.5;
  for(int i=0;i<8;i++){
    if(i>=oct)break;
    v+=a*snoise(p);p*=2.1;a*=0.48;
  }
  return v;
}

// Hash for fiber direction
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
`;

function createMyceliumMaterial(){
  const mat=new THREE.MeshStandardMaterial({
    color:new THREE.Color(0.89,0.87,0.82),
    roughness:0.82,
    metalness:0.0,
  });

  mat.onBeforeCompile=(shader)=>{
    // Pass UVs to fragment
    shader.vertexShader=shader.vertexShader.replace(
      'void main() {',
      'varying vec2 vUv2;\nvarying vec3 vWorldPos;\nvoid main() {'
    );
    shader.vertexShader=shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvUv2=uv;\nvWorldPos=(modelMatrix*vec4(position,1.0)).xyz;'
    );

    shader.fragmentShader=shader.fragmentShader.replace(
      'void main() {',
      `varying vec2 vUv2;\nvarying vec3 vWorldPos;\n${MYCELIUM_GLSL}\nvoid main() {`
    );

    // COLOR: warm off-white with organic variation
    shader.fragmentShader=shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
       vec2 texCoord = vUv2 * 12.0;
       // Large-scale color variation (warm/cool areas)
       float colorVar = fbmTex(texCoord * 0.3, 4) * 0.06;
       // Medium substrate variation
       float medVar = fbmTex(texCoord * 0.8 + 50.0, 3) * 0.03;
       diffuseColor.rgb += vec3(colorVar + medVar, colorVar * 0.8 + medVar, colorVar * 0.5);
       // Subtle warm/cool shift
       float warmShift = snoise(texCoord * 0.2 + 100.0) * 0.015;
       diffuseColor.r += warmShift;
       diffuseColor.b -= warmShift * 0.5;
      `
    );

    // NORMAL: fiber micro-texture + substrate grain
    shader.fragmentShader=shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>
       vec2 tc = vUv2 * 40.0;
       // Layered noise for organic surface
       float n1 = snoise(tc) * 0.4;
       float n2 = snoise(tc * 2.3 + 30.0) * 0.25;
       float n3 = snoise(tc * 5.7 + 60.0) * 0.12;
       // Fiber-like directional perturbation
       float fiberAngle = snoise(tc * 0.5 + 200.0) * 3.14159;
       float fiberStrength = (hash(floor(tc * 2.0)) > 0.6) ? 0.06 : 0.02;
       float fiberNx = cos(fiberAngle) * fiberStrength;
       float fiberNy = sin(fiberAngle) * fiberStrength;
       // Pore depressions
       float pore = smoothstep(0.7, 0.75, hash(floor(tc * 3.0)));
       float poreDepth = pore * 0.04;
       // Combine
       normal = normalize(normal + vec3(
         (n1 + n2 + n3) * 0.05 + fiberNx,
         (n1 * 0.8 + n2 + n3 * 1.2) * 0.05 + fiberNy,
         0.0
       ) - vec3(0.0, 0.0, poreDepth));
      `
    );

    // ROUGHNESS: varies with substrate features
    shader.fragmentShader=shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      `#include <roughnessmap_fragment>
       float rNoise = fbmTex(vUv2 * 15.0 + 400.0, 4) * 0.12;
       float rFiber = (hash(floor(vUv2 * 80.0)) > 0.7) ? 0.05 : 0.0;
       roughnessFactor = clamp(roughnessFactor + rNoise + rFiber - 0.03, 0.6, 1.0);
      `
    );
  };

  return mat;
}

/* ═══ HUMAN FIGURE ═══ */
function createHuman(){
  const g=new THREE.Group();
  const m=new THREE.MeshBasicMaterial({color:0x666666,transparent:true,opacity:0.4,side:THREE.DoubleSide});
  // Simplified silhouette as flat shape
  const shape=new THREE.Shape();
  // Rough human outline (facing camera)
  shape.moveTo(-0.15,0); // left foot
  shape.lineTo(-0.1,0);shape.lineTo(-0.1,0.45);shape.lineTo(-0.18,0.45);// left leg
  shape.lineTo(-0.18,0.85);shape.lineTo(-0.22,0.85);// torso left
  shape.lineTo(-0.3,0.7);shape.lineTo(-0.28,0.68);shape.lineTo(-0.2,0.83);// left arm
  shape.lineTo(-0.14,0.85);shape.lineTo(-0.14,1.05);// shoulder to neck
  // Head
  shape.absarc(0,1.15,0.1,Math.PI*0.85,Math.PI*0.15,true);
  shape.lineTo(0.14,1.05);shape.lineTo(0.14,0.85);
  shape.lineTo(0.2,0.83);shape.lineTo(0.28,0.68);shape.lineTo(0.3,0.7);shape.lineTo(0.22,0.85);// right arm
  shape.lineTo(0.18,0.85);shape.lineTo(0.18,0.45);shape.lineTo(0.1,0.45);// right leg
  shape.lineTo(0.1,0);shape.lineTo(0.15,0);
  const geo=new THREE.ShapeGeometry(shape);
  const mesh=new THREE.Mesh(geo,m);
  mesh.scale.set(1.4,1.4,1);
  g.add(mesh);
  return g;
}

/* ═══ SLIDER ═══ */
function Slider({label,value,min,max,step=0.01,onChange,unit=""}){
  const pct=((value-min)/(max-min))*100;
  return(<div style={{marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:11,letterSpacing:"0.04em",color:"#888"}}>
      <span>{label}</span><span style={{color:"#bbb",fontVariantNumeric:"tabular-nums"}}>{Number.isInteger(step)?value:value.toFixed(step<0.1?2:1)}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))}
      style={{width:"100%",height:3,appearance:"none",background:`linear-gradient(to right,#c8b89a ${pct}%,#333 ${pct}%)`,borderRadius:2,outline:"none",cursor:"pointer"}}/>
  </div>);
}

const PATTERNS=[
  {id:"organic",label:"Organic",fn:patOrganic,params:{density:5,smoothness:0.3,scale:1,randomness:0.4},sliders:[{key:"density",label:"Density",min:2,max:12,step:0.5},{key:"smoothness",label:"Smoothness",min:0,max:1},{key:"scale",label:"Scale",min:0.3,max:3,step:0.1},{key:"randomness",label:"Randomness",min:0,max:1}]},
  {id:"faceted",label:"Faceted",fn:patFaceted,params:{density:5,sharpness:0.7,variation:0.8,rotation:0},sliders:[{key:"density",label:"Density",min:3,max:12,step:1},{key:"sharpness",label:"Sharpness",min:0,max:1},{key:"variation",label:"Variation",min:0,max:1},{key:"rotation",label:"Rotation",min:0,max:90,step:5,unit:"°"}]},
  {id:"dunes",label:"Dunes",fn:patDunes,params:{frequency:3,layers:3,direction:30,curl:0.3,erosion:0},sliders:[{key:"frequency",label:"Frequency",min:1,max:8,step:0.5},{key:"layers",label:"Layers",min:1,max:5,step:1},{key:"direction",label:"Direction",min:0,max:180,step:5,unit:"°"},{key:"curl",label:"Curl",min:0,max:1},{key:"erosion",label:"Erosion",min:0,max:1}]},
  {id:"voronoi",label:"Cellular",fn:patVoronoi,params:{cellCount:6,wallWidth:0.5,depth2:0.7,jitter:0.8,style:0},sliders:[{key:"cellCount",label:"Cell Count",min:3,max:15,step:1},{key:"wallWidth",label:"Wall Width",min:0.1,max:1},{key:"depth2",label:"Depth",min:0,max:1},{key:"jitter",label:"Jitter",min:0,max:1},{key:"style",label:"Style",min:0,max:1,step:1}]},
  {id:"plateau",label:"Plateau",fn:patPlateau,params:{levels:4,scale:3,sharpness:0.7,warp:0.3},sliders:[{key:"levels",label:"Levels",min:2,max:10,step:1},{key:"scale",label:"Scale",min:1,max:8,step:0.5},{key:"sharpness",label:"Sharpness",min:0,max:1},{key:"warp",label:"Warp",min:0,max:1}]},
];

/* ═══ APP ═══ */
export default function NUMUConfigurator(){
  const canvasRef=useRef(null),sceneRef=useRef(null),camRef=useRef(null),rendRef=useRef(null);
  const meshRef=useRef(null),frameRef=useRef(null),matRef=useRef(null);
  const arrayGroupRef=useRef(null),humanRef=useRef(null),geoRef=useRef(null);
  const orb=useRef({drag:false,px:0,py:0,theta:0.4,phi:Math.PI/2.2,dist:0.55});

  const[mode,setMode]=useState("tile");
  const[pi,setPi]=useState(0);
  const[pp,setPp]=useState({...PATTERNS[0].params});
  const[w,setW]=useState(40);
  const[h,setH]=useState(40);
  const[brd,setBrd]=useState(15);
  const[thick,setThick]=useState(5);
  const[amp,setAmp]=useState(2.5);
  const[cols,setCols]=useState(6);
  const[rows,setRows]=useState(4);
  const[gap,setGap]=useState(5);
  const pat=PATTERNS[pi];

  const updateCam=useCallback(()=>{
    const cam=camRef.current;if(!cam)return;const o=orb.current;
    cam.position.set(o.dist*Math.sin(o.phi)*Math.sin(o.theta),o.dist*Math.cos(o.phi),o.dist*Math.sin(o.phi)*Math.cos(o.theta));
    cam.up.set(0,1,0);cam.lookAt(0,0,thick/200+amp/200);
  },[thick,amp]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const r=new THREE.WebGLRenderer({canvas,antialias:true});
    r.setPixelRatio(Math.min(window.devicePixelRatio,2));
    r.setClearColor(0x0e0e0e);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
    r.outputColorSpace=THREE.SRGBColorSpace;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
    rendRef.current=r;
    const scene=new THREE.Scene();sceneRef.current=scene;
    const cam=new THREE.PerspectiveCamera(30,1,0.01,50);camRef.current=cam;

    scene.add(new THREE.AmbientLight(0xf5efe6,0.22));
    const main=new THREE.DirectionalLight(0xfff6e8,2.6);
    main.position.set(-0.5,0.55,0.85);main.castShadow=true;
    main.shadow.mapSize.set(2048,2048);main.shadow.camera.near=0.1;main.shadow.camera.far=8;
    main.shadow.camera.left=-4;main.shadow.camera.right=4;main.shadow.camera.top=4;main.shadow.camera.bottom=-4;
    main.shadow.bias=-0.0004;main.shadow.radius=5;scene.add(main);
    scene.add(new THREE.DirectionalLight(0xe8e4dd,0.25).translateX(0.6).translateY(-0.2).translateZ(0.5));
    scene.add(new THREE.DirectionalLight(0xf5f0ea,0.12).translateY(0.7).translateZ(0.15));

    const wall=new THREE.Mesh(new THREE.PlaneGeometry(20,20),
      new THREE.MeshStandardMaterial({color:new THREE.Color(0.78,0.72,0.64),roughness:0.92,metalness:0}));
    wall.position.z=-0.01;wall.receiveShadow=true;scene.add(wall);

    // Create shader material once
    matRef.current=createMyceliumMaterial();

    const resize=()=>{const p=canvas.parentElement;if(!p)return;r.setSize(p.clientWidth,p.clientHeight);cam.aspect=p.clientWidth/p.clientHeight;cam.updateProjectionMatrix();};
    resize();window.addEventListener("resize",resize);
    const onD=e=>{orb.current.drag=true;orb.current.px=e.clientX;orb.current.py=e.clientY;canvas.setPointerCapture(e.pointerId);};
    const onU=e=>{orb.current.drag=false;canvas.releasePointerCapture(e.pointerId);};
    const onM=e=>{if(!orb.current.drag)return;const o=orb.current;o.theta+=(e.clientX-o.px)*0.006;o.phi=Math.max(0.3,Math.min(Math.PI-0.3,o.phi-(e.clientY-o.py)*0.006));o.px=e.clientX;o.py=e.clientY;updateCam();};
    const onW=e=>{e.preventDefault();orb.current.dist=Math.max(0.15,Math.min(8,orb.current.dist*(1+e.deltaY*0.001)));updateCam();};
    canvas.addEventListener('pointerdown',onD);canvas.addEventListener('pointerup',onU);
    canvas.addEventListener('pointermove',onM);canvas.addEventListener('wheel',onW,{passive:false});
    updateCam();
    const loop=()=>{frameRef.current=requestAnimationFrame(loop);r.render(scene,cam);};loop();
    return()=>{cancelAnimationFrame(frameRef.current);window.removeEventListener("resize",resize);
      canvas.removeEventListener('pointerdown',onD);canvas.removeEventListener('pointerup',onU);
      canvas.removeEventListener('pointermove',onM);canvas.removeEventListener('wheel',onW);r.dispose();};
  },[updateCam]);

  // Build geo when panel params change
  useEffect(()=>{
    if(geoRef.current)geoRef.current.dispose();
    geoRef.current=buildPanel(w,h,brd,thick,amp,pat.fn,pp);
  },[w,h,brd,thick,amp,pi,pp,pat.fn]);

  // Update scene
  useEffect(()=>{
    const scene=sceneRef.current;if(!scene||!geoRef.current||!matRef.current)return;
    if(meshRef.current){scene.remove(meshRef.current);meshRef.current=null;}
    if(arrayGroupRef.current){scene.remove(arrayGroupRef.current);arrayGroupRef.current=null;}
    if(humanRef.current){scene.remove(humanRef.current);humanRef.current=null;}

    const geo=geoRef.current,mat=matRef.current;
    const W=w/100,H=h/100,G=gap/1000;

    if(mode==="tile"){
      const mesh=new THREE.Mesh(geo,mat);mesh.castShadow=true;scene.add(mesh);meshRef.current=mesh;
      orb.current.dist=0.55;updateCam();
    }else{
      const count=cols*rows;
      const inst=new THREE.InstancedMesh(geo,mat,count);inst.castShadow=true;
      const dummy=new THREE.Object3D();
      const totalW=cols*W+(cols-1)*G,totalH=rows*H+(rows-1)*G;
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        dummy.position.set(c*(W+G)-totalW/2+W/2,r*(H+G)-totalH/2+H/2,0);
        dummy.updateMatrix();inst.setMatrixAt(r*cols+c,dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate=true;
      const group=new THREE.Group();group.add(inst);
      const human=createHuman();
      human.position.set(totalW/2+0.15,-totalH/2,0.001);
      group.add(human);humanRef.current=human;
      scene.add(group);arrayGroupRef.current=group;meshRef.current=inst;
      orb.current.dist=Math.max(totalW,totalH)*1.1+0.3;
      orb.current.theta=0.12;orb.current.phi=Math.PI/2.1;updateCam();
    }
  },[mode,w,h,cols,rows,gap,thick,amp,pi,pp,pat.fn,updateCam]);

  return(
    <div style={{width:"100vw",height:"100vh",display:"flex",background:"#111",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:"#ddd",overflow:"hidden"}}>
      <div style={{flex:1,position:"relative"}}>
        <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",cursor:"grab",touchAction:"none"}}/>
        <div style={{position:"absolute",top:28,left:32}}>
          <div style={{fontSize:24,fontWeight:200,letterSpacing:"0.25em",color:"#c8b89a"}}>NUMU</div>
          <div style={{fontSize:10,fontWeight:300,letterSpacing:"0.15em",color:"#555",textTransform:"uppercase",marginTop:4}}>Panel Configurator</div>
        </div>
        <div style={{position:"absolute",top:28,right:340,display:"flex",gap:4,background:"#1a1a1a",borderRadius:6,padding:3}}>
          {["tile","array"].map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{padding:"8px 20px",fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",
                background:mode===m?"#c8b89a":"transparent",color:mode===m?"#111":"#666",
                border:"none",borderRadius:4,cursor:"pointer",fontWeight:mode===m?600:400,fontFamily:"inherit"}}>{m==="tile"?"Single Tile":"Array"}</button>
          ))}
        </div>
        <div style={{position:"absolute",bottom:20,left:32,fontSize:10,color:"#444"}}>Drag to orbit · Scroll to zoom</div>
      </div>
      <div style={{width:310,background:"#161616",borderLeft:"1px solid #252525",overflowY:"auto",padding:"28px 22px",display:"flex",flexDirection:"column"}}>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:10}}>Pattern</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {PATTERNS.map((p,i)=>(<button key={p.id} onClick={()=>{setPi(i);setPp({...PATTERNS[i].params});}}
              style={{padding:"8px 0",fontSize:11,letterSpacing:"0.04em",background:i===pi?"#c8b89a":"#222",color:i===pi?"#111":"#777",
                border:"none",borderRadius:4,cursor:"pointer",fontWeight:i===pi?600:400,fontFamily:"inherit",
                width:i<3?"calc(33.33% - 4px)":"calc(50% - 3px)"}}>{p.label}</button>))}
          </div>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:10}}>Dimensions</div>
          <Slider label="Width" value={w} min={20} max={100} step={1} onChange={setW} unit="cm"/>
          <Slider label="Height" value={h} min={20} max={100} step={1} onChange={setH} unit="cm"/>
          <Slider label="Thickness" value={thick} min={1} max={10} step={0.5} onChange={setThick} unit="cm"/>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:10}}>Relief</div>
          <Slider label="Amplitude" value={amp} min={0} max={6} step={0.1} onChange={setAmp} unit="cm"/>
          <Slider label="Border" value={brd} min={0} max={50} step={1} onChange={setBrd} unit="mm"/>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:10}}>{pat.label} Parameters</div>
          {pat.sliders.map(s=>(<Slider key={s.key} label={s.label} value={pp[s.key]} min={s.min} max={s.max} step={s.step||0.01}
            onChange={v=>setPp(prev=>({...prev,[s.key]:v}))} unit={s.unit||""}/>))}
        </div>
        {mode==="array"&&(<div style={{marginBottom:22}}>
          <div style={{fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:10}}>Array Layout</div>
          <Slider label="Columns" value={cols} min={2} max={16} step={1} onChange={setCols}/>
          <Slider label="Rows" value={rows} min={2} max={16} step={1} onChange={setRows}/>
          <Slider label="Gap" value={gap} min={0} max={20} step={1} onChange={setGap} unit="mm"/>
          <div style={{fontSize:10,color:"#555",marginTop:6}}>
            Coverage: {((cols*w/100+(cols-1)*gap/1000)*100).toFixed(0)}×{((rows*h/100+(rows-1)*gap/1000)*100).toFixed(0)}cm
          </div>
        </div>)}
        <div style={{marginTop:"auto",paddingTop:16,borderTop:"1px solid #222",fontSize:10,color:"#444",lineHeight:1.7}}>
          {mode==="tile"?`Total: ${(thick+amp).toFixed(1)}cm max · Panel: ${w}×${h}cm`:`${cols}×${rows} panels · ${gap}mm gap`}<br/>All designs are production-ready
        </div>
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#c8b89a;cursor:pointer;border:2px solid #111;margin-top:-5px;}
        input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#c8b89a;cursor:pointer;border:2px solid #111;}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#161616;}::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
      `}</style>
    </div>
  );
}
