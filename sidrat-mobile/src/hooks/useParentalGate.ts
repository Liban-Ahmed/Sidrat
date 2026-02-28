/**
 * useParentalGate Hook
 *
 * Manages parental gate state and auto-lock timer.
 * Gate auto-locks after 5 minutes of inactivity.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';

const AUTO_LOCK_MS = 5 * 60 * 1000; // 5 minutes

export function useParentalGate() {
  const isUnlocked = useAppStore((s) => s.parentalGateUnlocked);
  const unlock = useAppStore((s) => s.unlockParentalGate);
  const lock = useAppStore((s) => s.lockParentalGate);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-lock after timeout
  useEffect(() => {
    if (isUnlocked) {
      timerRef.current = setTimeout(() => {
        lock();
      }, AUTO_LOCK_MS);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isUnlocked, lock]);

  const attemptUnlock = useCallback(
    (onSuccess: () => void) => {
      // Return the data needed to show the ParentalGate modal
      // The caller should render <ParentalGate> and call onSuccess when verified
      return {
        showGate: !isUnlocked,
        onVerified: () => {
          unlock();
          onSuccess();
        },
      };
    },
    [isUnlocked, unlock],
  );

  return {
    isUnlocked,
    lock,
    attemptUnlock,
  };
}
