import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* ============================= بيانات السيارات ============================= */
/* cls يحدد الهيكل الهندسي: hatch / sport / wagon / roadster / super / hyper */
const CAR_DATA=[
 {brand:"BMW",model:"M3 Competition",hp:503,max:290,acc:8.8,color:"#e11d48",cls:"sport"},
 {brand:"BMW",model:"M5 CS",hp:627,max:305,acc:9.3,color:"#374151",cls:"sport"},
 {brand:"BMW",model:"M4 CSL",hp:543,max:307,acc:9.1,color:"#f8fafc",cls:"sport"},
 {brand:"Toyota",model:"GR Supra",hp:382,max:250,acc:8.3,color:"#ef4444",cls:"sport"},
 {brand:"Toyota",model:"GR Yaris",hp:268,max:230,acc:7.5,color:"#2563eb",cls:"hatch"},
 {brand:"Toyota",model:"GR86",hp:228,max:226,acc:7.1,color:"#f8fafc",cls:"sport"},
 {brand:"Nissan",model:"GT-R Nismo",hp:600,max:330,acc:9.7,color:"#111827",cls:"super"},
 {brand:"Nissan",model:"370Z",hp:332,max:250,acc:7.5,color:"#f59e0b",cls:"sport"},
 {brand:"Nissan",model:"Z",hp:400,max:250,acc:8.0,color:"#06b6d4",cls:"sport"},
 {brand:"Lamborghini",model:"Huracán EVO",hp:631,max:325,acc:10,color:"#facc15",cls:"super"},
 {brand:"Lamborghini",model:"Aventador SVJ",hp:759,max:350,acc:10,color:"#84cc16",cls:"hyper"},
 {brand:"Lamborghini",model:"Revuelto",hp:814,max:350,acc:10,color:"#fb7185",cls:"hyper"},
 {brand:"Porsche",model:"911 Turbo S",hp:640,max:330,acc:10,color:"#ffffff",cls:"super"},
 {brand:"Porsche",model:"718 Cayman GT4",hp:414,max:304,acc:8.1,color:"#f97316",cls:"sport"},
 {brand:"Porsche",model:"Taycan Turbo S",hp:750,max:260,acc:9.5,color:"#64748b",cls:"sport"},
 {brand:"Volkswagen",model:"Golf R",hp:315,max:250,acc:8.0,color:"#2563eb",cls:"hatch"},
 {brand:"Volkswagen",model:"Golf GTI",hp:241,max:250,acc:7.2,color:"#dc2626",cls:"hatch"},
 {brand:"Volkswagen",model:"Golf Clubsport",hp:296,max:250,acc:7.8,color:"#111827",cls:"hatch"},
 {brand:"Audi",model:"R8 V10 Performance",hp:602,max:331,acc:9.8,color:"#a1a1aa",cls:"super"},
 {brand:"Audi",model:"RS6 Avant",hp:621,max:305,acc:9.2,color:"#7c3aed",cls:"wagon"},
 {brand:"Audi",model:"RS3",hp:401,max:290,acc:8.3,color:"#22c55e",cls:"hatch"},
 {brand:"Ferrari",model:"488 Pista",hp:711,max:340,acc:10,color:"#dc2626",cls:"super"},
 {brand:"Ferrari",model:"SF90 Stradale",hp:986,max:340,acc:10,color:"#ef4444",cls:"hyper"},
 {brand:"Ferrari",model:"F8 Tributo",hp:710,max:340,acc:10,color:"#b91c1c",cls:"super"},
 {brand:"Honda",model:"Civic Type R",hp:315,max:275,acc:7.7,color:"#f8fafc",cls:"hatch"},
 {brand:"Honda",model:"NSX",hp:573,max:307,acc:9.0,color:"#dc2626",cls:"super"},
 {brand:"Honda",model:"S2000",hp:247,max:240,acc:7.0,color:"#f59e0b",cls:"roadster"},
 {brand:"Mercedes-Benz",model:"AMG GT Black Series",hp:720,max:325,acc:9.9,color:"#111827",cls:"super"},
 {brand:"Mercedes-Benz",model:"AMG C 63 S",hp:671,max:280,acc:9.0,color:"#64748b",cls:"sport"},
 {brand:"Mercedes-Benz",model:"AMG GT 63 S",hp:831,max:315,acc:9.8,color:"#1d4ed8",cls:"sport"},
 {brand:"Bugatti",model:"Chiron Super Sport",hp:1578,max:490,acc:10,color:"#0ea5e9",cls:"hyper"},
 {brand:"Bugatti",model:"Chiron",hp:1479,max:420,acc:10,color:"#1e3a8a",cls:"hyper"},
 {brand:"Bugatti",model:"Veyron",hp:987,max:407,acc:9.7,color:"#0f172a",cls:"hyper"},
 {brand:"BMW",model:"M3 E30",hp:238,max:235,acc:6.8,color:"#1d4ed8",cls:"sport"},
 {brand:"Lamborghini",model:"Terzo Millennio",hp:1000,max:350,acc:10,color:"#84cc16",cls:"hyper"},
 {brand:"Koenigsegg",model:"Chimera",hp:1600,max:440,acc:10,color:"#f97316",cls:"hyper"},
 {brand:"Ford",model:"Crown Victoria",hp:250,max:200,acc:5.5,color:"#111827",cls:"wagon"},
 {brand:"Toyota",model:"Supra Mk4 (1994)",hp:320,max:290,acc:7.9,color:"#e8681c",cls:"sport"},
 {brand:"Nissan",model:"Silvia S15",hp:250,max:240,acc:7.6,color:"#111827",cls:"sport"},
 {brand:"Audi",model:"RS5",hp:450,max:280,acc:8.6,color:"#94a3b8",cls:"sport"},
 {brand:"Ferrari",model:"LaFerrari",hp:963,max:350,acc:10,color:"#dc2626",cls:"hyper"},
 {brand:"Honda",model:"Integra Type R DB8",hp:197,max:220,acc:6.8,color:"#f8fafc",cls:"sport"}
];

/* نماذج GLB الحقيقية: ضع الملفات داخل مجلد models/ بجانب index.html
   len = الطول بالمتر، paint = أسماء خامات الطلاء القابلة للتلوين، flip = قلب اتجاه المقدمة (اضغط O داخل اللعبة لقلبها) */
const MODEL_MAP={
 "BMW M4 CSL":{file:"bmw_m4csl.glb",len:4.8,paint:/car_?paint/i,flip:false},
 "BMW M3 E30":{file:"free_bmw_m3_e30.glb",len:4.35,paint:/paint/i,flip:false},
 "Volkswagen Golf R":{file:"2025_volkswagen_golf_r.glb",len:4.29,paint:/^carpaint$/i,flip:false},
 "Lamborghini Aventador SVJ":{file:"lamborgini_aventador.glb",len:4.8,paint:/^(body|frontcolor)$/i,flip:false},
 "Lamborghini Terzo Millennio":{file:"lamborgini_terzo.glb",len:4.9,paint:/^(back|material)$/i,flip:false},
 "Koenigsegg Chimera":{file:"2024_koenigsegg_chimera.glb",len:4.6,paint:/carpaint/i,flip:false},
 "Ford Crown Victoria":{file:"ford_crown_victoria_2011.glb",len:5.4,paint:/^carpaint/i,flip:false},
 "Toyota Supra Mk4 (1994)":{file:"toyota_supra_mk_iv_1994.glb",len:4.52,paint:/paint|body/i,flip:false},
 "Nissan Silvia S15":{file:"nissan_s15_drift_free.glb",len:4.52,paint:/paint|body/i,flip:false},
 "Audi RS5":{file:"audi_rs5.glb",len:4.72,paint:/paint|body/i,flip:false},
 "Ferrari LaFerrari":{file:"ferrari_laferrari__www_vecarz_com.glb",len:4.70,paint:/paint|body|vernice/i,flip:false},
 "Honda Integra Type R DB8":{file:"honda_integra_type-r_db8_updated.glb",len:4.4,paint:/paint|body/i,flip:false},
 "Mercedes-Benz AMG GT 63 S":{file:"mercedes_gt63_amg.glb",len:5.02,paint:/paint|body/i,flip:false},
 "Bugatti Chiron":{file:"bugatti_chiron_mansory.glb",len:4.54,paint:/paint|body|carbon/i,flip:false}
};
const CITY_MODEL={file:"city_map_free.glb",targetSize:380,x:0,z:-150};
const glbCache={};
const gltfLoader=new GLTFLoader();

const CLASS_DIMS={
 hatch:   {w:1.78,len:4.05,wheelR:.34,wb:1.30,bodyY:.40,bodyH:.52,hoodLen:.95,hoodH:.16,hoodY:.60,cabinLen:1.95,cabinH:.58,cabinY:.90,trunkLen:.55,wide:1.00,wing:false,aggr:false},
 sport:   {w:1.90,len:4.55,wheelR:.37,wb:1.48,bodyY:.36,bodyH:.50,hoodLen:1.15,hoodH:.14,hoodY:.56,cabinLen:1.65,cabinH:.46,cabinY:.82,trunkLen:.85,wide:1.00,wing:false,aggr:false},
 wagon:   {w:1.92,len:4.85,wheelR:.37,wb:1.55,bodyY:.38,bodyH:.54,hoodLen:1.05,hoodH:.15,hoodY:.58,cabinLen:2.55,cabinH:.52,cabinY:.86,trunkLen:.35,wide:1.00,wing:false,aggr:false},
 roadster:{w:1.82,len:4.15,wheelR:.36,wb:1.42,bodyY:.32,bodyH:.44,hoodLen:1.25,hoodH:.12,hoodY:.50,cabinLen:1.00,cabinH:.28,cabinY:.66,trunkLen:.55,wide:1.00,wing:false,aggr:false,noRoof:true},
 super:   {w:2.00,len:4.48,wheelR:.40,wb:1.48,bodyY:.28,bodyH:.42,hoodLen:1.30,hoodH:.10,hoodY:.44,cabinLen:1.25,cabinH:.36,cabinY:.64,trunkLen:.75,wide:1.06,wing:true, aggr:true},
 hyper:   {w:2.06,len:4.62,wheelR:.42,wb:1.52,bodyY:.24,bodyH:.38,hoodLen:1.40,hoodH:.08,hoodY:.40,cabinLen:1.10,cabinH:.32,cabinY:.58,trunkLen:.85,wide:1.10,wing:true, aggr:true}
};

const MISSIONS=Array.from({length:100},(_,i)=>{
 const n=i+1, names=["بداية الطريق","توصيل سريع","وسط المدينة","المنعطفات","طريق الساحل","مطاردة الزمن","الطريق السريع","اختبار التماسك","سباق ليلي","التحدي النهائي"];
 return {n,title:`المهمة ${n} — ${names[i%names.length]}`,reward:1000+n*1250,dist:350+n*75,diff:Math.min(10,1+Math.floor(i/10))};
});

/* ============================= متغيرات عامة ============================= */
let scene,camera,renderer,composer,usePost=true,car,curDims=CLASS_DIMS.sport;
let clock=new THREE.Clock(),speed=0,steer=0,camMode=2,prevSpeed=0,velDir=new THREE.Vector3(0,0,-1);
let selected=0, mission=0, money=25000, keys={}, gear=1, rpm=900;
let customization={paint:CAR_DATA[0].color,rim:"#d4d4d8",power:1,grip:1,ride:0,upgrades:{spoiler:false,lights:false,body:false,exhaust:false}};
let wheelGroups=[], sunLight, poiList=[];
const $=id=>document.getElementById(id);
const clamp=THREE.MathUtils.clamp, lerp=THREE.MathUtils.lerp;

/* ============================= أدوات + نسيج إجرائي ============================= */
function mat(color,rough=.6,metal=.1,extra={}){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,...extra});}
function pmat(color,rough=.35,metal=.6){return new THREE.MeshPhysicalMaterial({color,roughness:rough,metalness:metal,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.2});}
function glassMat(){return new THREE.MeshPhysicalMaterial({color:0x0c1420,roughness:.05,metalness:.85,envMapIntensity:1.4});}
function emissiveMat(color,intensity=1.4){return new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.4});}

function noiseCanvas(size,base,variance,tint){
 const c=document.createElement("canvas");c.width=c.height=size;const ctx=c.getContext("2d");
 ctx.fillStyle=base;ctx.fillRect(0,0,size,size);
 for(let i=0;i<size*size*.06;i++){
  const x=Math.random()*size,y=Math.random()*size,r=Math.random()*1.6+.3;
  const v=Math.floor((Math.random()-.5)*variance);
  ctx.fillStyle=`rgba(${tint[0]+v},${tint[1]+v},${tint[2]+v},${.25+Math.random()*.3})`;
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
 }
 return c;
}
function asphaltTexture(){
 const c=noiseCanvas(256,"#171b20",26,[70,78,88]);
 ctx2(c);
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(30,30);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function ctx2(c){} // reserved
function groundTexture(){
 const c=noiseCanvas(256,"#232c33",20,[90,110,100]);
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(60,60);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function windowsTexture(){
 const size=256,c=document.createElement("canvas");c.width=c.height=size;const ctx=c.getContext("2d");
 ctx.fillStyle="#0c1420";ctx.fillRect(0,0,size,size);
 const cols=10,rows=16;
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const on=Math.random()<.42;
  ctx.fillStyle=on?(Math.random()<.5?"#ffe9a8":"#bfe4ff"):"#101825";
  ctx.fillRect(x*(size/cols)+2,y*(size/rows)+2,size/cols-4,size/rows-4);
 }
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;return tex;
}

function box(w,h,d,material,x=0,y=0,z=0,parent=scene){let g=material instanceof THREE.Material?material:mat(material);let m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),g);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
function cyl(r1,r2,h,material,x,y,z,rot=false,parent=scene){let g=material instanceof THREE.Material?material:mat(material,.5,.2);let m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,20),g);m.position.set(x,y,z);if(rot)m.rotation.z=Math.PI/2;m.castShadow=true;parent.add(m);return m;}

/* ============================= السماء المتدرجة ============================= */
function buildSky(){
 const skyGeo=new THREE.SphereGeometry(900,20,14);
 const skyMat=new THREE.ShaderMaterial({
  side:THREE.BackSide,
  uniforms:{top:{value:new THREE.Color(0x3f6fa8)},bottom:{value:new THREE.Color(0xd7e6ee)},offset:{value:20},exponent:{value:.7}},
  vertexShader:`varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`varying vec3 vPos;uniform vec3 top;uniform vec3 bottom;uniform float offset;uniform float exponent;
   void main(){float h=normalize(vPos+vec3(0.0,offset,0.0)).y;gl_FragColor=vec4(mix(bottom,top,max(pow(max(h,0.0),exponent),0.0)),1.0);}`
 });
 scene.add(new THREE.Mesh(skyGeo,skyMat));
}

/* ============================= المدينة ============================= */
function createCity(){
 scene.fog=new THREE.Fog(0xaec3d6,180,660);
 scene.add(new THREE.HemisphereLight(0xdfefff,0x1b2530,1.4));
 sunLight=new THREE.DirectionalLight(0xfff3df,3.1);
 sunLight.position.set(-140,190,110);sunLight.castShadow=true;
 sunLight.shadow.mapSize.set(2048,2048);
 sunLight.shadow.camera.left=-260;sunLight.shadow.camera.right=260;sunLight.shadow.camera.top=260;sunLight.shadow.camera.bottom=-260;
 sunLight.shadow.camera.far=700;sunLight.shadow.bias=-.0003;
 scene.add(sunLight);
 const fill=new THREE.DirectionalLight(0xaecdff,.5);fill.position.set(120,80,-140);scene.add(fill);

 const groundMat=mat(0x2a353e,1,0,{map:groundTexture()});
 box(1200,.3,1200,groundMat,0,-.2,0);

 const asphalt=asphaltTexture();
 const roadMat=mat(0x14181d,.95,0,{map:asphalt});
 const lineMat=emissiveMat(0xe6d78b,.5);
 for(let x=-500;x<=500;x+=40){box(14,.12,1000,roadMat,x,0,-20);box(.1,.13,1000,lineMat,x,0.08,-20)}
 for(let z=-500;z<=500;z+=40){box(1000,.12,14,roadMat,0,0,z);box(1000,.13,.1,lineMat,0,0.08,z)}

 const winTex=windowsTexture();
 for(let x=-460;x<=460;x+=40) for(let z=-460;z<=460;z+=40){
  if(Math.abs(x)<80||Math.abs(z)<80||Math.random()<.22) continue;
  let h=8+Math.random()*70,w=18+Math.random()*17,d=18+Math.random()*17;
  const facadeMat=mat(new THREE.Color().setHSL(.58,.14,.17+Math.random()*.1),.85,.05);
  box(w,h,d,facadeMat,x,h/2,z);
  const winMat=mat(0xffffff,.4,.1,{map:winTex,emissiveMap:winTex,emissive:0xffffff,emissiveIntensity:.35});
  winMat.map.repeat.set(1,Math.max(1,h/8));
  box(w*.92,h*.92,.1,winMat,x,h/2,z-d/2-.06);
 }
 // معلم وسط المدينة: منصّة أساس + تحميل نموذج مدينة حقيقي فوقها
 box(CITY_MODEL.targetSize+20,.6,CITY_MODEL.targetSize+20,0x2c343c,CITY_MODEL.x,0.1,CITY_MODEL.z);
 loadCityModel();
 // طريق السرعة
 box(28,.25,700,roadMat,220,.15,0);for(let z=-330;z<330;z+=24) box(1,.3,10,emissiveMat(0xffffff,.6),220,.32,z);
 // مرآب / معرض / منطقة سباق
 box(70,.5,50,0x162032,-150,.3,120);box(70,.5,50,0x162032,120,.3,170);box(90,.5,50,0x1a1420,-280,.3,-230);
 for(let i=0;i<20;i++){let z=-200+i*20;box(1,.3,10,emissiveMat(0xfbbf24,1),-280,.5,z)}
 poiList=[{name:"ورشة التعديل",x:-150,z:120,r:60},{name:"معرض السيارات",x:120,z:170,r:60},{name:"منطقة السباق",x:-280,z:-230,r:70},{name:"طريق السرعة",x:220,z:0,r:360},{name:"وسط المدينة",x:0,z:-150,r:90}];
 // أشجار
 const leafMat=mat(0x275c3a,1,0);const trunkMat=mat(0x5b4632,1,0);
 for(let i=0;i<100;i++){let x=(Math.random()-.5)*950,z=(Math.random()-.5)*950;if(Math.abs(x)<110&&Math.abs(z)<110)continue;
  cyl(1.2,1.2,5,trunkMat,x,2.5,z);
  let t=new THREE.Mesh(new THREE.SphereGeometry(4+Math.random()*3,10,8),leafMat);t.position.set(x,7,z);t.castShadow=true;scene.add(t);
 }
 // أعمدة إضاءة على الطرق الرئيسية
 for(let z=-460;z<=460;z+=80){ if(Math.abs(z)<90) continue; addStreetLamp(9,0,z); addStreetLamp(-9,0,z);}
}
function addStreetLamp(x,y,z){
 cyl(.09,.09,5,mat(0x1c232b,.6,.4),x,2.5,z);
 const head=box(.3,.25,.3,emissiveMat(0xfff2c8,1.6),x,5.05,z);
 const lamp=new THREE.PointLight(0xffe9b0,1.1,14,2);lamp.position.set(x,5,z);scene.add(lamp);
}

/* ============================= بناء السيارة ============================= */
function paintMaterial(){return pmat(new THREE.Color(customization.paint),.32,.55);}
function darkAccent(){return mat(0x14171c,.55,.25);}

function buildWheel(x,z,dims,parent){
 const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
 const tire=new THREE.Mesh(new THREE.CylinderGeometry(dims.wheelR,dims.wheelR,.27,22),mat(0x0c0d10,.9,0));tire.rotation.z=Math.PI/2;tire.castShadow=true;g.add(tire);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(dims.wheelR*.56,dims.wheelR*.56,.29,20),mat(customization.rim,.28,.85));rim.rotation.z=Math.PI/2;g.add(rim);
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(dims.wheelR*.13,dims.wheelR*.13,.31,14),mat(0x1b1e22,.4,.5));hub.rotation.z=Math.PI/2;g.add(hub);
 for(let i=0;i<5;i++){
  const spoke=new THREE.Mesh(new THREE.BoxGeometry(.05,dims.wheelR*.9,.05),mat(customization.rim,.3,.8));
  spoke.rotation.x=i*(Math.PI*2/5);spoke.position.set(x>0?.145:-.145,0,0);
  g.add(spoke);
 }
 wheelGroups.push(g);
 return g;
}

function createCar(data){
 const dims=CLASS_DIMS[data.cls]||CLASS_DIMS.sport;curDims=dims;
 const wide=dims.wide,w=dims.w*wide,len=dims.len,mid=Math.max(.3,len-dims.hoodLen-dims.trunkLen);
 const g=new THREE.Group();g.position.set(0,dims.wheelR+customization.ride*.15,0);scene.add(g);
 const paint=paintMaterial(),dark=darkAccent(),glass=glassMat();

 const midZ=(dims.hoodLen-dims.trunkLen)/2;
 box(w,dims.bodyH,mid,paint,0,dims.bodyY,midZ,g);
 const hood=box(w*.94,dims.hoodH,dims.hoodLen,paint,0,dims.hoodY,-len/2+dims.hoodLen/2,g);hood.rotation.x=-.16;
 const trunk=box(w*.94,dims.hoodH*1.25,dims.trunkLen,paint,0,dims.hoodY,len/2-dims.trunkLen/2,g);trunk.rotation.x=.12;
 box(w*1.02,dims.bodyH*.5,.3,dark,0,dims.bodyY-dims.bodyH*.16,-len/2-.04,g);
 box(w*1.02,dims.bodyH*.5,.32,dark,0,dims.bodyY-dims.bodyH*.16,len/2+.06,g);

 // مقصورة القيادة
 if(!dims.noRoof){
  box(w*.86,dims.cabinH,dims.cabinLen,dark,0,dims.cabinY,midZ*.4,g);
  const wshield=box(w*.78,dims.cabinH*.9,.06,glass,0,dims.cabinY-dims.cabinH*.05,midZ*.4-dims.cabinLen/2-.02,g);wshield.rotation.x=-.5;
  const rwin=box(w*.78,dims.cabinH*.8,.06,glass,0,dims.cabinY-dims.cabinH*.02,midZ*.4+dims.cabinLen/2+.02,g);rwin.rotation.x=.46;
 } else {
  const wshield=box(w*.72,dims.cabinH*1.6,.06,glass,0,dims.cabinY+.12,-len/2+dims.hoodLen+.05,g);wshield.rotation.x=-.55;
  box(.22,.22,.22,dark,-w*.18,dims.cabinY+.05,midZ*.4+.35,g);box(.22,.22,.22,dark,w*.18,dims.cabinY+.05,midZ*.4+.35,g);
 }

 // مرايا
 box(.05,.12,.22,dark,-w/2-.05,dims.cabinY+.02,-len/2+dims.hoodLen+.1,g);
 box(.05,.12,.22,dark,w/2+.05,dims.cabinY+.02,-len/2+dims.hoodLen+.1,g);

 // أضواء
 const lightBoost=customization.upgrades.lights?2.6:1.4;
 box(.28,.12,.06,emissiveMat(0xfff8e2,lightBoost),-w*.32,dims.hoodY-.02,-len/2-.02,g);
 box(.28,.12,.06,emissiveMat(0xfff8e2,lightBoost),w*.32,dims.hoodY-.02,-len/2-.02,g);
 box(.3,.1,.06,emissiveMat(0xff2b3d,lightBoost*.8),-w*.34,dims.hoodY,len/2+.02,g);
 box(.3,.1,.06,emissiveMat(0xff2b3d,lightBoost*.8),w*.34,dims.hoodY,len/2+.02,g);

 // إضافات احترافية
 if(dims.wing||customization.upgrades.spoiler){
  const wingMat=customization.upgrades.body?mat(0x0c0d10,.4,.2):dark;
  box(.06,.24,.06,wingMat,-w*.32,dims.bodyY+dims.bodyH*.5+.14,len/2-.18,g);
  box(.06,.24,.06,wingMat,w*.32,dims.bodyY+dims.bodyH*.5+.14,len/2-.18,g);
  box(w*.8,.05,.32,wingMat,0,dims.bodyY+dims.bodyH*.5+.32,len/2-.2,g);
 }
 if(dims.aggr||customization.upgrades.body){
  box(w*1.05,.045,.2,dark,0,dims.bodyY-dims.bodyH*.48,-len/2-.16,g); // splitter
  box(w*.92,.045,.24,dark,0,dims.bodyY-dims.bodyH*.46,len/2+.14,g); // diffuser
  for(let i=-1;i<=1;i++) box(.05,.1,.24,dark,i*w*.24,dims.bodyY-dims.bodyH*.42,len/2+.16,g);
  box(.06,.1,mid*.85,dark,-w/2-.02,dims.bodyY-dims.bodyH*.42,midZ,g);
  box(.06,.1,mid*.85,dark,w/2+.02,dims.bodyY-dims.bodyH*.42,midZ,g);
 }

 // عوادم
 const chrome=mat(0xd8dee6,.25,.9);
 const tips=customization.upgrades.exhaust?[-.26,-.13,.13,.26]:[-.16,.16];
 tips.forEach(off=>{const e=cyl(.05,.06,.14,chrome,off*w,dims.bodyY-dims.bodyH*.35,len/2+.16,false,g);e.rotation.x=Math.PI/2;});

 // إضاءة سفلية (Underglow) عند تفعيل ترقية الأضواء
 if(customization.upgrades.lights){
  box(w*.85,.03,len*.8,emissiveMat(0x00e5ff,2.2),0,dims.bodyY-dims.bodyH*.55,midZ*.3,g);
  const glow=new THREE.PointLight(0x00e5ff,.8,4,2);glow.position.set(0,dims.wheelR*.3,0);g.add(glow);
 }

 // عجلات
 wheelGroups=[];
 for(const xz of [[-w/2*.92,-dims.wb],[w/2*.92,-dims.wb],[-w/2*.92,dims.wb],[w/2*.92,dims.wb]]) buildWheel(xz[0],xz[1],dims,g);

 car=g;attachGlb(g,data);return g;
}
function modelKey(d){return `${d.brand} ${d.model}`;}
function recolorGlb(root){
 const cfg=MODEL_MAP[modelKey(CAR_DATA[selected])];if(!cfg||!root)return;
 root.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m&&cfg.paint.test(m.name||"")&&m.color)m.color.set(customization.paint);});});
}
function robustBox(root){
 const boxes=[],sizes=[];
 root.traverse(o=>{if(o.isMesh&&o.geometry){o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone();
  if(!isFinite(b.min.x)||!isFinite(b.max.x))return;
  b.applyMatrix4(o.matrixWorld);boxes.push(b);
  const s=b.getSize(new THREE.Vector3());sizes.push(Math.max(s.x,s.y,s.z)||0.001);}});
 if(!sizes.length)return new THREE.Box3().setFromObject(root);
 const sorted=[...sizes].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)]||1;
 const out=new THREE.Box3();
 boxes.forEach((b,i)=>{if(sizes[i]<=median*15&&sizes[i]>=median/60)out.union(b);});
 if(out.isEmpty())boxes.forEach(b=>out.union(b));
 return out;
}
function findWheels(holder){
 const list=[];
 holder.traverse(o=>{if(o.isMesh&&/wheel|tire|tyre|rim|jante|roue/i.test(o.name||"")){
  o.geometry.computeBoundingBox();const s=o.geometry.boundingBox.getSize(new THREE.Vector3());
  const axis=(s.x<=s.y&&s.x<=s.z)?"x":(s.y<=s.z?"y":"z");
  list.push({obj:o,axis});
 }});
 return list;
}
function attachGlb(g,data){
 const cfg=MODEL_MAP[modelKey(data)];if(!cfg)return;
 toast("⏳ جاري تحميل نموذج السيارة الحقيقي...");
 const place=gltf=>{
  if(!g.parent)return; // تم تبديل السيارة أثناء التحميل
  const m=gltf.scene.clone(true);
  m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;
   o.material=Array.isArray(o.material)?o.material.map(x=>x.clone()):o.material.clone();
   (Array.isArray(o.material)?o.material:[o.material]).forEach(x=>{if(x.transmission>0){x.transmission=0;x.transparent=true;x.opacity=Math.min(x.opacity,.4);}});}});
  const holder=new THREE.Group();holder.add(m);
  holder.updateMatrixWorld(true);
  let b=robustBox(holder),sz=b.getSize(new THREE.Vector3());
  if(sz.x>sz.z)holder.rotation.y=Math.PI/2; // اجعل الطول على محور Z
  if(cfg.flip)holder.rotation.y+=Math.PI;
  holder.updateMatrixWorld(true);b=robustBox(holder);sz=b.getSize(new THREE.Vector3());
  const k=cfg.len/Math.max(sz.z,.01);holder.scale.setScalar(k);holder.updateMatrixWorld(true);
  b=robustBox(holder);const c=b.getCenter(new THREE.Vector3());
  holder.position.set(-c.x,-curDims.wheelR-b.min.y,-c.z);
  g.children.forEach(ch=>ch.visible=false);wheelGroups=[];
  g.add(holder);g.userData.glb=holder;g.userData.glbInner=m;
  g.userData.glbWheels=findWheels(holder);
  recolorGlb(m);toast("✅ تم تحميل النموذج");
 };
 if(glbCache[cfg.file])place(glbCache[cfg.file]);
 else gltfLoader.load("models/"+cfg.file,gl=>{glbCache[cfg.file]=gl;place(gl);},undefined,()=>toast("⚠️ ملف models/"+cfg.file+" غير موجود — تُستخدم النسخة البرمجية"));
}
function rebuildCar(){if(car)scene.remove(car);car=createCar(CAR_DATA[selected]);}

function loadCityModel(){
 toast("⏳ جاري تحميل حي المدينة التفصيلي...");
 gltfLoader.load("models/"+CITY_MODEL.file,gltf=>{
  const m=gltf.scene;
  m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const wrap=new THREE.Group();wrap.add(m);wrap.updateMatrixWorld(true);
  let b=new THREE.Box3().setFromObject(wrap),sz=b.getSize(new THREE.Vector3());
  const k=CITY_MODEL.targetSize/Math.max(sz.x,sz.z,.01);
  wrap.scale.setScalar(k);wrap.updateMatrixWorld(true);
  b=new THREE.Box3().setFromObject(wrap);const c=b.getCenter(new THREE.Vector3());
  wrap.position.set(CITY_MODEL.x-c.x,-b.min.y,CITY_MODEL.z-c.z);
  scene.add(wrap);toast("✅ تم تحميل حي المدينة");
 },undefined,()=>toast("⚠️ ملف models/"+CITY_MODEL.file+" غير موجود — سيبقى وسط المدينة بالنسخة البرمجية"));
}

/* ============================= الصوت (محرك مُصنّع) ============================= */
let audioCtx,oscA,oscB,filterNode,gainNode,soundOn=true,audioReady=false;
function initAudio(){
 if(audioReady)return;audioReady=true;
 try{
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  oscA=audioCtx.createOscillator();oscA.type="sawtooth";
  oscB=audioCtx.createOscillator();oscB.type="square";oscB.detune.value=-1200;
  filterNode=audioCtx.createBiquadFilter();filterNode.type="lowpass";filterNode.frequency.value=700;
  gainNode=audioCtx.createGain();gainNode.gain.value=0;
  oscA.connect(filterNode);oscB.connect(filterNode);filterNode.connect(gainNode);gainNode.connect(audioCtx.destination);
  oscA.start();oscB.start();
 }catch(e){soundOn=false;}
}
function updateEngineSound(dt,throttle){
 if(!soundOn||!audioReady||!audioCtx)return;
 const freq=55+(rpm/7500)*260;
 oscA.frequency.setTargetAtTime(freq,audioCtx.currentTime,.05);
 oscB.frequency.setTargetAtTime(freq*.5,audioCtx.currentTime,.05);
 filterNode.frequency.setTargetAtTime(400+(rpm/7500)*2600,audioCtx.currentTime,.08);
 const target=.028+Math.min(1,Math.abs(throttle))*.055+Math.min(1,Math.abs(speed)/40)*.02;
 gainNode.gain.setTargetAtTime(target,audioCtx.currentTime,.08);
}
function toggleSound(){
 soundOn=!soundOn;
 $("soundBtn").textContent=soundOn?"🔊":"🔇";
 if(soundOn&&audioCtx&&audioCtx.state==="suspended")audioCtx.resume();
 if(!soundOn&&gainNode)gainNode.gain.setTargetAtTime(0,audioCtx.currentTime,.05);
}

/* ============================= واجهة المستخدم ============================= */
function setupUI(){
 $("hud").classList.remove("hidden");$("mobileControls").classList.remove("hidden");
 $("carSelect").innerHTML=CAR_DATA.map((c,i)=>`<option value="${i}">${c.brand} — ${c.model}</option>`).join("");
 renderCards();renderMissions();updateMission();
 $("carSelect").value=selected;
 $("carSelect").onchange=e=>{selected=+e.target.value;loadCustomization();rebuildCar();};
 $("paint").oninput=e=>{customization.paint=e.target.value;if(car&&car.userData.glbInner)recolorGlb(car.userData.glbInner);else rebuildCar();};
 $("rim").oninput=e=>{customization.rim=e.target.value;rebuildCar();};
 $("power").oninput=e=>customization.power=+e.target.value;
 $("grip").oninput=e=>customization.grip=+e.target.value;
 $("ride").oninput=e=>{customization.ride=+e.target.value;rebuildCar();};
 $("applyCustom").onclick=()=>{rebuildCar();toast("تم حفظ التعديلات وتجهيز السيارة");};
 document.querySelectorAll(".chips button[data-up]").forEach(b=>{
  b.onclick=()=>{const k=b.dataset.up;customization.upgrades[k]=!customization.upgrades[k];b.classList.toggle("active",customization.upgrades[k]);rebuildCar();};
 });
 document.querySelectorAll(".close").forEach(b=>b.onclick=()=>b.closest(".panel").classList.add("hidden"));
 $("menuBtn").onclick=()=>$("mainMenu").classList.remove("hidden");
 $("garageOpen").onclick=()=>{openPanel("garage");syncChips();};
 $("dealerOpen").onclick=()=>openPanel("dealer");
 $("missionsOpen").onclick=()=>openPanel("missions");
 $("cityInfoOpen").onclick=()=>openPanel("cityInfo");
 if($("soundBtn"))$("soundBtn").onclick=toggleSound;
 document.addEventListener("keydown",e=>{
  initAudio();if(audioCtx&&audioCtx.state==="suspended")audioCtx.resume();
  keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==="c")camMode=camMode%3+1;if(e.key.toLowerCase()==="r")resetCar();
  if(e.key.toLowerCase()==="o"&&car&&car.userData.glb){car.userData.glb.rotation.y+=Math.PI;car.userData.glb.position.x*=-1;car.userData.glb.position.z*=-1;const k=modelKey(CAR_DATA[selected]);MODEL_MAP[k].flip=!MODEL_MAP[k].flip;toast("تم قلب اتجاه السيارة (flip="+MODEL_MAP[k].flip+")");}
 });
 document.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
 document.querySelectorAll("#mobileControls button[data-key]").forEach(b=>{let k=b.dataset.key;b.addEventListener("pointerdown",()=>{initAudio();keys[k]=true;});b.addEventListener("pointerup",()=>keys[k]=false);b.addEventListener("pointercancel",()=>keys[k]=false);});
 $("mobileCam").onclick=()=>camMode=camMode%3+1;$("mobileBrake").onpointerdown=()=>keys[" "]=true;$("mobileBrake").onpointerup=()=>keys[" "]=false;
}
function syncChips(){document.querySelectorAll(".chips button[data-up]").forEach(b=>b.classList.toggle("active",!!customization.upgrades[b.dataset.up]));}
function openPanel(id){document.querySelectorAll(".panel").forEach(p=>p.classList.add("hidden"));$(id).classList.remove("hidden");}
function renderCards(){$("carCards").innerHTML=CAR_DATA.map((c,i)=>`<div class="carCard ${(i>mission&&!MODEL_MAP[c.brand+" "+c.model])?"lock":""}" data-i="${i}"><b>${c.brand} ${c.model}</b><span>${c.hp} HP • ${c.max} km/h</span><div class="spec"><span>0-100: ${((100/c.acc)+1).toFixed(1)}s</span><span>${(i<=mission||MODEL_MAP[c.brand+" "+c.model])?(MODEL_MAP[c.brand+" "+c.model]?"✦ نموذج حقيقي":"متاح"):"🔒 مقفلة"}</span></div></div>`).join("");
 document.querySelectorAll(".carCard").forEach(x=>x.onclick=()=>{
  const i=+x.dataset.i;
  if(i>mission&&!MODEL_MAP[CAR_DATA[i].brand+" "+CAR_DATA[i].model]){toast("🔒 هذه السيارة مقفلة — أكمل مزيدًا من المهام لفتحها");return;}
  selected=i;loadCustomization();rebuildCar();toast(`${CAR_DATA[selected].brand} ${CAR_DATA[selected].model} جاهزة`);
 });
}
function renderMissions(){$("missionList").innerHTML=MISSIONS.map(m=>`<div class="missionItem ${m.n>mission+1?"lock":""}"><b>#${m.n}</b><br>${m.title.replace(`المهمة ${m.n} — `,"")}<br><small>${m.reward.toLocaleString()}$ • ${m.diff}/10</small></div>`).join("");}
function loadCustomization(){let c=CAR_DATA[selected];customization.paint=c.color;$("paint").value=c.color;$("rim").value=customization.rim;$("power").value=customization.power;$("grip").value=customization.grip;$("ride").value=customization.ride;}
function updateMission(){let m=MISSIONS[mission];$("missionNo").textContent=m.n;$("reward").textContent=m.reward.toLocaleString();$("missionTitle").textContent=m.title;$("missionText").textContent=`قد مسافة ${m.dist} متر ثم عد إلى نقطة الهدف.`;$("missionProgress").style.width="0%";}
function toast(t){$("toast").textContent=t;$("toast").classList.add("toastShow");setTimeout(()=>$("toast").classList.remove("toastShow"),1800);}
function resetCar(){car.position.set(0,curDims.wheelR+customization.ride*.15,0);car.rotation.set(0,0,0);speed=0;velDir.set(0,0,-1);toast("تمت إعادة السيارة إلى الطريق");}

/* ============================= الفيزياء ============================= */
function drive(dt){
 if(!car)return;
 const forward=keys.w||keys.arrowup, back=keys.s||keys.arrowdown,left=keys.a||keys.arrowleft,right=keys.d||keys.arrowright,brakeKey=!!keys[" "];
 const data=CAR_DATA[selected],max=data.max/3.6*customization.power;
 const accelRate=(9+ (data.hp/1000)*17)*customization.power;
 let throttle=0;
 if(forward){speed+=accelRate*dt;throttle=1;}
 else if(back){ if(speed>0.4){speed-=accelRate*1.6*dt;throttle=-1;} else {speed-=accelRate*.5*dt;throttle=-.6;} }
 else speed*=Math.pow(.985,dt*60);
 if(brakeKey){speed*=Math.pow(.86,dt*60);throttle=-1;}
 speed=clamp(speed,-max*.32,max);

 const steerTarget=(left?-1:0)+(right?1:0);
 steer=lerp(steer,steerTarget,dt*8);
 const speedFrac=Math.min(Math.abs(speed)/max,1);
 const maxAngle=THREE.MathUtils.degToRad(36)/(1+speedFrac*1.7);
 const steerAngle=steer*maxAngle;
 const dirSign=speed<0?-1:1;
 const wheelbase=curDims.wb*2;
 const turnR=Math.abs(steerAngle)>0.002?wheelbase/Math.tan(Math.abs(steerAngle)):99999;
 const yawRate=(speed/turnR)*Math.sign(steerAngle)*dirSign*customization.grip;
 car.rotation.y-=yawRate*dt*1.55;

 const carForward=new THREE.Vector3(0,0,-1).applyQuaternion(car.quaternion);
 const slip=clamp(Math.abs(steer)*speedFrac*(1.35-customization.grip)*(brakeKey?1.6:1),0,.92);
 velDir.lerp(carForward,dt*(11*(1-slip)+1)).normalize();
 car.position.addScaledVector(velDir,speed*dt);

 // انتقال الوزن: ميلان أمامي/خلفي وجانبي واقعي
 const accelNow=(speed-prevSpeed)/Math.max(dt,.0001);prevSpeed=speed;
 const targetPitch=clamp(accelNow*.0016,-.05,.05);
 const targetRoll=clamp(-steer*speedFrac*.14,-.09,.09);
 car.rotation.x=lerp(car.rotation.x,targetPitch,dt*6);
 car.rotation.z=lerp(car.rotation.z,targetRoll,dt*6);
 const bounce=Math.sin(performance.now()*.012)*Math.min(.012,Math.abs(speed)*.00008);
 car.position.y=curDims.wheelR+customization.ride*.15+bounce;

 wheelGroups.forEach(w=>w.rotation.x-=speed*dt*(1/Math.max(curDims.wheelR,.2)));
 if(car.userData.glbWheels)car.userData.glbWheels.forEach(w=>w.obj.rotation[w.axis]-=speed*dt*3.1);

 // نظام التروس ودورة المحرك
 const gearCount=6,frac=speedFrac;
 gear=Math.min(gearCount,1+Math.floor(frac*gearCount*.999));
 const within=(frac-(gear-1)/gearCount)*gearCount;
 let targetRpm=lerp(1000,7300,clamp(within,0,1));
 if(Math.abs(speed)<.4&&forward)targetRpm=lerp(1000,3400,Math.min(1,performance.now()%600/600));
 rpm=lerp(rpm,targetRpm,dt*6);
 updateEngineSound(dt,throttle);

 $("speed").textContent=Math.round(Math.abs(speed)*3.6);
 if($("gear"))$("gear").textContent=Math.abs(speed)<.3?"N":gear;
 if($("tachNeedle"))$("tachNeedle").style.transform=`rotate(${-130+clamp(rpm/7500,0,1)*260}deg)`;
 if($("rpmVal"))$("rpmVal").textContent=Math.round(rpm);

 const d=Math.min(1,car.position.length()/MISSIONS[mission].dist);
 $("missionProgress").style.width=(d*100)+"%";
 if(d>=1){
  money+=MISSIONS[mission].reward;
  if(mission<99){mission++;selected=Math.max(selected,Math.min(CAR_DATA.length-1,Math.floor(mission/3)));toast(`أحسنت! فتحت تقدمًا جديدًا +${MISSIONS[mission-1].reward.toLocaleString()}$`);updateMission();renderMissions();renderCards();}
  else toast("🏆 أنهيت المهمة 100 — نهاية السلسلة الحالية!");
 }
 if(Math.abs(car.position.x)>560||Math.abs(car.position.z)>560)resetCar();

 updateLocationLabel();
}
let locTimer=0;
function updateLocationLabel(){
 locTimer-=1;if(locTimer>0)return;locTimer=15;
 let found="طريق مفتوح";
 for(const p of poiList){const dx=car.position.x-p.x,dz=car.position.z-p.z;if(Math.sqrt(dx*dx+dz*dz)<p.r){found=p.name;break;}}
 if($("location"))$("location").textContent=found.toUpperCase();
}

function cameraFollow(dt){
 if(!car)return;
 let desired=new THREE.Vector3();
 if(camMode===1){
  desired.copy(car.position).add(new THREE.Vector3(0,curDims.cabinY+.15,-curDims.cabinLen*.15).applyQuaternion(car.quaternion));
  camera.position.lerp(desired,1-Math.pow(.001,dt));
  let look=car.position.clone().add(new THREE.Vector3(0,curDims.cabinY,-30).applyQuaternion(car.quaternion));
  camera.lookAt(look);
 } else if(camMode===2){
  desired.copy(car.position).add(new THREE.Vector3(0,4.2,9).applyQuaternion(car.quaternion));
  camera.position.lerp(desired,1-Math.pow(.001,dt));
  camera.lookAt(car.position.clone().add(new THREE.Vector3(0,1,0)));
 } else {
  desired.copy(car.position).add(new THREE.Vector3(7,6,9));
  camera.position.lerp(desired,1-Math.pow(.001,dt));
  camera.lookAt(car.position);
 }
}

/* ============================= الحلقة الرئيسية ============================= */
function animate(){
 requestAnimationFrame(animate);
 let dt=Math.min(.04,clock.getDelta());
 drive(dt);cameraFollow(dt);
 if(usePost&&composer)composer.render(); else renderer.render(scene,camera);
}

function initEnvironment(){
 try{
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.045).texture;
 }catch(e){/* بيئة انعكاس اختيارية */}
}
function initPost(){
 try{
  composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.42,.5,.86);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  usePost=true;
 }catch(e){usePost=false;}
}

function init(){
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.05,1200);
 camera.position.set(0,5,10);
 renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 renderer.setSize(innerWidth,innerHeight);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 document.body.appendChild(renderer.domElement);

 buildSky();
 initEnvironment();
 createCity();
 rebuildCar();
 initPost();
 setupUI();

 window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  if(composer)composer.setSize(innerWidth,innerHeight);
 });
 setTimeout(()=>{$("loading").style.display="none"},900);
 animate();
}
init();
