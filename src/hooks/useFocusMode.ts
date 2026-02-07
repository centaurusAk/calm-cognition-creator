import { useState, useCallback, useEffect } from 'react';

export interface FocusSession {
  duration: number;
  elapsed: number;
  isActive: boolean;
  isPaused: boolean;
}

export function useFocusMode() {
  const [focusMode, setFocusMode] = useState(false);
  const [session, setSession] = useState<FocusSession>({
    duration: 45,
    elapsed: 0,
    isActive: false,
    isPaused: false,
  });

  const startFocus = useCallback((duration: number = 45) => {
    setFocusMode(true);
    setSession({
      duration,
      elapsed: 0,
      isActive: true,
      isPaused: false,
    });
    document.documentElement.classList.add('focus-mode');
  }, []);

  const pauseFocus = useCallback(() => {
    setSession(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeFocus = useCallback(() => {
    setSession(prev => ({ ...prev, isPaused: false }));
  }, []);

  const endFocus = useCallback(() => {
    setFocusMode(false);
    setSession({
      duration: 45,
      elapsed: 0,
      isActive: false,
      isPaused: false,
    });
    document.documentElement.classList.remove('focus-mode');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session.isActive && !session.isPaused) {
      interval = setInterval(() => {
        setSession(prev => {
          const newElapsed = prev.elapsed + 1;
          if (newElapsed >= prev.duration * 60) {
            document.documentElement.classList.remove('focus-mode');
            return { ...prev, elapsed: newElapsed, isActive: false };
          }
          return { ...prev, elapsed: newElapsed };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [session.isActive, session.isPaused]);

  return {
    focusMode,
    session,
    startFocus,
    pauseFocus,
    resumeFocus,
    endFocus,
  };
}
