import { useEffect, useRef, type RefObject } from "react";

import { readTokenColor } from "@/lib/color";
import { cn } from "@/lib/utils";

export type HeroShaderState = { intro: number; scroll: number };

const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Domain-warped fbm "light on paper": bright ivory with slow ribbons of teal,
// lime and coral that bend around the pointer.
const fragmentSource = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;
uniform float uScroll;
uniform vec3 uBase;
uniform vec3 uMint;
uniform vec3 uAccent;
uniform vec3 uLime;
uniform vec3 uGlow;

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

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;

  float md = length(p - uMouse);
  p += (p - uMouse) * 0.18 * exp(-md * md * 3.5);

  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.4 + 3.4 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 1.4 + 3.4 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p * 1.1 + 3.0 * r);

  vec3 col = uBase;
  col = mix(col, uMint, smoothstep(0.25, 0.6, f));
  // Teal leads; lime and coral are only faint hints.
  col = mix(col, uAccent, smoothstep(0.34, 0.7, f) * clamp(length(q) * 1.6, 0.0, 1.0));
  col = mix(col, uLime, smoothstep(0.58, 0.82, r.x) * 0.2);
  col = mix(col, uGlow, smoothstep(0.62, 0.86, r.y) * 0.14);
  col = mix(col, uAccent, 0.35 * exp(-md * md * 5.0));

  // Keep the lower-left calm, where the copy sits.
  float calm = smoothstep(0.75, 0.0, length((uv - vec2(0.15, 0.1)) * vec2(1.2, 1.6)));
  col = mix(col, uBase, calm * 0.55);

  col = mix(uBase, col, uIntro);
  col = mix(col, uBase, clamp(uScroll, 0.0, 1.0) * 0.9);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (3.0 / 255.0);

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
      ["uMint", "--secondary"],
      ["uAccent", "--accent"],
      ["uLime", "--teal"],
      ["uGlow", "--glow"],
    ];
    for (const [name, token] of tokens) gl.uniform3fv(uniform(name), readTokenColor(token));

    const mouse = { x: 0.25, y: 0.1, tx: 0.25, ty: 0.1 };
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

    const start = performance.now();
    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const state = stateRef.current;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntro, state?.intro ?? 1);
      gl.uniform1f(uScroll, state?.scroll ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    draw();

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
