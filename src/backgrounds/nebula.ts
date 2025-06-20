import * as PIXI from 'pixi.js';

export class NebulaBackground {
  app: PIXI.Application;
  bg: PIXI.Graphics;
  startTime: number;

  constructor(app: PIXI.Application) {
    this.app = app;

    const vertex = `
      precision mediump float;

      attribute vec2 aVertexPosition;
      attribute vec2 aTextureCoord;

      uniform mat3 projectionMatrix;

      varying vec2 vTextureCoord;

      void main() {
          vTextureCoord = aTextureCoord;
          gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision mediump float;

      uniform float uTime;
      uniform vec2 uResolution;

      float random(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f*f*(3.0 - 2.0*f);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          vec2 pos = uv * 8.0 + vec2(uTime * 0.05, uTime * 0.03);

          float n = noise(pos);
          float nebula = smoothstep(0.2, 1.0, n);

          vec3 color = mix(vec3(0.02, 0.0, 0.1), vec3(0.3, 0.1, 0.5), nebula);
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new PIXI.Geometry()
    .addAttribute(
        'aVertexPosition',
        [
            -1, -1, // bottom left
            1, -1, // bottom right
            1,  1, // top right
            -1,  1  // top left
        ],
    )

    const uniformGroup = new PIXI.UniformGroup({
      uTime:{
        value:1, type:'f32',
      }
    });

    const shader = PIXI.Shader.from({ 
      gl: {vertex, fragment},
    })

    const quad = new PIXI.Mesh(geometry, shader)
    
    this.bg = new PIXI.Graphics();
    this.bg.fill(0x000000)
        .roundRect(0, 0, app.renderer.width, app.renderer.height)

    this.bg.filters = [this.shader];

    this.app.stage.addChildAt(this.bg, 0); // put as the very first background layer
    this.startTime = Date.now();

    this.app.ticker.add(this.update, this);
  }

  update() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.shader.uniforms.time = elapsed;
  }
}