import { useEffect, useRef } from 'react';

interface GlobeParticlesProps {
  /** When true, a soft NHID-teal focus glow pulses over the globe. */
  active: boolean;
  containerElement: HTMLDivElement | null;
}

/**
 * A restrained canvas overlay: a slow teal halo that pulses when a country is
 * selected. Deliberately subtle — operational, not a fireworks display.
 */
export default function GlobeParticles({ active, containerElement }: GlobeParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!canvasRef.current || !containerElement) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = containerElement.offsetWidth * dpr;
      canvas.height = containerElement.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.016;
      const w = containerElement.offsetWidth;
      const h = containerElement.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (activeRef.current) {
        const cx = w / 2;
        const cy = h / 2;
        const pulse = 1 + Math.sin(t * 1.6) * 0.12;
        const r = Math.min(w, h) * 0.42 * pulse;
        const g = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
        g.addColorStop(0, 'rgba(20, 184, 166, 0)');
        g.addColorStop(0.85, 'rgba(20, 184, 166, 0.10)');
        g.addColorStop(1, 'rgba(20, 184, 166, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateSize);
    };
  }, [containerElement]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
