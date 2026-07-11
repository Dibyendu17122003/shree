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

interface Props {
  onNoClick: () => void;
  onExhausted?: () => void;
  disabled?: boolean;
}

export default function NoButton({ onNoClick, onExhausted, disabled }: Props) {
  const [message, setMessage] = useState(MESSAGES[0]);
  const [hidden, setHidden] = useState(false);
  const [scale, setScale] = useState(1);
  const [msgProgress, setMsgProgress] = useState(0);
  const [floating, setFloating] = useState(false);
  const [floatPos, setFloatPos] = useState({ top: '50%', left: '50%' });
  const moveCountRef = useRef(0);

  const teleport = useCallback(() => {
    moveCountRef.current += 1;
    setFloatPos(getSafePosition());
  }, []);

  const advance = useCallback(() => {
    setScale(prev => {
      const next = Math.max(0.15, prev - 0.07);
      if (next <= 0.15) {
        setHidden(true);
        if (onExhausted) onExhausted();
      }
      return next;
    });
    setMessage(prev => {
      const idx = MESSAGES.indexOf(prev);
      return idx < MESSAGES.length - 1 ? MESSAGES[idx + 1] : prev;
    });
    setMsgProgress(s => Math.min(1, s + 0.085));
  }, [onExhausted]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled || hidden) return;
    e.stopPropagation();
    advance();
    onNoClick();
    if (!floating) setFloating(true);
    teleport();
  }, [disabled, hidden, floating, teleport, advance, onNoClick]);

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
      className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 whitespace-nowrap select-none"
      style={{
        transform: `scale(${scale})`,
        opacity: Math.max(0.2, scale),
        boxShadow: '0 0 30px rgba(233,30,99,0.4), 0 0 60px rgba(233,30,99,0.2)',
      }}
      onPointerDown={handlePointerDown}
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
              }}
              transition={springTransition}
              key="floating-wrapper"
            >
              <div
                className="relative"
                style={{ padding: '24px', margin: '-24px' }}
                onPointerDown={handlePointerDown}
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
              onPointerDown={handlePointerDown}
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
