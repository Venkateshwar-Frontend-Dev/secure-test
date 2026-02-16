import { useEffect } from "react";
import { Result } from "antd";
import { detectBrowser, isChromeOnly } from "../utils/browserDetection";
import { logEvent } from "../services/eventLogger";

export default function BrowserGuard({ children }) {
  const info = detectBrowser();
  const allowed = isChromeOnly();

  useEffect(() => {
    logEvent("BROWSER_DETECTED", info);

    if (!allowed) {
      logEvent("BROWSER_BLOCKED", info);
    }
  }, []);

  if (!allowed) {
    return (
      <Result
        status="error"
        title="Unsupported Browser"
        subTitle={
          <>
            This assessment must be taken using Google Chrome.
            <br />
            Please close this browser and reopen the assessment link using the
            latest version of Google Chrome.
          </>
        }
        extra={
          <>
            <div>Detected Browser: {info?.browserName}</div>
            <div>Version: {info?.version}</div>
          </>
        }
      />
    );
  }

  return children;
}
