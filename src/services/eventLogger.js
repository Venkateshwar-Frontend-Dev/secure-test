// ================================
// Secure Unified Event Logger
// ================================

let attemptId = null;
let isFinalized = false;
let eventQueue = [];

let lastEventSignature = null;
let lastEventTime = 0;

// -------------------------------
// Config
// -------------------------------
const LOG_KEY = "exam_logs";
const ATTEMPT_KEY = "exam_attempt_id";
const BATCH_SIZE = 20; // Flush when 20 logs collected
const FLUSH_INTERVAL = 10000; // Flush every 10 seconds

let flushTimer = null;

// -------------------------------
// Storage Helpers
// -------------------------------
function saveLogs() {
  localStorage.setItem(LOG_KEY, JSON.stringify(eventQueue));
}

function loadLogs() {
  const saved = localStorage.getItem(LOG_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveAttempt(id) {
  localStorage.setItem(ATTEMPT_KEY, id);
}

// -------------------------------
// Init Logger (CALL BEFORE RENDER)
// -------------------------------
export function initLogger(id) {
  attemptId = id;
  saveAttempt(attemptId);

  isFinalized = false;

  eventQueue = loadLogs();

  // Restore duplicate protection after refresh
  if (eventQueue.length > 0) {
    const last = eventQueue[eventQueue.length - 1];

    lastEventSignature = JSON.stringify({
      eventType: last.eventType,
      metadata: last.metadata,
      questionId: last.questionId,
    });

    lastEventTime = new Date(last.timestamp).getTime();
  }

  // Start periodic flushing
  startAutoFlush();
}

// -------------------------------
// Unified Log Event
// -------------------------------
export function logEvent(eventType, metadata = {}, questionId = null) {
  if (isFinalized || !attemptId) return;

  const now = Date.now();

  const signature = JSON.stringify({
    eventType,
    metadata,
    questionId,
  });

  // Prevent duplicate spam (500ms window)
  if (lastEventSignature === signature && now - lastEventTime < 500) {
    return;
  }

  lastEventSignature = signature;
  lastEventTime = now;

  const event = {
    eventType,
    timestamp: new Date().toISOString(),
    attemptId,
    questionId,
    metadata,
  };

  eventQueue.push(event);
  saveLogs();

  // Size-based batching
  if (eventQueue.length >= BATCH_SIZE) {
    flushLogs();
  }
}

// -------------------------------
// Flush Logs (Safe Batch Send)
// -------------------------------
export async function flushLogs() {
  if (eventQueue.length === 0 || isFinalized || !navigator.onLine) return;

  const logsToSend = [...eventQueue];

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logsToSend),
    });

    if (!res.ok) {
      console.error("Log upload failed:", res.status);
      return;
    }

    // Remove only sent logs
    eventQueue = eventQueue.slice(logsToSend.length);
    saveLogs();
  } catch (error) {
    console.warn("Network error. Logs preserved locally.");
  }
}

// -------------------------------
// Auto Flush Every 10 Seconds
// -------------------------------
function startAutoFlush() {
  if (flushTimer) return;

  flushTimer = setInterval(() => {
    flushLogs();
  }, FLUSH_INTERVAL);
}

// -------------------------------
// Finalize Submission
// -------------------------------
export async function finalizeSubmission() {
  await flushLogs();

  isFinalized = true;

  clearInterval(flushTimer);
  flushTimer = null;

  Object.freeze(eventQueue);
}

// -------------------------------
// Online Recovery
// -------------------------------
window.addEventListener("online", () => {
  flushLogs();
});

// -------------------------------
// Debug Helper
// -------------------------------
export function getLogs() {
  return eventQueue;
}
