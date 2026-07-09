import { useState, useEffect, useCallback } from 'react';
import { sessionApi, answersApi } from '../api/client';
import type { StoredState } from '../types';

const STORAGE_KEY = 'date_proposal_state';

const getInitialState = (): StoredState => ({
  sessionId: '',
  currentStep: 0,
  answers: {},
  dateAccepted: false,
  questionStartTime: Date.now(),
});

export function useSession() {
  const [state, setState] = useState<StoredState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); }
      catch {}
    }
    return getInitialState();
  });

  const [loading, setLoading] = useState(!state.sessionId);

  useEffect(() => {
    if (!state.sessionId) {
      sessionApi.create()
        .then((data) => {
          setState(prev => {
            const newState = { ...prev, sessionId: data.sessionId };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
          });
          setLoading(false);
        })
        .catch(() => {
          const fallbackId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          setState(prev => {
            const newState = { ...prev, sessionId: fallbackId };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
          });
          setLoading(false);
        });
    }
  }, [state.sessionId]);

  useEffect(() => {
    if (state.sessionId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<StoredState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const saveAnswer = useCallback((questionKey: string, question: string, answer: string, answerValue?: string) => {
    const timeSpent = Math.round((Date.now() - state.questionStartTime) / 1000);
    const answerData = {
      sessionId: state.sessionId,
      questionKey,
      question,
      answer,
      answerValue: answerValue || answer,
      timeSpent,
    };

    updateState({
      answers: { ...state.answers, [questionKey]: answer },
      questionStartTime: Date.now(),
    });

    answersApi.save(answerData).catch(() => {});
  }, [state.sessionId, state.questionStartTime, state.answers, updateState]);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
    setLoading(true);
  }, []);

  return { state, loading, updateState, saveAnswer, reset };
}
