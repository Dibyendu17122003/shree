import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  'Are you sure? 🥺',
  'Please ❤️',
  'Think again',
  "I'll buy you flowers 🌹",
  "I'll buy dessert 🍰",
  "I'll let you choose everything ❤️",
  "Don't break my heart 💔",
  'One more chance 🥺',
  'Last chance!',
  'Okay but really? 🥺',
];

function getSafePosition() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const btnW = 140;
  const btnH = 70;
  const centerXMin = w * 0.25;
  const centerXMax = w * 0.75;
  const centerYMin = h * 0.15;
  const centerYMax = h * 0.65;

  for (let attempt = 0; attempt < 30; attempt++) {
    const x = Math.random() * (w - btnW);
    const y = Math.random() * (h - btnH);
    const inCenterX = x + btnW > centerXMin && x < centerXMax;
    const inCenterY = y + btnH > centerYMin && y < centerYMax;
    if (!(inCenterX && inCenterY)) {
      return { top: `${y}px`, left: `${x}px` };
    }
  }
  return { top: `${h - btnH - 20}px`, left: `${w - btnW - 20}px` };
}

function getCurvedPath() {
  const start = { x: 0, y: 0 };
  const peak = { x: (Math.random() - 0.5) * 200, y: -Math.random() * 150 - 50 };
  return [`${start.x}px ${start.y}px`, `${peak.x}px ${peak.y}px`, '0px 0px'];
}

interface Props {
  onNoClick: () => void;
  onExhausted?: () => void;
  disabled?: boolean;
}

export default function NoButton({ onNoClick, onExhausted, disabled }: Props) {
  const [clickCount, setClickCount] = useState(0);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [shake, setShake] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scale, setScale] = useState(1);
  const [msgProgress, setMsgProgress] = useState(0);
  const [floating, setFloating] = useState(false);
  const [floatPos, setFloatPos] = useState({ top: '50%', left: '50%' });
  const [anticipating, setAnticipating] = useState(false);
  const [arcPath, setArcPath] = useState<string[]>(['0px 0px']);
  const moveCountRef = useRef(0);

  const teleport = useCallback(() => {
    moveCountRef.current += 1;
    setFloatPos(getSafePosition());
    setArcPath(getCurvedPath());
  }, []);

  const advance = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next < MESSAGES.length) setMessage(MESSAGES[next]);
      setMsgProgress(s => Math.min(1, s + 0.085));
      setScale(s => Math.max(0.15, s - 0.07));
      if (next >= 11) {
        setHidden(true);
        if (onExhausted) onExhausted();
      }
      return next;
    });
  }, [onExhausted]);

  const handleHover = useCallback(() => {
    if (disabled || hidden) return;
    setAnticipating(true);
    setTimeout(() => {
      setAnticipating(false);
      if (!floating) {
        setFloating(true);
        setTimeout(() => teleport(), 50);
      } else {
        teleport();
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
      advance();
    }, 150);
  }, [disabled, hidden, floating, teleport, advance]);

  const handleNo = useCallback(() => {
    if (disabled || hidden) return;
    advance();
    if (!floating) {
      setFloating(true);
      setTimeout(() => teleport(), 50);
    } else {
      teleport();
    }
  }, [disabled, hidden, floating, teleport, advance]);

  if (hidden) return null;

  const msgFontSize = `clamp(0.6rem, ${0.6 + msgProgress * 0.5}rem, 1.1rem)`;

  const springTransition = {
    type: 'spring' as const,
    stiffness: 80 + moveCountRef.current * 15,
    damping: 8 + moveCountRef.current * 0.5,
    mass: 0.8 + moveCountRef.current * 0.05,
  };

  const btn = (inline: boolean) => (
    <motion.button
      className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 active:scale-95 whitespace-nowrap select-none"
      style={{
        transform: `scale(${scale})`,
        opacity: Math.max(0.2, scale),
        boxShadow: anticipating
          ? '0 0 40px rgba(233,30,99,0.6), 0 0 80px rgba(233,30,99,0.3)'
          : '0 0 30px rgba(233,30,99,0.4), 0 0 60px rgba(233,30,99,0.2)',
      }}
      onClick={handleNo}
      onPointerEnter={handleHover}
      whileTap={{ scale: scale * 0.9 }}
      key={inline ? 'inline' : 'floating'}
    >
      No 💔
    </motion.button>
  );

  return (
    <AnimatePresence>
      {!disabled && (
        <>
          {floating ? (
            <motion.div
              className="fixed z-50"
              style={{
                top: floatPos.top,
                left: floatPos.left,
              }}
              initial={{ x: '-50%', y: '-50%', scale: 0.5, opacity: 0 }}
              animate={{
                x: '-50%',
                y: '-50%',
                scale: 1,
                opacity: 1,
                rotate: shake ? [0, -12, 12, -8, 8, 0] : anticipating ? [0, -3, 3, 0] : 0,
              }}
              transition={springTransition}
              key="floating-wrapper"
            >
              <div
                className="relative"
                style={{ padding: '24px', margin: '-24px' }}
                onPointerEnter={handleHover}
              >
                {btn(false)}
              </div>
              <motion.p
                className="text-center mt-2 text-rose-300/80 font-script leading-snug"
                key={message}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1, fontSize: msgFontSize }}
                transition={{ type: 'spring', stiffness: 120, damping: 8 }}
              >
                {message}
              </motion.p>
            </motion.div>
          ) : (
            <div
              onPointerEnter={handleHover}
              className="relative"
            >
              {btn(true)}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
