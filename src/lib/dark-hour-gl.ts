/**
 * "Dark Hour" backdrop in raw WebGL (one fragment shader, no Three.js:
 * a full-screen quad doesn't need a 600 KB scene-graph library).
 *
 * - Real moon: sphere-lit with today's phase, craters from noise, halo.
 * - Slow slanted light shafts + drifting motes, tinted per screen.
 * - Moon glides between screens; subtle pointer parallax.
 * - Cheap by design: DPR capped, lower resolution on small screens, 30-45 fps cap,
 *   paused when the tab is hidden, a single static frame for reduced motion.
 * - Returns null when WebGL is unavailable; the CSS background stays as fallback.
 */

export type GlScreen = "home" | "projects" | "about" | "contact" | "language";

export interface DarkHourApi {
  setScreen: (screen: GlScreen, rtl: boolean) => void;
  setPointer: (x: number, y: number) => void;
  destroy: () => void;
}

interface Target {
  x: number; // moon x as a fraction of the half-width (mirrored in RTL)
  y: number;
  r: number;
  tint: [number, number, number];
}

const TARGETS: Record<GlScreen, Target> = {
  home: { x: 0.78, y: 0.32, r: 0.14, tint: [0.04, 0.16, 0.42] },
  projects: { x: 0.8, y: 0.3, r: 0.11, tint: [0.04, 0.23, 0.55] },
  about: { x: 0.7, y: 0.3, r: 0.13, tint: [0.03, 0.22, 0.43] },
  contact: { x: 0.8, y: -0.24, r: 0.11, tint: [0.02, 0.15, 0.31] },
  language: { x: 0.8, y: -0.24, r: 0.11, tint: [0.04, 0.16, 0.4] },
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMoonPos;
uniform float uMoonR;
uniform float uPhase;
uniform vec2 uPointer;
uniform vec3 uTint;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Base gradient (matches the CSS fallback).
  vec3 col = mix(vec3(0.0, 0.02, 0.06), vec3(0.0, 0.07, 0.2), smoothstep(-0.6, 0.6, p.y + 0.2));
  col = mix(col, uTint, smoothstep(1.15, 0.0, length(p - vec2(0.25 * aspect, 0.3))) * 0.55);

  // Slanted light shafts.
  vec2 q = vec2(p.x + p.y * 0.42, p.y);
  float t = uTime * 0.03;
  float shafts = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float x = fract(q.x * (0.55 + fi * 0.23) + t * (1.0 + fi * 0.4) + fi * 0.37);
    float w = smoothstep(0.0, 0.05, x) * smoothstep(0.34 + fi * 0.04, 0.28, x);
    shafts += w * (0.4 + 0.5 * fbm(q * 3.0 + fi + t * 3.0)) * (1.0 - fi * 0.22);
  }
  col += vec3(0.08, 0.3, 0.75) * shafts * 0.3 * (0.6 + 0.4 * smoothstep(-0.5, 0.5, p.y));

  // Drifting motes.
  vec2 g = uv * vec2(aspect, 1.0) * vec2(26.0, 14.0);
  g.y += uTime * 0.35;
  vec2 gi = floor(g), gf = fract(g) - 0.5;
  float h = hash(gi);
  float mote = step(0.93, h) * smoothstep(0.16, 0.0, length(gf + vec2(h - 0.5, fract(h * 7.0) - 0.5) * 0.5));
  col += vec3(0.45, 0.9, 1.0) * mote * (0.25 + 0.2 * sin(uTime * 1.3 + h * 40.0));

  // Moon.
  vec2 m = p - uMoonPos - uPointer * 0.012;
  float r = length(m) / uMoonR;
  float halo = exp(-max(r - 1.0, 0.0) * 3.2) * 0.5 + exp(-max(r - 1.0, 0.0) * 0.9) * 0.12;
  col += vec3(0.35, 0.8, 1.0) * halo * 0.4;
  {
    vec3 n = vec3(m / uMoonR, sqrt(max(1.0 - r * r, 0.0)));
    float a = uPhase * 6.2831853;           // 0 new, 0.5 full
    vec3 L = normalize(vec3(sin(a), 0.12, -cos(a)));
    float lit = smoothstep(-0.03, 0.12, dot(n, L));
    float tex = fbm(n.xy * 5.5 + 3.1);
    vec3 dark = vec3(0.03, 0.07, 0.17);     // earthshine
    vec3 bright = vec3(0.7, 0.82, 0.95) * (0.8 + 0.2 * tex);
    vec3 surf = mix(dark, bright, lit);
    surf *= 1.0 - 0.2 * smoothstep(0.55, 0.9, fbm(n.xy * 11.0 + 7.0)) * lit; // craters
    surf += vec3(0.2, 0.7, 0.95) * smoothstep(0.86, 1.0, r) * 0.3;           // cyan rim
    col = mix(col, surf, smoothstep(1.0, 0.985, r));                          // soft edge
  }

  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0; // dither, no banding
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[dark-hour] shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createDarkHour(
  canvas: HTMLCanvasElement,
  opts: { phase: number; reduced: boolean },
): DarkHourApi | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one big triangle
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(program, "uRes"),
    time: gl.getUniformLocation(program, "uTime"),
    moonPos: gl.getUniformLocation(program, "uMoonPos"),
    moonR: gl.getUniformLocation(program, "uMoonR"),
    phase: gl.getUniformLocation(program, "uPhase"),
    pointer: gl.getUniformLocation(program, "uPointer"),
    tint: gl.getUniformLocation(program, "uTint"),
  };

  // Animated state (eased toward the targets each frame).
  let rtl = false;
  let target = TARGETS.home;
  const state = { x: target.x, y: target.y, r: target.r, tint: [...target.tint] as number[] };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let width = 1;
  let height = 1;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let clock = opts.reduced ? 14 : 0;
  let alive = true;

  const small = () => window.innerWidth < 768;

  function resize(): void {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (small() ? 0.7 : 0.9);
    width = Math.max(2, Math.floor(window.innerWidth * scale));
    height = Math.max(2, Math.floor(window.innerHeight * scale));
    canvas.width = width;
    canvas.height = height;
    gl!.viewport(0, 0, width, height);
  }

  function draw(): void {
    const aspect = width / height;
    gl!.uniform2f(u.res, width, height);
    gl!.uniform1f(u.time, clock);
    gl!.uniform2f(u.moonPos, state.x * (rtl ? -1 : 1) * (aspect / 2), state.y);
    gl!.uniform1f(u.moonR, state.r);
    gl!.uniform1f(u.phase, opts.phase);
    gl!.uniform2f(u.pointer, pointer.x, pointer.y);
    gl!.uniform3f(u.tint, state.tint[0]!, state.tint[1]!, state.tint[2]!);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function ease(dt: number): boolean {
    const k = 1 - Math.pow(0.0015, dt); // frame-rate independent
    let moving = false;
    const step = (cur: number, to: number) => {
      const next = cur + (to - cur) * k;
      if (Math.abs(to - next) > 0.0004) moving = true;
      return next;
    };
    state.x = step(state.x, target.x);
    state.y = step(state.y, target.y);
    state.r = step(state.r, target.r);
    for (let i = 0; i < 3; i++) state.tint[i] = step(state.tint[i]!, target.tint[i]!);
    pointer.x = step(pointer.x, pointer.tx);
    pointer.y = step(pointer.y, pointer.ty);
    return moving;
  }

  const frameInterval = () => (small() ? 1 / 30 : 1 / 45);

  function frame(now: number): void {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    acc += dt;
    if (acc < frameInterval()) return;
    clock += acc;
    ease(acc);
    acc = 0;
    draw();
  }

  /** Reduced motion: no loop. Redraw a still frame only when something changes. */
  let settling = 0;
  function settle(): void {
    cancelAnimationFrame(settling);
    const run = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1) || 0.016;
      last = now;
      const moving = ease(dt);
      draw();
      if (moving && alive) settling = requestAnimationFrame(run);
    };
    last = performance.now();
    settling = requestAnimationFrame(run);
  }

  function start(): void {
    if (opts.reduced) {
      draw();
      return;
    }
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function onVisibility(): void {
    if (opts.reduced || !alive) return;
    cancelAnimationFrame(raf);
    if (!document.hidden) start();
  }
  function onResize(): void {
    resize();
    draw();
  }
  function onLost(e: Event): void {
    e.preventDefault();
    alive = false;
    cancelAnimationFrame(raf);
    canvas.style.opacity = "0"; // CSS fallback shows through again
  }

  resize();
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  start();

  return {
    setScreen(screen, isRtl) {
      rtl = isRtl;
      target = TARGETS[screen];
      if (opts.reduced) settle();
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
      if (opts.reduced) return; // still image: no parallax
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(settling);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
