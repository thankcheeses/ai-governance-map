import { useEffect, useRef } from 'react';

/**
 * The sky behind the globe.
 *
 * Earth floating on flat black reads as a missing background, not as space. This
 * draws a deterministic starfield — same seed every load, so the sky does not
 * reshuffle on every render — with a faint Milky Way band across it.
 *
 * It is decoration and says nothing about the data, so it sits behind the map,
 * never interacts, and disappears entirely under `prefers-reduced-motion` drift.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deterministic PRNG: the sky is the same every visit.
    let seed = 0x2f6e2b1;
    const rand = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      seed = 0x2f6e2b1;

      // Deep-space gradient: not pure black, which is what made it look empty.
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.8);
      bg.addColorStop(0, '#0E1A30');
      bg.addColorStop(0.55, '#0A1222');
      bg.addColorStop(1, '#060B16');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Milky Way band — a soft diagonal haze, deliberately very low contrast.
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(-0.42);
      const band = ctx.createLinearGradient(0, -h * 0.34, 0, h * 0.34);
      band.addColorStop(0, 'rgba(120,150,210,0)');
      band.addColorStop(0.5, 'rgba(142,168,224,0.03)');
      band.addColorStop(1, 'rgba(120,150,210,0)');
      ctx.fillStyle = band;
      ctx.fillRect(-w, -h * 0.34, w * 2, h * 0.68);
      ctx.restore();

      // Star density scales with area so a wide screen is not sparse.
      const count = Math.round((w * h) / 5200);
      for (let i = 0; i < count; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const r = rand();
        const radius = r > 0.985 ? 1.5 : r > 0.9 ? 1.05 : 0.65;
        const alpha = 0.08 + rand() * 0.3;
        // A few stars carry colour, as real ones do — most stay near white.
        const tint = rand();
        ctx.fillStyle =
          tint > 0.94
            ? `rgba(180,205,255,${alpha})`
            : tint < 0.05
              ? `rgba(255,222,190,${alpha})`
              : `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
