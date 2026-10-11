import { useEffect, useRef, type RefObject } from "react";

import { readTokenColor } from "@/lib/color";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type HeroShaderState = { intro: number; scroll: number };

const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Moving clouds on a light ground, like the light spilling behind the Contact
// headline: big blurred pools of teal (the lead colour) with a little lime and
// coral, a faint drifting blush of magenta pink, and two layers of bright cloud billows drifting fast across them (the
// far layer slower than the near one, for depth).
const fragmentSource = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;
uniform float uScroll;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uTeal;
uniform vec3 uAqua;
uniform vec3 uLime;
uniform vec3 uCoral;
uniform vec3 uMagenta;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// A soft pool of colour centred on c, radius r.
float pool(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 1.5;

  // The pointer gently parts the clouds.
  float md = length(p - uMouse);
  p += (p - uMouse) * 0.12 * exp(-md * md * 4.0);

  // Cloud wisps: a fast-moving warp field bends every pool's edge.
  vec2 wind = vec2(t * 0.22, t * 0.06);
  vec2 warp = vec2(fbm(p * 1.3 + wind), fbm(p * 1.3 + vec2(5.2, 1.3) - wind * 0.8)) - 0.5;
  vec2 w = p + warp * 0.55;

  float aspect = uRes.x / uRes.y;
  float sx = aspect * 0.5;

  // Pools sweep across on their own loops. Teal leads; lime and coral are accents.
  vec2 c1 = vec2(sin(t * 0.21) * sx * 0.9 - sx * 0.25, cos(t * 0.17) * 0.28 + 0.12);
  vec2 c2 = vec2(cos(t * 0.18 + 1.7) * sx * 0.85 + sx * 0.3, sin(t * 0.23 + 0.6) * 0.3 - 0.05);
  vec2 c3 = vec2(sin(t * 0.15 + 3.1) * sx * 0.7, cos(t * 0.2 + 2.2) * 0.32 - 0.22);
  vec2 c4 = vec2(cos(t * 0.24 + 4.0) * sx * 0.8 + sx * 0.35, sin(t * 0.19 + 1.1) * 0.3 + 0.2);
  vec2 c5 = vec2(sin(t * 0.27 + 5.3) * sx * 0.6, cos(t * 0.21 + 3.7) * 0.25 - 0.05);
  vec2 c6 = vec2(cos(t * 0.2 + 2.4) * sx * 0.75, sin(t * 0.25 + 4.6) * 0.3 + 0.1);

  vec3 col = uBase;
  col = mix(col, uAqua, pool(w, c1, 0.55) * 0.85);
  col = mix(col, uTeal, pool(w, c2, 0.5) * 0.8);
  col = mix(col, uDeep, pool(w, c3, 0.34) * 0.45);
  col = mix(col, uLime, pool(w, c4, 0.36) * 0.6);
  // Coral is lifted toward white first, so it blooms as a peach blush instead
  // of muddying the teal underneath.
  col = mix(col, mix(uCoral, vec3(1.0), 0.5), pool(w, c5, 0.3) * 0.5);
  // Magenta pink: just an essence, lifted toward white like the coral.
  col = mix(col, mix(uMagenta, vec3(1.0), 0.45), pool(w, c6, 0.26) * 0.32);

  // Bright cloud billows: a big, slower far layer and a denser, faster near
  // layer, each with a soft shaded underside so they read as clouds.
  float far = fbm(p * vec2(1.1, 1.8) + wind * 1.4 + warp * 0.9);
  float near = fbm(p * vec2(2.0, 3.2) - vec2(wind.x * 2.6, wind.y) + warp * 1.4);
  float clouds = smoothstep(0.46, 0.76, far) * 0.6 + smoothstep(0.5, 0.8, near) * 0.45;
  float shade = smoothstep(0.42, 0.6, far) - smoothstep(0.5, 0.7, far);
  col = mix(col, uDeep, shade * 0.05);
  col = mix(col, vec3(1.0), clamp(clouds, 0.0, 0.78));

  col = mix(uBase, col, uIntro);
  col = mix(col, uBase, clamp(uScroll, 0.0, 1.0) * 0.85);
  // Fine grain keeps the gradient from banding.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (4.0 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Full-bleed hero background. Renders at reduced resolution (it is a soft
 * gradient) and pauses whenever the hero is off screen.
 */
export function HeroShader({
  className,
  stateRef,
}: {
  className?: string;
  stateRef: RefObject<HeroShaderState>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uRes = uniform("uRes");
    const uTime = uniform("uTime");
    const uMouse = uniform("uMouse");
    const uIntro = uniform("uIntro");
    const uScroll = uniform("uScroll");
    const tokens: [string, string][] = [
      ["uBase", "--ivory"],
      ["uDeep", "--deep-teal"],
      ["uTeal", "--accent"],
      ["uAqua", "--interactive"],
      ["uLime", "--teal"],
      ["uCoral", "--glow"],
      ["uMagenta", "--magenta"],
    ];
    for (const [name, token] of tokens) gl.uniform3fv(uniform(name), readTokenColor(token));

    const mouse = { x: 0.4, y: 0, tx: 0.4, ty: 0 };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left - rect.width / 2) / rect.height;
      mouse.ty = -(event.clientY - rect.top - rect.height / 2) / rect.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersection.observe(canvas);

    const still = prefersReducedMotion();
    const start = performance.now();
    let frame = 0;
    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const state = stateRef.current;
      gl.uniform1f(uTime, still ? 8 : (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntro, state?.intro ?? 1);
      gl.uniform1f(uScroll, state?.scroll ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (visible) draw();
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      resizeObserver.disconnect();
      intersection.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [stateRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full", className)} />;
}
