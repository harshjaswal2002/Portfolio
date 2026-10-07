'use strict';
// Local WebGL artwork: a reflective parametric form driven by the document's scroll.
class ScrollSculpture {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!this.gl) throw new Error('WebGL unavailable');
    const gl = this.gl;
    const vertex = `
      precision highp float;
      attribute vec2 aUV;
      uniform float uAspect, uRotation, uMorph, uScale, uX, uY;
      varying vec3 vNormal, vPosition;
      const float PI = 3.14159265359;
      vec3 curve(float u) { float r=1.6+0.36*cos(3.0*u);return vec3(r*cos(2.0*u),0.64*sin(3.0*u),r*sin(2.0*u)); }
      vec3 shape(vec2 uv) {
        float u=uv.x*PI*2.0,v=uv.y*PI*2.0;
        vec3 c=curve(u),t=normalize(curve(u+0.006)-curve(u-0.006));
        vec3 n=normalize(vec3(cos(2.0*u),0.3*sin(3.0*u),sin(2.0*u)));
        vec3 b=normalize(cross(t,n)); n=normalize(cross(b,t));
        vec3 knot=c+0.4*(cos(v)*n+sin(v)*b);
        vec3 sphere=1.48*vec3(cos(u)*sin(v*0.5),cos(v*0.5),sin(u)*sin(v*0.5));
        sphere*=1.0+0.055*sin(5.0*u+v*2.0)*sin(v*0.5);
        return mix(sphere,knot,uMorph);
      }
      mat3 rotateY(float a) {return mat3(cos(a),0.0,-sin(a),0.0,1.0,0.0,sin(a),0.0,cos(a));}
      mat3 rotateX(float a) {return mat3(1.0,0.0,0.0,0.0,cos(a),sin(a),0.0,-sin(a),cos(a));}
      void main() {
        vec3 p=shape(aUV);
        vec3 du=shape(aUV+vec2(0.001,0.0))-shape(aUV-vec2(0.001,0.0));
        vec3 dv=shape(aUV+vec2(0.0,0.001))-shape(aUV-vec2(0.0,0.001));
        mat3 rot=rotateY(uRotation)*rotateX(0.4+0.1*sin(uRotation));
        vNormal=rot*normalize(cross(du,dv));
        p=rot*p;vPosition=p;
        float perspective=5.8/(5.8-p.z);
        gl_Position=vec4((p.x*uScale*perspective+uX)/uAspect,p.y*uScale*perspective+uY,-p.z*0.1,1.0);
      }
    `;
    const fragment = `
      precision highp float;
      varying vec3 vNormal,vPosition;
      uniform vec3 uTint;
      float strip(float v,float center,float width) {return 1.0-smoothstep(width*0.2,width,abs(v-center));}
      void main() {
        vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;
        vec3 view=normalize(vec3(0.0,0.0,5.8)-vPosition);
        vec3 r=reflect(-view,n);
        vec3 dark=vec3(0.12,0.14,0.14),light=vec3(0.91,0.91,0.86);
        float env=0.5+0.5*r.y;
        vec3 color=mix(dark,light,smoothstep(0.1,0.87,env));
        color*=0.47+0.53*smoothstep(-0.46,-0.16,r.y);
        float band=strip(r.x+0.34*r.z,0.28,0.21)*smoothstep(-0.4,0.2,r.y);
        float band2=strip(r.z-0.2*r.y,0.1,0.09);
        color=mix(color,vec3(1.0,0.99,0.91),band*0.82);
        color+=vec3(0.40,0.40,0.34)*band2;
        float warm=strip(r.x-0.5*r.z,-0.7,0.45)*(1.0-smoothstep(-0.2,0.6,r.y));
        color=mix(color,uTint,warm*0.8);
        float fresnel=pow(1.0-max(dot(n,view),0.0),3.0);
        color=mix(color,vec3(0.91,0.92,0.85),fresnel*0.35);
        color*=0.82+0.18*max(dot(n,normalize(vec3(-1.0,1.8,2.0))),0.0);
        gl_FragColor=vec4(color,1.0);
      }
    `;
    const compile = (type, source) => {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    this.program = gl.createProgram();
    gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
    gl.useProgram(this.program);
    const points = [], indices = [], rows = 144, columns = 40;
    for (let row=0;row<=rows;row++) for (let col=0;col<=columns;col++) points.push(row/rows, 0.002+col/columns*0.996);
    for (let row=0;row<rows;row++) for (let col=0;col<columns;col++) {
      const a=row*(columns+1)+col,b=a+columns+1;indices.push(a,b,a+1,b,b+1,a+1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
    const location=gl.getAttribLocation(this.program,'aUV');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    this.count=indices.length;this.uniforms={};
    ['uAspect','uRotation','uMorph','uScale','uX','uY','uTint'].forEach(name=>this.uniforms[name]=gl.getUniformLocation(this.program,name));
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
    this.resize();
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.hidden=true;document.documentElement.classList.remove('webgl-ready');});
  }
  resize() {
    const ratio=Math.min(window.devicePixelRatio||1,1.35);
    this.canvas.width=Math.round(window.innerWidth*ratio);this.canvas.height=Math.round(window.innerHeight*ratio);
    this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
  }
  render(state) {
    const gl=this.gl,u=this.uniforms;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(u.uAspect,this.canvas.width/this.canvas.height);
    gl.uniform1f(u.uRotation,state.rotation);gl.uniform1f(u.uMorph,state.morph);
    gl.uniform1f(u.uScale,state.scale);gl.uniform1f(u.uX,state.x);gl.uniform1f(u.uY,state.y);
    gl.uniform3fv(u.uTint,state.tint);gl.drawElements(gl.TRIANGLES,this.count,gl.UNSIGNED_SHORT,0);
  }
}
