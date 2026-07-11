import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from '../components/animations/FloatingHearts';
import SakuraPetals from '../components/animations/SakuraPetals';
import Sparkles from '../components/animations/Sparkles';
import ConfettiEffect from '../components/animations/ConfettiEffect';
import { useSession } from '../hooks/useSession';

const loveLetter = `My Dearest Shree,

From the moment I met you, my world has been brighter. Every laugh we share, every moment we spend together, every memory we create — it all means more to me than words can say.

Shree, you are the most beautiful part of my life. The way you smile, the way you tease me, the way you care — everything about you makes my heart skip a beat.

Thank you for saying yes. Thank you for being you. Thank you for making my heart feel so full.

I promise to make every moment of our date special, to hold your hand, to make you smile, to make you laugh, and to cherish every second with you.

You are my favorite notification, my favorite distraction, and my favorite person. My heart beats only for you.

See you very soon, my love.

Yours forever and always,
The one who loves you endlessly ❤️`;

function parseMeetTime(time: string): number {
  switch (time) {
    case '10:00': return 10;
    case '13:00': return 13;
    case '17:00': return 17;
    default: return 19;
  }
}

export default function FinalScreen() {
  const { state } = useSession();
  const [showLetter, setShowLetter] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showEnvelope, setShowEnvelope] = useState(false);

  const selectedDate = state.answers?.date;
  const selectedTime = state.answers?.meet_time;

  const countdownTarget = useCallback(() => {
    const target = new Date();
    if (selectedDate) {
      const d = new Date(selectedDate);
      target.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    } else {
      target.setDate(target.getDate() + 7);
    }
    target.setHours(parseMeetTime(selectedTime || ''), 0, 0, 0);
    return target;
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const timer = setTimeout(() => setShowEnvelope(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = countdownTarget().getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("It's today! ❤️");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget]);

  const openLetter = useCallback(() => {
    setLetterOpened(true);
    setTimeout(() => {
      setShowLetter(true);
    }, 800);
  }, []);

  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <FloatingHearts count={20} />
      <SakuraPetals count={12} />
      <Sparkles count={30} />
      <ConfettiEffect fire={true} />

      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-purple-900/10" />

      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-lg mx-auto">
        <AnimatePresence>
          {!showEnvelope ? (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 sm:space-y-6 py-8"
            >
              <motion.div
                className="text-6xl sm:text-8xl"
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎉
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-6xl font-script text-gradient"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                YAY! ❤️
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl font-display text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                SUSHAMA
              </motion.p>

              <motion.p
                className="text-lg sm:text-xl font-display text-gradient font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Our Date Is Official ❤️
              </motion.p>

              <motion.p
                className="text-base sm:text-lg text-rose-300/60 font-script px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Thank you for saying YES, Shree.
                <br />
                My heart is yours forever.
                <br />
                <span className="text-rose-400/80">I seriously can't wait to see you.</span>
              </motion.p>

              <motion.div
                className="glass-card p-4 sm:p-6 mt-4 sm:mt-6 mx-auto max-w-xs sm:max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-xs sm:text-sm text-white/40 mb-1 sm:mb-2">See you in...</p>
                <p className="text-2xl sm:text-3xl font-mono text-gradient font-bold">
                  {timeLeft}
                </p>
                {selectedDate && (
                  <p className="text-[10px] sm:text-xs text-white/30 mt-1 sm:mt-2 font-script">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {selectedTime ? ` at ${selectedTime.replace(':', ':')}` : ''}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {['❤️', '💕', '💗', '💖', '💝'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl sm:text-2xl"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ) : !letterOpened ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center cursor-pointer py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={openLetter}
              whileHover={{ scale: 1.03 }}
            >
              <motion.p
                className="text-base sm:text-lg text-rose-300/80 font-script mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                I have something for you...
              </motion.p>

              <div className="relative">
                {/* ==========================================
                    POLAROID PHOTOS AROUND THE ENVELOPE
                    Replace the placeholder bg gradients below
                    with your own image URLs like:
                    backgroundImage: 'url(https://your-image-url.jpg)'
                    ========================================== */}
                {[
                  { angle: -18, x: -120, y: -50, delay: 0, rotate: -12 },
                  { angle: 22, x: 120, y: -70, delay: 0.3, rotate: 8 },
                  { angle: -25, x: -110, y: 70, delay: 0.6, rotate: -8 },
                  { angle: 20, x: 110, y: 60, delay: 0.9, rotate: 10 },
                  { angle: -15, x: -60, y: -110, delay: 1.2, rotate: -5 },
                  { angle: 15, x: 60, y: -120, delay: 1.5, rotate: 6 },
                ].map((photo, i) => (
                  <motion.div
                    key={i}
                    className="absolute hidden sm:block"
                    style={{ left: '50%', top: '50%' }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: photo.x,
                      y: [photo.y, photo.y - 8, photo.y],
                    }}
                    transition={{
                      opacity: { delay: 1.5 + photo.delay, duration: 0.5 },
                      scale: { delay: 1.5 + photo.delay, duration: 0.5 },
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <div
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-cover bg-center shadow-xl"
                      style={{
                          // 📷 Place your photo at: client/public/images/photo${i + 1}.jpg
                        backgroundImage: `url(/images/photo${i + 1}.jpg)`,
                        transform: `rotate(${photo.rotate}deg)`,
                        border: '3px solid rgba(255,255,255,0.9)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </motion.div>
                ))}

                {/* Mobile photos (simpler, 2 visible) */}
                {[
                  { x: -70, y: -40, delay: 0, rotate: -10 },
                  { x: 70, y: -45, delay: 0.4, rotate: 8 },
                  { x: -65, y: 45, delay: 0.8, rotate: -6 },
                  { x: 65, y: 40, delay: 1.2, rotate: 7 },
                ].map((photo, i) => (
                  <motion.div
                    key={`m${i}`}
                    className="absolute sm:hidden"
                    style={{ left: '50%', top: '50%' }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: photo.x,
                      y: [photo.y, photo.y - 5, photo.y],
                    }}
                    transition={{
                      opacity: { delay: 1.5 + photo.delay, duration: 0.5 },
                      scale: { delay: 1.5 + photo.delay, duration: 0.5 },
                      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <div
                      className="w-14 h-16 rounded-md bg-cover bg-center shadow-lg"
                      style={{
                        // 📷 Place your photo at: client/public/images/photo${i + 7}.jpg
                        backgroundImage: `url(/images/photo${i + 7}.jpg)`,
                        transform: `rotate(${photo.rotate}deg)`,
                        border: '2px solid rgba(255,255,255,0.9)',
                      }}
                    />
                  </motion.div>
                ))}

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-40 h-28 sm:w-48 sm:h-36 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-400 to-pink-600 rounded-t-2xl sm:rounded-t-3xl rounded-b-md shadow-2xl shadow-rose-500/30" />
                    <div className="absolute top-0 left-0 right-0 h-0">
                      <div className="w-40 sm:w-48 h-14 sm:h-18 bg-gradient-to-b from-rose-300 to-rose-400"
                        style={{
                          clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
                          transform: 'translateY(-0.5px)',
                        }}
                      />
                    </div>
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      💌
                    </motion.div>
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2">
                      <div className="w-16 sm:w-24 h-0.5 sm:h-1 rounded-full bg-white/20" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.p
                className="text-xs sm:text-sm text-white/40 mt-3 sm:mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Tap to open ❤️
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              className="glass-card p-4 sm:p-8 max-w-lg mx-auto text-left relative"
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl font-script text-gradient text-center mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                A Letter For My Shree ❤️
              </motion.h2>

              <div className="space-y-3 sm:space-y-4">
                {loveLetter.split('\n\n').map((paragraph, i) => (
                  <motion.p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed text-white/80 font-script"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
