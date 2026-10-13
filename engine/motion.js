// Motion-graphic Reels template (2D canvas, no office/characters). Brand palette, light background.
// spec: {eyebrow, hook, highlight, points:[{text, illus}], cta, ctaSub}
// illus per point: "chat-vs-agent" | "tools" | "flow" | "human" | "checklist" | "chart"
(function(){
const W=1080,H=1920,SEG=3.6;
const BLUE='#005CFC',INK='#0C111F',WHITE='#FFFFFF',CLOUD='#F5F7FC',ICE='#E6EEFF',SLATE='#58647A',LINE='#D9E1F2',GREEN='#14A44D';
const FD='"Inter Display","Inter",sans-serif',FT='"Inter",sans-serif';
let ctx,cv,SPEC,N;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const easeO=t=>1-Math.pow(1-clamp(t,0,1),3);
const easeIO=t=>{t=clamp(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function fillR(x,y,w,h,r,c){ctx.fillStyle=c;rr(x,y,w,h,r);ctx.fill();}
function shadowCard(x,y,w,h,r,c){ctx.save();ctx.shadowColor='rgba(12,17,31,.16)';ctx.shadowBlur=36;ctx.shadowOffsetY=14;fillR(x,y,w,h,r,c);ctx.restore();}
function text(t,x,y,font,c,align){ctx.font=font;ctx.fillStyle=c;ctx.textAlign=align||'left';ctx.textBaseline='alphabetic';ctx.fillText(t,x,y);ctx.textAlign='left';}
function wrap(t,maxW,font){ctx.font=font;const ws=String(t).split(/\s+/).filter(Boolean),out=[];let l=[];
  for(const w of ws){const s=[...l,w].join(' ');if(ctx.measureText(s).width>maxW&&l.length){out.push(l);l=[w];}else l.push(w);}if(l.length)out.push(l);return out;}
function drawLines(lines,x,y,lh,font,c,hl,hlBg,hlC){ctx.font=font;lines.forEach((ws,i)=>{let cx=x;const by=y+i*lh;ws.forEach(w=>{const ww=ctx.measureText(w).width,sp=ctx.measureText(' ').width;
  const k=w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');const on=hl&&hl.has(k);
  if(on){fillR(cx-10,by-lh*.78,ww+20,lh*.98,12,hlBg);}ctx.fillStyle=on?hlC:c;ctx.fillText(w,cx,by);cx+=ww+sp;});});}

/* ---------- background ---------- */
function background(t){ctx.fillStyle=CLOUD;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(0,92,252,.08)';for(let y=60;y<H;y+=60)for(let x=60;x<W;x+=60){ctx.beginPath();ctx.arc(x,y,2.2,0,6.283);ctx.fill();}
  // floating soft shapes
  const sh=[[120,420,140,.0],[930,620,110,1.3],[180,1500,90,2.1],[960,1380,150,3.4]];
  sh.forEach(([x,y,s,p],i)=>{const dy=Math.sin(t*.8+p)*18;ctx.save();ctx.translate(x,y+dy);ctx.rotate(Math.sin(t*.3+p)*.2);
    fillR(-s/2,-s/2,s,s,s*.28,i%2?'rgba(0,92,252,.07)':'rgba(12,17,31,.04)');ctx.restore();});}
function chrome(t){ctx.save();ctx.font='700 30px '+FT;ctx.letterSpacing='9px';const bt='HANS CREATIVE',bw=ctx.measureText(bt).width+64;
  fillR((W-bw)/2,120,bw,68,34,WHITE);ctx.fillStyle=BLUE;ctx.fillText(bt,(W-bw)/2+36,166);ctx.restore();
  const n=N,gw=(560-(n-1)*10)/n;for(let i=0;i<n;i++){const x=(W-560)/2+i*(gw+10);fillR(x,216,gw,8,4,'rgba(12,17,31,.14)');
    const f=clamp((t-i*SEG)/SEG,0,1);if(f>0)fillR(x,216,gw*f,8,4,BLUE);}}

/* ---------- illustrations (area: y 300..1120) ---------- */
function bubble(x,y,w,h,c,tc,label,a,right){ctx.save();ctx.globalAlpha=a;fillR(x,y,w,h,26,c);ctx.beginPath();
  if(right){ctx.moveTo(x+w-30,y+h);ctx.lineTo(x+w-6,y+h+22);ctx.lineTo(x+w-60,y+h);}else{ctx.moveTo(x+30,y+h);ctx.lineTo(x+6,y+h+22);ctx.lineTo(x+60,y+h);}ctx.fill();
  text(label,x+28,y+h/2+12,'600 32px '+FT,tc);ctx.restore();}
function check(x,y,s,on,k){ctx.save();fillR(x,y,s,s,s*.28,on?BLUE:WHITE);if(!on){ctx.strokeStyle=LINE;ctx.lineWidth=3;rr(x,y,s,s,s*.28);ctx.stroke();}
  if(on){ctx.strokeStyle=WHITE;ctx.lineWidth=s*.12;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();const p=clamp(k,0,1);
    ctx.moveTo(x+s*.26,y+s*.52);const mx=x+s*.43,my=y+s*.7;if(p<.5){const q=p/.5;ctx.lineTo(x+s*.26+(mx-x-s*.26)*q,y+s*.52+(my-y-s*.52)*q);}else{ctx.lineTo(mx,my);const q=(p-.5)/.5;ctx.lineTo(mx+(x+s*.76-mx)*q,my+(y+s*.32-my)*q);}ctx.stroke();}
  ctx.restore();}
function illusChatVsAgent(lt){
  // left: chatbot
  const a=easeO(lt/.5);shadowCard(60,320,450,780,36,WHITE);text('CHATBOT',100,390,'800 30px '+FT,SLATE);
  bubble(100,430,330,92,ICE,INK,'Promo apa hari ini?',easeO((lt-.3)/.4),false);
  bubble(150,580,320,92,INK,WHITE,'Diskon 20%, kak!',easeO((lt-.9)/.4),true);
  ctx.save();ctx.globalAlpha=easeO((lt-1.4)/.4);text('Selesai di jawaban.',100,1040,'600 30px '+FT,SLATE);ctx.restore();
  // right: agent
  shadowCard(570,320,450,780,36,WHITE);fillR(570,320,450,10,5,BLUE);text('AI AGENT',610,390,'800 30px '+FT,BLUE);
  ctx.save();ctx.globalAlpha=a;fillR(610,430,370,92,22,ICE);text('Tujuan:',636,470,'700 26px '+FT,SLATE);text('Kirim promo ke 50 leads',636,506,'700 30px '+FT,INK);ctx.restore();
  const steps=['Cari data leads','Tulis pesan promo','Kirim via WhatsApp','Catat di CRM'];
  steps.forEach((s,i)=>{const t0=.6+i*.55;const ap=easeO((lt-t0+.3)/.3);ctx.save();ctx.globalAlpha=ap;const y=570+i*110;
    check(610,y,64,lt>t0,(lt-t0)/.35);text(s,700,y+44,'600 32px '+FT,INK);ctx.restore();});
  ctx.save();ctx.globalAlpha=easeO((lt-2.8)/.4);text('Tugas selesai ✓',610,1040,'700 30px '+FT,GREEN);ctx.restore();}
function icon(kind,cx,cy,s){ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=INK;ctx.fillStyle=INK;ctx.lineWidth=s*.07;ctx.lineCap='round';ctx.lineJoin='round';
  if(kind==='browser'){rr(-s*.42,-s*.32,s*.84,s*.64,s*.08);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.42,-s*.14);ctx.lineTo(s*.42,-s*.14);ctx.stroke();
    [-.32,-.22,-.12].forEach(x=>{ctx.beginPath();ctx.arc(x*s,-s*.23,s*.03,0,6.283);ctx.fill();});}
  if(kind==='email'){rr(-s*.42,-s*.28,s*.84,s*.56,s*.06);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.4,-s*.24);ctx.lineTo(0,s*.06);ctx.lineTo(s*.4,-s*.24);ctx.stroke();}
  if(kind==='sheet'){rr(-s*.36,-s*.38,s*.72,s*.76,s*.06);ctx.stroke();for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(-s*.36,-s*.38+i*s*.19);ctx.lineTo(s*.36,-s*.38+i*s*.19);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-s*.08,-s*.38);ctx.lineTo(-s*.08,s*.38);ctx.stroke();}
  if(kind==='app'){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b],i)=>{ctx.fillStyle=i==1?BLUE:INK;rr(a*s*.2-s*.15,b*s*.2-s*.15,s*.3,s*.3,s*.07);ctx.fill();});}
  ctx.restore();}
function illusTools(lt,t){const cx=W/2,cy=720,R=300;
  const tools=[['browser','Browsing'],['email','Email'],['sheet','Spreadsheet'],['app','Aplikasi']];
  tools.forEach(([k,l],i)=>{const ang=-Math.PI/2+i*Math.PI/2+Math.PI/4;const ap=easeO((lt-.2-i*.25)/.35);
    const x=cx+Math.cos(ang)*R*ap,y=cy+Math.sin(ang)*R*ap;
    ctx.save();ctx.globalAlpha=ap;ctx.strokeStyle='rgba(0,92,252,.35)';ctx.lineWidth=5;ctx.setLineDash([14,14]);ctx.lineDashOffset=-t*60;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
    // pulse traveling
    const pp=((t*0.9+i*.25)%1);ctx.fillStyle=BLUE;ctx.beginPath();ctx.arc(cx+(x-cx)*pp,cy+(y-cy)*pp,10,0,6.283);ctx.fill();
    shadowCard(x-110,y-110,220,220,44,WHITE);icon(k,x,y-18,120);text(l,x,y+80,'700 28px '+FT,INK,'center');ctx.restore();});
  const s=1+Math.sin(t*3)*.03;ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);
  ctx.shadowColor='rgba(0,92,252,.45)';ctx.shadowBlur=50;fillR(-120,-120,240,240,60,BLUE);ctx.shadowBlur=0;
  text('AI',0,8,'900 84px '+FD,WHITE,'center');text('AGENT',0,62,'800 30px '+FT,'#CFE0FF','center');ctx.restore();}
function illusFlow(lt){const steps=[['Tujuan','Apa hasil akhirnya?'],['Rencana','Pecah jadi langkah'],['Kerjakan','Pakai tools'],['Cek hasil','Ulangi kalau kurang']];
  const active=Math.min(3,Math.floor(clamp(lt-.3,0,9)/.65));
  steps.forEach(([a,b],i)=>{const y=330+i*195;const ap=easeO((lt-i*.18)/.4);ctx.save();ctx.globalAlpha=ap;ctx.translate((1-ap)*-60,0);
    const on=i<=active;shadowCard(140,y,800,150,32,on?WHITE:'rgba(255,255,255,.7)');
    fillR(170,y+30,90,90,24,on?BLUE:ICE);text(String(i+1),215,y+92,'900 50px '+FD,on?WHITE:BLUE,'center');
    text(a,300,y+70,'800 44px '+FD,INK);text(b,300,y+114,'500 30px '+FT,SLATE);
    if(i<3){ctx.strokeStyle=i<active?BLUE:LINE;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(215,y+150);ctx.lineTo(215,y+195);ctx.stroke();}
    ctx.restore();});
  // loop arrow
  ctx.save();ctx.globalAlpha=easeO((lt-2.4)/.4);ctx.strokeStyle=BLUE;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(960,330+3*195+75);ctx.bezierCurveTo(1040,1000,1040,400,960,405);ctx.stroke();
  ctx.fillStyle=BLUE;ctx.beginPath();ctx.moveTo(960,390);ctx.lineTo(990,420);ctx.lineTo(950,425);ctx.fill();ctx.restore();}
function person(cx,cy,s,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy-s*.42,s*.22,0,6.283);ctx.fill();ctx.beginPath();ctx.moveTo(cx-s*.42,cy+s*.5);
  ctx.quadraticCurveTo(cx-s*.42,cy-s*.1,cx,cy-s*.12);ctx.quadraticCurveTo(cx+s*.42,cy-s*.1,cx+s*.42,cy+s*.5);ctx.closePath();ctx.fill();}
function illusHuman(lt,t){shadowCard(120,330,840,770,40,WHITE);
  // agent result card
  const ap=easeO(lt/.4);ctx.save();ctx.globalAlpha=ap;fillR(170,380,740,250,28,ICE);
  text('HASIL KERJA AGENT',210,440,'800 26px '+FT,BLUE);text('Draft promo + 50 pesan',210,500,'800 40px '+FD,INK);text('siap dikirim',210,550,'800 40px '+FD,INK);
  fillR(780,450,90,90,24,BLUE);ctx.strokeStyle=WHITE;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(800,500);ctx.lineTo(820,520);ctx.lineTo(850,475);ctx.stroke();ctx.restore();
  // human
  ctx.save();ctx.globalAlpha=easeO((lt-.5)/.4);fillR(170,680,180,180,90,INK);person(260,790,120,WHITE);
  text('Kamu',260,910,'700 30px '+FT,INK,'center');
  text('Aturan & keputusan akhir',400,740,'800 38px '+FD,INK);text('tetap di tangan manusia.',400,790,'500 32px '+FT,SLATE);ctx.restore();
  // approve button press
  const pr=lt>2.2&&lt<2.45?.94:1;const ok=lt>=2.3;ctx.save();ctx.globalAlpha=easeO((lt-1)/.4);ctx.translate(540,990);ctx.scale(pr,pr);
  fillR(-300,-55,600,110,55,ok?GREEN:BLUE);text(ok?'✓ Disetujui':'Setujui',0,16,'800 42px '+FD,WHITE,'center');ctx.restore();
  // cursor
  ctx.save();const ct=easeIO((lt-1.3)/.9);ctx.globalAlpha=lt>1.2&&lt<3?1:0;const x=860-ct*300,y=1120-ct*110;ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+40,y+90);ctx.lineTo(x+52,y+52);ctx.lineTo(x+90,y+42);ctx.closePath();ctx.fill();ctx.restore();}
const ILLUS={'chat-vs-agent':illusChatVsAgent,tools:illusTools,flow:illusFlow,human:illusHuman};

/* ---------- scenes ---------- */
function hook(lt,t){const hl=new Set(String(SPEC.highlight||'').toLowerCase().split(/\s+/).map(w=>w.replace(/[^\p{L}\p{N}]/gu,'')).filter(Boolean));
  const f='900 104px '+FD,lines=wrap(SPEC.hook,900,f).slice(0,6),lh=120;
  // big blocks sweeping
  for(let i=0;i<3;i++){const p=easeO((lt-i*.08)/.6);fillR(-40+(1-p)*-900,380+i*30,W+80,20,10,i===1?BLUE:'rgba(0,92,252,.12)');}
  const y0=560;const a=easeO((lt-.15)/.5);ctx.save();ctx.globalAlpha=a;ctx.translate(0,(1-a)*50);
  if(SPEC.eyebrow){ctx.save();ctx.font='700 32px '+FT;ctx.letterSpacing='7px';const ew=ctx.measureText(SPEC.eyebrow.toUpperCase()).width+56;
    fillR(90,y0,ew,64,32,INK);ctx.fillStyle=WHITE;ctx.fillText(SPEC.eyebrow.toUpperCase(),118,y0+43);ctx.restore();}
  drawLines(lines,90,y0+200,lh,f,INK,hl,BLUE,WHITE);ctx.restore();
  // little agent chip
  const b=easeO((lt-.8)/.5);ctx.save();ctx.globalAlpha=b;const yy=y0+200+lines.length*lh+40;fillR(90,yy,420,110,28,WHITE);
  ctx.strokeStyle=LINE;ctx.lineWidth=3;rr(90,yy,420,110,28);ctx.stroke();fillR(116,yy+22,66,66,18,BLUE);text('AI',149,yy+68,'900 34px '+FD,WHITE,'center');
  const dots='•••'.slice(0,1+Math.floor(t*3)%3);text('bekerja'+dots,206,yy+68,'700 36px '+FT,INK);ctx.restore();}
function pointScene(k,lt,t){const pt=SPEC.points[k]||{text:''};const fn=ILLUS[pt.illus]||ILLUS[Object.keys(ILLUS)[k%4]];
  fn(lt,t);
  const a=easeO(lt/.45);ctx.save();ctx.globalAlpha=a;ctx.translate(0,(1-a)*60);
  const f='800 58px '+FD,lines=wrap(pt.text,760,f).slice(0,5),lh=72,ch=Math.max(230,120+lines.length*lh),y0=1180;
  shadowCard(60,y0,960,ch,40,WHITE);fillR(100,y0+44,104,104,26,BLUE);text(String(k+1),152,y0+118,'900 60px '+FD,WHITE,'center');
  drawLines(lines,236,y0+100,lh,f,INK,null);ctx.restore();}
function ctaScene(lt,t){const a=easeO(lt/.5);ctx.save();ctx.globalAlpha=a;ctx.translate(0,(1-a)*60);
  const f='900 88px '+FD,lines=wrap(SPEC.cta,820,f).slice(0,4),lh=104,y0=640,ch=140+lines.length*lh+170;
  shadowCard(60,y0,960,ch,48,INK);drawLines(lines,120,y0+70+lh-16,lh,f,WHITE,null);
  const sub=SPEC.ctaSub||'DM @hanscreative.co';ctx.font='800 48px '+FD;const sw=ctx.measureText(sub).width+80,sy=y0+100+lines.length*lh;
  const pulse=1+Math.sin(t*5)*.025;ctx.save();ctx.translate(120+sw/2,sy+50);ctx.scale(pulse,pulse);fillR(-sw/2,-50,sw,100,50,BLUE);text(sub,0,17,'800 48px '+FD,WHITE,'center');ctx.restore();
  ctx.restore();}

window.setup=async function(spec){SPEC=spec;N=2+spec.points.length;
  await document.fonts.load('900 96px "Inter Display"');await document.fonts.load('700 30px "Inter"');
  cv=document.createElement('canvas');cv.width=W;cv.height=H;ctx=cv.getContext('2d');document.body.appendChild(cv);
  return {duration:N*SEG};};
window.frame=function(t){const i=Math.min(N-1,Math.floor(t/SEG)),lt=t-i*SEG;
  background(t);
  // scene fade-out
  const out=i<N-1?clamp((SEG-lt)/.28,0,1):1;ctx.save();ctx.globalAlpha=out;
  if(i===0)hook(lt,t);else if(i<N-1)pointScene(i-1,lt,t);else ctaScene(lt,t);
  ctx.restore();chrome(t);
  return cv.toDataURL('image/jpeg',.9);};
})();
