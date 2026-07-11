import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/questions/QuestionCard';
import FloatingHearts from '../components/animations/FloatingHearts';
import SakuraPetals from '../components/animations/SakuraPetals';
import Sparkles from '../components/animations/Sparkles';
import { useSession } from '../hooks/useSession';
import { answersApi } from '../api/client';
import type { Question } from '../types';

const questions: Question[] = [
  {
    key: 'date',
    question: 'When should we go, Shree?',
    type: 'date',
  },
  {
    key: 'meet_time',
    question: 'Pick our time',
    type: 'time',
    options: [
      { label: '10 AM ☀️', value: '10:00' },
      { label: '1 PM 🌤️', value: '13:00' },
      { label: '5 PM 🌆', value: '17:00' },
    ],
  },
  {
    key: 'breakfast',
    question: 'What breakfast would you like?',
    type: 'single',
    customOption: true,
    options: [
      { label: 'Pancakes 🥞', value: 'pancakes' },
      { label: 'Croissant 🥐', value: 'croissant' },
      { label: 'French Toast 🍞', value: 'french_toast' },
      { label: 'Paratha 🫓', value: 'paratha' },
      { label: 'Idli-Dosa 🫘', value: 'idli_dosa' },
      { label: 'Sandwich 🥪', value: 'sandwich' },
      { label: 'Omelette 🍳', value: 'omelette' },
      { label: 'Cereal 🥣', value: 'cereal' },
    ],
  },
  {
    key: 'lunch',
    question: 'What heavy lunch are you craving?',
    type: 'single',
    customOption: true,
    options: [
      { label: 'Biryani 🍚', value: 'biryani' },
      { label: 'Butter Chicken 🍛', value: 'butter_chicken' },
      { label: 'Mutton Curry 🍖', value: 'mutton_curry' },
      { label: 'Fish Fry 🐟', value: 'fish_fry' },
      { label: 'Chicken Tikka 🍗', value: 'chicken_tikka' },
      { label: 'Prawn Malai 🦐', value: 'prawn_malai' },
      { label: 'Mutton Biryani 🥘', value: 'mutton_biryani' },
      { label: 'Dal Makhani 🫘', value: 'dal_makhani' },
      { label: 'Paneer Butter Masala 🧀', value: 'paneer' },
      { label: 'Rogan Josh 🥩', value: 'rogan_josh' },
      { label: 'Chicken Curry 🍲', value: 'chicken_curry' },
      { label: 'Keema Naan 🫓', value: 'keema_naan' },
    ],
  },
  {
    key: 'afternoon_snacks',
    question: 'What afternoon snacks should we munch?',
    type: 'single',
    options: [
      { label: 'Samosa 🥟', value: 'samosa' },
      { label: 'Roll 🌯', value: 'roll' },
      { label: 'Cutlet 🥠', value: 'cutlet' },
      { label: 'Pakora 🫘', value: 'pakora' },
      { label: 'Fruit Chaat 🥗', value: 'fruit_chaat' },
      { label: 'French Fries 🍟', value: 'fries' },
      { label: 'Momo 🥟', value: 'momo' },
      { label: 'Chowmin 🍜', value: 'chowmin' },
    ],
  },
  {
    key: 'dinner',
    question: 'What dinner would you like?',
    type: 'single',
    customOption: true,
    options: [
      { label: 'Ramen 🍜', value: 'ramen' },
      { label: 'Steak 🥩', value: 'steak' },
      { label: 'Fish & Chips 🐟', value: 'fish_chips' },
      { label: 'Chicken 🍗', value: 'chicken' },
      { label: 'Tacos 🌮', value: 'tacos' },
      { label: 'Dal-Rice 🍲', value: 'dal_rice' },
      { label: 'Kebab 🥙', value: 'kebab' },
      { label: 'Seafood 🦐', value: 'seafood' },
    ],
  },
  {
    key: 'snacks',
    question: 'What dessert should we share?',
    type: 'single',
    options: [
      { label: 'Ice Cream 🍦', value: 'icecream' },
      { label: 'Brownie 🍫', value: 'brownie' },
      { label: 'Cheesecake 🍰', value: 'cheesecake' },
      { label: 'Donut 🍩', value: 'donut' },
      { label: 'Lava Cake 🎂', value: 'lava' },
      { label: 'Gulab Jamun 🍡', value: 'gulab_jamun' },
      { label: 'Rasgulla 🍥', value: 'rasgulla' },
      { label: 'Kulfi 🍨', value: 'kulfi' },
    ],
  },
  {
    key: 'location',
    question: 'Where in Kolkata should we meet?',
    type: 'single',
    customOption: true,
    options: [
      { label: '🏛️ Maidan', value: 'maidan' },
      { label: '🌳 Rabindra Sarobar', value: 'rabindra' },
      { label: '🌉 Prinsep Ghat', value: 'prinsep' },
      { label: '🌿 Eco Park', value: 'eco_park' },
      { label: '🎡 Millennium Park', value: 'millennium' },
      { label: '🏛️ Victoria Memorial', value: 'victoria' },
      { label: '🎢 Nicco Park', value: 'nicco' },
      { label: '🔬 Science City', value: 'science_city' },
      { label: '🦁 Alipore Zoo', value: 'zoo' },
      { label: '🌴 Botanical Garden', value: 'botanical' },
      { label: '🛕 Dakshineswar', value: 'dakshineswar' },
      { label: '🙏 Belur Math', value: 'belur' },
      { label: '🌁 Howrah Bridge', value: 'howrah_bridge' },
      { label: '🌃 Park Street', value: 'park_street' },
      { label: '🏬 South City Mall', value: 'south_city' },
      { label: '🛍️ Quest Mall', value: 'quest_mall' },
      { label: '🏞️ Lake Town', value: 'lake_town' },
      { label: '🌳 New Town', value: 'new_town' },
      { label: '📚 College Street', value: 'college_street' },
    ],
  },
  {
    key: 'shirt_color',
    question: 'Which shirt color should I wear?',
    type: 'single',
    options: [
      { label: 'White 🤍', value: 'white' },
      { label: 'Black 🖤', value: 'black' },
      { label: 'Blue 💙', value: 'blue' },
      { label: 'Red ❤️', value: 'red' },
      { label: 'Lavender 💜', value: 'lavender' },
      { label: 'Pink 🩷', value: 'pink' },
      { label: 'Green 💚', value: 'green' },
      { label: 'Yellow 💛', value: 'yellow' },
    ],
  },
  {
    key: 'pant_color',
    question: 'Which pant color should I wear?',
    type: 'single',
    options: [
      { label: 'Black 🖤', value: 'black' },
      { label: 'Blue 💙', value: 'blue' },
      { label: 'Grey 🩶', value: 'grey' },
      { label: 'Beige 🤎', value: 'beige' },
      { label: 'White 🤍', value: 'white' },
      { label: 'Navy 💙', value: 'navy' },
      { label: 'Brown 🟤', value: 'brown' },
      { label: 'Olive 💚', value: 'olive' },
    ],
  },
  {
    key: 'flowers',
    question: 'Which flowers should I bring?',
    type: 'single',
    options: [
      { label: 'Rose 🌹', value: 'rose' },
      { label: 'Tulip 🌷', value: 'tulip' },
      { label: 'Sunflower 🌻', value: 'sunflower' },
      { label: 'Lily 🌸', value: 'lily' },
      { label: 'Mixed Bouquet 💐', value: 'mixed' },
      { label: 'Orchid 🌺', value: 'orchid' },
      { label: 'Jasmine 🌼', value: 'jasmine' },
      { label: 'Daisy 🌼', value: 'daisy' },
    ],
  },
  {
    key: 'vibe',
    question: 'Choose our vibe, Shree',
    type: 'single',
    options: [
      { label: 'Romantic ❤️', value: 'romantic' },
      { label: 'Cozy 🕯️', value: 'cozy' },
      { label: 'Adventure ⚡', value: 'adventure' },
      { label: 'Luxury 💎', value: 'luxury' },
      { label: 'Funny 😄', value: 'funny' },
      { label: 'Simple 🌿', value: 'simple' },
      { label: 'Dreamy ✨', value: 'dreamy' },
      { label: 'Playful 🎀', value: 'playful' },
    ],
  },
  {
    key: 'activity',
    question: 'What should we do together?',
    type: 'single',
    options: [
      { label: 'Movie 🎬', value: 'movie' },
      { label: 'Shopping 🛍️', value: 'shopping' },
      { label: 'Fun Activity 🎯', value: 'fun_activity' },
      { label: 'Romantic Vibe 💕', value: 'romantic_vibe' },
      { label: 'Photography 📸', value: 'photography' },
      { label: 'Coffee Date ☕', value: 'coffee_date' },
      { label: 'Walking Together 🚶', value: 'walking' },
      { label: 'Couple Time 💑', value: 'couple_time' },
    ],
  },
  {
    key: 'promises',
    question: 'Promise me, Shree...',
    type: 'checklist',
    options: [
      { label: 'Hold Hands 🤝', value: 'holdhands' },
      { label: 'Take Selfies 📸', value: 'selfies' },
      { label: 'No Phone 📵', value: 'nophone' },
      { label: 'Smile Always 😊', value: 'smile' },
      { label: 'Stay Longer ⏰', value: 'staylonger' },
      { label: 'Give Me A Hug 🫂', value: 'hug' },
    ],
  },
];

export default function Questions() {
  const navigate = useNavigate();
  const { state, loading, updateState } = useSession();
  const maxIndex = questions.length - 1;
  const initialIndex = state.currentStep > 0 ? Math.min(state.currentStep, maxIndex) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [saving, setSaving] = useState(false);
  const questionStartRef = useRef(state.questionStartTime);

  useEffect(() => {
    if (!state.sessionId && !loading) {
      navigate('/question');
    }
  }, [state.sessionId, loading, navigate]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback((answer: string, answerValue: string) => {
    if (!currentQuestion || saving) return;
    setSaving(true);

    const timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);
    const answerData = {
      sessionId: state.sessionId,
      questionKey: currentQuestion.key,
      question: currentQuestion.question,
      answer,
      answerValue,
      timeSpent,
    };

    answersApi.save(answerData).catch(() => {});

    const updatedAnswers = { ...state.answers, [currentQuestion.key]: answer };
    const isLast = currentIndex >= maxIndex;

    if (isLast) {
      const dateSelectionData = {
        sessionId: state.sessionId,
        selectedDate: updatedAnswers['date'] || '',
        selectedTime: updatedAnswers['meet_time'] || '',
        dateAccepted: true,
        promiseChecklist: (currentQuestion.key === 'promises') ? answer.split(',') : [],
        loveMeterValue: 0,
        excitementLevel: '',
      };
      answersApi.saveDateSelection(dateSelectionData).catch(() => {});
      updateState({
        answers: updatedAnswers,
        currentStep: currentIndex + 1,
        dateAccepted: true,
      });
      navigate('/final', { state: { date: updatedAnswers['date'], time: updatedAnswers['meet_time'] } });
      return;
    }

    let nextIndex = currentIndex + 1;
    if (currentQuestion.key === 'meet_time') {
      if (answer === '10:00') nextIndex = 2;
      else if (answer === '13:00') nextIndex = 3;
      else if (answer === '17:00') nextIndex = 4;
    }
    setCurrentIndex(nextIndex);
    questionStartRef.current = Date.now();
    updateState({
      answers: updatedAnswers,
      currentStep: nextIndex,
      questionStartTime: Date.now(),
    });
    setSaving(false);
  }, [currentQuestion, saving, state.sessionId, state.answers, currentIndex, maxIndex, updateState, navigate]);

  if (!state.sessionId) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0f]">
        <motion.div className="text-6xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>❤️</motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    navigate('/final');
    return null;
  }

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden bg-[#0a0a0f]">
      <FloatingHearts count={6} />
      <SakuraPetals count={4} />
      <Sparkles count={10} />

      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/5 via-transparent to-purple-900/5" />

      <div className="relative z-10 flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-6 h-full min-h-dvh">
        <div className="pt-3 sm:pt-8 pb-1 sm:pb-2 px-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 h-1 sm:h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs sm:text-sm text-white/40 font-mono whitespace-nowrap">{currentIndex + 1}/{questions.length}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-4 sm:py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="w-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                currentAnswer={state.answers[currentQuestion.key]}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
