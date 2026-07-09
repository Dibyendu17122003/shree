import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../hooks/useSession';
import LoadingScreen from '../components/animations/LoadingScreen';
import FloatingHearts from '../components/animations/FloatingHearts';
import Sparkles from '../components/animations/Sparkles';

const floatingEmojis = ['✨', '🌸', '🦋', '⭐', '💫'].map((emoji, i) => {
  const fs = Math.random() * 20 + 10;
  const l = Math.random() * 100;
  const t = Math.random() * 100;
  const dur = 3 + Math.random() * 2;
  const del = Math.random() * 3;
  return { emoji, fs, l, t, dur, del, i };
});

export default function Landing() {
  const navigate = useNavigate();
  const { loading } = useSession();
  const [showLoader, setShowLoader] = useState(true);
  const [loaderReady, setLoaderReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!loading && started) {
      navigate('/question');
    }
  }, [loading, started, navigate]);

  const handleLoaderDone = () => {
    setLoaderReady(true);
    if (!loading) {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (loaderReady && !loading) {
      setShowLoader(false);
    }
  }, [loaderReady, loading]);

  if (showLoader) {
    return <LoadingScreen onComplete={handleLoaderDone} ready={!loading} />;
  }

  if (!loading && started) {
    return null;
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <FloatingHearts count={15} />
      <Sparkles count={25} />

      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-purple-900/10" />

      <AnimatePresence>
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 max-w-lg w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-6xl sm:text-7xl mb-6 sm:mb-8"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ❤️
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-script mb-2 text-gradient leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Hi Shree ❤️
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-rose-300/50 mb-4 sm:mb-6 font-script"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            For SUSHAMA
          </motion.p>

          <motion.p
            className="text-base sm:text-xl text-white/70 mb-6 sm:mb-8 font-light leading-relaxed px-2 sm:px-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            I made something special for you.
            <br />
            <span className="text-rose-300">Please don't leave before finishing.</span>
          </motion.p>

          <motion.button
            className="btn-primary text-lg sm:text-xl px-10 sm:px-12 py-4 sm:py-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
          >
            Continue ❤️
          </motion.button>

          {floatingEmojis.map(e => (
            <motion.div
              key={e.i}
              className="absolute pointer-events-none"
              style={{ fontSize: e.fs, left: `${e.l}%`, top: `${e.t}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: e.dur, delay: e.del, repeat: Infinity }}
            >
              {e.emoji}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
