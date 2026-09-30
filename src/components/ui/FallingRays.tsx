"use client";

import React, { useEffect, useRef } from "react";

export interface FallingRaysProps {
  color1?: string;
  color2?: string;
  rayCount?: number;
  rayWidth?: number;
  pulseSpeed?: number;
  pulseWidth?: number;
  trailLength?: number;
  motionBlur?: number;
  bgGlow?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return [0.1, 0.0, 1.0];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  uniform float uTime;
  uniform vec2  uResolution;

  uniform float uRayCount;
  uniform float uRayWidth;
  uniform float uPulseSpeed;
  uniform float uTrailLength;
  uniform float uBgGlow;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  // accumulated scroll offset — ONLY this drives pulse movement
  uniform float uScrollDelta;

  // ── Bezier flare geometry (ski-slope: tight top, fanned bottom) ──
  const float topWidth    = 0.16;
  const float bottomWidth = 0.96;

  // y(t) cubic coefficients  P0=0, P1=0.5, P2=0.8, P3=1
  const float kA = 0.1;  const float kB = -0.6;  const float kC = 1.5;

  // Width polynomial: flowW(t) = ((kWa*t + kWb)*t + kWc)*t + topWidth
  // At t=0 -> topWidth (0.16)
  // At t=1 -> 0.20 + 0.65 - 0.05 + 0.16 = 0.96 (precisely bottomWidth)
  const float kWa = 0.20; const float kWb = 0.65; const float kWc = -0.05;

  varying vec2 vUv;

  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float hash2(float n){ return fract(sin(n * 311.7) * 19843.8712); }

  // ── hue-shift a colour slightly based on per-ray seed ──
  vec3 hueShift(vec3 col, float shift) {
    // cheap HSV-space hue rotation via RGB rotation matrix
    float c = cos(shift); float s = sin(shift);
    return clamp(mat3(
       0.299+0.701*c-0.168*s, 0.587-0.587*c-0.330*s, 0.114-0.114*c+0.497*s,
       0.299-0.299*c+0.328*s, 0.587+0.413*c+0.035*s, 0.114-0.114*c-0.292*s,
       0.299-0.300*c-0.900*s, 0.587-0.588*c+1.050*s, 0.114+0.886*c-0.203*s
    ) * col, 0.0, 1.0);
  }

  void main() {
    float targetY = 1.0 - vUv.y;

    // ── 3-iter Newton-Raphson: invert y(t) ──
    float t = targetY;
    float f, df;
    f = ((kA*t+kB)*t+kC)*t - targetY;  df = (3.0*kA*t+2.0*kB)*t+kC;  t -= f/max(df,0.001);
    f = ((kA*t+kB)*t+kC)*t - targetY;  df = (3.0*kA*t+2.0*kB)*t+kC;  t -= f/max(df,0.001);
    f = ((kA*t+kB)*t+kC)*t - targetY;  df = (3.0*kA*t+2.0*kB)*t+kC;
    t = clamp(t - f/max(df,0.001), 0.0, 1.0);

    float flowW   = ((kWa*t+kWb)*t+kWc)*t + topWidth;
    float dy_dt   = (3.0*kA*t+2.0*kB)*t+kC;
    float dW_dt   = (3.0*kWa*t+2.0*kWb)*t+kWc;

    float idealH   = (vUv.x - 0.5) / flowW;
    float idealBin = (idealH + 0.5) * (uRayCount - 1.0);

    float wScale       = flowW / bottomWidth;
    float rayW         = uRayWidth * mix(0.65, 1.30, wScale);
    float px           = 1.0 / uResolution.x;
    float aaScale      = 1.0;
    if (rayW < px * 1.5) { aaScale = rayW / (px*1.5); rayW = px*1.5; }

    float invRayW      = 1.0 / rayW;
    float invTrail     = 1.0 / max(uTrailLength, 0.001);
    float invNebulaW   = 1.0 / (uRayWidth * 18.0);

    // Nebula / ambient glow weight increases toward bottom fan
    float glowWeight = smoothstep(0.2, 1.0, t) * 1.2 + exp(-pow((t-0.5)*2.5,2.0)) * 0.3;

    vec3 accumColor = vec3(0.0);
    vec3 nebulaAccum = vec3(0.0);

    float binBase = floor(idealBin);

    for (int offset = 0; offset <= 1; offset++) {
      float bin = binBase + float(offset);
      if (bin < 0.0 || bin >= uRayCount) continue;

      float rayIdx  = bin / (uRayCount - 1.0);
      float H       = rayIdx - 0.5;
      float centerX = 0.5 + H * flowW;
      float dist    = abs(vUv.x - centerX);
      if (dist > rayW * 22.0) continue;

      float dx_dt    = H * dW_dt;
      float geoFac   = abs(dy_dt) / sqrt(dx_dt*dx_dt + dy_dt*dy_dt);
      float trueDist = dist * geoFac;

      // ── Per-ray identity ──
      float cHash  = hash(bin  * 3.7);
      float cHash2 = hash2(bin * 5.3);

      // Depth feel: rays near edges are slightly dimmer / cooler
      float depthFade = 1.0 - 0.35 * abs(H) * 2.0;

      // Hue-varied ray colour (±25° of base colour1/2 blend)
      vec3 baseCol  = mix(uColor1, uColor2, targetY * 0.7 + rayIdx * 0.3);
      vec3 rayColor = hueShift(baseCol, (cHash - 0.5) * 0.85) * (0.85 + cHash2 * 0.3);
      rayColor     *= depthFade;

      // ── Static fiber line (always visible — gives the lattice at rest) ──
      float fiberCore  = exp(-trueDist * invRayW * 1.8);
      float fiberHalo  = exp(-trueDist * invRayW * 0.55);
      float fiberGlow  = (fiberCore * 0.55 + fiberHalo * 0.12) * aaScale;
      // Slight time shimmer on the fiber (very subtle — NOT scroll-driven)
      float shimmer    = 0.85 + 0.15 * sin(uTime * 0.9 + bin * 2.3);
      accumColor += rayColor * fiberGlow * shimmer;

      // ── Scroll-driven pulses — FROZEN when scroll stops ──
      float pulsePhase = uScrollDelta * uPulseSpeed + bin * 0.31 + cHash * 0.45;

      for (float p = 0.0; p < 3.0; p += 1.0) {
        float pulsePos = fract(pulsePhase + p * 0.37);
        float delta    = pulsePos - t;

        // Only render pulse when it's near this fragment (skip far ones cheaply)
        if (delta < -0.05 || delta > uTrailLength + 0.05) continue;

        // Head cutoff — hard edge at the leading tip
        float headCut  = smoothstep(-0.018, 0.0, delta);

        // Tail: smooth cubic falloff behind the head
        float tailW = 0.0;
        if (delta >= 0.0 && delta < uTrailLength) {
          float nTrail = delta * invTrail;
          tailW = pow(1.0 - nTrail, 2.2) * (1.0 - nTrail * 0.4);
        }

        // Head intensity — tight Gaussian around the leading point
        float headG   = exp(-abs(delta) / (rayW * 6.0)) * headCut;

        // White-hot spark core: very tight in both screen dimensions
        float sparkD  = abs(delta) / (rayW * 2.8) + trueDist / (rayW * 0.9);
        float spark   = exp(-sparkD * sparkD) * headCut;

        float pulseTotal = (headG * 4.5 + tailW * 2.2) * fiberCore;

        // Chromatic bloom: cool core → warm edge
        vec3 headColor = mix(rayColor * 1.6, vec3(1.0, 0.95, 1.0), clamp(spark * 3.0, 0.0, 1.0));
        // Extra wide halo around head
        vec3 haloColor = rayColor * (exp(-trueDist * invRayW * 0.4) * headG * 1.8);

        float vFade    = smoothstep(0.015, 0.10, targetY) * smoothstep(1.0, 0.90, targetY);

        accumColor += (headColor * pulseTotal + haloColor) * vFade;
      }

      // ── Wide nebula glow (soft ambient cloud around each ray) ──
      float nebula    = exp(-trueDist * invNebulaW) * uBgGlow * 0.22;
      nebulaAccum    += rayColor * nebula * glowWeight;
    }

    float yFade    = smoothstep(0.008, 0.12, targetY);
    vec3 finalColor = accumColor * yFade + nebulaAccum;

    // Radial vignette — tighter, more cinematic
    vec2 cUV    = (vUv - 0.5) * vec2(1.0, 0.8);
    float vig   = 1.0 - smoothstep(0.55, 1.25, length(cUV));
    finalColor *= (vig * 0.35 + 0.65);

    // Tone-map: lift shadows a touch for neon-on-dark feel
    finalColor  = finalColor / (finalColor + 0.28);
    finalColor *= 1.32;

    float maxCh  = max(max(finalColor.r, finalColor.g), finalColor.b);
    float alpha  = smoothstep(0.0, 0.75, maxCh);
    vec3  normC  = finalColor / max(alpha, 0.001);

    gl_FragColor = vec4(normC, alpha);
  }
`;

export const FallingRays: React.FC<FallingRaysProps> = ({
  color1     = "#7C3AED",
  color2     = "#DB2777",
  rayCount   = 28,
  rayWidth   = 0.0032,
  pulseSpeed = 0.22,
  pulseWidth = 0.015,
  trailLength = 0.55,
  motionBlur = 0.3,
  bgGlow     = 0.45,
  className  = "",
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Scroll-linked animation state
  const scrollVelocityRef = useRef(0);   // smoothed velocity (s equivalent)
  const scrollAccumRef    = useRef(0);   // accumulated time offset

  const propsRef = useRef({
    color1,
    color2,
    rayCount,
    rayWidth,
    pulseSpeed,
    pulseWidth,
    trailLength,
    motionBlur,
    bgGlow,
  });

  useEffect(() => {
    propsRef.current = {
      color1,
      color2,
      rayCount,
      rayWidth,
      pulseSpeed,
      pulseWidth,
      trailLength,
      motionBlur,
      bgGlow,
    };
  }, [
    color1,
    color2,
    rayCount,
    rayWidth,
    pulseSpeed,
    pulseWidth,
    trailLength,
    motionBlur,
    bgGlow,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl =
      canvas.getContext("webgl2", { alpha: true, antialias: true }) ||
      canvas.getContext("webgl", { alpha: true, antialias: true });

    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Full screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Drive scroll delta directly from window.scrollY so pulses track page scroll
    // and stop immediately when reaching 1 viewport height (bottom edge)
    const SCROLL_SCALE = 0.00075;
    const getScrollOffset = () => {
      const maxScroll = window.innerHeight || 800;
      const clampedY = Math.min(maxScroll, Math.max(0, window.scrollY));
      return clampedY * SCROLL_SCALE;
    };

    // Uniform locations
    const uTimeLoc        = gl.getUniformLocation(program, "uTime");
    const uScrollDeltaLoc = gl.getUniformLocation(program, "uScrollDelta");
    const uResolutionLoc  = gl.getUniformLocation(program, "uResolution");
    const uRayCountLoc    = gl.getUniformLocation(program, "uRayCount");
    const uRayWidthLoc    = gl.getUniformLocation(program, "uRayWidth");
    const uPulseSpeedLoc  = gl.getUniformLocation(program, "uPulseSpeed");
    // uPulseWidth unused in new shader (kept in props for API compat)
    const uTrailLengthLoc = gl.getUniformLocation(program, "uTrailLength");
    // uMotionBlur unused in new shader (kept in props for API compat)
    const uBgGlowLoc      = gl.getUniformLocation(program, "uBgGlow");
    const uColor1Loc      = gl.getUniformLocation(program, "uColor1");
    const uColor2Loc      = gl.getUniformLocation(program, "uColor2");

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);

      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    const startTime = performance.now();

    const render = (currentTime: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsedTime = (currentTime - startTime) * 0.001;

      gl.useProgram(program);

      const p = propsRef.current;
      const [r1, g1, b1] = hexToRgb(p.color1);
      const [r2, g2, b2] = hexToRgb(p.color2);

      const currentScrollOffset = getScrollOffset();

      if (uTimeLoc)        gl.uniform1f(uTimeLoc,        elapsedTime);
      if (uScrollDeltaLoc) gl.uniform1f(uScrollDeltaLoc, currentScrollOffset);
      if (uResolutionLoc)  gl.uniform2f(uResolutionLoc,  width, height);
      const isMobile = window.innerWidth < 640;
      const effectiveRays = isMobile ? Math.min(p.rayCount, 10) : p.rayCount;
      if (uRayCountLoc)    gl.uniform1f(uRayCountLoc,    effectiveRays);
      if (uRayWidthLoc)    gl.uniform1f(uRayWidthLoc,    p.rayWidth);
      if (uPulseSpeedLoc)  gl.uniform1f(uPulseSpeedLoc,  p.pulseSpeed);
      if (uTrailLengthLoc) gl.uniform1f(uTrailLengthLoc, p.trailLength);
      if (uBgGlowLoc)      gl.uniform1f(uBgGlowLoc,      p.bgGlow);
      if (uColor1Loc)      gl.uniform3f(uColor1Loc,      r1, g1, b1);
      if (uColor2Loc)      gl.uniform3f(uColor2Loc,      r2, g2, b2);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (program)       gl.deleteProgram(program);
      if (vertShader)    gl.deleteShader(vertShader);
      if (fragShader)    gl.deleteShader(fragShader);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default FallingRays;
