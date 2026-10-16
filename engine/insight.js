// "Insight" Reels template: editorial paper look, serif + black sans, orange accent, typed prompts,
// animated charts, connector diagram, shutter transitions. 1080x1920.
// spec: {template:"insight", scenes:[{type, dur, ...}]}
// types: prompt | statement | connect | dashboard | stack | cta
(function(){
const W=1080,H=1920;
// palettes: "hans" (default, brand HANS CREATIVE) | "warm" (cream + orange). Set spec.palette.
const PALS={hans:{PAPER:'#F5F7FC',PAPER2:'#E6EEFF',INK:'#0C111F',INK2:'#1E2638',OR:'#005CFC',OR2:'#9DBBFF',MUTE:'#58647A',NIGHT:'#0C111F',GLOW:'0,92,252',SOFT:'#BFD3FF',LIGHT:'#6EA2FF'},
  warm:{PAPER:'#F3EEE4',PAPER2:'#E9E2D4',INK:'#141414',INK2:'#2A2A2A',OR:'#FF5B2E',OR2:'#FFB199',MUTE:'#7A7468',NIGHT:'#121212',GLOW:'255,91,46',SOFT:'#F3D9CF',LIGHT:'#FF5B2E'}};
let PAPER,PAPER2,INK,INK2,OR,OR2,MUTE,NIGHT,GLOW,SOFT,LIGHT;const WHITE='#FFFFFF';
function usePal(n){const P=PALS[n]||PALS.hans;({PAPER,PAPER2,INK,INK2,OR,OR2,MUTE,NIGHT,GLOW,SOFT,LIGHT}=P);}usePal('hans');
const FD='"Inter Display","Inter",sans-serif',FT='"Inter",sans-serif',FS='"Lora",serif',FM='"Liberation Mono","DejaVu Sans Mono",monospace';
let ctx,cv,S,starts=[],TOTAL=0;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),eo=t=>1-Math.pow(1-cl(t,0,1),3),eio=t=>{t=cl(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const back=t=>{t=cl(t,0,1);const c1=1.4,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function rr(x,y,w,h,r){r=Math.min(r,h/2,w/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function fr(x,y,w,h,r,c){ctx.fillStyle=c;rr(x,y,w,h,r);ctx.fill();}
function st(x,y,w,h,r,c,lw){ctx.strokeStyle=c;ctx.lineWidth=lw||4;rr(x,y,w,h,r);ctx.stroke();}
function tx(t,x,y,f,c,al){ctx.font=f;ctx.fillStyle=c;ctx.textAlign=al||'left';ctx.textBaseline='alphabetic';ctx.fillText(t,x,y);ctx.textAlign='left';}
function wrap(t,maxW,f){ctx.font=f;const ws=String(t).split(/\s+/).filter(Boolean),o=[];let l=[];for(const w of ws){const s=[...l,w].join(' ');if(ctx.measureText(s).width>maxW&&l.length){o.push(l);l=[w];}else l.push(w);}if(l.length)o.push(l);return o;}
const norm=w=>w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
// hard offset shadow card (neo-brutalist)
function card(x,y,w,h,r,fill,off){off=off==null?14:off;fr(x+off,y+off,w,h,r,INK);fr(x,y,w,h,r,fill);st(x,y,w,h,r,INK,5);}

/* ---------- backgrounds ---------- */
function bgPaper(t){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(20,20,20,.06)';ctx.lineWidth=2;for(let y=300;y<H;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // grain
  for(let i=0;i<500;i++){ctx.fillStyle=`rgba(20,20,20,${.03+rnd(i+11)*.05})`;ctx.fillRect(rnd(i)*W,rnd(i+77)*H,2,2);}
  // slow orange sun
  const x=880+Math.sin(t*.4)*40,y=1660+Math.cos(t*.3)*30;const g=ctx.createRadialGradient(x,y,0,x,y,520);g.addColorStop(0,`rgba(${GLOW},.16)`);g.addColorStop(1,`rgba(${GLOW},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function bgNight(t){ctx.fillStyle=NIGHT;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=2;for(let x=0;x<W;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  const x=540+Math.sin(t*.5)*120,y=900;const g=ctx.createRadialGradient(x,y,0,x,y,700);g.addColorStop(0,`rgba(${GLOW},.28)`);g.addColorStop(1,`rgba(${GLOW},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}

/* ---------- type ---------- */
// big black headline, highlighted words get an orange marker stroke underneath
function headline(text,x,y,maxW,size,lt,start,color,hl,opts){opts=opts||{};const f=`900 ${size}px ${FD}`,lines=wrap(text,maxW,f),lh=size*1.04;ctx.font=f;let k=0;
  const sp=ctx.measureText(' ').width;const hs=new Set((hl||[]).map(norm));
  lines.forEach((ws,li)=>{const lw=ws.reduce((a,w)=>a+ctx.measureText(w).width,0)+sp*(ws.length-1);let cx=opts.center?x-lw/2:x;const by=y+li*lh;
    // line mask reveal (slide up)
    ws.forEach(w=>{const ww=ctx.measureText(w).width;const p=eo((lt-start-k*.06)/.38);k++;if(p<=0){cx+=ww+sp;return;}
      const on=hs.has(norm(w));
      if(on){const m=eo((lt-start-k*.06-.2)/.35);fr(cx,by+size*.1,ww*m,size*.09,size*.045,opts.mark||(color===INK?INK:LIGHT));}
      ctx.save();ctx.beginPath();ctx.rect(cx-20,by-size*1.02,ww+40,size*1.3);ctx.clip();ctx.font=f;ctx.fillStyle=on?(color===INK?OR:LIGHT):color;ctx.fillText(w,cx,by+(1-p)*size*1.1);ctx.restore();cx+=ww+sp;});});
  return lines.length*lh;}
function serif(t,x,y,size,c,al,alpha){ctx.save();if(alpha!=null)ctx.globalAlpha*=alpha;tx(t,x,y,`italic 500 ${size}px ${FS}`,c,al);ctx.restore();}
function mono(t,x,y,size,c,al,ls){ctx.save();ctx.font=`700 ${size}px ${FM}`;ctx.letterSpacing=(ls||2)+'px';ctx.fillStyle=c;ctx.textAlign=al||'left';ctx.fillText(t,x,y);ctx.restore();}
function tag(t,x,y,dark){ctx.save();ctx.font=`700 26px ${FM}`;ctx.letterSpacing='4px';const s=t.toUpperCase(),w=ctx.measureText(s).width+48;
  fr(x,y,w,56,8,dark?OR:INK);ctx.fillStyle=dark?WHITE:PAPER;ctx.fillText(s,x+24,y+38);ctx.restore();return w;}

/* ---------- icons ---------- */
function icon(kind,cx,cy,s,c){ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=s*.09;ctx.lineCap='round';ctx.lineJoin='round';
  if(kind==='chart'){[[-.3,.1],[-.05,-.12],[.2,-.3]].forEach(([x,h],i)=>{ctx.fillRect(x*s,h*s,s*.18,(.32-h)*s);});ctx.beginPath();ctx.moveTo(-.38*s,.34*s);ctx.lineTo(.42*s,.34*s);ctx.stroke();}
  if(kind==='post'){rr(-.32*s,-.32*s,.64*s,.64*s,.1*s);ctx.stroke();ctx.beginPath();ctx.arc(-.1*s,-.1*s,.08*s,0,6.283);ctx.fill();ctx.beginPath();ctx.moveTo(-.28*s,.24*s);ctx.lineTo(-.02*s,0);ctx.lineTo(.12*s,.12*s);ctx.lineTo(.28*s,-.04*s);ctx.stroke();}
  if(kind==='cal'){rr(-.32*s,-.26*s,.64*s,.58*s,.08*s);ctx.stroke();ctx.beginPath();ctx.moveTo(-.32*s,-.08*s);ctx.lineTo(.32*s,-.08*s);ctx.stroke();[-.16,.16].forEach(x=>{ctx.beginPath();ctx.moveTo(x*s,-.36*s);ctx.lineTo(x*s,-.18*s);ctx.stroke();});}
  if(kind==='chat'){rr(-.34*s,-.28*s,.68*s,.46*s,.14*s);ctx.stroke();ctx.beginPath();ctx.moveTo(-.14*s,.18*s);ctx.lineTo(-.24*s,.34*s);ctx.lineTo(.02*s,.18*s);ctx.stroke();}
  if(kind==='spark'){for(let i=0;i<4;i++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.moveTo(0,-.38*s);ctx.lineTo(0,.38*s);ctx.stroke();}}
  ctx.restore();}

/* ---------- scenes ---------- */
// HOOK: typed prompt in an input bar + headline
function scenePrompt(s,lt,d,t){bgPaper(t);
  const k=eo(lt/.4);serif(s.kicker||'',90,420,58,INK,'left',k);
  // input bar
  const p=back(cl((lt-.15)/.45,0,1));ctx.save();ctx.translate(540,600);ctx.scale(.85+.15*p,.85+.15*p);ctx.globalAlpha=cl(p,0,1);ctx.translate(-540,-600);
  card(70,520,940,170,40,WHITE,12);
  const full=s.text||'',n=Math.floor(cl((lt-.45)/1.5,0,1)*full.length),typed=full.slice(0,n);
  const ls=wrap(typed||' ',700,`600 40px ${FT}`);const shown=ls.length?ls.slice(-2):[['']];
  shown.forEach((l,i)=>tx(l.join(' '),120,(shown.length>1?582:622)+i*52,`600 40px ${FT}`,INK));
  if(Math.floor(t*2.4)%2===0||n<full.length){ctx.font=`600 40px ${FT}`;const last=shown[shown.length-1].join(' ');const cw=ctx.measureText(last).width;fr(124+cw,(shown.length>1?582:622)+(shown.length-1)*52-36,5,46,2,OR);}
  const go=n>=full.length;fr(880,550,100,110,30,go?OR:PAPER2);ctx.strokeStyle=go?INK:MUTE;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(930,630);ctx.lineTo(930,580);ctx.moveTo(910,600);ctx.lineTo(930,580);ctx.lineTo(950,600);ctx.stroke();
  ctx.restore();
  headline(s.title||'',90,950,900,124,lt,1.9,INK,s.hl);
  if(s.chart){const cp=eo((lt-.6)/.5);ctx.save();ctx.globalAlpha=cp;ctx.translate(0,(1-cp)*80);card(90,1290,900,440,36,WHITE,12);
    mono((s.chart.label||'').toUpperCase(),130,1360,24,MUTE,'left',3);mono(s.chart.badge||'ILUSTRASI',950,1360,22,MUTE,'right',3);
    const pts=[.35,.3,.42,.38,.5,.62,.7];const x0=140,x1=940,y0=1420,y1=1680;
    ctx.strokeStyle='rgba(20,20,20,.08)';ctx.lineWidth=2;for(let g=0;g<4;g++){const y=y0+g*(y1-y0)/3;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
    const dr=cl((lt-.9)/1.6,0,1),m=dr*(pts.length-1);ctx.strokeStyle=INK;ctx.lineWidth=8;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();
    for(let j=0;j<=Math.floor(m);j++){const x=x0+j*(x1-x0)/(pts.length-1),y=y0+pts[j]*(y1-y0);j?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    const f=m-Math.floor(m),j=Math.floor(m);let hx=x0+j*(x1-x0)/(pts.length-1),hy=y0+pts[j]*(y1-y0);if(j<pts.length-1){hx+=f*(x1-x0)/(pts.length-1);hy+=f*(pts[j+1]-pts[j])*(y1-y0);ctx.lineTo(hx,hy);}ctx.stroke();
    if(dr>0){ctx.fillStyle=OR;ctx.beginPath();ctx.arc(hx,hy,18+Math.sin(t*6)*3,0,6.283);ctx.fill();st(hx-18,hy-18,36,36,18,INK,4);}
    if(dr>=1){const q=back(cl((lt-2.6)/.35,0,1));ctx.save();ctx.translate(hx-20,hy-90);ctx.scale(q,q);tx('?',0,0,`italic 700 120px ${FS}`,OR,'center');ctx.restore();}
    ctx.restore();}
  // side stickers
  (s.chips||[]).forEach((c,i)=>{const q=back(cl((lt-2.3-i*.18)/.35,0,1));if(q<=0)return;ctx.save();ctx.font=`700 34px ${FT}`;const w=ctx.measureText(c).width+56;
    const x=[90,300,160][i%3],y=1470+i*120;ctx.translate(x+w/2,y+36);ctx.rotate((i%2?.04:-.035));ctx.scale(q,q);ctx.translate(-w/2,-36);card(0,0,w,76,38,i===1?OR:WHITE,8);tx(c,28,50,`700 34px ${FT}`,INK);ctx.restore();});}

// STATEMENT: two-line contrast, sans + serif italic, optional dark
function sceneStatement(s,lt,d,t){const dark=s.dark!==false;dark?bgNight(t):bgPaper(t);const c=dark?WHITE:INK;
  // drifting "sheet" fragments
  if(dark)for(let i=0;i<7;i++){const q=eo((lt-i*.08)/.5);const x=(rnd(i)*800+60+Math.sin(t*.6+i)*20),y=280+rnd(i+5)*1300+Math.cos(t*.5+i)*20;ctx.save();ctx.globalAlpha=.16*q;ctx.translate(x,y);ctx.rotate((rnd(i+9)-.5)*.5);
    for(let r=0;r<4;r++)for(let col=0;col<3;col++){st(col*70,r*34,70,34,0,WHITE,2);if(rnd(i*13+r*3+col)>.45)fr(col*70+10,r*34+12,20+rnd(i+r+col)*36,10,4,WHITE);}ctx.restore();}
  const h1=headline(s.line1||'',90,760,900,118,lt,.1,c,s.hl1);
  const q=eo((lt-.9)/.5);ctx.save();ctx.globalAlpha=q;ctx.translate(0,(1-q)*40);
  const ls=wrap(s.line2||'',900,`italic 600 104px ${FS}`);ls.forEach((l,i)=>tx(l.join(' '),90,780+h1+40+i*116,`italic 600 104px ${FS}`,dark?LIGHT:OR));ctx.restore();
  if(s.foot){const r=eo((lt-1.6)/.4);ctx.save();ctx.globalAlpha=r;mono(s.foot.toUpperCase(),90,1720,28,dark?'rgba(255,255,255,.6)':MUTE,'left',4);ctx.restore();}}

// CONNECT: hub & spoke diagram, packets flow to the hub
function sceneConnect(s,lt,d,t){bgPaper(t);tag(s.eyebrow||'',90,300,false);headline(s.title||'',90,480,900,86,lt,.05,INK,s.hl);
  const cx=540,cy=1160,nodes=s.nodes||[],pos=[[230,880],[850,880],[230,1440],[850,1440]];
  nodes.forEach((n,i)=>{const [x,y]=pos[i];const p=eo((lt-n.at)/.5);if(p<=0)return;
    ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.setLineDash([2,16]);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(cx-x)*p,y+(cy-y)*p);ctx.stroke();ctx.restore();
    if(p>=1){for(let k=0;k<2;k++){const u=((t*.9+k*.5+i*.21)%1);ctx.fillStyle=OR;ctx.beginPath();ctx.arc(x+(cx-x)*u,y+(cy-y)*u,11,0,6.283);ctx.fill();}}});
  // hub
  const hp=back(cl((lt-.4)/.5,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(hp,hp);ctx.rotate(Math.sin(t)*.03);
  fr(-150+14,-150+14,300,300,70,INK);fr(-150,-150,300,300,70,OR);st(-150,-150,300,300,70,INK,6);icon('spark',0,-34,110,INK);tx(s.hub||'Claude',0,90,`900 58px ${FD}`,INK,'center');ctx.restore();
  nodes.forEach((n,i)=>{const [x,y]=pos[i];const q=back(cl((lt-n.at)/.4,0,1));if(q<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(q,q);
    card(-180,-110,360,220,30,WHITE,10);fr(-150,-84,76,76,20,PAPER2);icon(n.icon||'chart',-112,-46,64,INK);
    tx(n.label,-150,40,`800 34px ${FD}`,INK);const ls=wrap(n.sub||'',300,`500 24px ${FT}`);ls.slice(0,1).forEach(l=>tx(l.join(' '),-150,80,`500 24px ${FT}`,MUTE));ctx.restore();});
  if(s.note){const r=eo((lt-2.4)/.4);ctx.save();ctx.globalAlpha=r;serif(s.note,540,1760,44,INK,'center');ctx.restore();}}

// DASHBOARD: question bubble + streamed answer with animated bar chart, hour heat strip, insight bullets
function sceneDashboard(s,lt,d,t){bgPaper(t);tag(s.eyebrow||'',90,280,false);headline(s.title||'',90,450,900,80,lt,.05,INK,s.hl);
  // user question bubble (right)
  const q=s.question||'';const qp=eo((lt-.3)/.4);ctx.save();ctx.globalAlpha=qp;ctx.translate((1-qp)*80,0);
  const ql=wrap(q,620,`600 36px ${FT}`);const qh=ql.length*48+52;const qw=Math.max(...ql.map(l=>{ctx.font=`600 36px ${FT}`;return ctx.measureText(l.join(' ')).width;}))+64;
  card(1000-qw,600,qw,qh,30,OR,8);ql.forEach((l,i)=>tx(l.join(' '),1000-qw+32,600+52+i*48,`600 36px ${FT}`,INK));ctx.restore();
  // answer panel
  const top=600+qh+50,ap=eo((lt-1.0)/.5);if(ap<=0)return;ctx.save();ctx.globalAlpha=ap;ctx.translate(0,(1-ap)*60);
  card(70,top,940,1700-top,36,WHITE,12);
  fr(110,top+40,64,64,20,OR);icon('spark',142,top+72,44,INK);tx(s.who||'Claude',192,top+84,`800 34px ${FD}`,INK);
  mono(s.badge||'ILUSTRASI',970,top+82,22,MUTE,'right',3);
  // bar chart
  const bars=s.bars||[],bx=120,by=top+140,bw=840,bh=300;mono((s.barsTitle||'').toUpperCase(),bx,by+10,22,MUTE,'left',3);
  const n=bars.length,gap=34,colW=(bw-gap*(n-1))/n;
  bars.forEach((b,i)=>{const g=eo((lt-1.4-i*.15)/.6);const h=(bh-70)*b.v*g;const x=bx+i*(colW+gap),y0=by+bh-10;
    fr(x,y0-h,colW,h,14,b.hot?OR:INK);if(b.hot&&g>.9){const pulse=1+Math.sin(t*5)*.05;ctx.save();ctx.translate(x+colW/2,y0-h-34);ctx.scale(pulse,pulse);icon('spark',0,0,40,OR);ctx.restore();}
    tx(b.label,x+colW/2,y0+40,`700 28px ${FT}`,INK,'center');});
  // hour heat strip
  const hy=by+bh+90;mono((s.heatTitle||'').toUpperCase(),bx,hy,22,MUTE,'left',3);
  const cells=12,cw=(bw-11*8)/cells,hot=s.heat||[];for(let i=0;i<cells;i++){const g=eo((lt-2.2-i*.04)/.3);const v=hot.includes(i)?1:(.15+rnd(i+3)*.35);ctx.save();ctx.globalAlpha=g;
    fr(bx+i*(cw+8),hy+20,cw,64,10,hot.includes(i)?OR:`rgba(20,20,20,${v*.5})`);ctx.restore();}
  // insights
  (s.insights||[]).forEach((it,i)=>{const r=eo((lt-it.at)/.35);if(r<=0)return;const y=hy+150+i*76;ctx.save();ctx.globalAlpha=r;ctx.translate((1-r)*-40,0);
    fr(bx,y-26,30,30,8,OR);ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx+7,y-11);ctx.lineTo(bx+13,y-5);ctx.lineTo(bx+24,y-19);ctx.stroke();
    tx(it.text,bx+52,y,`600 34px ${FT}`,INK);ctx.restore();});
  ctx.restore();}

// STACK: index cards dealt one by one, serif numerals
function sceneStack(s,lt,d,t){bgNight(t);tag(s.eyebrow||'',90,300,true);headline(s.title||'',90,470,900,86,lt,.05,WHITE,s.hl);
  const items=s.items||[];items.forEach((it,i)=>{const q=back(cl((lt-.8-i*.45)/.45,0,1));if(q<=0)return;const y=700+i*300;const rot=[-.025,.02,-.015][i%3];
    ctx.save();ctx.translate(540+(1-q)*700,y+120);ctx.rotate(rot+(1-q)*.3);ctx.translate(-450,-120);ctx.globalAlpha=cl(q,0,1);
    fr(12,12,900,240,30,OR);fr(0,0,900,240,30,PAPER);st(0,0,900,240,30,INK,5);
    tx(String(i+1).padStart(2,'0'),50,170,`italic 600 140px ${FS}`,OR);
    tx(it.title,250,108,`900 50px ${FD}`,INK);const ls=wrap(it.sub||'',600,`500 32px ${FT}`);ls.slice(0,2).forEach((l,j)=>tx(l.join(' '),250,158+j*40,`500 32px ${FT}`,INK2));ctx.restore();});
  if(s.note){const r=eo((lt-2.6)/.4);ctx.save();ctx.globalAlpha=r;serif(s.note,540,1700,42,SOFT,'center');ctx.restore();}}

// CTA: paper, big headline, orange pill, marquee
function sceneCta(s,lt,d,t){bgPaper(t);const hh=headline(s.text||'',540,720,920,112,lt,.05,INK,s.hl,{center:true});
  const p=back(cl((lt-.8)/.45,0,1));ctx.save();ctx.translate(540,820+hh);ctx.scale(p,p);ctx.font=`900 60px ${FD}`;const w=ctx.measureText(s.button).width+130;
  fr(-w/2+14,-64+14,w,128,64,INK);fr(-w/2,-64,w,128,64,OR);st(-w/2,-64,w,128,64,INK,6);tx(s.button,0,20,`900 60px ${FD}`,INK,'center');ctx.restore();
  const q=eo((lt-1.3)/.5);ctx.save();ctx.globalAlpha=q;serif(s.sub||'',540,1000+hh,44,INK,'center');ctx.restore();
  // marquee band
  ctx.save();ctx.translate(0,1560);ctx.rotate(-.05);fr(-100,0,W+200,110,0,INK);const m=(s.marquee||'SIMPAN · SHARE · DM').toUpperCase()+'   ✦   ';ctx.font=`800 50px ${FD}`;const mw=ctx.measureText(m).width;
  let x=-((t*160)%mw)-100;while(x<W+100){tx(m,x,74,`800 50px ${FD}`,PAPER);x+=mw;}ctx.restore();}

const SC={prompt:scenePrompt,statement:sceneStatement,connect:sceneConnect,dashboard:sceneDashboard,stack:sceneStack,cta:sceneCta};
const DARK={statement:s=>s.dark!==false,stack:()=>true};

function chrome(t,i,dark){const c=dark?'rgba(255,255,255,.85)':INK;const n=S.scenes.length;
  mono(String(i+1).padStart(2,'0')+' / '+String(n).padStart(2,'0'),90,150,28,c,'left',4);
  ctx.save();ctx.font=`900 30px ${FD}`;ctx.letterSpacing='3px';ctx.fillStyle=c;ctx.textAlign='right';ctx.fillText('HANS CREATIVE',990,150);ctx.restore();
  const f=cl((t-starts[i])/S.scenes[i].dur,0,1);fr(90,186,900,4,2,dark?'rgba(255,255,255,.18)':'rgba(20,20,20,.15)');fr(90,186,900*f,4,2,OR);}
// shutter transition: 6 vertical bars drop in then out
function coverShutter(tt){const u=(tt+.25)/.5;if(u>0&&u<1){const n=6,bw=W/n;for(let k=0;k<n;k++){const v=cl(u*1.6-k*.1,0,1);const a=v<.5?eio(v*2):1,b=v<.5?0:eio((v-.5)*2);ctx.fillStyle=k%2?OR:INK;ctx.fillRect(k*bw,b*H,bw+1,(a-b)*H);}}}
function shutter(t){for(let i=1;i<starts.length;i++){const u=(t-starts[i]+.25)/.5;if(u>0&&u<1){const n=6,bw=W/n;for(let k=0;k<n;k++){const v=cl(u*1.6-k*.1,0,1);
  const a=v<.5?eio(v*2):1,b=v<.5?0:eio((v-.5)*2);ctx.fillStyle=k%2?OR:INK;ctx.fillRect(k*bw,b*H,bw+1,(a-b)*H);}}}}

/* cover: static title card for the first spec.cover.dur seconds (first frame = thumbnail) */
let COVER=0;
function sceneCover(c){bgPaper(0);
  mono('HANS CREATIVE',90,300,30,INK,'left',6);fr(90,322,900,4,2,INK);
  if(c.eyebrow)tag(c.eyebrow,90,420,false);
  if(c.kicker)serif(c.kicker,90,580,58,INK,'left');
  const hh=headline(c.title||'',90,c.kicker?760:700,900,c.size||128,99,0,INK,c.hl);
  if(c.sub){const ls=wrap(c.sub,900,`italic 600 60px ${FS}`);ls.slice(0,2).forEach((l,i)=>tx(l.join(' '),90,(c.kicker?760:700)+hh+50+i*72,`italic 600 60px ${FS}`,OR));}
  card(90,1460,900,150,40,OR,12);ctx.fillStyle=WHITE;ctx.beginPath();ctx.moveTo(150,1505);ctx.lineTo(150,1565);ctx.lineTo(198,1535);ctx.closePath();ctx.fill();
  tx(c.badge||'Tonton sampai habis',232,1552,`900 50px ${FD}`,WHITE);}
window.setup=async function(spec){S=spec;usePal(spec.palette||'hans');COVER=spec.cover?(spec.cover.dur||0.6):0;let a=0;starts=S.scenes.map(s=>{const v=a;a+=s.dur;return v;});TOTAL=a;
  await document.fonts.load('900 96px "Inter Display"');await document.fonts.load('700 30px "Inter"');await document.fonts.load('italic 600 60px "Lora"');await document.fonts.load('700 30px "Liberation Mono"');
  cv=document.createElement('canvas');cv.width=W;cv.height=H;ctx=cv.getContext('2d');document.body.appendChild(cv);return {duration:TOTAL+COVER,cues:starts.map(v=>v+COVER)};};
window.frame=function(t){if(COVER){if(t<COVER){ctx.save();sceneCover(S.cover);ctx.restore();coverShutter(t-COVER);return cv.toDataURL('image/jpeg',.9);}t-=COVER;}let i=starts.length-1;while(i>0&&t<starts[i])i--;const s=S.scenes[i],lt=t-starts[i];
  ctx.save();SC[s.type](s,lt,s.dur,t);ctx.restore();chrome(t,i,DARK[s.type]?DARK[s.type](s):false);shutter(t);if(COVER)coverShutter(t);
  return cv.toDataURL('image/jpeg',.9);};
})();
