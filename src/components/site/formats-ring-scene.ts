import type * as ThreeModule from "three";

type Three = typeof ThreeModule;

const vertexShader = `
uniform float uVelocity;
uniform float uRadius;
varying vec2 vUv;
varying float vFront;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  // Panels ripple vertically with rotation speed, like film through a gate.
  world.y += sin(uv.x * 3.14159265) * uVelocity * 0.55;
  vFront = smoothstep(-uRadius, uRadius * 0.92, world.z);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform float uVelocity;
uniform float uLoaded;
uniform vec3 uBase;
varying vec2 vUv;
varying float vFront;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 cover = uPlaneAspect > uImageAspect
    ? vec2(1.0, uImageAspect / uPlaneAspect)
    : vec2(uPlaneAspect / uImageAspect, 1.0);
  vec2 uv = (vUv - 0.5) * cover + 0.5;
  float shift = uVelocity * 0.035;

  vec3 color = vec3(
    texture2D(uTexture, uv + vec2(shift, 0.0)).r,
    texture2D(uTexture, uv).g,
    texture2D(uTexture, uv - vec2(shift, 0.0)).b
  );
  color = mix(uBase, color, uLoaded);

  float shade = mix(0.1, 1.0, vFront);
  if (!gl_FrontFacing) shade *= 0.35;
  color = mix(uBase, color, shade);

  vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
  float d = roundedBox(p, vec2(uPlaneAspect, 1.0) * 0.5, 0.04);
  float alpha = 1.0 - smoothstep(-0.004, 0.002, d);
  gl_FragColor = vec4(color, alpha);
}
`;

type RingOptions = {
  images: string[];
  base: [number, number, number];
  /** Target rotation in radians (scroll + drag); the ring eases toward it. */
  getTarget: () => number;
  onActive: (index: number) => void;
};

/** Builds the ring scene inside `container`; returns a disposer. */
export function createRingScene(THREE: Three, container: HTMLElement, options: RingOptions) {
  const { images, base, getTarget, onActive } = options;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);

  const count = images.length;
  const step = (Math.PI * 2) / count;
  const panelWidth = 2.9;
  const radius = panelWidth / (step * 0.8);
  const panelHeight = panelWidth * 1.3;

  const group = new THREE.Group();
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const materials: ThreeModule.ShaderMaterial[] = [];
  const velocityUniforms: { value: number }[] = [];
  const geometries: ThreeModule.BufferGeometry[] = [];
  const textures: ThreeModule.Texture[] = [];
  let disposed = false;

  images.forEach((src, index) => {
    // Bend a flat plane onto the cylinder, centred on its own origin so each
    // mesh has a distinct position (keeps transparent depth-sorting correct).
    const geometry = new THREE.PlaneGeometry(panelWidth, panelHeight, 48, 1);
    const position = geometry.attributes["position"];
    if (position) {
      for (let v = 0; v < position.count; v++) {
        const theta = position.getX(v) / radius;
        position.setX(v, Math.sin(theta) * radius);
        position.setZ(v, Math.cos(theta) * radius - radius);
      }
      position.needsUpdate = true;
    }
    geometries.push(geometry);

    const uniforms = {
      uTexture: { value: null as ThreeModule.Texture | null },
      uImageAspect: { value: 1 },
      uPlaneAspect: { value: panelWidth / panelHeight },
      uVelocity: { value: 0 },
      uRadius: { value: radius },
      uLoaded: { value: 0 },
      uBase: { value: new THREE.Vector3(...base) },
    };
    velocityUniforms.push(uniforms.uVelocity);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
    materials.push(material);

    loader.load(src, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      textures.push(texture);
      const image = texture.image as { width: number; height: number };
      uniforms.uTexture.value = texture;
      uniforms.uImageAspect.value = image.width / image.height;
      uniforms.uLoaded.value = 1;
    });

    const mesh = new THREE.Mesh(geometry, material);
    const angle = index * step;
    mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
    mesh.rotation.y = angle;
    group.add(mesh);
  });

  const fit = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    // Leave room for the heading above and the title below on short screens.
    const heightShare = height < 820 ? 0.4 : 0.46;
    const forHeight = panelHeight / heightShare / (2 * tanHalf);
    const forWidth = panelWidth / 0.62 / (2 * tanHalf * camera.aspect);
    const distance = Math.max(forHeight, forWidth);
    camera.position.set(0, distance * 0.16, radius + distance);
    camera.lookAt(0, -0.4, radius * 0.6);
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(container);
  fit();

  let visible = true;
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  });
  intersection.observe(container);

  let current = getTarget();
  let previous = current;
  let velocity = 0;
  let activeIndex = -1;
  let frame = 0;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    current += (getTarget() - current) * 0.075;
    const delta = current - previous;
    previous = current;
    velocity += (Math.max(-1, Math.min(1, delta * 9)) - velocity) * 0.12;

    group.rotation.y = -current;
    for (const uniform of velocityUniforms) uniform.value = velocity;

    const index = ((Math.round(current / step) % count) + count) % count;
    if (index !== activeIndex) {
      activeIndex = index;
      onActive(index);
    }
    renderer.render(scene, camera);
  };
  tick();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersection.disconnect();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    canvas.remove();
  };
}
