// Mini WebGL2 renderer for the HANS CREATIVE office (offline, no external libs).
// Static lit geometry is baked into one buffer; dynamic + textured meshes draw separately.
(function(){
const M4={
  id(){return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];},
  mul(a,b){const o=new Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;},
  tr(x,y,z){const m=M4.id();m[12]=x;m[13]=y;m[14]=z;return m;},
  ry(t){const c=Math.cos(t),s=Math.sin(t);return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];},
  rx(t){const c=Math.cos(t),s=Math.sin(t);return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];},
  persp(fov,asp,n,f){const t=1/Math.tan(fov/2);return [t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)/(n-f),-1, 0,0,2*f*n/(n-f),0];},
  ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0, 0,2/(t-b),0,0, 0,0,-2/(f-n),0, -(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1];},
  look(e,c,u){let z=norm(sub(e,c)),x=norm(cross(u,z)),y=cross(z,x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,e),-dot(y,e),-dot(z,e),1];},
  apply(m,p){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12], m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13], m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];},
  applyN(m,n){const v=[m[0]*n[0]+m[4]*n[1]+m[8]*n[2], m[1]*n[0]+m[5]*n[1]+m[9]*n[2], m[2]*n[0]+m[6]*n[1]+m[10]*n[2]];return norm(v);}
};
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(a){const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];}

/* Geometry: arrays of triangles {p:[], n:[], uv:[]} centered like three.js */
function G(){return {p:[],n:[],uv:[]};}
function quad(g,a,b,c,d,n,uvs){[[a,b,c],[a,c,d]].forEach((tri,i)=>{tri.forEach((v,j)=>{g.p.push(...v);g.n.push(...n);
  const uv=uvs?(i?[uvs[0],uvs[2],uvs[3]]:[uvs[0],uvs[1],uvs[2]])[j]:[0,0];g.uv.push(...uv);});});}
function boxG(w,h,d){const g=G(),x=w/2,y=h/2,z=d/2;
  quad(g,[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z],[0,0,1]);quad(g,[x,-y,-z],[-x,-y,-z],[-x,y,-z],[x,y,-z],[0,0,-1]);
  quad(g,[x,-y,z],[x,-y,-z],[x,y,-z],[x,y,z],[1,0,0]);quad(g,[-x,-y,-z],[-x,-y,z],[-x,y,z],[-x,y,-z],[-1,0,0]);
  quad(g,[-x,y,z],[x,y,z],[x,y,-z],[-x,y,-z],[0,1,0]);quad(g,[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z],[0,-1,0]);return g;}
function planeG(w,h){const g=G(),x=w/2,y=h/2;quad(g,[-x,-y,0],[x,-y,0],[x,y,0],[-x,y,0],[0,0,1],[[0,1],[1,1],[1,0],[0,0]]);return g;}
function cylG(rt,rb,h,seg){const g=G(),y=h/2;seg=seg||20;const sl=(rb-rt)/h;
  for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2;
    const c0=[Math.sin(a0),Math.cos(a0)],c1=[Math.sin(a1),Math.cos(a1)];
    const n0=norm([c0[0],sl,c0[1]]),n1=norm([c1[0],sl,c1[1]]);
    const A=[rb*c0[0],-y,rb*c0[1]],B=[rb*c1[0],-y,rb*c1[1]],C=[rt*c1[0],y,rt*c1[1]],D=[rt*c0[0],y,rt*c0[1]];
    g.p.push(...A,...B,...C,...A,...C,...D);g.n.push(...n0,...n1,...n1,...n0,...n1,...n0);for(let k=0;k<6;k++)g.uv.push(0,0);
    g.p.push(0,y,0,...D,...C);g.n.push(0,1,0,0,1,0,0,1,0);g.p.push(0,-y,0,...B,...A);g.n.push(0,-1,0,0,-1,0,0,-1,0);for(let k=0;k<6;k++)g.uv.push(0,0);}
  return g;}
function sphereG(r,ws,hs,thetaLen,flat){const g=G();thetaLen=thetaLen||Math.PI;
  const P=(i,j)=>{const ph=i/ws*Math.PI*2,th=j/hs*thetaLen;return [-r*Math.cos(ph)*Math.sin(th),r*Math.cos(th),r*Math.sin(ph)*Math.sin(th)];};
  for(let j=0;j<hs;j++)for(let i=0;i<ws;i++){const a=P(i,j),b=P(i,j+1),c=P(i+1,j+1),d=P(i+1,j);
    for(const tri of [[a,b,c],[a,c,d]]){const fn=norm(cross(sub(tri[1],tri[0]),sub(tri[2],tri[0])));
      tri.forEach(v=>{g.p.push(...v);g.n.push(...(flat?fn:norm(v)));g.uv.push(0,0);});}}
  return g;}
function torusG(R,r,rs,ts){const g=G();const P=(i,j)=>{const u=i/ts*Math.PI*2,v=j/rs*Math.PI*2;
  return [[(R+r*Math.cos(v))*Math.cos(u),(R+r*Math.cos(v))*Math.sin(u),r*Math.sin(v)],[Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v)]];};
  for(let i=0;i<ts;i++)for(let j=0;j<rs;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);
    for(const tri of [[a,b,c],[a,c,d]])tri.forEach(v=>{g.p.push(...v[0]);g.n.push(...v[1]);g.uv.push(0,0);});}
  return g;}

const VS=`#version 300 es
in vec3 aP;in vec3 aN;in vec3 aC;in vec2 aUV;
uniform mat4 uM,uVP,uLVP;out vec3 vN,vC,vW;out vec2 vUV;out vec4 vL;
void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=mat3(uM)*aN;vC=aC;vUV=aUV;vL=uLVP*w;gl_Position=uVP*w;}`;
const FS=`#version 300 es
precision highp float;precision highp sampler2DShadow;
in vec3 vN,vC,vW;in vec2 vUV;in vec4 vL;
uniform sampler2DShadow uSh;uniform sampler2D uTex;uniform int uUseTex,uUnlit;uniform vec3 uTint,uSun,uSky,uGround,uFog,uEye;uniform float uFogN,uFogF;
out vec4 o;
void main(){vec3 base=vC*uTint;if(uUseTex==1)base=texture(uTex,vUV).rgb;
 vec3 col;if(uUnlit==1){col=base;}else{
  vec3 n=normalize(vN);float d=max(dot(n,uSun),0.);
  vec3 p=vL.xyz/vL.w*.5+.5;float s=0.;
  for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)s+=texture(uSh,vec3(p.xy+vec2(x,y)/2048.,p.z-.0015));
  s/=9.;if(p.x<0.||p.x>1.||p.y<0.||p.y>1.)s=1.;
  vec3 hemi=mix(uGround,uSky,n.y*.5+.5)*.78;
  col=base*(hemi+vec3(1.)*d*.62*s);}
 float f=clamp((length(vW-uEye)-uFogN)/(uFogF-uFogN),0.,1.);
 o=vec4(pow(mix(col,uFog,f),vec3(1./1.08)),1.);}`;
const SVS=`#version 300 es
in vec3 aP;uniform mat4 uM,uLVP;void main(){gl_Position=uLVP*uM*vec4(aP,1.);}`;
const SFS=`#version 300 es
precision highp float;out vec4 o;void main(){o=vec4(1.);}`;

function hex(c){return [(c>>16&255)/255,(c>>8&255)/255,(c&255)/255];}
function lin(c){return c.map(v=>Math.pow(v,1.08));}

function Engine(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true});
  if(!gl)throw new Error('no webgl2');
  const prog=mk(VS,FS),sprog=mk(SVS,SFS);
  function mk(v,f){const p=gl.createProgram();for(const [t,s] of [[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));gl.attachShader(p,sh);}gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
  const U={};['uM','uVP','uLVP','uSh','uTex','uUseTex','uUnlit','uTint','uSun','uSky','uGround','uFog','uEye','uFogN','uFogF'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));
  const SU={uM:gl.getUniformLocation(sprog,'uM'),uLVP:gl.getUniformLocation(sprog,'uLVP')};
  // shadow map
  const SM=2048,shTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,shTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,SM,SM,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,shTex,0);
  gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);gl.bindFramebuffer(gl.FRAMEBUFFER,null);

  const sun=norm([10,22,14]);
  const LVP=M4.mul(M4.ortho(-21,21,-21,21,1,70),M4.look([sun[0]*30,sun[1]*30,sun[2]*30],[0,0,0],[0,1,0]));
  const staticBuf={p:[],n:[],c:[],uv:[]};const draws=[];
  function upload(g,colors){const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const put=(loc,data,size)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);};
    put(gl.getAttribLocation(prog,'aP'),g.p,3);put(gl.getAttribLocation(prog,'aN'),g.n,3);
    put(gl.getAttribLocation(prog,'aC'),colors,3);put(gl.getAttribLocation(prog,'aUV'),g.uv,2);
    gl.bindVertexArray(null);return {vao,count:g.p.length/3};}
  const api={M4,
    geo:{box:boxG,plane:planeG,cyl:cylG,sphere:sphereG,torus:torusG},
    // add static lit mesh baked in world space
    addStatic(g,m,color){const c=lin(hex(color));for(let i=0;i<g.p.length;i+=3){const p=M4.apply(m,[g.p[i],g.p[i+1],g.p[i+2]]),n=M4.applyN(m,[g.n[i],g.n[i+1],g.n[i+2]]);
      staticBuf.p.push(...p);staticBuf.n.push(...n);staticBuf.c.push(...c);}staticBuf.uv.push(...g.uv);},
    // dynamic or special mesh; returns handle with .m (matrix), .tint, .unlit, .tex
    add(g,m,color,opt){const d=Object.assign({m,tint:lin(hex(color==null?0xffffff:color)),unlit:false,tex:null,shadow:true},opt||{});
      const cols=[];for(let i=0;i<g.p.length;i+=3)cols.push(1,1,1);Object.assign(d,upload(g,cols));draws.push(d);return d;},
    texture(cv){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cv);gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);return t;},
    finalize(){const s=staticBuf;const g={p:s.p,n:s.n,uv:s.uv};const h=upload(g,s.c);h.m=M4.id();h.tint=[1,1,1];h.unlit=false;h.tex=null;h.shadow=true;draws.unshift(h);},
    render(eye,target,fov,bg){const W=canvas.width,H=canvas.height;
      // shadow pass
      gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.viewport(0,0,SM,SM);gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
      gl.useProgram(sprog);gl.uniformMatrix4fv(SU.uLVP,false,LVP);
      for(const d of draws){if(!d.shadow)continue;gl.uniformMatrix4fv(SU.uM,false,d.m);gl.bindVertexArray(d.vao);gl.drawArrays(gl.TRIANGLES,0,d.count);}
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);
      const b=lin(hex(bg));gl.clearColor(b[0],b[1],b[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);const VP=M4.mul(M4.persp(fov*Math.PI/180,W/H,.1,200),M4.look(eye,target,[0,1,0]));
      gl.uniformMatrix4fv(U.uVP,false,VP);gl.uniformMatrix4fv(U.uLVP,false,LVP);gl.uniform3fv(U.uSun,sun);
      gl.uniform3fv(U.uSky,[1,1,1]);gl.uniform3fv(U.uGround,lin(hex(0xC9D6F2)));gl.uniform3fv(U.uFog,b);gl.uniform3fv(U.uEye,eye);
      gl.uniform1f(U.uFogN,40);gl.uniform1f(U.uFogF,80);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shTex);gl.uniform1i(U.uSh,0);gl.uniform1i(U.uTex,1);
      for(const d of draws){gl.uniformMatrix4fv(U.uM,false,d.m);gl.uniform3fv(U.uTint,d.tint);gl.uniform1i(U.uUnlit,d.unlit?1:0);
        gl.uniform1i(U.uUseTex,d.tex?1:0);if(d.tex){gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,d.tex);}
        gl.bindVertexArray(d.vao);gl.drawArrays(gl.TRIANGLES,0,d.count);}
      api.VP=VP;},
    project(p){const v=api.VP,x=v[0]*p[0]+v[4]*p[1]+v[8]*p[2]+v[12],y=v[1]*p[0]+v[5]*p[1]+v[9]*p[2]+v[13],w=v[3]*p[0]+v[7]*p[1]+v[11]*p[2]+v[15];
      return {x:(x/w*.5+.5),y:(1-(y/w*.5+.5)),vis:w>0};},
    hex,lin};
  return api;
}
window.Engine=Engine;window.M4=M4;
})();
