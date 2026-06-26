import { useEffect, useRef } from 'react';

interface GlobeParticlesProps {
  selectedCountry: string | null;
  containerElement: HTMLDivElement | null;
}

export default function GlobeParticles({ selectedCountry, containerElement }: GlobeParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const updateSize = () => {
      canvas.width = containerElement.offsetWidth;
      canvas.height = containerElement.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Simple particle animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glow effect if country selected
      if (selectedCountry) {
        // Pulse glow in center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const pulseScale = 1 + Math.sin(time * 2) * 0.2;

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          150 * pulseScale
        );
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0.3)'); // Teal with opacity
        gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.1)');
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateSize);
    };
  }, [selectedCountry, containerElement]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}
