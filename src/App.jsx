import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Assessment from "./pages/Assessment";
import BrowserGuard from "./routes/BrowserGuard";
import { flushLogs, initLogger } from "./services/eventLogger";

const existingAttempt = localStorage.getItem("exam_attempt_id");
const attemptId = existingAttempt || "ATTEMPT_001";
initLogger(attemptId);

function App() {
  useEffect(() => {
    const handleOnline = () => {
      flushLogs();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);


  return (
    <Routes>
      <Route
        path="/"
        element={
          <BrowserGuard>
            <Assessment />
          </BrowserGuard>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
