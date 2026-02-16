import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export default function useFullscreenGuard(isActive) {

  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        // Entered Fullscreen
        logEvent("ENTER_FULLSCREEN");
      } else {
        // Exited Fullscreen
        logEvent("EXIT_FULLSCREEN");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isActive]);

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        logEvent("FULLSCREEN_FAILED");
      });
    }
  };

  return { enterFullscreen };
}
