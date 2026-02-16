import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export default function useFocusGuard(isActive) {
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent("TAB_HIDDEN");
      } else {
        logEvent("TAB_VISIBLE");
      }
    };

    const handleBlur = () => {
      logEvent("WINDOW_BLUR");
    };

    const handleFocus = () => {
      logEvent("WINDOW_FOCUS");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isActive]);
}
