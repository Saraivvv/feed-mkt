import React, { useEffect, useRef } from "react";

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Shader compile error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Shader link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function runFallbackCanvas(canvas, variant) {
  const context = canvas.getContext("2d", { alpha: false });
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
  const colors =
    variant === "inverted"
      ? { background: "#070707", stroke: "rgba(244, 245, 240, 0.26)", glow: "rgba(255, 163, 0, 0.025)" }
      : { background: "#070707", stroke: "rgba(255, 163, 0, 0.22)", glow: "rgba(255, 163, 0, 0.04)" };
  let width = 1;
  let height = 1;
  let frame = 0;
  let lastDraw = 0;
  const trail = Array.from({ length: 10 }, () => ({ x: 0.5, y: 0.5 }));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const handlePointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    pointer.active = true;
  };

  const handlePointerLeave = () => {
    pointer.active = false;
  };

  const draw = (now) => {
    frame = requestAnimationFrame(draw);
    if (document.hidden || now - lastDraw < 32) return;
    lastDraw = now;

    pointer.tx += (pointer.x - pointer.tx) * 0.12;
    pointer.ty += (pointer.y - pointer.ty) * 0.12;
    trail[0].x += (pointer.tx - trail[0].x) * 0.24;
    trail[0].y += (pointer.ty - trail[0].y) * 0.24;

    for (let index = 1; index < trail.length; index += 1) {
      trail[index].x += (trail[index - 1].x - trail[index].x) * 0.13;
      trail[index].y += (trail[index - 1].y - trail[index].y) * 0.13;
    }

    context.fillStyle = colors.background;
    context.fillRect(0, 0, width, height);

    const gradient = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
    gradient.addColorStop(0, colors.glow);
    gradient.addColorStop(1, "rgba(7, 7, 7, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 0.65;
    context.strokeStyle = colors.stroke;
    context.lineJoin = "round";
    context.lineCap = "round";

    const time = now * 0.001;
    const gapY = 8;
    const gapX = 28;

    for (let baseY = -32; baseY <= height + 32; baseY += gapY) {
      context.beginPath();

      for (let x = -56; x <= width + 56; x += gapX) {
        const wave = Math.sin(x * 0.006 + time * 0.22) * 18 + Math.sin(x * 0.014 - time * 0.18) * 7;
        let nextX = x;
        let y = baseY + wave;

        if (pointer.active) {
          const dx = nextX / width - pointer.tx;
          const dy = y / height - pointer.ty;
          const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 0.24);
          let trailInfluence = 0;
          let trailDirection = 0;

          trail.forEach((point, index) => {
            const trailDx = nextX / width - point.x;
            const trailDy = y / height - point.y;
            const currentInfluence = Math.max(0, 1 - Math.hypot(trailDx, trailDy) / (0.22 + index * 0.026)) * (1 - index / trail.length);
            trailInfluence += currentInfluence;
            trailDirection += Math.sign(trailDy || 1) * currentInfluence;
          });

          const lineVoid = Math.max(influence * 0.96, Math.min(trailInfluence, 1) * 0.72);
          y += Math.sign(dy || 1) * influence * 72;
          y += Math.sign(trailDirection || 1) * Math.min(trailInfluence, 1) * 46;

          if (lineVoid > 0.62) {
            context.moveTo(nextX, y);
            continue;
          }
        }

        if (x === -56) context.moveTo(nextX, y);
        else context.lineTo(nextX, y);
      }

      context.stroke();
    }
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerleave", handlePointerLeave);
  frame = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerleave", handlePointerLeave);
  };
}

function InteractiveWavesCanvas({ variant = "base", className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const visibility = { active: false };
    let renderFrame = null;
    let frame = 0;

    const startLoop = (render) => {
      if (frame) return;
      visibility.active = true;
      frame = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      visibility.active = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibility.active = entry.isIntersecting;
        if (visibility.active && renderFrame) startLoop(renderFrame);
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    visibilityObserver.observe(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      visibilityObserver.disconnect();
      return runFallbackCanvas(canvas, variant);
    }

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform vec2 u_pointer;
      uniform vec2 u_trail[12];
      uniform float u_time;
      uniform float u_variant;
      varying vec2 v_uv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      vec2 aspectPoint(vec2 point) {
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        return vec2((point.x - 0.5) * aspect, point.y);
      }

      vec2 repelFrom(vec2 p, vec2 origin, float radius, float strength) {
        vec2 delta = p - origin;
        float distanceToOrigin = max(length(delta), 0.0001);
        float influence = 1.0 - smoothstep(0.0, radius, distanceToOrigin);
        influence = influence * influence * (3.0 - 2.0 * influence);
        return normalize(delta) * influence * strength;
      }

      vec2 trailWarp(vec2 p, out float trailVoid) {
        vec2 warp = vec2(0.0);
        trailVoid = 0.0;

        for (int i = 0; i < 12; i++) {
          float fi = float(i);
          vec2 point = aspectPoint(u_trail[i]);
          float age = 1.0 - fi / 12.0;
          float radius = 0.26 + fi * 0.034;
          float distanceToPoint = distance(p, point);
          float influence = 1.0 - smoothstep(0.0, radius, distanceToPoint);
          influence = influence * influence * (3.0 - 2.0 * influence) * age;
          warp += repelFrom(p, point, radius, 0.044 + age * 0.072);
          trailVoid = max(trailVoid, influence * 0.86);
        }

        return warp;
      }

      float cursorVoid(vec2 p, vec2 pointer) {
        float distanceToPointer = distance(p, pointer);
        float core = 1.0 - smoothstep(0.0, 0.18, distanceToPointer);
        float cushion = 1.0 - smoothstep(0.18, 0.42, distanceToPointer);
        return clamp(core * 0.98 + cushion * 0.42, 0.0, 1.0);
      }

      float waveLines(vec2 uv, float time, out float lineVoid) {
        vec2 p = aspectPoint(uv);
        vec2 pointer = aspectPoint(u_pointer);
        float trailVoid = 0.0;
        vec2 warp = trailWarp(p, trailVoid);
        warp += repelFrom(p, pointer, 0.44, 0.245);
        p += warp;

        float cursor = cursorVoid(p, pointer);
        lineVoid = clamp(max(cursor, trailVoid), 0.0, 1.0);

        float broad = sin(p.x * 5.4 + time * 0.22) * 0.020;
        broad += sin(p.x * 10.8 - time * 0.18) * 0.010;
        broad += sin((p.x + uv.y * 0.18) * 17.5 + time * 0.12) * 0.004;
        broad += (noise(vec2(p.x * 2.8 + time * 0.035, uv.y * 1.6)) - 0.5) * 0.010;

        float lines = (uv.y + broad) * 82.0;
        float center = abs(fract(lines) - 0.5);
        float line = 1.0 - smoothstep(0.020, 0.048, center);

        float broken = 0.72 + noise(vec2(uv.x * 150.0 + time * 0.75, lines * 0.09)) * 0.28;
        return line * broken * (1.0 - lineVoid * 0.985);
      }

      void main() {
        float t = u_time;
        float lineVoid = 0.0;
        float line = waveLines(v_uv, t, lineVoid);
        float vignette = smoothstep(1.02, 0.12, distance(v_uv, vec2(0.5, 0.52)));
        float bottomShade = smoothstep(0.68, 1.0, v_uv.y);

        vec3 black = vec3(0.027, 0.027, 0.027);
        vec3 orange = vec3(1.0, 0.635, 0.0);
        vec3 paper = vec3(0.957, 0.961, 0.941);
        vec3 stroke = mix(orange, paper, u_variant);
        vec3 color = black;

        color += orange * 0.018 * vignette;
        color += stroke * line * (0.23 + vignette * 0.13);
        color *= 1.0 - bottomShade * 0.42;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    let program;
    try {
      program = createProgram(gl, vertexSource, fragmentSource);
    } catch (error) {
      console.warn(error);
      visibilityObserver.disconnect();
      return runFallbackCanvas(canvas, variant);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const trailLocations = Array.from({ length: 12 }, (_, index) => gl.getUniformLocation(program, `u_trail[${index}]`));
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const variantLocation = gl.getUniformLocation(program, "u_variant");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(variantLocation, variant === "inverted" ? 1 : 0);

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const trail = Array.from({ length: 12 }, () => ({ x: 0.5, y: 0.5 }));
    const startTime = performance.now();
    let lastDraw = 0;
    let width = 1;
    let height = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.15);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const render = (now) => {
      frame = 0;
      if (document.hidden || !visibility.active) return;
      if (now - lastDraw < 28) {
        startLoop(render);
        return;
      }
      lastDraw = now;

      pointer.tx += (pointer.x - pointer.tx) * 0.08;
      pointer.ty += (pointer.y - pointer.ty) * 0.08;
      trail[0].x += (pointer.tx - trail[0].x) * 0.24;
      trail[0].y += (pointer.ty - trail[0].y) * 0.24;

      for (let index = 1; index < trail.length; index += 1) {
        trail[index].x += (trail[index - 1].x - trail[index].x) * 0.13;
        trail[index].y += (trail[index - 1].y - trail[index].y) * 0.13;
      }

      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform2f(pointerLocation, pointer.tx, pointer.ty);
      trailLocations.forEach((location, index) => {
        gl.uniform2f(location, trail[index].x, trail[index].y);
      });
      gl.uniform1f(timeLocation, (now - startTime) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      startLoop(render);
    };
    renderFrame = render;

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    startLoop(render);

    return () => {
      stopLoop();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [variant]);

  return <canvas className={`interactive-waves-canvas interactive-waves-${variant} ${className}`.trim()} ref={canvasRef} aria-hidden="true" />;
}

export default InteractiveWavesCanvas;
