import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { sessionApi, answersApi } from '../api/client';
import type { StoredState } from '../types';

interface SessionContextType {
  state: StoredState;
  loading: boolean;
  updateState: (updates: Partial<StoredState>) => void;
  saveAnswer: (questionKey: string, question: string, answer: string, answerValue?: string) => void;
  reset: () => void;
}

const getInitialState = (): StoredState => ({
  sessionId: '',
  currentStep: 0,
  answers: {},
  dateAccepted: false,
  questionStartTime: Date.now(),
});

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(getInitialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('date_proposal_state');
    if (!state.sessionId) {
      sessionApi.create()
        .then((data) => {
          setState(prev => ({ ...prev, sessionId: data.sessionId }));
          setLoading(false);
        })
        .catch(() => {
          const fallbackId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          setState(prev => ({ ...prev, sessionId: fallbackId }));
          setLoading(false);
        });
    }
  }, [state.sessionId]);

  const updateState = useCallback((updates: Partial<StoredState>) => {
    setState(prev => ({ ...prev, ...updates }));
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
    setState(getInitialState());
    setLoading(true);
  }, []);

  return (
    <SessionContext.Provider value={{ state, loading, updateState, saveAnswer, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
