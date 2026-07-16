import { useColorMode } from '@docusaurus/theme-common';
import React, { useEffect, useRef } from 'react';

/**
 * Ambient "cursor wake" backdrop (ported from the DocSearch MCP app): a faint
 * field of source-code characters inside the page gradient. Moving the mouse
 * stirs the field — glyphs along the pointer path flicker and a few resolve
 * into accent-colored characters (the crawler parsing raw text into docs). A
 * DocSearch logomark is stamped as cell-art on the right.
 *
 * Zero-dependency canvas 2D engine. Reads --font-mono and --backdrop-glyph*
 * tokens. Respects prefers-reduced-motion (renders a single static frame) and
 * pauses when hidden or scrolled out of view.
 */

const CELL_W = 14;
const CELL_H = 18;
const FONT_SIZE = 11;
const SPRITE_PAD = 3;
const MAX_DPR = 2;
const MAX_CELLS = 6000;
const FRAME_MS = 1000 / 24;
const MAX_STEP_MS = 100;
const ALPHA_CULL = 0.015;

const FIELD_DENSITY = 0.45;
const FIELD_SEED = 0x0c5eed;
const ROLL_SEED = 0xa11a9e;
const FLICKER_MS = 320;
const ACCENT_MS = 1200;
const ACCENT_CHANCE = 0.08;
const HOT_BOOST = 0.7;
const POINTER_RADIUS = 8;
const POINTER_STIR_FULL = 3;
const Y_ASPECT = CELL_H / CELL_W;

const FIELD_GLYPHS =
  'abcdefghijklmnopqrstuvwxyz0123456789' +
  '{}[]()<>/=;:.+-*&|#$%_?!{}[]()<>/=;:.+-*&|#$%_?!' +
  '~^\'"`\\@,λ';
const SAFE_GLYPHS = '{}<>/;=*&#';
const DECODE_GLYPHS = 'docsearchmp';

const LOGO_ART = [
  '.................',
  '                 .....',
  ' -----------         ...',
  '--------------         ..',
  '                        ..',
  ' ---------------         ..',
  ' ---------------         ..',
  '                          .',
  ' ---------------         ..',
  ' ---------------         ..',
  '                        ..',
  ' -------------         ..',
  ' -----------         ...',
  '                 ....',
  ' .................',
];
const LOGO_MARGIN_MIN = 4;
const LOGO_MARGIN_FRAC = 0.12;
const LOGO_BASE = 0.34;
const LOGO_GLOW_RADIUS = 12;
const LOGO_GLOW = 0.55;
const NO_HOME = 0xffff;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function auditionGlyphs(candidates, font) {
  const probe = document.createElement('canvas');
  probe.width = 24;
  probe.height = 24;
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) return candidates;
  const signature = (ch) => {
    ctx.clearRect(0, 0, 24, 24);
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(ch, 12, 12);
    return ctx.getImageData(0, 0, 24, 24).data.join();
  };
  const tofu = signature('￾');
  const blank = signature(' ');
  const kept = candidates.filter((ch) => {
    const sig = signature(ch);
    return sig !== tofu && sig !== blank;
  });
  return kept.length > 0 ? kept : [...SAFE_GLYPHS];
}

function buildAtlas(glyphs, font, colors, dpr) {
  const cw = CELL_W + SPRITE_PAD * 2;
  const ch = CELL_H + SPRITE_PAD * 2;
  const sprites = document.createElement('canvas');
  sprites.width = Math.ceil(cw * dpr) * glyphs.length;
  sprites.height = Math.ceil(ch * dpr) * 2;
  const ctx = sprites.getContext('2d');
  if (!ctx) return null;
  const spriteW = sprites.width / glyphs.length;
  const spriteH = sprites.height / 2;
  ctx.setTransform(spriteW / cw, 0, 0, spriteH / ch, 0, 0);
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let row = 0; row < 2; row++) {
    ctx.fillStyle = colors[row];
    for (let i = 0; i < glyphs.length; i++) {
      ctx.fillText(glyphs[i], i * cw + cw / 2, row * ch + ch / 2);
    }
  }
  return { sprites, spriteW, spriteH };
}

function createCursorWakeScene(fieldCount, decodeCount, logoGlyph) {
  const roll = mulberry32(ROLL_SEED);
  let time = 0;
  let pointerOn = false;
  let px = 0;
  let py = 0;
  let prevX = 0;
  let prevY = 0;

  let base = new Float32Array(0);
  let phase = new Float32Array(0);
  let speed = new Float32Array(0);
  let cx = new Float32Array(0);
  let cy = new Float32Array(0);
  let hot = new Float32Array(0);
  let flicker = new Float32Array(0);
  let accentT = new Float32Array(0);
  let home = new Uint16Array(0);

  const scene = {
    cols: 0,
    rows: 0,
    glyph: new Uint16Array(0),
    alpha: new Float32Array(0),
    accent: new Uint8Array(0),
    reinit,
    step,
    setPointer,
    clearPointer,
  };

  function setPointer(x, y) {
    if (!pointerOn) {
      prevX = x;
      prevY = y;
    }
    pointerOn = true;
    px = x;
    py = y;
  }

  function clearPointer() {
    pointerOn = false;
  }

  function reinit(cols, rows) {
    const rng = mulberry32(FIELD_SEED);
    const count = cols * rows;
    scene.cols = cols;
    scene.rows = rows;
    scene.glyph = new Uint16Array(count);
    scene.alpha = new Float32Array(count);
    scene.accent = new Uint8Array(count);
    base = new Float32Array(count);
    phase = new Float32Array(count);
    speed = new Float32Array(count);
    cx = new Float32Array(count);
    cy = new Float32Array(count);
    hot = new Float32Array(count);
    flicker = new Float32Array(count);
    accentT = new Float32Array(count);
    home = new Uint16Array(count).fill(NO_HOME);
    for (let i = 0; i < count; i++) {
      base[i] = rng() < FIELD_DENSITY ? 0.12 + rng() * 0.18 : 0;
      scene.glyph[i] = Math.floor(rng() * fieldCount);
      phase[i] = rng() * Math.PI * 2;
      speed[i] = (Math.PI * 2) / (9000 + rng() * 9000);
      cx[i] = (i % cols) + 0.5;
      cy[i] = (Math.floor(i / cols) + 0.5) * Y_ASPECT;
      scene.alpha[i] = base[i];
    }
    const logoW = Math.max(...LOGO_ART.map((line) => line.length));
    const logoH = LOGO_ART.length;
    const margin = Math.max(LOGO_MARGIN_MIN, Math.round(cols * LOGO_MARGIN_FRAC));
    const x0 = cols - logoW - margin;
    if (x0 >= 2 && rows >= logoH + 2) {
      const y0 = Math.round((rows - logoH) / 2);
      for (let r = 0; r < logoH; r++) {
        const line = LOGO_ART[r];
        for (let c = 0; c < line.length; c++) {
          if (line[c] === ' ') continue;
          const i = (y0 + r) * cols + (x0 + c);
          const g = logoGlyph(line[c]);
          base[i] = LOGO_BASE + rng() * 0.08;
          home[i] = g;
          scene.glyph[i] = g;
          scene.alpha[i] = base[i];
        }
      }
    }
  }

  function step(dt) {
    time += dt;
    const { cols, rows, glyph, alpha, accent } = scene;
    const count = cols * rows;
    const sx = prevX;
    const sy = prevY * Y_ASPECT;
    const dx = px - prevX;
    const dy = (py - prevY) * Y_ASPECT;
    const segLen2 = dx * dx + dy * dy;
    const strength = pointerOn
      ? Math.min(1, Math.sqrt(segLen2) / POINTER_STIR_FULL)
      : 0;
    const pxa = px;
    const pya = py * Y_ASPECT;
    for (let i = 0; i < count; i++) {
      if (base[i] === 0) continue;
      let a = base[i] * (0.85 + 0.15 * Math.sin(phase[i] + time * speed[i]));
      if (pointerOn && home[i] !== NO_HOME) {
        const gx = cx[i] - pxa;
        const gy = cy[i] - pya;
        const g2 = gx * gx + gy * gy;
        if (g2 < LOGO_GLOW_RADIUS * LOGO_GLOW_RADIUS) {
          a += (1 - Math.sqrt(g2) / LOGO_GLOW_RADIUS) * LOGO_GLOW;
        }
      }
      if (strength > 0) {
        let t =
          segLen2 > 0 ? ((cx[i] - sx) * dx + (cy[i] - sy) * dy) / segLen2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = cx[i] - (sx + t * dx);
        const qy = cy[i] - (sy + t * dy);
        const d = Math.sqrt(qx * qx + qy * qy);
        if (d < POINTER_RADIUS) {
          const heat = (1 - d / POINTER_RADIUS) * strength;
          if (heat > hot[i]) hot[i] = heat;
          if (heat > 0.25 && flicker[i] <= 0) flicker[i] = FLICKER_MS;
          if (accent[i] === 0 && roll() < ACCENT_CHANCE * heat) {
            accent[i] = 1;
            accentT[i] = ACCENT_MS;
            glyph[i] = fieldCount + Math.floor(roll() * decodeCount);
          }
        }
      }
      if (flicker[i] > 0) {
        flicker[i] -= dt;
        if (accent[i] === 0) {
          glyph[i] =
            flicker[i] <= 0 && home[i] !== NO_HOME
              ? home[i]
              : Math.floor(roll() * fieldCount);
        }
      }
      if (hot[i] > 0) {
        a += hot[i] * HOT_BOOST;
        hot[i] = Math.max(0, hot[i] - dt / 900);
      }
      if (accent[i] === 1) {
        accentT[i] -= dt;
        if (accentT[i] <= 0) {
          accent[i] = 0;
          glyph[i] =
            home[i] !== NO_HOME ? home[i] : Math.floor(roll() * fieldCount);
        } else {
          const p = 1 - accentT[i] / ACCENT_MS;
          a = Math.max(a, Math.sin(Math.PI * p) * 0.65);
        }
      }
      alpha[i] = a > 1 ? 1 : a;
    }
    prevX = px;
    prevY = py;
  }

  return scene;
}

function createBackdropEngine(canvas) {
  const rawCtx = canvas.getContext('2d');
  if (!rawCtx) return { setThemeDirty: () => {}, destroy: () => {} };
  const ctx = rawCtx;

  const root = document.documentElement;
  const monoStack =
    getComputedStyle(root).getPropertyValue('--font-mono').trim() || 'monospace';
  const font = `400 ${FONT_SIZE}px ${monoStack}`;

  const fieldGlyphs = auditionGlyphs([...FIELD_GLYPHS], font);
  const glyphs = [...fieldGlyphs, ...DECODE_GLYPHS];
  const scene = createCursorWakeScene(
    fieldGlyphs.length,
    DECODE_GLYPHS.length,
    (ch) => {
      const i = fieldGlyphs.indexOf(ch);
      return i >= 0 ? i : Math.max(0, fieldGlyphs.indexOf('.'));
    },
  );

  let dpr = 1;
  let cssW = 0;
  let cssH = 0;
  let cellW = CELL_W;
  let cellH = CELL_H;
  let atlas = null;

  let rafId = null;
  let lastTs = -1;
  let pointerClientX = 0;
  let pointerClientY = 0;
  let pointerDirty = false;
  let atlasDirty = true;
  let disposed = false;
  let contextLost = false;
  let hidden = document.hidden;
  let intersecting = false;
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedQuery.matches;

  const running = () =>
    !disposed && !reduced && !hidden && intersecting && !contextLost;

  function scheduleFrame() {
    if (rafId === null && !disposed && !contextLost) {
      rafId = requestAnimationFrame(frame);
    }
  }

  function wake() {
    lastTs = -1;
    scheduleFrame();
  }

  function frame(ts) {
    rafId = null;
    if (disposed || contextLost) return;
    const active = running();
    if (active) scheduleFrame();
    if (active && lastTs >= 0 && ts - lastTs < FRAME_MS && !atlasDirty) return;
    if (atlasDirty) {
      const styles = getComputedStyle(root);
      const colors = [
        styles.getPropertyValue('--backdrop-glyph').trim() ||
          'rgb(128 128 128 / 0.4)',
        styles.getPropertyValue('--backdrop-glyph-accent').trim() ||
          'rgb(84 104 255 / 0.6)',
      ];
      atlas = buildAtlas(glyphs, font, colors, dpr);
      atlasDirty = false;
    }
    if (active) {
      if (pointerDirty) {
        const rect = canvas.getBoundingClientRect();
        scene.setPointer(
          (pointerClientX - rect.left) / cellW,
          (pointerClientY - rect.top) / cellH,
        );
        pointerDirty = false;
      }
      const dt = lastTs < 0 ? 0 : Math.min(ts - lastTs, MAX_STEP_MS);
      lastTs = lastTs < 0 ? ts : ts - ((ts - lastTs) % FRAME_MS);
      scene.step(dt);
    }
    render();
  }

  function render() {
    if (!atlas || ctx.isContextLost?.()) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const { glyph, alpha, accent, cols, rows } = scene;
    const { sprites, spriteW, spriteH } = atlas;
    const dw = CELL_W + SPRITE_PAD * 2;
    const dh = CELL_H + SPRITE_PAD * 2;
    const count = cols * rows;
    for (let i = 0; i < count; i++) {
      const a = alpha[i];
      if (a <= ALPHA_CULL) continue;
      ctx.globalAlpha = a > 1 ? 1 : a;
      ctx.drawImage(
        sprites,
        glyph[i] * spriteW,
        accent[i] * spriteH,
        spriteW,
        spriteH,
        (i % cols) * cellW - SPRITE_PAD,
        Math.floor(i / cols) * cellH - SPRITE_PAD,
        dw,
        dh,
      );
    }
    ctx.globalAlpha = 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    cssW = rect.width;
    cssH = rect.height;
    const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    if (nextDpr !== dpr) {
      dpr = nextDpr;
      atlasDirty = true;
    }
    const bufW = Math.round(cssW * dpr);
    const bufH = Math.round(cssH * dpr);
    if (canvas.width !== bufW) canvas.width = bufW;
    if (canvas.height !== bufH) canvas.height = bufH;
    cellW = CELL_W;
    cellH = CELL_H;
    let cols = Math.ceil(cssW / cellW);
    let rows = Math.ceil(cssH / cellH);
    if (cols * rows > MAX_CELLS) {
      const s = Math.sqrt((cols * rows) / MAX_CELLS);
      cellW *= s;
      cellH *= s;
      cols = Math.ceil(cssW / cellW);
      rows = Math.ceil(cssH / cellH);
    }
    if (cols !== scene.cols || rows !== scene.rows) scene.reinit(cols, rows);
    wake();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const io = new IntersectionObserver((entries) => {
    intersecting = entries[entries.length - 1]?.isIntersecting ?? true;
    if (running()) wake();
  });
  io.observe(canvas);

  const onVisibility = () => {
    hidden = document.hidden;
    if (running()) wake();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onPointerMove = (event) => {
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    pointerDirty = true;
  };
  const onPointerGone = () => {
    pointerDirty = false;
    scene.clearPointer();
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerGone);
  window.addEventListener('blur', onPointerGone);

  const onReducedChange = (event) => {
    reduced = event.matches;
    wake();
  };
  reducedQuery.addEventListener('change', onReducedChange);

  const onContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
  };
  const onContextRestored = () => {
    contextLost = false;
    atlasDirty = true;
    wake();
  };
  canvas.addEventListener('contextlost', onContextLost);
  canvas.addEventListener('contextrestored', onContextRestored);

  document.fonts
    ?.load(font)
    .then(() => {
      if (!disposed) {
        atlasDirty = true;
        scheduleFrame();
      }
    })
    .catch(() => {});

  return {
    setThemeDirty: () => {
      atlasDirty = true;
      scheduleFrame();
    },
    destroy: () => {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerGone);
      window.removeEventListener('blur', onPointerGone);
      reducedQuery.removeEventListener('change', onReducedChange);
      canvas.removeEventListener('contextlost', onContextLost);
      canvas.removeEventListener('contextrestored', onContextRestored);
    },
  };
}

export function AsciiBackdrop({ className }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const engine = createBackdropEngine(canvas);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setThemeDirty();
  }, [colorMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(48vh,560px)] w-full forced-colors:hidden print:hidden' +
        (className ? ` ${className}` : '')
      }
      style={{
        maskImage: 'linear-gradient(to bottom, black 55%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent)',
      }}
    />
  );
}

export default AsciiBackdrop;
