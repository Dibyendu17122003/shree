import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  fire: boolean;
  type?: 'default' | 'emoji' | 'heart';
}

export default function ConfettiEffect({ fire, type = 'default' }: Props) {
  useEffect(() => {
    if (!fire) return;

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#ff6b9d', '#e91e63', '#ff4081', '#ff80ab', '#f48fb1'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#ff6b9d', '#e91e63', '#ff4081', '#ff80ab', '#f48fb1'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    const heartConfetti = () => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff6b9d', '#e91e63', '#ff4081'],
        shapes: ['circle'],
        scalar: 1.5,
      });
    };

    const int1 = setInterval(heartConfetti, 500);
    setTimeout(() => clearInterval(int1), 3000);

    const massive = () => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ff6b9d', '#e91e63', '#ff4081', '#ff80ab', '#f48fb1', '#ffd700'],
      });
    };
    setTimeout(massive, 500);
    setTimeout(massive, 1500);
    setTimeout(massive, 2500);

    return () => {};
  }, [fire]);

  return null;
}
