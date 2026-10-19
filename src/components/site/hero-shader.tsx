import { useEffect, useRef } from "react";

import { readTokenColor } from "@/lib/color";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Soft clouds in the brand colours drifting across white: two layers of
// billows (big, slow masses behind smaller, quicker puffs), lit from the top
// left so each has a bright crown and a soft teal underside. Aqua and mint
// lead, with a breath of lime. They gather behind the triangle and in the top
// left corner, stay light behind the headline, part around the pointer and
// fade out towards the bottom.
const fragmentSource = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntro;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uAqua;
uniform vec3 uMint;
uniform vec3 uLime;
uniform vec3 uTeal;

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
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // The pointer gently parts the clouds.
  vec2 toMouse = p - vec2(uMouse.x * aspect, uMouse.y);
  p += toMouse * 0.12 * exp(-dot(toMouse, toMouse) * 7.0) * uHover;

  // Wind drifts everything to the right; the warp keeps the edges billowing.
  vec2 wind = vec2(uTime * 0.022, uTime * 0.005);
  vec2 q = vec2(fbm(p * 1.1 + wind * 0.6), fbm(p * 1.1 + vec2(3.1, 7.4) - wind * 0.4));
  vec2 far = p * 1.25 + q * 0.9 - wind;
  vec2 near = p * 2.3 + q * 1.4 - wind * 1.9 + 11.0;
  float farD = fbm(far);
  float nearD = fbm(near);
  float cover = smoothstep(0.36, 0.7, farD) * 0.8 + smoothstep(0.45, 0.76, nearD) * 0.55;

  // Light from the top left: brighter where density falls away towards it.
  float lit = clamp((farD - fbm(far + vec2(-0.04, 0.05))) * 7.0 + 0.5, 0.0, 1.0);

  // Colour: aqua to mint over large patches, a hint of lime, teal undersides.
  float hue = fbm(p * 0.55 + wind * 0.3 + 5.0);
  vec3 body = mix(uAqua, uMint, smoothstep(0.35, 0.7, hue));
  body = mix(body, uLime, smoothstep(0.6, 0.85, hue) * 0.35);
  vec3 cloud = mix(mix(body, uTeal, 0.32), body, lit);
  cloud = mix(cloud, vec3(1.0), lit * 0.4);

  // Where they gather: the right side and the top left corner; thinned out
  // behind the light teal headline (the band ~55–90% up, left of ~85%
  // across); gone by the bottom edge.
  float place = 0.6 + 0.4 * smoothstep(0.3, 0.95, uv.x);
  place = max(place, smoothstep(0.7, 1.0, uv.y) * smoothstep(0.55, 0.0, uv.x));
  float headline = smoothstep(0.52, 0.64, uv.y) * (1.0 - smoothstep(0.86, 0.96, uv.y))
    * (1.0 - smoothstep(0.72, 0.88, uv.x));
  place *= 1.0 - 0.65 * headline;
  float amount = clamp(cover, 0.0, 1.0) * place * smoothstep(0.0, 0.4, uv.y) * uIntro;

  vec3 col = mix(vec3(1.0), cloud, amount * 0.88);
  // Fine grain keeps the soft gradients from banding.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (2.5 / 255.0);
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
 * Full-bleed WebGL background for the home hero: soft clouds in the brand
 * colours drifting over white. It renders at half resolution (the clouds are
 * soft), fades in once drawn, pauses off screen and holds still for reduced
 * motion. Without WebGL the hero is simply white.
 */
export function HeroShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false });
    if (!gl) return;
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
    const uIntro = uniform("uIntro");
    const uMouse = uniform("uMouse");
    const uHover = uniform("uHover");
    const tokens: [string, string][] = [
      ["uAqua", "--aqua"],
      ["uMint", "--mint"],
      ["uLime", "--teal"],
      ["uTeal", "--hero-teal-2"],
    ];
    for (const [name, token] of tokens) gl.uniform3fv(uniform(name), readTokenColor(token));

    // Pointer in uv (y up), eased; it parts the clouds while it's over the hero.
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, on: 0 };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
      mouse.on = mouse.ty >= 0 && mouse.ty <= 1 ? 1 : 0;
    };
    const onLeave = () => (mouse.on = 0);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const still = prefersReducedMotion();
    const start = performance.now();
    const draw = () => {
      const seconds = (performance.now() - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.hover += (mouse.on - mouse.hover) * 0.04;
      gl.uniform1f(uTime, still ? 40 : 40 + seconds);
      // The clouds fade in over the first 2s.
      gl.uniform1f(uIntro, still ? 1 : 1 - (1 - Math.min(seconds / 2, 1)) ** 3);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, still ? 0 : mouse.hover);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * 0.5));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * 0.5));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      if (still) draw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    draw();
    canvas.dataset["ready"] = "";

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersection.observe(canvas);

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (visible) draw();
    };
    if (!still) loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      resizeObserver.disconnect();
      intersection.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none block size-full opacity-0 transition-opacity duration-700 data-[ready]:opacity-100",
        className,
      )}
    />
  );
}
