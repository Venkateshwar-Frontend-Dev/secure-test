import React, { useEffect, useState } from "react";
import { Button, Layout, Typography, Space, Card, message } from "antd";
import { logEvent, finalizeSubmission } from "../services/eventLogger";
import useFullscreenGuard from "../hooks/useFullscreenGuard";
import useFocusGuard from "../hooks/useFocusGuard";
import useCopyPasteGuard from "../hooks/useCopyPasteGuard";
import useExamTimer from "../hooks/useExamTimer";
import LogViewer from "../components/LogViewer";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Assessment() {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);

  const { enterFullscreen } = useFullscreenGuard(true);
  useFocusGuard(examStarted && !examFinished);
  useCopyPasteGuard(examStarted && !examFinished);

  //  5 minute exam
  const timeLeft = useExamTimer(300, examStarted && !examFinished);

  //  Auto-submit when timer expires
  useEffect(() => {
    if (examStarted && timeLeft === 0 && !examFinished) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleReload = () => {
      logEvent("PAGE_REFRESHED");
    };

    window.addEventListener("beforeunload", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartExam = () => {
    enterFullscreen();
    logEvent("EXAM_STARTED");
    setExamStarted(true);
  };

  const handleSubmit = async () => {
    if (!navigator.onLine) {
      message.error("You are offline. Please reconnect to submit.");
      return;
    }
    if (examFinished) return;

    setExamFinished(true);
    logEvent("EXAM_SUBMITTED");

    await finalizeSubmission();

    message.success("Exam submitted successfully!");
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Content>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Title level={3}>Assessment Environment</Title>

          {!examStarted ? (
            <Button type="primary" size="large" onClick={handleStartExam}>
              Start Exam
            </Button>
          ) : (
            <Card>
              <Title level={4}>Time Remaining</Title>
              <Text strong style={{ fontSize: 20 }}>
                {formatTime(timeLeft)}
              </Text>
              <br />
              {!examFinished && (
                <Button danger style={{ marginTop: 16 }} onClick={handleSubmit}>
                  Submit Exam
                </Button>
              )}

              {examFinished && (
                <Text
                  type="success"
                  style={{ display: "block", marginTop: 16 }}
                >
                  Exam Finished
                </Text>
              )}
            </Card>
          )}

          <div style={{ overflowX: "auto" }}>
            <LogViewer />
          </div>
        </Space>
      </Content>
    </Layout>
  );
}
