const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("img").forEach(i=>{const bad=()=>i.classList.add("x");i.addEventListener("error",bad);if(i.complete&&!i.naturalWidth)bad()});

/* Drifting photo strips: slide by themselves, grab and fling with a finger or mouse */
document.querySelectorAll(".strip").forEach(s=>{const tr=s.firstElementChild;
 [...tr.children].forEach(n=>{const c=n.cloneNode(true);c.setAttribute("aria-hidden","true");tr.appendChild(c)});
 let x=0,v=0,drag=false,lx=0,last=performance.now();const dir=s.dataset.dir==="r"?1:-1,sp=reduce?8:70;
 s.addEventListener("pointerdown",e=>{drag=true;lx=e.clientX;s.setPointerCapture(e.pointerId)});
 s.addEventListener("pointermove",e=>{if(drag){const d=e.clientX-lx;lx=e.clientX;x+=d;v=d*60}});
 ["pointerup","pointercancel"].forEach(n=>s.addEventListener(n,()=>drag=false));
 (function f(now){requestAnimationFrame(f);const dt=Math.min((now-last)/1000,.05);last=now;const h=tr.scrollWidth/2;
  if(!drag){v+=(dir*sp-v)*Math.min(1,dt*2);x+=v*dt}
  x=((x%h)+h)%h-h;tr.style.transform=`translate3d(${x}px,0,0)`})(last)});

/* Service panels: open one by hover/tap, or they cycle on their own */
(function(){const ac=document.querySelector(".acc");if(!ac)return;const ps=[...ac.children];let cur=0,hold=0;
 const set=i=>{cur=i;ps.forEach((p,j)=>p.classList.toggle("on",j===i))};set(0);
 ps.forEach((p,i)=>{p.tabIndex=0;["pointerenter","pointerdown","focus"].forEach(ev=>p.addEventListener(ev,()=>{set(i);hold=Date.now()+5000}))});
 setInterval(()=>{if(Date.now()>hold)set((cur+1)%ps.length)},reduce?6000:3200)})();

/* WebGL world: a dotted world-map globe with flight routes out of Uganda */
(function(){const cv=document.getElementById("stage"),T=window.THREE;if(!T||!cv)return;try{go()}catch(e){console.warn("3D off",e)}
function go(){
const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setClearColor(0,0);
const S=new T.Scene(),C=new T.PerspectiveCamera(35,1,.1,50);C.position.z=7;
S.add(new T.HemisphereLight(0xffffff,0xd8c7a6,.95));const dl=new T.DirectionalLight(0xffffff,.8);dl.position.set(-3,4,5);S.add(dl);
const G=new T.Group();S.add(G);
const ll=(la,lo,r)=>{const a=la*Math.PI/180,o=lo*Math.PI/180;return new T.Vector3(r*Math.cos(a)*Math.sin(o),r*Math.sin(a),r*Math.cos(a)*Math.cos(o))};
G.add(new T.Mesh(new T.SphereGeometry(1,64,48),new T.MeshStandardMaterial({color:0xeaf2ee,roughness:.5})));
G.add(new T.Mesh(new T.SphereGeometry(1.07,48,32),new T.MeshBasicMaterial({color:0xf4b36a,transparent:true,opacity:.3,side:T.BackSide})));
const gp=[];for(let la=-60;la<=60;la+=30)for(let lo=0;lo<360;lo+=6)gp.push(ll(la,lo,1.002),ll(la,lo+6,1.002));
for(let lo=0;lo<360;lo+=30)for(let la=-90;la<90;la+=6)gp.push(ll(la,lo,1.002),ll(la+6,lo,1.002));
G.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(gp),new T.LineBasicMaterial({color:0x1f5d4a,transparent:true,opacity:.14})));

/* coarse continent outlines [lon,lat] -> painted to a hidden canvas -> sampled into dots */
const MAP=[
[[-168,66],[-156,71],[-125,70],[-95,72],[-80,68],[-62,60],[-55,50],[-67,44],[-76,35],[-81,25],[-90,29],[-97,26],[-97,20],[-87,21],[-88,16],[-83,10],[-79,8],[-86,12],[-92,15],[-105,20],[-110,24],[-117,32],[-124,40],[-125,49],[-135,58],[-150,60],[-160,58]],
[[-55,60],[-45,60],[-20,70],[-20,82],[-60,82],[-72,76]],
[[-80,8],[-72,12],[-62,10],[-50,0],[-35,-6],[-40,-22],[-48,-28],[-58,-38],[-65,-42],[-68,-52],[-72,-52],[-74,-40],[-71,-20],[-81,-5]],
[[-10,36],[-9,43],[-2,47],[-5,48],[3,51],[8,54],[10,57],[5,62],[15,69],[28,71],[45,68],[60,70],[80,73],[110,77],[140,72],[170,70],[180,66],[160,60],[155,50],[140,45],[135,35],[122,30],[120,22],[108,18],[106,10],[100,13],[100,2],[104,1],[98,8],[93,20],[88,22],[80,13],[77,8],[72,20],[67,25],[57,25],[59,22],[52,16],[43,12],[39,21],[35,29],[35,33],[30,36],[26,40],[22,37],[19,41],[13,45],[12,44],[8,44],[3,43],[-2,37]],
[[-17,21],[-10,30],[-6,36],[10,37],[11,33],[20,32],[32,31],[33,28],[38,20],[43,12],[51,12],[40,-3],[40,-15],[35,-25],[32,-29],[26,-34],[18,-34],[12,-18],[13,-5],[9,3],[-8,4],[-17,14]],
[[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[140,-38],[130,-32],[115,-34]],
[[44,-25],[50,-15],[49,-12],[44,-17]],[[-5,50],[1,52],[-3,58],[-6,56]],[[130,32],[140,36],[142,44],[136,36]],[[95,5],[104,-5],[106,-6],[98,2]],[[109,1],[118,7],[117,-3]]];
const mc=document.createElement("canvas");mc.width=720;mc.height=360;const x2=mc.getContext("2d");x2.fillStyle="#000";
MAP.forEach(p=>{x2.beginPath();p.forEach(([lo,la],i)=>{const X=(lo+180)/2,Y=(90-la)*2;i?x2.lineTo(X,Y):x2.moveTo(X,Y)});x2.closePath();x2.fill()});
const px=x2.getImageData(0,0,720,360).data,land=[],N=18000;
for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,q=Math.sqrt(1-y*y),h=i*2.399963,la=Math.asin(y)*180/Math.PI;let lo=Math.atan2(Math.cos(h)*q,Math.sin(h)*q)*180/Math.PI;lo=Math.atan2(Math.sin(h)*q,Math.cos(h)*q)*180/Math.PI;
 const X=Math.min(719,Math.floor((lo+180)/2)),Y=Math.min(359,Math.floor((90-la)*2));if(px[(Y*720+X)*4+3]>128){const v=ll(la,lo,1.004);land.push(v.x,v.y,v.z)}}
const dc=document.createElement("canvas");dc.width=dc.height=32;const d2=dc.getContext("2d");d2.fillStyle="#fff";d2.beginPath();d2.arc(16,16,15,0,7);d2.fill();
const pg=new T.BufferGeometry();pg.setAttribute("position",new T.Float32BufferAttribute(land,3));
G.add(new T.Points(pg,new T.PointsMaterial({color:0x1f5d4a,size:.022,map:new T.CanvasTexture(dc),alphaTest:.5})));

/* routes from Uganda */
const U=ll(1.3,32.6,1.005),routes=[];
[[51.5,-.1],[41,29],[25.2,55.3],[-26.2,28],[40.7,-74],[19,72.8],[30,31],[-33.9,151.2],[-23.5,-46.6],[35.7,139.7]].forEach(([la,lo])=>{
 const b=ll(la,lo,1.005),m=U.clone().add(b).normalize().multiplyScalar(1+U.distanceTo(b)*.38),cu=new T.QuadraticBezierCurve3(U,m,b);
 G.add(new T.Line(new T.BufferGeometry().setFromPoints(cu.getPoints(60)),new T.LineBasicMaterial({color:0xd2552b,transparent:true,opacity:.75})));
 const dot=new T.Mesh(new T.SphereGeometry(.018,12,10),new T.MeshBasicMaterial({color:0xd2552b}));dot.position.copy(b);G.add(dot);
 const tr=new T.Mesh(new T.SphereGeometry(.014,12,10),new T.MeshBasicMaterial({color:0xf2b84b}));G.add(tr);routes.push({cu,tr,o:Math.random(),s:.12+Math.random()*.12})});
const pin=new T.Mesh(new T.SphereGeometry(.032,20,16),new T.MeshBasicMaterial({color:0xd2552b}));pin.position.copy(U);G.add(pin);
const pr=new T.Mesh(new T.RingGeometry(.04,.05,48),new T.MeshBasicMaterial({color:0xd2552b,transparent:true,side:T.DoubleSide}));pr.position.copy(U);pr.lookAt(U.clone().multiplyScalar(2));G.add(pr);

const keys=[[32,5],[10,35],[80,25],[-70,10],[32,5]];let W=1,H=1,k=1;
function size(){W=cv.clientWidth||innerWidth;H=cv.clientHeight||innerHeight;R.setPixelRatio(Math.min(devicePixelRatio||1,W<700?1.6:2));R.setSize(W,H,false);C.aspect=W/H;C.updateProjectionMatrix();
 k=2*7*Math.tan(35*Math.PI/360)/H;const rad=Math.min(H*.44,W*.62);G.scale.setScalar(rad*k);G.position.set((W>H*1.1?W*.2:0)*k,(W>H*1.1?0:H*.1)*k,0)}
const tg={x:0,y:0},ptr={x:0,y:0};let t=0,kick=0,cur=0,curX=.1,last=performance.now(),on=false,pt=-9;const root=document.documentElement;
const setP=(x,y)=>{tg.x=x/innerWidth*2-1;tg.y=-(y/innerHeight*2-1);on=true;pt=t};
addEventListener("pointermove",e=>setP(e.clientX,e.clientY),{passive:true});addEventListener("touchmove",e=>{const q=e.touches[0];if(q)setP(q.clientX,q.clientY)},{passive:true});
addEventListener("pointerdown",e=>{setP(e.clientX,e.clientY);kick=3},{passive:true});addEventListener("resize",size);
function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const dt=Math.min((now-last)/1000,.05)*(reduce?.3:1);last=now;t+=dt;
 if(!on||t-pt>3){tg.x=Math.sin(t*.8)*.7;tg.y=Math.cos(t*.6)*.5}ptr.x+=(tg.x-ptr.x)*.1;ptr.y+=(tg.y-ptr.y)*.1;
 root.style.setProperty("--px",ptr.x.toFixed(3));root.style.setProperty("--py",ptr.y.toFixed(3));
 const sp=root.scrollHeight-innerHeight,p=Math.max(0,Math.min(1,sp>0?scrollY/sp:0))*(keys.length-1),i=Math.min(keys.length-2,Math.floor(p)),f=p-i,e=f*f*(3-2*f);
 const lon=keys[i][0]+(keys[i+1][0]-keys[i][0])*e,lat=keys[i][1]+(keys[i+1][1]-keys[i][1])*e;
 kick*=.95;const yaw=-lon*Math.PI/180+Math.sin(t*.55)*.5+ptr.x*.6+kick*Math.sin(t*6)*.15+t*.0;
 cur+=(yaw-cur)*.07;curX+=(lat*Math.PI/180*.8+.12+ptr.y*.25-curX)*.07;G.rotation.set(curX,cur,0);
 routes.forEach(r=>{r.o=(r.o+dt*r.s*(1+kick))%1;r.tr.position.copy(r.cu.getPoint(r.o))});
 const q=(t*.8)%1;pr.scale.setScalar(1+q*3);pr.material.opacity=.8*(1-q);R.render(S,C)}
size();requestAnimationFrame(frame)}})();
