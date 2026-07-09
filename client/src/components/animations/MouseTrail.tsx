import { useEffect, useRef } from 'react';

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
      mouseRef.current = { x: pos.x, y: pos.y, moved: true };
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: pos.x + (Math.random() - 0.5) * 10,
          y: pos.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 1,
          life: 1,
          size: Math.random() * 6 + 4,
        });
      }
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onMouse);

    const colors = ['#ff6b9d', '#e91e63', '#ff4081', '#ff80ab', '#f48fb1'];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.reduce((acc, p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02;
        p.life -= 0.015;
        if (p.life <= 0) return acc;
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
        ctx.fillStyle = color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
        ctx.fill();
        acc.push(p);
        return acc;
      }, [] as typeof particles.current);

      if (particles.current.length < 100 && mouseRef.current.moved) {
        requestAnimationFrame(animate);
      } else if (particles.current.length > 0) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => requestAnimationFrame(animate), 100);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
