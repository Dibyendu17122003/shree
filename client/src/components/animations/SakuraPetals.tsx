import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

export default function SakuraPetals({ count = 15 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 12 + 8,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 15,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 200,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-5%',
            width: petal.size,
            height: petal.size * 0.7,
            opacity: 0.6,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, petal.drift],
            rotate: [petal.rotation, petal.rotation + 720],
            opacity: [0.6, 0.2, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        >
          <svg viewBox="0 0 24 24" fill="#ffb7c5" width="100%" height="100%">
            <path d="M12 2C12 2 8 6 8 10C8 13.3 10.7 16 12 16C13.3 16 16 13.3 16 10C16 6 12 2 12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
