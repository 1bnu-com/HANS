# Soundtrack generator for story template: music bed + whoosh at scene changes + optional pops.
# usage: python3 engine/audio.py spec.json out.wav
import sys, json, numpy as np, wave
spec=json.load(open(sys.argv[1]))
if spec.get('cover'): spec['scenes']=[{'type':'cover','dur':spec['cover'].get('dur',0.6)}]+spec['scenes']
durs=[s['dur'] for s in spec['scenes']];dur=sum(durs);starts=np.cumsum([0]+durs[:-1])
sr=44100;t=np.arange(int(sr*dur))/sr;out=np.zeros_like(t);rng=np.random.default_rng(len(spec['scenes']))
bpm=104;beat=60/bpm;bar=beat*4
chords=[[220.0,261.63,329.63],[174.61,220.0,261.63],[261.63,329.63,392.0],[196.0,246.94,293.66]];bass=[55.0,43.65,65.41,49.0]
i=0
while i*bar<dur:
  s=i*bar;m=(t>=s)&(t<s+bar);tt=t[m]-s;env=np.minimum(1,tt/0.25)*np.exp(-tt*0.4)
  for f in chords[i%4]: out[m]+=0.07*env*(np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*2*f*tt))
  out[m]+=0.15*env*np.sin(2*np.pi*bass[i%4]*tt)
  for k in range(8):
    s2=s+k*beat/2;m2=(t>=s2)&(t<s2+0.18);tt2=t[m2]-s2;out[m2]+=0.05*np.exp(-tt2*14)*np.sin(2*np.pi*chords[i%4][k%3]*2*tt2)
  i+=1
for k in range(int(dur/beat)+1):
  s=k*beat;m=(t>=s)&(t<s+0.25);tt=t[m]-s;out[m]+=0.38*np.exp(-tt*18)*np.sin(2*np.pi*(52+90*np.exp(-tt*30))*tt)
  s2=s+beat/2;m=(t>=s2)&(t<s2+0.05);tt=t[m]-s2;out[m]+=0.05*np.exp(-tt*80)*rng.uniform(-1,1,m.sum())
  if k%2==1:
    m=(t>=s)&(t<s+0.15);tt=t[m]-s;out[m]+=0.12*np.exp(-tt*25)*rng.uniform(-1,1,m.sum())
for s in starts[1:]:
  a=s-0.3;m=(t>=a)&(t<a+0.6);tt=t[m]-a;n=rng.uniform(-1,1,m.sum());out[m]+=0.35*np.sin(np.pi*tt/0.6)**2*np.convolve(n,np.ones(8)/8,'same')
pops=[]
for st,sc in zip(starts,spec['scenes']):
  for key in ('items','actions'):
    for it in sc.get(key,[]) or []:
      if isinstance(it,dict) and 'at' in it: pops.append(st+it['at'])
  for msg in sc.get('messages',[]) or []: pops.append(st+msg['at'])
for p in pops:
  m=(t>=p)&(t<p+0.12);tt=t[m]-p;out[m]+=0.22*np.exp(-tt*40)*np.sin(2*np.pi*(900-3000*tt)*tt)
out*=np.minimum(1,np.minimum(t/0.3,(dur-t)/1.0));out=out/np.max(np.abs(out))*0.7
w=wave.open(sys.argv[2],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
