import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_TIMEOUT = 3000;

export const useAutoHide = (timeout = DEFAULT_TIMEOUT) => {
  const [expanded, setExpanded] = useState(true);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setExpanded(false);
    }, timeout);
  }, [clearTimer, timeout]);

  const show = useCallback(() => {
    setExpanded(true);
    startTimer();
  }, [startTimer]);

  const onInteraction = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  return { expanded, show, onInteraction };
};
