// HANS CREATIVE office scene + Reels timeline (1080x1920). Requires engine.js.
(function(){
const C={blue:0x005CFC,ink:0x0C111F,white:0xFFFFFF,cloud:0xF5F7FC,ice:0xE6EEFF,slate:0x58647A,plant:0x2E8B57,skin:0xE8C4A0};
const OUT_W=1080,OUT_H=1920,GL_W=720,GL_H=1280;
const FONT='"Inter Display","Inter",sans-serif',FONT_T='"Inter",sans-serif';
let E,M4,glc,out,ctx,SPEC,people=[],leds=[],orb=null;

function grp(x,z,ry){return M4.mul(M4.tr(x,0,z),M4.ry(ry||0));}
function at(P,x,y,z,ry){let m=M4.mul(P,M4.tr(x,y,z));if(ry)m=M4.mul(m,M4.ry(ry));return m;}
function box(P,w,h,d,c,x,y,z,opt){const m=at(P,x,y+h/2,z);const g=E.geo.box(w,h,d);if(opt)return E.add(g,m,c,opt);E.addStatic(g,m,c);}
function cyl(P,rt,rb,h,c,x,y,z,seg){E.addStatic(E.geo.cyl(rt,rb,h,seg||18),at(P,x,y+h/2,z),c);}
function tex(w,h,draw){const cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);return E.texture(cv);}
function screen(P,w,h,x,y,z,ry,draw){const S=at(P,x,y,z,ry);box(S,w+.12,h+.12,.08,C.ink,0,-h/2-.06,0);
  E.add(E.geo.plane(w,h),M4.mul(S,M4.tr(0,0,.05)),0xffffff,{tex:tex(512,Math.round(512*h/w),draw),unlit:true,shadow:false});}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function desk(P,x,z,ry){const D=grp(0,0,0);const G=M4.mul(P,M4.mul(M4.tr(x,0,z),M4.ry(ry||0)));
  box(G,2.2,.08,1.1,C.white,0,.82,0);box(G,.08,.82,1,C.slate,-1,0,0);box(G,.08,.82,1,C.slate,1,0,0);}
function chair(P,x,z,ry,col){const G=M4.mul(P,M4.mul(M4.tr(x,0,z),M4.ry(ry||0)));
  cyl(G,.05,.05,.45,C.slate,0,0,0,8);box(G,.6,.1,.6,col||C.ink,0,.45,0);box(G,.6,.7,.1,col||C.ink,0,.55,-.28);}
function plant(P,x,z,s){s=s||1;cyl(P,.28*s,.22*s,.5*s,C.white,x,0,z);E.addStatic(E.geo.sphere(.55*s,6,4,Math.PI,true),at(P,x,.95*s,z),C.plant);}
function person(P,x,z,ry,col,seated,name,role){const base=M4.mul(P,M4.mul(M4.tr(x,seated?.5:0,z),M4.ry(ry||0)));
  const bh=seated?.7:1.15;const parts=[
    [E.geo.cyl(.26,.3,bh,16),M4.tr(0,bh/2,0),col],
    [E.geo.sphere(.24,18,12),M4.tr(0,bh+.26,0),C.skin],
    [E.geo.sphere(.25,18,8,Math.PI/2),M4.tr(0,bh+.28,0),C.ink]];
  const hs=parts.map(([g,l,c])=>{const h=E.add(g,M4.mul(base,l),c);h.local=l;return h;});
  const head=M4.apply(base,[0,bh+.26,0]);
  people.push({hs,base,name,role,head,phase:Math.random()*6});}

/* screen drawings */
const dChart=(c,w,h)=>{c.fillStyle='#0C111F';c.fillRect(0,0,w,h);c.fillStyle='#8A95AB';c.font='600 22px '+FONT_T;c.fillText('Cost per chat · 7 hari',24,40);
  [62,55,58,44,40,36,31].forEach((n,i)=>{const bh=n*2.6;c.fillStyle=i==6?'#005CFC':'#2A3550';c.fillRect(30+i*66,h-30-bh,44,bh);});
  c.fillStyle='#FFFFFF';c.font='800 34px '+FONT;c.fillText('Rp3.100',w-170,44);};
const dFunnel=(c,w,h)=>{c.fillStyle='#0C111F';c.fillRect(0,0,w,h);['Impresi','Klik','Chat WA','Closing'].forEach((t,i)=>{const bw=w-80-i*90,rh=(h-50)/4;
  c.fillStyle=i==3?'#005CFC':'#1E2A44';c.fillRect((w-bw)/2,30+i*rh,bw,rh-10);c.fillStyle='#FFFFFF';c.font='700 22px '+FONT_T;c.textAlign='center';c.fillText(t,w/2,30+i*rh+rh/2+4);});c.textAlign='left';};
const dDesign=(c,w,h)=>{c.fillStyle='#F5F7FC';c.fillRect(0,0,w,h);c.fillStyle='#0C111F';c.fillRect(0,0,w,28);
  [40,200,360].forEach((x,i)=>{c.fillStyle=i==1?'#0C111F':'#FFFFFF';c.fillRect(x,60,130,h-90);c.fillStyle='#005CFC';c.fillRect(x+14,80,60,10);
  c.fillStyle=i==1?'#FFFFFF':'#0C111F';c.fillRect(x+14,102,100,14);c.fillRect(x+14,122,80,14);c.fillStyle='#E6EEFF';c.fillRect(x+14,h-100,102,40);});};
const dVideo=(c,w,h)=>{c.fillStyle='#161D30';c.fillRect(0,0,w,h);c.fillStyle='#2A3550';c.fillRect(30,24,w-60,h-110);
  c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(w/2-18,(h-86)/2-6);c.lineTo(w/2+22,(h-86)/2+14);c.lineTo(w/2-18,(h-86)/2+34);c.fill();
  ['#005CFC','#58647A','#005CFC','#E6EEFF'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(30+i*112,h-70,100,18);});c.fillStyle='#58647A';c.fillRect(30,h-42,w-60,10);};
const dCode=(c,w,h)=>{c.fillStyle='#0C111F';c.fillRect(0,0,w,h);c.font='500 21px "DejaVu Sans Mono",monospace';
  [['#8A95AB','// AI Follow-Up'],['#7FA8FF','if (lead.diam > 24 jam)'],['#FFFFFF','  kirim("Halo kak, masih'],['#FFFFFF','  tertarik?")'],['#7FA8FF','crm.update(stage)'],['#5B95FF','✓ 128 chat dibalas']].forEach(([col,t],i)=>{c.fillStyle=col;c.fillText(t,22,40+i*34);});};
const dWrite=(c,w,h)=>{c.fillStyle='#FFFFFF';c.fillRect(0,0,w,h);c.fillStyle='#005CFC';c.font='700 18px '+FONT_T;c.fillText('HOOK #12',28,40);
  c.fillStyle='#0C111F';c.font='800 30px '+FONT;c.fillText('Stop scroll dulu,',28,84);c.fillText('ini rahasianya…',28,122);
  c.fillStyle='#D9E1F2';for(let i=0;i<4;i++)c.fillRect(28,150+i*24,w-56-(i%2)*120,10);};
const dSign=(c,w,h)=>{c.fillStyle='#0C111F';c.fillRect(0,0,w,h);c.font='800 54px '+FONT;const a=c.measureText('HANS ').width,b=c.measureText('CREATIVE').width;let x=(w-a-b)/2;
  c.fillStyle='#FFFFFF';c.fillText('HANS ',x,h/2+19);c.fillStyle='#3B82FF';c.fillText('CREATIVE',x+a,h/2+19);};

function build(){
  // shell
  box(M4.id(),26,.4,18,C.white,0,-.4,0);box(M4.id(),26,.05,18,C.cloud,0,0,0);
  box(M4.id(),26,4,.3,C.white,0,0,-9);box(M4.id(),.3,4,18,C.white,-13,0,0);box(M4.id(),.3,4,18,C.white,13,0,0);
  box(M4.id(),26,.35,.32,C.blue,0,4,-9);
  for(let i=-2;i<=2;i++)box(M4.id(),3.2,1.8,.05,C.ice,i*5,1.6,-8.82);
  [[0,5,C.ice],[-7,-4,C.white],[0,-4,C.white],[7,-4,C.white],[-7,4,C.white],[7,4,C.white]].forEach(([x,z,c])=>box(M4.id(),7.4,.04,6.4,c,x,.02,z));
  for(const x of[-10.5,-3.5,3.5,10.5])box(M4.id(),.08,2.4,.08,C.slate,x,0,.3);
  box(M4.id(),7,.08,.08,C.slate,-7,2.4,.3);box(M4.id(),7,.08,.08,C.slate,7,2.4,.3);

  // lobby
  let g=grp(0,5);box(g,3.6,1.05,1,C.ink,0,0,-.6);box(g,3.8,.08,1.15,C.white,0,1.05,-.6);box(g,3.6,.12,.02,C.blue,0,.6,-.09);
  box(g,4.2,2.9,.15,C.white,0,0,-2.8);screen(g,3.6,1,0,2.75,-2.6,0,dSign);
  [[-2.2,1.6],[2.2,1.6]].forEach(([x,z])=>{box(g,1.4,.45,.7,C.ice,x,0,z);box(g,1.4,.5,.15,C.ice,x,.45,z+.3);});
  plant(g,-3.2,-2.4,1.2);plant(g,3.2,-2.4,1.2);

  // ads (Ibnu)
  g=grp(-7,-4);
  [[-1.5,-.3],[1.5,-.3]].forEach(([x,z],i)=>{desk(g,x,z);screen(g,1.5,.85,x,1.38,z-.3,0,i?dFunnel:dChart);chair(g,x,z+.8,Math.PI);});
  person(g,-1.5,.5,Math.PI,C.blue,true,'Ibnu','Founder & Performance Marketer');
  screen(g,4.2,2,0,2.2,-2.9,0,dChart);box(g,.9,1.1,.5,C.slate,-3,0,1.8);box(g,.9,.04,.5,C.blue,-3,1.1,1.8);plant(g,3,2,1);

  // studio (Cia)
  g=grp(0,-4);
  desk(g,-1.5,-1);screen(g,1.6,.95,-1.5,1.4,-1.35,0,dDesign);chair(g,-1.5,-.2,Math.PI);person(g,-1.5,-.2,Math.PI,C.ink,true,'Cia','Designer & Video Editor');
  desk(g,1.5,-1);screen(g,1.6,.95,1.5,1.4,-1.35,0,dVideo);chair(g,1.5,-.2,Math.PI);
  cyl(g,.03,.03,1.6,C.slate,-2.6,0,1.7,6);
  E.add(E.geo.torus(.38,.05,10,40),at(g,-2.6,1.95,1.7),0xffffff,{unlit:true});
  box(g,2.4,2.6,.05,C.ice,-1.2,0,2.9);box(g,1.2,.9,1.2,C.white,1.8,0,1.8);box(g,.5,.5,.5,C.blue,1.8,.9,1.8);plant(g,3.1,-2.4);

  // AI lab (Nicol)
  g=grp(7,-4);
  for(let i=0;i<3;i++){const x=-2.4+i*1.1;box(g,.9,2.6,.9,C.ink,x,0,-2.4);
    for(let j=0;j<6;j++)leds.push(box(g,.6,.05,.02,C.blue,x,.4+j*.35-.025,-1.94,{unlit:true,shadow:false}));}
  desk(g,1.6,-.4);screen(g,1.5,.9,1.6,1.38,-.7,0,dCode);chair(g,1.6,.4,Math.PI);person(g,1.6,.4,Math.PI,C.slate,true,'Nicol','AI & Automation Specialist');
  cyl(g,.5,.6,.9,C.white,-1.2,0,1.4);
  orb={h:E.add(E.geo.sphere(.45,6,4,Math.PI,true),at(g,-1.2,1.6,1.4),C.blue,{unlit:true}),P:g};

  // copy (Lulu)
  g=grp(-7,4);
  box(g,3,2.6,.5,C.white,-1.6,0,-2.7);const bc=[C.blue,C.ink,C.slate,C.ice,C.blue];
  for(let r=0;r<3;r++)for(let b=0;b<8;b++)box(g,.22,.55+(b%3)*.08,.32,bc[(b+r)%5],-2.8+b*.33,.2+r*.8,-2.55);
  desk(g,1.4,-1.2);screen(g,1.3,.8,1.4,1.32,-1.5,0,dWrite);chair(g,1.4,-.4,Math.PI);person(g,1.4,-.4,Math.PI,C.ink,true,'Lulu','Copywriter');
  box(g,1.1,.5,1,C.blue,-1.8,0,1.4);box(g,1.1,.7,.2,C.blue,-1.8,.5,1.85);cyl(g,.03,.03,1.7,C.ink,-.9,0,2.2,6);cyl(g,.15,.32,.35,C.ink,-.9,1.7,2.2,16);plant(g,3,2.2);

  // meeting
  g=grp(7,4);
  box(g,4,.08,1.6,C.white,-.6,.78,-1.2);box(g,.1,.78,.1,C.slate,-2.4,0,-1.2);box(g,.1,.78,.1,C.slate,1.2,0,-1.2);
  [-2,-.6,.8].forEach(x=>{chair(g,x,-.2,Math.PI,C.white);chair(g,x,-2.2,0,C.white);});
  box(g,2.8,.45,1,C.ink,-.6,0,2.2);box(g,2.8,.6,.25,C.ink,-.6,.45,2.6);box(g,1,.35,.6,C.white,-.6,0,1.1);plant(g,2.8,2.4,1.1);
  E.finalize();
}

/* ---------- timeline ---------- */
const SEG=3.6;
const SHOTS=[
  {e0:[16,14,18],e1:[12,11.5,15.5],tg:[-.5,.6,-1],fov:50},
  {e0:[-3.0,4.4,8.8],e1:[-4.4,3.9,8.0],tg:[-5.6,1.3,2.6],fov:44,who:'Lulu'},
  {e0:[10.8,4.4,1.8],e1:[9.4,3.9,1.2],tg:[8.5,1.3,-4.6],fov:44,who:'Nicol'},
  {e0:[0.8,4.4,1.9],e1:[-.6,3.9,1.4],tg:[-1.5,1.3,-5.2],fov:44,who:'Cia'},
  {e0:[-6.2,4.4,2.2],e1:[-7.6,3.9,1.6],tg:[-8.4,1.4,-4.8],fov:44,who:'Ibnu'},
  {e0:[0,4.8,15.5],e1:[0,3.7,11.8],tg:[0,2.3,2.2],fov:46}
];
const DUR=SHOTS.length*SEG;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const easeO=t=>1-Math.pow(1-t,3);
const L=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
function cam(t){const i=Math.min(SHOTS.length-1,Math.floor(t/SEG)),s=SHOTS[i],u=(t-i*SEG)/SEG;
  let e=L(s.e0,s.e1,easeO(u)),tg=s.tg,fov=s.fov;
  const TR=1.0,lt=t-i*SEG;
  if(i>0&&lt<TR){const p=SHOTS[i-1],k=ease(lt/TR);e=L(p.e1,e,k);tg=L(p.tg,tg,k);fov=p.fov+(fov-p.fov)*k;}
  return {e,tg,fov,i,lt};}

/* ---------- overlay ---------- */
function wrap(text,maxW,font){ctx.font=font;const words=String(text).split(/\s+/).filter(Boolean),lines=[];let line=[];
  for(const w of words){const test=[...line,w].join(' ');if(ctx.measureText(test).width>maxW&&line.length){lines.push(line);line=[w];}else line.push(w);}
  if(line.length)lines.push(line);return lines;}
function drawWords(lines,x,y,lh,font,color,hl,hlColor,hlText){ctx.font=font;ctx.textBaseline='alphabetic';
  lines.forEach((ws,li)=>{let cx=x;const by=y+li*lh;ws.forEach((w,wi)=>{const ww=ctx.measureText(w).width;const sp=ctx.measureText(' ').width;
    const isH=hl&&hl.has(w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,''));
    if(isH){ctx.fillStyle=hlColor;rr(ctx,cx-10,by-lh*.78,ww+20,lh*.98,12);ctx.fill();}
    ctx.fillStyle=isH?hlText:color;ctx.fillText(w,cx,by);cx+=ww+sp;});});}
function card(x,y,w,h,fill,r){ctx.save();ctx.shadowColor='rgba(12,17,31,.28)';ctx.shadowBlur=40;ctx.shadowOffsetY=16;ctx.fillStyle=fill;rr(ctx,x,y,w,h,r||36);ctx.fill();ctx.restore();}
function appear(lt,last){const a=Math.min(1,lt/.45),b=last?1:Math.min(1,(SEG-lt)/.3);return {alpha:Math.max(0,Math.min(a,b)),dy:(1-easeO(Math.min(1,lt/.45)))*60};}

function overlay(t,c){
  const S=OUT_W/GL_W;
  // name tags
  people.forEach(p=>{const pr=E.project([p.head[0],p.head[1]+.62,p.head[2]]);if(!pr.vis)return;
    const active=SHOTS[c.i].who===p.name;if(!active&&c.i!==0)return;const x=pr.x*OUT_W,y=pr.y*OUT_H;if(x<-100||x>OUT_W+100||y<0||y>OUT_H)return;
    const sc=active?1:.62;ctx.save();ctx.globalAlpha=active?1:.85;ctx.font=`800 ${Math.round(40*sc)}px ${FONT}`;const tw=ctx.measureText(p.name.toUpperCase()).width;
    const w=tw+48*sc,h=66*sc;ctx.fillStyle=active?'#005CFC':'#0C111F';rr(ctx,x-w/2,y-h-14*sc,w,h,h/2);ctx.fill();
    ctx.beginPath();ctx.moveTo(x-12*sc,y-14*sc-1);ctx.lineTo(x,y);ctx.lineTo(x+12*sc,y-14*sc-1);ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(p.name.toUpperCase(),x,y-14*sc-h/2+14*sc);ctx.restore();});
  ctx.textAlign='left';

  // brand pill
  ctx.save();ctx.font='700 30px '+FONT_T;ctx.letterSpacing='9px';const bt='HANS CREATIVE';const bw=ctx.measureText(bt).width+64;
  ctx.fillStyle='rgba(255,255,255,.96)';rr(ctx,(OUT_W-bw)/2,120,bw,68,34);ctx.fill();ctx.fillStyle='#005CFC';ctx.fillText(bt,(OUT_W-bw)/2+36,166);ctx.restore();
  // progress
  const n=SHOTS.length,gw=(560-(n-1)*10)/n;for(let i=0;i<n;i++){const x=(OUT_W-560)/2+i*(gw+10);ctx.fillStyle='rgba(12,17,31,.18)';rr(ctx,x,216,gw,8,4);ctx.fill();
    const f=Math.max(0,Math.min(1,(t-i*SEG)/SEG));if(f>0){ctx.fillStyle='#005CFC';rr(ctx,x,216,gw*f,8,4);ctx.fill();}}

  const {alpha,dy}=appear(c.lt,c.i===SHOTS.length-1);ctx.save();ctx.globalAlpha=alpha;ctx.translate(0,dy);
  if(c.i===0){
    const hl=new Set(String(SPEC.highlight||'').toLowerCase().split(/\s+/).map(w=>w.replace(/[^\p{L}\p{N}]/gu,'')).filter(Boolean));
    const f=`900 96px ${FONT}`,lines=wrap(SPEC.hook,840,f).slice(0,5),lh=112;
    const ch=96+lines.length*lh+(SPEC.eyebrow?70:0);const y0=600;
    card(60,y0,960,ch,'#0C111F',44);
    let y=y0+70;if(SPEC.eyebrow){ctx.font='700 30px '+FONT_T;ctx.letterSpacing='6px';ctx.fillStyle='#7FA8FF';ctx.fillText(SPEC.eyebrow.toUpperCase(),120,y+10);ctx.letterSpacing='0px';y+=70;}
    drawWords(lines,120,y+lh-26,lh,f,'#FFFFFF',hl,'#005CFC','#FFFFFF');
  }else if(c.i<SHOTS.length-1){
    const k=c.i-1,pt=SPEC.points[k]||{text:''},who=people.find(p=>p.name===SHOTS[c.i].who);
    const f=`800 60px ${FONT}`,lines=wrap(pt.text,760,f).slice(0,5),lh=74;const ch=Math.max(250,150+lines.length*lh);const y0=1180;
    card(60,y0,960,ch,'#FFFFFF',40);
    ctx.fillStyle='#005CFC';rr(ctx,100,y0+44,104,104,26);ctx.fill();ctx.fillStyle='#fff';ctx.font=`900 60px ${FONT}`;ctx.textAlign='center';ctx.fillText(String(k+1),152,y0+118);ctx.textAlign='left';
    ctx.font='700 26px '+FONT_T;ctx.letterSpacing='4px';ctx.fillStyle='#58647A';ctx.fillText(((who?who.name+' · '+who.role:'')).toUpperCase(),236,y0+76);ctx.letterSpacing='0px';
    drawWords(lines,236,y0+148,lh,f,'#0C111F',null);
  }else{
    const f=`900 84px ${FONT}`,lines=wrap(SPEC.cta,840,f).slice(0,4),lh=98;const y0=1040;const ch=110+lines.length*lh+150;
    card(60,y0,960,ch,'#0C111F',44);
    drawWords(lines,120,y0+60+lh-14,lh,f,'#FFFFFF',null);
    const sub=SPEC.ctaSub||'DM @hanscreative.co';ctx.font=`800 46px ${FONT}`;const sw=ctx.measureText(sub).width+72;const sy=y0+80+lines.length*lh;
    ctx.fillStyle='#005CFC';rr(ctx,120,sy,sw,96,48);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(sub,156,sy+64);
  }
  ctx.restore();
}

/* ---------- API for the recorder ---------- */
window.setup=async function(spec){SPEC=spec;await document.fonts.load('900 96px "Inter Display"');await document.fonts.load('700 30px "Inter"');
  glc=document.createElement('canvas');glc.width=GL_W;glc.height=GL_H;E=Engine(glc);M4=E.M4;
  out=document.createElement('canvas');out.width=OUT_W;out.height=OUT_H;ctx=out.getContext('2d');document.body.appendChild(out);
  build();return {duration:DUR};};
window.frame=function(t){
  const s=t;people.forEach(p=>{const dy=Math.sin(s*2+p.phase)*.03;p.hs.forEach(h=>{h.m=M4.mul(M4.mul(M4.tr(0,dy,0),p.base),h.local);});});
  leds.forEach((l,i)=>{l.tint=E.lin(E.hex(Math.sin(s*3+i*1.7)>.3?C.blue:0x1E2A44));});
  if(orb)orb.h.m=M4.mul(at(orb.P,-1.2,1.6+Math.sin(s*1.5)*.08,1.4),M4.mul(M4.ry(s*.6),M4.rx(s*.3)));
  const c=cam(t);E.render(c.e,c.tg,c.fov,C.cloud);
  ctx.drawImage(glc,0,0,OUT_W,OUT_H);overlay(t,c);
  return out.toDataURL('image/jpeg',.9);};
})();
