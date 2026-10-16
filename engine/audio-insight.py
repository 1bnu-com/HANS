# Soundtrack for the "insight" template: lo-fi groove (90 bpm, D minor), typing clicks on prompt scenes,
# shutter thumps at scene changes, soft plucks on items. usage: python3 engine/audio-insight.py spec.json out.wav
import sys, json, numpy as np, wave
spec=json.load(open(sys.argv[1]));sc=spec['scenes'];durs=[s['dur'] for s in sc];dur=sum(durs);starts=np.cumsum([0]+durs[:-1])
sr=44100;t=np.arange(int(sr*dur))/sr;out=np.zeros_like(t);rng=np.random.default_rng(7)
bpm=90;beat=60/bpm;bar=beat*4
chords=[[146.83,174.61,220.0,261.63],[196.0,233.08,293.66,349.23],[233.08,293.66,349.23,440.0],[220.0,277.18,329.63,392.0]];bass=[73.42,98.0,58.27,55.0]
def add(s,length,sig):
  a=int(s*sr);b=min(len(t),a+len(sig))
  if a<len(t) and b>a: out[a:b]+=sig[:b-a]
i=0
while i*bar<dur:
  s=i*bar;n=int(bar*sr);tt=np.arange(n)/sr;env=np.minimum(1,tt/0.4)*np.exp(-tt*0.35)
  pad=sum(np.sin(2*np.pi*f*tt+0.3*np.sin(2*np.pi*0.5*tt)) for f in chords[i%4])*0.035*env
  add(s,bar,pad)
  for k in (0,2.5):
    m=int(beat*1.2*sr);tb=np.arange(m)/sr;add(s+k*beat,beat,0.16*np.exp(-tb*3)*np.sin(2*np.pi*bass[i%4]*tb))
  for k in range(8):
    if rng.random()<.6:
      f=chords[i%4][rng.integers(0,4)]*2;m=int(0.3*sr);tb=np.arange(m)/sr;add(s+k*beat/2,0.3,0.045*np.exp(-tb*9)*np.sin(2*np.pi*f*tb))
  i+=1
for k in range(int(dur/beat)+1):
  s=k*beat;m=int(.3*sr);tb=np.arange(m)/sr
  if k%2==0: add(s,.3,0.42*np.exp(-tb*14)*np.sin(2*np.pi*(48+70*np.exp(-tb*25))*tb))
  else: add(s,.3,0.16*np.exp(-tb*22)*rng.uniform(-1,1,m)*(0.6+0.4*np.sin(2*np.pi*190*tb)))
  m2=int(.04*sr);add(s+beat/2,.04,0.035*np.exp(-np.arange(m2)/sr*90)*rng.uniform(-1,1,m2))
# shutter thump + rising noise
for s in starts[1:]:
  m=int(.5*sr);tb=np.arange(m)/sr;n=np.convolve(rng.uniform(-1,1,m),np.ones(30)/30,'same');add(s-.25,.5,0.25*np.sin(np.pi*tb/.5)**2*n)
  m=int(.25*sr);tb=np.arange(m)/sr;add(s,.25,0.35*np.exp(-tb*20)*np.sin(2*np.pi*(90-40*tb)*tb))
# typing clicks during prompt typing
for st,s in zip(starts,sc):
  if s['type']=='prompt':
    nch=len(s.get('text',''));
    for j in range(nch):
      c=st+.45+1.5*j/max(1,nch);m=int(.02*sr);add(c,.02,0.09*np.exp(-np.arange(m)/sr*300)*rng.uniform(-1,1,m))
  pops=[]
  for key in ('nodes','insights'):
    for it in s.get(key,[]) or []:
      if 'at' in it: pops.append(st+it['at'])
  if s['type']=='stack': pops+= [st+.8+k*.45 for k in range(len(s.get('items',[])))]
  if s['type']=='dashboard': pops+= [st+1.4+k*.15 for k in range(len(s.get('bars',[])))]
  for p in pops:
    m=int(.2*sr);tb=np.arange(m)/sr;add(p,.2,0.16*np.exp(-tb*25)*(np.sin(2*np.pi*1175*tb)+.5*np.sin(2*np.pi*1760*tb)))
out*=np.minimum(1,np.minimum(t/0.3,(dur-t)/1.0));out=out/np.max(np.abs(out))*0.7
w=wave.open(sys.argv[2],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
