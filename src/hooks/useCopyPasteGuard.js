import { useEffect } from "react";
import { logEvent } from "../services/eventLogger";

export default function useCopyPasteGuard(isActive) {
  useEffect(() => {
    if (!isActive) return;

    const handleCopy = (e) => {
      e.preventDefault();
      logEvent("COPY_ATTEMPT");
    };

    const handlePaste = (e) => {
      e.preventDefault();
      logEvent("PASTE_ATTEMPT");
    };

    const handleCut = (e) => {
      e.preventDefault();
      logEvent("CUT_ATTEMPT");
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "c") {
          logEvent("COPY_SHORTCUT_ATTEMPT");
        }
        if (e.key.toLowerCase() === "v") {
          logEvent("PASTE_SHORTCUT_ATTEMPT");
        }
        if (e.key.toLowerCase() === "x") {
          logEvent("CUT_SHORTCUT_ATTEMPT");
        }
      }
    };

    const handleRightClick = (e) => {
      e.preventDefault();
      logEvent("RIGHT_CLICK_BLOCKED");
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleRightClick);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, [isActive]);
}
