import { useEffect, useRef, useState } from "react";
import { logEvent } from "../services/eventLogger";

export default function useExamTimer(durationInSeconds, isActive) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    logEvent("TIMER_STARTED", { duration: durationInSeconds });

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // 🔥 Heartbeat every 30 seconds
        if (newTime % 30 === 0) {
          logEvent("TIMER_HEARTBEAT", { remaining: newTime });
        }

        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          logEvent("TIMER_EXPIRED");
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, durationInSeconds]);

  return timeLeft;
}
