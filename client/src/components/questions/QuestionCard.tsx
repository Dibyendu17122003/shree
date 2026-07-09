import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../../types';

interface Props {
  question: Question;
  onAnswer: (answer: string, value: string) => void;
  currentAnswer?: string;
}

function getGridCols(count: number): string {
  if (count >= 19) return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5';
  if (count >= 12) return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4';
  if (count >= 8) return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4';
  if (count >= 6) return 'grid-cols-2 xs:grid-cols-3';
  if (count >= 4) return 'grid-cols-2 xs:grid-cols-3';
  return 'grid-cols-3';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function QuestionCard({ question, onAnswer, currentAnswer }: Props) {
  if (question.type === 'date') {
    return <DatePickerQuestion onAnswer={onAnswer} currentDate={currentAnswer || ''} />;
  }

  if (question.type === 'time') {
    return <TimePickerQuestion onAnswer={onAnswer} currentAnswer={currentAnswer || ''} />;
  }

  if (question.type === 'checklist') {
    return <ChecklistQuestion question={question} onAnswer={onAnswer} currentValues={currentAnswer ? currentAnswer.split(',') : []} />;
  }

  const optCount = question.options?.length ?? 0;
  const isLocation = question.key === 'location';

  return (
    <motion.div
      className="w-full mx-auto px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-center mb-3 sm:mb-6 text-gradient leading-snug px-2"
        variants={itemVariants}
      >
        {question.question}
      </motion.h2>

      <div className={`grid ${getGridCols(optCount)} gap-2 sm:gap-2.5`}>
        {question.options?.map((option, i) => (
          <motion.button
            key={option.value}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
              className={`
              relative overflow-hidden
              flex flex-col items-center justify-center gap-1
              py-2.5 sm:py-3 px-2 sm:px-3
              rounded-xl sm:rounded-2xl
              font-medium text-sm sm:text-base
              transition-all duration-150
              active:scale-95
              ${isLocation
                ? 'bg-white/[0.04] border border-white/[0.06] active:bg-rose-500/15 active:border-rose-500/30 sm:hover:bg-rose-500/15 sm:hover:border-rose-500/30 sm:hover:shadow-lg sm:hover:shadow-rose-500/10 text-white/80'
                : 'option-btn'}
              ${currentAnswer === option.value
                ? (isLocation
                  ? 'bg-rose-500/20 border-rose-500/50 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/40 text-white'
                  : 'option-btn-selected')
                : ''}
            `}
            onClick={() => onAnswer(option.value, option.label)}
          >
            {isLocation && (
              <span className="text-base sm:text-lg leading-none">{option.label.split(' ')[0]}</span>
            )}
            <span className={`leading-tight text-center ${isLocation ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
              {isLocation ? option.label.slice(option.label.indexOf(' ') + 1) : option.label}
            </span>
            {currentAnswer === option.value && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
        {question.customOption && (
          <CustomTextInput
            onAnswer={onAnswer}
            currentAnswer={currentAnswer}
            label={isLocation ? 'Suggest your spot! ❤️' : 'Tell me your favorite! ❤️'}
            placeholder={isLocation ? 'Type a location...' : 'Type here...'}
          />
        )}
      </div>
    </motion.div>
  );
}

function CustomTextInput({ onAnswer, currentAnswer, label, placeholder }: { onAnswer: (answer: string, value: string) => void; currentAnswer?: string; label: string; placeholder: string }) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState('');

  if (showInput) {
    return (
      <motion.div
        className="col-span-2 sm:col-span-3 md:col-span-4 glass-card p-3 sm:p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-xs sm:text-sm text-white/50 mb-2 text-center font-script">{label}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-rose-500/50 transition-colors"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && text.trim()) {
                onAnswer(`custom_${text.trim()}`, text.trim());
              }
            }}
          />
          <motion.button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium"
            whileTap={{ scale: 0.97 }}
            onClick={() => { if (text.trim()) onAnswer(`custom_${text.trim()}`, text.trim()); }}
          >
            Go
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      className="option-btn flex flex-col items-center justify-center gap-1 py-3 sm:py-4 px-2 sm:px-3 col-span-2 sm:col-span-1"
      variants={itemVariants}
      whileTap={{ scale: 0.97 }}
      onClick={() => setShowInput(true)}
    >
      <span className="text-sm sm:text-base">Custom ✏️</span>
    </motion.button>
  );
}

function TimePickerQuestion({ onAnswer, currentAnswer }: { onAnswer: (answer: string, value: string) => void; currentAnswer: string }) {
  const times = [
    { label: '10 AM', value: '10:00', emoji: '☀️', desc: 'Morning breeze' },
    { label: '1 PM', value: '13:00', emoji: '🌤️', desc: 'Golden afternoon' },
    { label: '5 PM', value: '17:00', emoji: '🌆', desc: 'Sunset magic' },
  ];

  return (
    <motion.div
      className="w-full mx-auto px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-center mb-4 sm:mb-8 text-gradient leading-snug px-2"
        variants={itemVariants}
      >
        Pick our time
      </motion.h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm mx-auto">
        {times.map((t, i) => (
          <motion.button
            key={t.value}
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
              className={`
              relative w-full sm:w-28 md:w-32 flex flex-col items-center gap-2 py-4 sm:py-6 px-4
              rounded-2xl sm:rounded-3xl font-medium transition-all duration-200
              active:scale-95
              ${currentAnswer === t.value
                ? 'bg-gradient-to-br from-rose-500/30 to-pink-600/20 border-2 border-rose-400/60 shadow-xl shadow-rose-500/20'
                : 'bg-white/[0.04] border border-white/[0.08] active:bg-white/[0.12] sm:hover:bg-white/[0.08] sm:hover:border-rose-500/30'
              }
            `}
            onClick={() => onAnswer(t.value, t.label)}
          >
            <motion.span
              className="text-3xl sm:text-4xl"
              animate={currentAnswer === t.value ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {t.emoji}
            </motion.span>
            <span className={`text-lg sm:text-xl font-bold ${currentAnswer === t.value ? 'text-white' : 'text-white/80'}`}>
              {t.label}
            </span>
            <span className="text-[10px] sm:text-xs text-white/40 font-script">{t.desc}</span>
            {currentAnswer === t.value && (
              <motion.div
                className="mt-1 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(3)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: j * 0.15, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function DatePickerQuestion({ onAnswer, currentDate }: { onAnswer: (answer: string, value: string) => void; currentDate: string }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(currentDate);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  const dates = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [daysInMonth, firstDay]);

  const handleSelect = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelected(dateStr);
    onAnswer(dateStr, `${day} ${monthName} ${viewYear}`);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(v => v - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(v => v + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const selDay = selected ? parseInt(selected.split('-')[2]) : null;

  return (
    <motion.div
      className="w-full mx-auto px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-center mb-3 sm:mb-6 text-gradient leading-snug px-2"
        variants={itemVariants}
      >
        When should we go, Shree?
      </motion.h2>

      <motion.div className="glass-card p-3 sm:p-6 max-w-sm mx-auto" variants={itemVariants}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <motion.button
            className="p-2 sm:p-2.5 rounded-lg transition-colors text-white/60 active:bg-white/10 sm:hover:bg-white/10 active:text-white sm:hover:text-white"
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </motion.button>
          <h3 className="text-sm sm:text-lg font-display font-bold text-white/80">{monthName} {viewYear}</h3>
          <motion.button
            className="p-2 sm:p-2.5 rounded-lg transition-colors text-white/60 active:bg-white/10 sm:hover:bg-white/10 active:text-white sm:hover:text-white"
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1 sm:mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] sm:text-xs text-white/30 font-medium py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {dates.map((day, i) => (
            <div key={i}>
              {day && !isPast(day) ? (
                <motion.button
                  className={`w-full py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-sm font-medium flex items-center justify-center transition-colors min-h-[36px] sm:min-h-[44px]
                    ${selDay === day
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
                      : 'text-white/70 active:bg-white/10 sm:hover:bg-white/10'
                    }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSelect(day)}
                >
                  {day}
                </motion.button>
              ) : (
                <div className="w-full py-2 sm:py-2.5 rounded-lg text-[11px] text-white/15 flex items-center justify-center">
                  {day || ''}
                </div>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <motion.p
            className="text-center mt-2 sm:mt-4 text-[10px] sm:text-sm text-rose-300/80 font-script"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {new Date(selected).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

function ChecklistQuestion({ question, onAnswer, currentValues }: {
  question: Question;
  onAnswer: (answer: string, value: string) => void;
  currentValues: string[];
}) {
  const toggleItem = (value: string) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onAnswer(newValues.join(','), newValues.length.toString());
  };

  return (
    <motion.div
      className="w-full mx-auto px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-center mb-3 sm:mb-6 text-gradient leading-snug px-2"
        variants={itemVariants}
      >
        {question.question}
      </motion.h2>

      <div className="space-y-2 sm:space-y-3 max-w-sm mx-auto">
        {question.options?.map((option, i) => (
          <motion.button
            key={option.value}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full option-btn flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl
              ${currentValues.includes(option.value) ? 'option-btn-selected' : ''}
            `}
            onClick={() => toggleItem(option.value)}
          >
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors
              ${currentValues.includes(option.value)
                ? 'bg-rose-500 border-rose-500'
                : 'border-white/20'}`}>
              {currentValues.includes(option.value) && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>
            <span className="text-sm sm:text-base">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
