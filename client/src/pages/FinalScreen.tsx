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

const desktopPhotos = [
  { radius: 280, startAngle: -20, tilt: -7, delay: 0.15 },
  { radius: 290, startAngle: 52, tilt: 6, delay: 0.35 },
  { radius: 270, startAngle: 124, tilt: -5, delay: 0.55 },
  { radius: 285, startAngle: 196, tilt: 8, delay: 0.75 },
  { radius: 260, startAngle: 268, tilt: -3, delay: 0.95 },
];

const mobilePhotos = [
  { radius: 135, startAngle: -15, tilt: -6, delay: 0.15 },
  { radius: 140, startAngle: 105, tilt: 5, delay: 0.45 },
  { radius: 130, startAngle: 225, tilt: -3, delay: 0.75 },
];

function PolaroidCard({ src, tilt, width, height, bottom }: { src: string; tilt: number; width: number; height: number; bottom: number }) {
  return (
    <div
      className="bg-white rounded-[3px] shadow-2xl shadow-rose-900/30 overflow-hidden"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        className="bg-contain bg-center bg-no-repeat"
        style={{ width, height, backgroundColor: 'rgba(0,0,0,0.08)', backgroundImage: `url(${src})` }}
      />
      <div className="flex items-center justify-center" style={{ height: bottom }}>
        <div className="w-3 h-3 rounded-full bg-rose-200/20" />
      </div>
    </div>
  );
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
    <div className="relative min-h-dvh flex items-center justify-center bg-[#0a0a0f]">
      <FloatingHearts count={20} />
      <SakuraPetals count={12} />
      <Sparkles count={30} />
      <ConfettiEffect fire={true} />

      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-purple-900/10" />

      <AnimatePresence mode="wait">
        {!showEnvelope ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center px-4 sm:px-6 w-full max-w-lg mx-auto"
          >
            <div className="space-y-4 sm:space-y-6 py-8">
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
            </div>
          </motion.div>
        ) : !letterOpened ? (
          <motion.div
            key="envelope"
            className="relative z-10 w-full min-h-dvh flex flex-col items-center justify-center overflow-visible px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-base sm:text-lg text-rose-300/80 font-script mb-4 sm:mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              I have something for you...
            </motion.p>

            <div className="relative flex items-center justify-center overflow-visible" style={{ minHeight: 360, minWidth: 360 }}>
              {/* Desktop Photos — orbit around envelope */}
              <div className="hidden sm:block absolute inset-0 overflow-visible pointer-events-none">
                {desktopPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ left: '50%', top: '50%', transformOrigin: '0 0' }}
                    initial={{ rotate: photo.startAngle, scale: 0, opacity: 0 }}
                    animate={{ rotate: photo.startAngle + 360, scale: 1, opacity: 1 }}
                    transition={{
                      rotate: { duration: 40, repeat: Infinity, ease: 'linear', delay: 1.8 + photo.delay },
                      scale: { duration: 0.5, type: 'spring', stiffness: 180, damping: 14, delay: 0.6 + photo.delay },
                      opacity: { duration: 0.4, delay: 0.6 + photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <motion.div
                      style={{ transform: `translateX(${photo.radius}px)` }}
                      initial={{ rotate: -photo.startAngle }}
                      animate={{ rotate: -photo.startAngle - 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 1.8 + photo.delay }}
                    >
                      <PolaroidCard
                        src={`/images/photo${i + 1}.jpg`}
                        tilt={photo.tilt}
                        width={240}
                        height={180}
                        bottom={30}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Photos — orbit around envelope */}
              <div className="sm:hidden absolute inset-0 overflow-visible pointer-events-none">
                {mobilePhotos.map((photo, i) => (
                  <motion.div
                    key={`m${i}`}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ left: '50%', top: '50%', transformOrigin: '0 0' }}
                    initial={{ rotate: photo.startAngle, scale: 0, opacity: 0 }}
                    animate={{ rotate: photo.startAngle + 360, scale: 1, opacity: 1 }}
                    transition={{
                      rotate: { duration: 35, repeat: Infinity, ease: 'linear', delay: 1.8 + photo.delay },
                      scale: { duration: 0.4, type: 'spring', stiffness: 150, damping: 12, delay: 0.6 + photo.delay },
                      opacity: { duration: 0.35, delay: 0.6 + photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <motion.div
                      style={{ transform: `translateX(${photo.radius}px)` }}
                      initial={{ rotate: -photo.startAngle }}
                      animate={{ rotate: -photo.startAngle - 360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: 'linear', delay: 1.8 + photo.delay }}
                    >
                      <PolaroidCard
                        src={`/images/photo${i + 3}.jpg`}
                        tilt={photo.tilt}
                        width={130}
                        height={100}
                        bottom={18}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Envelope */}
              <motion.div
                className="relative z-10 cursor-pointer"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                onClick={openLetter}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-40 h-28 sm:w-52 sm:h-36 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-400 to-pink-600 rounded-t-2xl sm:rounded-t-3xl rounded-b-md shadow-2xl shadow-rose-500/40" />
                  <div className="absolute top-0 left-0 right-0 h-0">
                    <div
                      className="w-40 sm:w-52 h-14 sm:h-[74px] bg-gradient-to-b from-rose-300 to-rose-400"
                      style={{
                        clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
                        transform: 'translateY(-0.5px)',
                      }}
                    />
                  </div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl"
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
              className="text-xs sm:text-sm text-white/40 mt-6 sm:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Tap the envelope to open your letter ❤️
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="relative z-20 px-4 sm:px-6 w-full max-w-lg mx-auto py-8"
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div className="glass-card p-4 sm:p-8 text-left">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
