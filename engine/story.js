// "Story" Reels template: kinetic type, phone chat mockups, glow scenes, wipes. 1080x1920.
// spec: {template:"story", scenes:[{type, dur, ...}]}  types: hook | reveal | chat | compare | chips | cta
(function(){
const W=1080,H=1920;
const BLUE='#005CFC',BLUE2='#3B82FF',INK='#0C111F',INK2='#151C2E',WHITE='#FFFFFF',CLOUD='#F5F7FC',ICE='#E6EEFF',SLATE='#58647A',LINE='#D9E1F2',GREEN='#14A44D',WA='#E7FFDB';
const FD='"Inter Display","Inter",sans-serif',FT='"Inter",sans-serif';
let ctx,cv,S,starts=[],TOTAL=0;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),eo=t=>1-Math.pow(1-cl(t,0,1),3),eio=t=>{t=cl(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const back=t=>{t=cl(t,0,1);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function rr(x,y,w,h,r){r=Math.min(r,h/2,w/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function fr(x,y,w,h,r,c){ctx.fillStyle=c;rr(x,y,w,h,r);ctx.fill();}
function sh(fn,blur,oy,col){ctx.save();ctx.shadowColor=col||'rgba(12,17,31,.22)';ctx.shadowBlur=blur;ctx.shadowOffsetY=oy;fn();ctx.restore();}
function tx(t,x,y,f,c,al){ctx.font=f;ctx.fillStyle=c;ctx.textAlign=al||'left';ctx.textBaseline='alphabetic';ctx.fillText(t,x,y);ctx.textAlign='left';}
function wrap(t,maxW,f){ctx.font=f;const ws=String(t).split(/\s+/).filter(Boolean),o=[];let l=[];for(const w of ws){const s=[...l,w].join(' ');if(ctx.measureText(s).width>maxW&&l.length){o.push(l);l=[w];}else l.push(w);}if(l.length)o.push(l);return o;}
const norm=w=>w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');

/* ---------- backgrounds ---------- */
function bgDark(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0A0F1C');g.addColorStop(1,'#0C1530');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  [[300+Math.sin(t*.5)*120,500,620,'rgba(0,92,252,.42)'],[850+Math.cos(t*.4)*100,1350,700,'rgba(59,130,255,.30)'],[200,1700,500,'rgba(0,92,252,.18)']].forEach(([x,y,r,c])=>{
    const rg=ctx.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,c);rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);});
  // perspective grid floor
  ctx.save();ctx.strokeStyle='rgba(120,160,255,.13)';ctx.lineWidth=2;const hz=1250;
  for(let i=-12;i<=12;i++){ctx.beginPath();ctx.moveTo(W/2+i*20,hz);ctx.lineTo(W/2+i*260,H);ctx.stroke();}
  for(let j=0;j<12;j++){const p=((j+t*.6)%12)/12;const y=hz+Math.pow(p,2.2)*(H-hz);ctx.globalAlpha=p;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.restore();
  // particles
  for(let i=0;i<60;i++){const x=rnd(i)*W,y=(rnd(i+99)*H-t*(20+rnd(i+7)*50))%H,yy=y<0?y+H:y,s=1+rnd(i+3)*3;ctx.fillStyle=`rgba(160,190,255,${.15+rnd(i+5)*.45})`;ctx.beginPath();ctx.arc(x,yy,s,0,6.283);ctx.fill();}}
function bgLight(t){ctx.fillStyle=CLOUD;ctx.fillRect(0,0,W,H);
  [[880+Math.sin(t*.6)*60,380,520,'rgba(0,92,252,.13)'],[160,1500+Math.cos(t*.5)*60,560,'rgba(0,92,252,.10)']].forEach(([x,y,r,c])=>{const rg=ctx.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,c);rg.addColorStop(1,'rgba(245,247,252,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);});
  ctx.fillStyle='rgba(0,92,252,.09)';for(let y=48;y<H;y+=56)for(let x=48;x<W;x+=56){ctx.beginPath();ctx.arc(x,y,2.2,0,6.283);ctx.fill();}}

/* ---------- kinetic text ---------- */
function kinetic(text,x,y,maxW,size,lt,start,color,hl,opts){opts=opts||{};const f=`900 ${size}px ${FD}`,lines=wrap(text,maxW,f),lh=size*1.12;ctx.font=f;let k=0;
  const sp=ctx.measureText(' ').width;const hs=new Set((hl||[]).map(norm));
  lines.forEach((ws,li)=>{const lw=ws.reduce((a,w)=>a+ctx.measureText(w).width,0)+sp*(ws.length-1);let cx=opts.center?x-lw/2:x;const by=y+li*lh;
    ws.forEach(w=>{const ww=ctx.measureText(w).width;const p=cl((lt-start-k*.07)/.32,0,1);k++;if(p<=0){cx+=ww+sp;return;}
      const s=.55+.45*back(p);ctx.save();ctx.globalAlpha=Math.min(1,p*1.6);ctx.translate(cx+ww/2,by-size*.35);ctx.scale(s,s);ctx.translate(-(cx+ww/2),-(by-size*.35));
      const on=hs.has(norm(w));if(on){const bw=(ww+24)*eo((lt-start-k*.07-.15)/.3);fr(cx-12,by-size*.86,bw,size*1.04,14,BLUE);}
      ctx.fillStyle=on?WHITE:color;ctx.font=f;ctx.fillText(w,cx,by);ctx.restore();cx+=ww+sp;});});
  return lines.length*lh;}
function label(t,x,y,dark,center){ctx.save();ctx.font='800 28px '+FT;ctx.letterSpacing='6px';const w=ctx.measureText(t.toUpperCase()).width+52;const X=center?x-w/2:x;
  fr(X,y,w,60,30,dark?'rgba(255,255,255,.1)':INK);if(dark){ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;rr(X,y,w,60,30);ctx.stroke();}
  ctx.fillStyle=WHITE;ctx.fillText(t.toUpperCase(),X+26,y+40);ctx.restore();}

/* ---------- phone ---------- */
function phone(x,y,w,h,rot,draw){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  sh(()=>fr(0,0,w,h,70,'#05070D'),80,40,'rgba(0,30,90,.45)');fr(14,14,w-28,h-28,58,WHITE);
  ctx.save();rr(14,14,w-28,h-28,58);ctx.clip();draw(w,h);ctx.restore();fr(w/2-70,26,140,34,17,'#05070D');ctx.restore();}
function chatHeader(w,name,status,t){fr(14,14,w-28,170,0,'#075E54');ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(80,122,36,0,6.283);ctx.fill();
  tx(name[0],80,136,'800 36px '+FT,'#075E54','center');tx(name,134,114,'700 32px '+FT,WHITE);tx(status,134,150,'500 24px '+FT,'rgba(255,255,255,.8)');}
function chatBubbles(w,msgs,lt,top){let y=top;ctx.fillStyle='#ECE5DD';ctx.fillRect(14,top-30,w-28,2000);
  msgs.forEach(m=>{if(lt<m.at)return;const p=eo((lt-m.at)/.3);const me=m.from==='user';const f='500 30px '+FT;const lines=wrap(m.text,w*.62,f);const bh=lines.length*40+44+(m.card?150:0);
    let bw=Math.max(...lines.map(l=>{ctx.font=f;return ctx.measureText(l.join(' ')).width;}))+64;if(m.card)bw=Math.max(bw,w*.68);
    const bx=me?w-34-bw:34;ctx.save();ctx.globalAlpha=p;ctx.translate(0,(1-p)*30);
    sh(()=>fr(bx,y,bw,bh,22,me?WA:WHITE),8,3,'rgba(0,0,0,.12)');
    lines.forEach((l,i)=>tx(l.join(' '),bx+24,y+46+i*40,f,INK));
    if(m.card){const cy=y+lines.length*40+30;fr(bx+18,cy,bw-36,124,16,m.card.color||ICE);tx(m.card.title,bx+40,cy+48,'800 28px '+FT,m.card.tc||BLUE);tx(m.card.sub,bx+40,cy+92,'600 26px '+FT,INK);}
    if(!me){tx(m.time||'02.01',bx+bw-20,y+bh-12,'500 20px '+FT,SLATE,'right');}
    ctx.restore();y+=bh+22;});
  // typing indicator
  const next=msgs.find(m=>m.at>lt&&m.from!=='user');if(next&&next.at-lt<.9){const bx=34;fr(bx,y,120,64,22,WHITE);for(let i=0;i<3;i++){const a=.3+.7*Math.abs(Math.sin(lt*6+i));ctx.fillStyle=`rgba(88,100,122,${a})`;ctx.beginPath();ctx.arc(bx+34+i*26,y+32,8,0,6.283);ctx.fill();}}}

/* ---------- scenes ---------- */
function sceneHook(s,lt,d,t){bgDark(t);
  label(s.eyebrow||'',90,330,true);
  const hh=kinetic(s.text,90,520,900,108,lt,.15,WHITE,s.hl);
  // phone with lock-screen notification sliding in
  if(!s.notifs){const q=back(cl((lt-.5)/.5,0,1));ctx.save();ctx.translate(800,560+hh+380);ctx.scale(q*.8,q*.8);ctx.rotate(Math.sin(t*1.5)*.06);
    ctx.shadowColor='rgba(59,130,255,.9)';ctx.shadowBlur=90;tx('?',0,180,'900 560px '+FD,BLUE2,'center');ctx.shadowBlur=0;tx('?',0,180,'900 560px '+FD,WHITE,'center');ctx.restore();
    (s.chips||[]).forEach((c,i)=>{const r=eo((lt-1.2-i*.25)/.4);if(r<=0)return;ctx.save();ctx.globalAlpha=r;ctx.font='700 34px '+FT;const w=ctx.measureText(c).width+60;
      const x=90,y=600+hh+120+i*170+Math.sin(t*2+i)*8;fr(x,y,w,80,40,'rgba(255,255,255,.1)');ctx.strokeStyle='rgba(160,190,255,.4)';ctx.lineWidth=2;rr(x,y,w,80,40);ctx.stroke();
      tx(c,x+30,y+52,'700 34px '+FT,WHITE);ctx.restore();});return;}
  const p=eo((lt-.5)/.6);phone(250,520+hh+40+(1-p)*500,580,1000,-.06+(1-p)*.1,(w,h)=>{
    const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1B2B5A');g.addColorStop(1,'#0A1024');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    tx(s.clock||'02.07',w/2,230,'200 150px '+FT,WHITE,'center');tx('Rabu, 15 Oktober',w/2,290,'500 30px '+FT,'rgba(255,255,255,.75)','center');
    (s.notifs||[]).forEach((n,i)=>{const q=back(cl((lt-1-i*.45)/.4,0,1));if(q<=0)return;const y=360+i*150;ctx.save();ctx.globalAlpha=cl(q,0,1);ctx.translate(0,(1-q)*-60);
      fr(30,y,w-60,130,28,'rgba(255,255,255,.92)');fr(52,y+30,56,56,14,'#25D366');tx('WA',80,y+66,'800 22px '+FT,WHITE,'center');
      tx(n.from,128,y+56,'800 28px '+FT,INK);tx(n.text,128,y+98,'500 26px '+FT,SLATE);tx('baru',w-56,y+56,'500 22px '+FT,SLATE,'right');ctx.restore();});});}
function sceneReveal(s,lt,d,t){bgDark(t);const cx=W/2,cy=860;
  // rings
  for(let i=0;i<3;i++){const p=eo((lt-i*.12)/.8);ctx.save();ctx.strokeStyle=`rgba(59,130,255,${.5-i*.13})`;ctx.lineWidth=4;ctx.setLineDash([24,18]);ctx.lineDashOffset=t*40*(i%2?1:-1);
    ctx.beginPath();ctx.arc(cx,cy,(260+i*110)*p,0,6.283);ctx.stroke();ctx.restore();}
  // burst particles
  for(let i=0;i<40;i++){const a=rnd(i)*6.283,sp=200+rnd(i+1)*520,p=eo(lt/1.2);ctx.fillStyle=`rgba(120,170,255,${(1-p)*.9})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*sp*p,cy+Math.sin(a)*sp*p,4+rnd(i+2)*5,0,6.283);ctx.fill();}
  const big=s.big||'AI AGENT';ctx.font=`900 190px ${FD}`;const tw=ctx.measureText(big).width;let x=cx-tw/2;
  [...big].forEach((ch,i)=>{const cw=ctx.measureText(ch).width;const p=back(cl((lt-.1-i*.05)/.4,0,1));if(p>0){ctx.save();ctx.globalAlpha=cl(p,0,1);ctx.shadowColor='rgba(59,130,255,.9)';ctx.shadowBlur=60;
    ctx.translate(x+cw/2,cy+70-(1-p)*120);tx(ch,0,0,`900 190px ${FD}`,WHITE,'center');ctx.restore();}x+=cw;});
  const q=eo((lt-.8)/.5);ctx.save();ctx.globalAlpha=q;tx(s.sub||'',cx,cy+220,'700 52px '+FD,'#BFD3FF','center');ctx.restore();
  if(s.sub2){const q2=eo((lt-1.3)/.5);ctx.save();ctx.globalAlpha=q2;ctx.font='800 44px '+FD;const w2=ctx.measureText(s.sub2).width+80;fr(cx-w2/2,cy+290,w2,92,46,BLUE);tx(s.sub2,cx,cy+351,'800 44px '+FD,WHITE,'center');ctx.restore();}}
function sceneChat(s,lt,d,t){bgLight(t);
  const p=eo(lt/.5);ctx.save();ctx.globalAlpha=p;label(s.eyebrow||'',90,300,false);ctx.restore();
  kinetic(s.title,90,450,900,76,lt,.1,INK,s.hl);
  phone(60+(1-p)*-200,620,600,1120,.03,(w,h)=>{chatHeader(w,s.name||'Toko Kamu',s.status||'AI agent · online',t);chatBubbles(w,s.messages||[],lt,240);});
  // floating action cards on the right
  (s.actions||[]).forEach((a,i)=>{const q=back(cl((lt-a.at)/.45,0,1));if(q<=0)return;const y=760+i*250;ctx.save();ctx.globalAlpha=cl(q,0,1);ctx.translate(700+(1-q)*200,y);ctx.rotate(.03*(i%2?-1:1));
    sh(()=>fr(0,0,330,200,30,WHITE),40,16,'rgba(0,40,120,.25)');fr(26,26,64,64,18,a.done?GREEN:BLUE);
    ctx.strokeStyle=WHITE;ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(42,58);ctx.lineTo(54,70);ctx.lineTo(74,46);ctx.stroke();
    tx(a.title,26,136,'800 32px '+FD,INK);tx(a.sub,26,176,'600 24px '+FT,SLATE);ctx.restore();});}
function sceneCompare(s,lt,d,t){bgLight(t);kinetic(s.title,W/2,380,920,84,lt,.05,INK,s.hl,{center:true});
  const cols=[[s.left,60,false],[s.right,560,true]];
  cols.forEach(([c,x,hero],ci)=>{const p=eo((lt-.3-ci*.25)/.5);ctx.save();ctx.globalAlpha=p;ctx.translate(0,(1-p)*80);
    if(hero)sh(()=>fr(x,560,460,760,40,INK),60,24,'rgba(0,60,200,.35)');else sh(()=>fr(x,560,460,760,40,WHITE),30,10);
    tx(c.title,x+40,650,'900 52px '+FD,hero?WHITE:INK);tx(c.tag,x+40,700,'600 28px '+FT,hero?'#9DB8FF':SLATE);
    c.items.forEach((it,i)=>{const q=eo((lt-.7-ci*.3-i*.22)/.3);ctx.save();ctx.globalAlpha=q;const y=780+i*170;
      fr(x+30,y,400,140,24,hero?'rgba(255,255,255,.08)':CLOUD);
      if(hero){fr(x+52,y+38,64,64,18,BLUE);ctx.strokeStyle=WHITE;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+68,y+70);ctx.lineTo(x+80,y+82);ctx.lineTo(x+100,y+58);ctx.stroke();}
      else{fr(x+52,y+38,64,64,18,LINE);tx('…',x+84,y+80,'800 34px '+FT,SLATE,'center');}
      const lines=wrap(it,270,'700 30px '+FT);lines.slice(0,2).forEach((l,j)=>tx(l.join(' '),x+136,y+64+j*38-(lines.length>1?16:0)+ (lines.length>1?0:6),'700 30px '+FT,hero?WHITE:INK));ctx.restore();});
    ctx.restore();});
  const v=back(cl((lt-.6)/.4,0,1));ctx.save();ctx.translate(W/2,1060);ctx.scale(v,v);sh(()=>{ctx.fillStyle=BLUE;ctx.beginPath();ctx.arc(0,0,64,0,6.283);ctx.fill();},40,0,'rgba(0,92,252,.6)');tx('VS',0,16,'900 44px '+FD,WHITE,'center');ctx.restore();}
function sceneChips(s,lt,d,t){bgDark(t);label(s.eyebrow||'',90,330,true);const hh=kinetic(s.title,90,520,900,92,lt,.1,WHITE,s.hl);
  (s.items||[]).forEach((it,i)=>{const q=back(cl((lt-.9-i*.3)/.4,0,1));if(q<=0)return;const y=560+hh+i*190;ctx.save();ctx.globalAlpha=cl(q,0,1);ctx.translate((1-q)*-300,0);
    fr(90,y,900,150,36,'rgba(255,255,255,.07)');ctx.strokeStyle='rgba(120,160,255,.35)';ctx.lineWidth=2;rr(90,y,900,150,36);ctx.stroke();
    fr(120,y+30,90,90,24,BLUE);tx(String(i+1),165,y+92,'900 50px '+FD,WHITE,'center');tx(it.title,240,y+68,'800 40px '+FD,WHITE);tx(it.sub,240,y+114,'500 28px '+FT,'#A8BCE6');ctx.restore();});
  if(s.note){const q=eo((lt-2.2)/.5);ctx.save();ctx.globalAlpha=q;tx(s.note,W/2,1760,'700 34px '+FT,'#BFD3FF','center');ctx.restore();}}
function sceneCta(s,lt,d,t){bgDark(t);const cx=W/2;
  const hh=kinetic(s.text,cx,720,900,104,lt,.05,WHITE,s.hl,{center:true});
  const p=back(cl((lt-.8)/.45,0,1));ctx.save();ctx.translate(cx,820+hh);ctx.scale(p,p);ctx.font='900 58px '+FD;const w=ctx.measureText(s.button).width+120;const pl=1+Math.sin(t*6)*.03;ctx.scale(pl,pl);
  sh(()=>fr(-w/2,-62,w,124,62,BLUE),60,0,'rgba(0,92,252,.8)');tx(s.button,0,20,'900 58px '+FD,WHITE,'center');ctx.restore();
  const q=eo((lt-1.3)/.5);ctx.save();ctx.globalAlpha=q;tx(s.sub||'',cx,1000+hh,'600 34px '+FT,'#BFD3FF','center');ctx.restore();}

function ico(kind,cx,cy,s,c){ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=s*.08;ctx.lineCap='round';ctx.lineJoin='round';
  if(kind==='brain'){ctx.beginPath();ctx.arc(-s*.16,-s*.08,s*.24,Math.PI*.6,Math.PI*1.9);ctx.arc(s*.16,-s*.08,s*.24,Math.PI*1.1,Math.PI*.4);ctx.lineTo(s*.05,s*.34);ctx.lineTo(-s*.05,s*.34);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-s*.3);ctx.lineTo(0,s*.3);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.2,-s*.05);ctx.quadraticCurveTo(-s*.08,0,-s*.2,s*.12);ctx.stroke();ctx.beginPath();ctx.moveTo(s*.2,-s*.05);ctx.quadraticCurveTo(s*.08,0,s*.2,s*.12);ctx.stroke();}
  if(kind==='tools'){ctx.beginPath();ctx.moveTo(-s*.3,s*.3);ctx.lineTo(s*.08,-s*.08);ctx.stroke();ctx.beginPath();ctx.arc(s*.16,-s*.16,s*.16,Math.PI*.9,Math.PI*2.6);ctx.stroke();}
  if(kind==='memory'){ctx.beginPath();ctx.ellipse(0,-s*.24,s*.3,s*.1,0,0,6.283);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.3,-s*.24);ctx.lineTo(-s*.3,s*.24);ctx.ellipse(0,s*.24,s*.3,s*.1,0,Math.PI,0,true);ctx.lineTo(s*.3,-s*.24);ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,0,s*.3,s*.1,0,0,Math.PI);ctx.stroke();}
  if(kind==='rules'){rr(-s*.26,-s*.34,s*.52,s*.68,s*.06);ctx.stroke();[-.14,0,.14].forEach(y=>{ctx.beginPath();ctx.moveTo(-s*.14,y*s);ctx.lineTo(s*.14,y*s);ctx.stroke();});}
  ctx.restore();}
function sceneAnatomy(s,lt,d,t){bgLight(t);kinetic(s.title,90,420,900,80,lt,.05,INK,s.hl);
  const cx=W/2,cy=1200,pos=[[60,780],[560,780],[60,1410],[560,1410]];
  const shown=(s.items||[]).filter(it=>lt>=it.at);const act=shown.length-1;
  s.items.forEach((it,i)=>{if(lt<it.at)return;const [x,y]=pos[i];const nx=x+230,ny=y+(i<2?260:-0);
    ctx.save();ctx.strokeStyle=i===act?BLUE:'rgba(0,92,252,.3)';ctx.lineWidth=5;ctx.setLineDash([14,12]);ctx.lineDashOffset=-t*50;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(nx,ny);ctx.stroke();ctx.restore();
    const pp=(t*1.2+i*.3)%1;ctx.fillStyle=BLUE;ctx.beginPath();ctx.arc(cx+(nx-cx)*pp,cy+(ny-cy)*pp,9,0,6.283);ctx.fill();});
  const hp=back(cl(lt/.5,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(hp*(1+Math.sin(t*3)*.03),hp*(1+Math.sin(t*3)*.03));
  sh(()=>{ctx.fillStyle=BLUE;ctx.beginPath();ctx.arc(0,0,120,0,6.283);ctx.fill();},70,0,'rgba(0,92,252,.6)');tx('AI',0,6,'900 76px '+FD,WHITE,'center');tx('AGENT',0,52,'800 28px '+FT,'#CFE0FF','center');ctx.restore();
  s.items.forEach((it,i)=>{const q=back(cl((lt-it.at)/.4,0,1));if(q<=0)return;const [x,y]=pos[i];ctx.save();ctx.globalAlpha=cl(q,0,1);ctx.translate(x+230,y+130);ctx.scale(.7+.3*q,.7+.3*q);ctx.translate(-230,-130);
    const on=i===act;sh(()=>fr(0,0,460,260,34,on?INK:WHITE),on?50:24,on?20:8,on?'rgba(0,60,200,.4)':undefined);
    fr(28,28,88,88,24,on?BLUE:ICE);ico(it.icon,72,72,72,on?WHITE:BLUE);tx(String(i+1).padStart(2,'0'),432,62,'800 26px '+FT,on?'#7FA8FF':SLATE,'right');
    tx(it.title,28,172,'900 46px '+FD,on?WHITE:INK);const ls=wrap(it.sub,400,'500 27px '+FT);ls.slice(0,2).forEach((l,j)=>tx(l.join(' '),28,212+j*34,'500 27px '+FT,on?'#B9CCF5':SLATE));ctx.restore();});}
function sceneLoop(s,lt,d,t){bgDark(t);label(s.eyebrow||'',90,300,true);kinetic(s.title,90,470,900,80,lt,.05,WHITE,s.hl);
  const cx=W/2,cy=1090,R=320,n=s.steps.length,per=(d-1.2)/n,k=cl((lt-.8)/per,0,n-.001),act=Math.floor(k);
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,R,0,6.283);ctx.stroke();
  ctx.strokeStyle=BLUE2;ctx.shadowColor='rgba(59,130,255,.9)';ctx.shadowBlur=30;ctx.lineCap='round';ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+6.283*(k/n));ctx.stroke();ctx.restore();
  const hx=cx+Math.cos(-Math.PI/2+6.283*k/n)*R,hy=cy+Math.sin(-Math.PI/2+6.283*k/n)*R;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(hx,hy,16,0,6.283);ctx.fill();
  s.steps.forEach((st,i)=>{const a=-Math.PI/2+6.283*i/n,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;const on=i===act,done=i<act;const q=eo((lt-.2-i*.12)/.4);ctx.save();ctx.globalAlpha=q;
    ctx.font='800 34px '+FD;const w=ctx.measureText(st).width+90;const sc=on?1.08:1;ctx.translate(x,y);ctx.scale(sc,sc);
    if(on)sh(()=>fr(-w/2,-42,w,84,42,BLUE),40,0,'rgba(0,92,252,.9)');else fr(-w/2,-42,w,84,42,done?'#1E3A7A':'#1A2238');
    ctx.strokeStyle=on?WHITE:'rgba(160,190,255,.35)';ctx.lineWidth=2;rr(-w/2,-42,w,84,42);ctx.stroke();
    fr(-w/2+12,-30,60,60,30,on?WHITE:'rgba(255,255,255,.12)');tx(String(i+1),-w/2+42,12,'900 32px '+FD,on?BLUE:WHITE,'center');tx(st,-w/2+84,12,'800 34px '+FD,WHITE);ctx.restore();});
  tx('↻',cx,cy+40,'900 120px '+FT,'rgba(255,255,255,.18)','center');
  if(s.example){const q=eo((lt-.6)/.4);ctx.save();ctx.globalAlpha=q;fr(90,1520,900,230,32,'rgba(255,255,255,.07)');ctx.strokeStyle='rgba(160,190,255,.35)';ctx.lineWidth=2;rr(90,1520,900,230,32);ctx.stroke();
    tx('CONTOH: '+s.example.task.toUpperCase(),130,1580,'800 26px '+FT,'#7FA8FF');const ex=s.example.lines[act]||'';
    const ls=wrap(ex,820,'700 38px '+FD);ls.slice(0,2).forEach((l,j)=>tx(l.join(' '),130,1645+j*50,'700 38px '+FD,WHITE));ctx.restore();}}

const SC={anatomy:sceneAnatomy,loop:sceneLoop,hook:sceneHook,reveal:sceneReveal,chat:sceneChat,compare:sceneCompare,chips:sceneChips,cta:sceneCta};

function chrome(t,dark){ctx.save();ctx.font='700 28px '+FT;ctx.letterSpacing='9px';const bt='HANS CREATIVE',bw=ctx.measureText(bt).width+60;
  fr((W-bw)/2,110,bw,62,31,dark?'rgba(255,255,255,.1)':WHITE);ctx.fillStyle=dark?WHITE:BLUE;ctx.fillText(bt,(W-bw)/2+34,152);ctx.restore();
  const n=S.scenes.length,gw=(560-(n-1)*10)/n;for(let i=0;i<n;i++){const x=(W-560)/2+i*(gw+10);fr(x,200,gw,8,4,dark?'rgba(255,255,255,.18)':'rgba(12,17,31,.14)');
    const f=cl((t-starts[i])/S.scenes[i].dur,0,1);if(f>0)fr(x,200,gw*f,8,4,BLUE);}}
function wipe(t){for(let i=1;i<starts.length;i++){const u=(t-starts[i]+.22)/.44;if(u>0&&u<1){const x=-W*1.2+eio(u)*W*2.6;ctx.save();ctx.translate(x,0);ctx.rotate(-.12);
  fr(-80,-400,W*.55,H+800,0,BLUE);fr(W*.55-80,-400,60,H+800,0,BLUE2);ctx.restore();}}}

window.setup=async function(spec){S=spec;let a=0;starts=S.scenes.map(s=>{const v=a;a+=s.dur;return v;});TOTAL=a;
  await document.fonts.load('900 96px "Inter Display"');await document.fonts.load('700 30px "Inter"');await document.fonts.load('200 100px "Inter"');
  cv=document.createElement('canvas');cv.width=W;cv.height=H;ctx=cv.getContext('2d');document.body.appendChild(cv);return {duration:TOTAL,cues:starts};};
window.frame=function(t){let i=starts.length-1;while(i>0&&t<starts[i])i--;const s=S.scenes[i],lt=t-starts[i];
  ctx.save();SC[s.type](s,lt,s.dur,t);ctx.restore();chrome(t,['hook','reveal','chips','cta','loop'].includes(s.type));wipe(t);
  return cv.toDataURL('image/jpeg',.9);};
})();
