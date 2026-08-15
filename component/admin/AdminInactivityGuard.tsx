"use client";

import { useEffect, useRef } from "react";
import { signOut, updateAdminActivity } from "@/app/actions/auth";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const PING_INTERVAL_MS = 30 * 1000; // Ping server at most every 30 seconds of activity

export function AdminInactivityGuard() {
  const lastPingRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleLogout() {
      signOut("inactivity");
    }

    function resetTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT_MS);

      const now = Date.now();
      if (now - lastPingRef.current > PING_INTERVAL_MS) {
        lastPingRef.current = now;
        updateAdminActivity().catch(() => {
          // Ignore network ping errors
        });
      }
    }

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    // Initialize timer
    resetTimer();

    // Attach listeners
    for (const event of events) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, []);

  return null;
}

export default AdminInactivityGuard;
