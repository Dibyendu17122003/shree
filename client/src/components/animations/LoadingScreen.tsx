import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  ready?: boolean;
}

function getStarCount() {
  return typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 30;
}

export default function LoadingScreen({ onComplete, ready = true }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fade'>('loading');
  const [stars] = useState(getStarCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99 && ready) {
          clearInterval(interval);
          setPhase('fade');
          setTimeout(onComplete, 600);
          return 100;
        }
        const next = prev + Math.random() * 3 + 1;
        if (next >= 100 && ready) {
          clearInterval(interval);
          setPhase('fade');
          setTimeout(onComplete, 600);
          return 100;
        }
        return Math.min(next, 99);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete, ready]);

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, #1a0a1e 0%, #0a0a0f 100%)',
            zIndex: 100,
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="text-7xl sm:text-8xl mb-6 sm:mb-8"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ❤️
          </motion.div>

          <motion.p
            className="text-xl sm:text-2xl font-script text-rose-300 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading something special...
          </motion.p>

          <div className="w-48 sm:w-56 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #ff6b9d, #e91e63, #ff4081)',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            className="text-sm text-white/40 mt-3 sm:mt-4 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.round(progress)}%
          </motion.p>

          {[...Array(stars)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: '#fff',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 3,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
