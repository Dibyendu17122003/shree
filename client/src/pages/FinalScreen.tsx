import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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

const desktopPhotos = [
  { radius: 280, startAngle: -20, tilt: -7, delay: 0.15 },
  { radius: 290, startAngle: 52, tilt: 6, delay: 0.35 },
  { radius: 270, startAngle: 124, tilt: -5, delay: 0.55 },
  { radius: 285, startAngle: 196, tilt: 8, delay: 0.75 },
  { radius: 260, startAngle: 268, tilt: -3, delay: 0.95 },
];

const mobilePhotos = [
  { radius: 125, startAngle: -15, tilt: -6, delay: 0.15 },
  { radius: 130, startAngle: 105, tilt: 5, delay: 0.45 },
  { radius: 120, startAngle: 225, tilt: -3, delay: 0.75 },
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

function parseMeetTime(time: string): number {
  if (time === '10:00') return 10;
  if (time === '13:00') return 13;
  if (time === '17:00') return 17;
  return 19;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatTime(time: string): string {
  if (time === '10:00') return '10 AM ☀️';
  if (time === '13:00') return '1 PM 🌤️';
  if (time === '17:00') return '5 PM 🌆';
  return time;
}

function CountdownTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.06] w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg shadow-rose-900/10">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="text-xl sm:text-2xl font-bold tabular-nums text-gradient"
            initial={{ y: 16, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs text-white/40 mt-1.5 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function FinalScreen() {
  const { state } = useSession();
  const location = useLocation();
  const [showLetter, setShowLetter] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const selectedDate = location.state?.date || state.answers?.date;
  const selectedTime = location.state?.time || state.answers?.meet_time;

  const countdownTarget = useCallback(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d, parseMeetTime(selectedTime || ''), 0, 0, 0);
    }
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 7);
    fallback.setHours(parseMeetTime(selectedTime || ''), 0, 0, 0);
    return fallback;
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const timer = setTimeout(() => setShowEnvelope(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const update = () => {
      const diff = countdownTarget().getTime() - Date.now();
      if (diff <= 0) {
        setDays(0); setHours(0); setMinutes(0); setSeconds(0);
        return;
      }
      setDays(Math.floor(diff / 86400000));
      setHours(Math.floor((diff % 86400000) / 3600000));
      setMinutes(Math.floor((diff % 3600000) / 60000));
      setSeconds(Math.floor((diff % 60000) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget]);

  const openLetter = useCallback(() => {
    setLetterOpened(true);
    setTimeout(() => setShowLetter(true), 800);
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
            <div className="space-y-5 sm:space-y-7 py-8">
              <motion.div
                className="text-6xl sm:text-8xl"
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎉
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-7xl font-script text-gradient"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                YAY! ❤️
              </motion.h1>

              <motion.p
                className="text-2xl sm:text-3xl font-display text-white/80 tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                SUSHAMA
              </motion.p>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-lg sm:text-xl font-display text-gradient font-bold">
                  Our Date Is Official ❤️
                </p>
                <div className="w-16 h-[2px] bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 mx-auto rounded-full" />
              </motion.div>

              {selectedDate && (
                <motion.div
                  className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-7 mx-auto max-w-xs sm:max-w-sm shadow-xl shadow-rose-900/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                    <span className="text-lg">📅</span>
                    <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-medium">Date</span>
                  </div>
                  <p className="text-sm sm:text-lg text-white/90 font-script leading-relaxed">
                    {formatDate(selectedDate)}
                  </p>
                  {selectedTime && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/[0.06]">
                      <p className="text-sm sm:text-base text-rose-300/70 font-script">
                        {formatTime(selectedTime)}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div
                className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mx-auto max-w-xs sm:max-w-sm shadow-xl shadow-rose-900/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <p className="text-xs sm:text-sm text-white/40 mb-3 sm:mb-4 font-medium tracking-wide">See you in ❤️</p>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <CountdownTile value={days} label="Days" />
                  <span className="text-lg sm:text-xl text-white/20 font-light -mt-6 sm:-mt-7">:</span>
                  <CountdownTile value={hours} label="Hrs" />
                  <span className="text-lg sm:text-xl text-white/20 font-light -mt-6 sm:-mt-7">:</span>
                  <CountdownTile value={minutes} label="Min" />
                  <span className="text-lg sm:text-xl text-white/20 font-light -mt-6 sm:-mt-7">:</span>
                  <CountdownTile value={seconds} label="Sec" />
                </div>
              </motion.div>

              <motion.p
                className="text-base sm:text-lg text-rose-300/60 font-script px-2 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Thank you for saying YES, Shree.
                <br />
                <span className="text-rose-400/80">I seriously can't wait to see you.</span>
              </motion.p>

              <motion.div
                className="flex items-center justify-center gap-4 sm:gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {['❤️', '💕', '💗', '💖', '💝'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl sm:text-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="text-xs sm:text-sm text-white/30 font-script animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                Get ready for something special...
              </motion.p>
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
              className="relative z-30 mb-4 sm:mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md inline-block text-base sm:text-lg text-rose-300/80 font-script shadow-lg shadow-rose-900/20">
                I have something for you...
              </span>
            </motion.p>

            <div className="relative flex items-center justify-center overflow-visible" style={{ minHeight: 360, minWidth: 360 }}>
              {/* Desktop Photos */}
              <div className="hidden sm:block absolute inset-0 overflow-visible pointer-events-none">
                {desktopPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ left: '50%', top: '50%', transformOrigin: '0 0', willChange: 'transform' }}
                    initial={{ rotate: photo.startAngle, scale: 0, opacity: 0 }}
                    animate={{ rotate: photo.startAngle + 360, scale: 1, opacity: 1 }}
                    transition={{
                      rotate: { duration: 40, repeat: Infinity, ease: 'linear', delay: 2.5 },
                      scale: { duration: 0.6, ease: 'easeOut', delay: 0.6 + photo.delay },
                      opacity: { duration: 0.4, delay: 0.6 + photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <motion.div
                      style={{ transform: `translateX(${photo.radius}px)`, willChange: 'transform' }}
                      initial={{ rotate: -photo.startAngle }}
                      animate={{ rotate: -photo.startAngle - 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear', delay: 2.5 }}
                    >
                      <PolaroidCard
                        src={`/images/photo${i + 1}.jpg`}
                        tilt={photo.tilt}
                        width={240} height={180} bottom={30}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Photos */}
              <div className="sm:hidden absolute inset-0 overflow-visible pointer-events-none">
                {mobilePhotos.map((photo, i) => (
                  <motion.div
                    key={`m${i}`}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ left: '50%', top: '50%', transformOrigin: '0 0', willChange: 'transform' }}
                    initial={{ rotate: photo.startAngle, scale: 0, opacity: 0 }}
                    animate={{ rotate: photo.startAngle + 360, scale: 1, opacity: 1 }}
                    transition={{
                      rotate: { duration: 45, repeat: Infinity, ease: 'linear', delay: 2.5 },
                      scale: { duration: 0.5, ease: 'easeOut', delay: 0.6 + photo.delay },
                      opacity: { duration: 0.35, delay: 0.6 + photo.delay },
                    }}
                    onClick={openLetter}
                  >
                    <motion.div
                      style={{ transform: `translateX(${photo.radius}px)`, willChange: 'transform' }}
                      initial={{ rotate: -photo.startAngle }}
                      animate={{ rotate: -photo.startAngle - 360 }}
                      transition={{ duration: 45, repeat: Infinity, ease: 'linear', delay: 2.5 }}
                    >
                      <PolaroidCard
                        src={`/images/photo${i + 3}.jpg`}
                        tilt={photo.tilt}
                        width={130} height={100} bottom={18}
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
              className="relative z-30 mt-6 sm:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md inline-block text-xs sm:text-sm text-white/40 font-script shadow-lg shadow-rose-900/20">
                Tap the envelope to open your letter ❤️
              </span>
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
            <motion.div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left shadow-xl shadow-rose-900/20">
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
