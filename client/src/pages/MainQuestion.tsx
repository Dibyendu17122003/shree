import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from '../components/animations/FloatingHearts';
import SakuraPetals from '../components/animations/SakuraPetals';
import Sparkles from '../components/animations/Sparkles';
import ConfettiEffect from '../components/animations/ConfettiEffect';
import NoButton from '../components/questions/NoButton';
import { useSession } from '../hooks/useSession';

const TEASE_MSG = "I know in your heart it was always YES... you were just testing my patience, weren't you, Shree? 😏❤️";

const blurBubbles = [...Array(6)].map((_, i) => ({
  w: Math.random() * 300 + 100,
  h: Math.random() * 300 + 100,
  l: Math.random() * 100,
  t: Math.random() * 100,
  dur: Math.random() * 4 + 3,
  del: Math.random() * 2,
  i,
}));

const celebrationEmojis = ['🎉', '✨', '💫', '🌟', '🎊', '💖', '💗', '🌹'].map((emoji, i) => ({
  emoji,
  tp: Math.random() * 60 + 20,
  yAmt: -40 - Math.random() * 40,
  dur: 2 + Math.random(),
  i,
}));

export default function MainQuestion() {
  const navigate = useNavigate();
  const { saveAnswer, updateState } = useSession();
  const [saidYes, setSaidYes] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [hideNo, setHideNo] = useState(false);
  const [showTease, setShowTease] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleYes = () => {
    setSaidYes(true);
    setShowFireworks(true);
    setHideNo(true);
    setShowTease(false);
    saveAnswer('main_question', 'Will you go on a date with me?', 'Yes', 'YES ❤️');
    updateState({ currentStep: 0, answers: { main_question: 'Yes' } });
    setTimeout(() => navigate('/questions'), 4000);
  };

  const handleNo = () => {
    saveAnswer('main_question', 'Will you go on a date with me?', 'No', 'NO 💔');
  };

  const handleNoExhausted = () => {
    setShowTease(true);
    setHideNo(true);
    setTimeout(() => {
      handleYes();
    }, 5000);
  };

  const glowColors = [
    '0 0 40px rgba(233,30,99,0.6), 0 0 80px rgba(233,30,99,0.3), 0 0 120px rgba(233,30,99,0.15)',
    '0 0 50px rgba(255,64,129,0.7), 0 0 100px rgba(255,64,129,0.4), 0 0 150px rgba(255,64,129,0.2)',
    '0 0 60px rgba(233,30,99,0.8), 0 0 120px rgba(233,30,99,0.4), 0 0 180px rgba(233,30,99,0.2)',
  ];

  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/15 via-fuchsia-900/5 to-purple-900/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent" />

      <FloatingHearts count={15} />
      <SakuraPetals count={12} />
      <Sparkles count={30} />
      <ConfettiEffect fire={showFireworks} />

      {blurBubbles.map(b => (
        <motion.div
          key={b.i}
          className="absolute rounded-full bg-rose-500/10 blur-3xl"
          style={{ width: b.w, height: b.h, left: `${b.l}%`, top: `${b.t}%` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.del }}
        />
      ))}

      <AnimatePresence mode="wait">
        {showTease ? (
          <motion.div
            key="tease"
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0a0f]/90 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center max-w-lg w-full"
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 }}
            >
              <motion.div
                className="text-5xl sm:text-6xl mb-4 sm:mb-6"
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                😏
              </motion.div>
              <motion.p
                className="text-lg sm:text-2xl md:text-3xl font-script text-rose-200 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {TEASE_MSG}
              </motion.p>
              <motion.p
                className="text-xs sm:text-sm text-rose-400/60 mt-4 sm:mt-6 font-script"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Redirecting you to the right answer...
              </motion.p>
              <motion.div
                className="mt-3 sm:mt-4 flex justify-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-400"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : !saidYes ? (
          <motion.div
            key="question"
            className="relative z-10 text-center px-4 sm:px-6 w-full max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative mb-4 sm:mb-8"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="text-5xl sm:text-7xl md:text-8xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                💌
              </motion.div>
              <motion.div
                className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 text-xl sm:text-3xl"
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.5] }}
                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 sm:-bottom-4 sm:-left-4 text-lg sm:text-2xl"
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.5] }}
                transition={{ duration: 1.5, delay: 1, repeat: Infinity }}
              >
                🌹
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mb-4 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.h1
                className="text-xl sm:text-3xl md:text-5xl font-script text-gradient leading-relaxed"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Shree,
                <br />
                <span className="text-2xl sm:text-4xl md:text-6xl">Will you go on a date with me?</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-xs sm:text-base text-white/40 mb-6 sm:mb-12 font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Every great love story starts with a yes...
            </motion.p>

            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <motion.button
                ref={yesBtnRef}
                className="relative px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300
                  bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400
                  active:scale-95"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: glowColors[glowIntensity],
                }}
                transition={{
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: '0 0 60px rgba(233,30,99,0.7), 0 0 120px rgba(233,30,99,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
              >
                <motion.span
                  className="relative z-10 flex items-center gap-1 sm:gap-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  YES ❤️
                </motion.span>
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 opacity-0"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ filter: 'blur(20px)' }}
                />
              </motion.button>

              <NoButton onNoClick={handleNo} onExhausted={handleNoExhausted} disabled={hideNo} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            className="relative z-10 text-center px-4 sm:px-6 w-full max-w-lg mx-auto py-8"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 150, damping: 12 }}
          >
            <motion.div
              className="text-6xl sm:text-8xl md:text-9xl mb-3 sm:mb-6"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -8, 8, -5, 5, 0],
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              ❤️
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-5xl md:text-7xl font-script text-gradient mb-2 sm:mb-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              YAY! ❤️
            </motion.h2>

            <motion.p
              className="text-lg sm:text-2xl text-rose-300/70 font-script mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              I knew it, Shree! 🥹
            </motion.p>

            <motion.p
              className="text-xs sm:text-base text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You've made me the happiest person...
            </motion.p>

            {celebrationEmojis.map(e => (
              <motion.div
                key={e.i}
                className="absolute text-lg sm:text-2xl pointer-events-none"
                style={{ left: `${15 + (e.i * 10)}%`, top: `${e.tp}%` }}
                animate={{ y: [0, e.yAmt], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                transition={{ duration: e.dur, delay: e.i * 0.15, repeat: Infinity }}
              >
                {e.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
