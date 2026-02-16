import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "antd";
import { getLogs } from "../services/eventLogger";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);

  const refreshLogs = () => {
    const data = getLogs();
    setLogs(data);
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const columns = [
    {
      title: "S/No",
      key: "serial",
      width: 80,
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      width: 200,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 250,
    },
    {
      title: "Attempt ID",
      dataIndex: "attemptId",
      key: "attemptId",
      width: 200,
    },
    {
      title: "Metadata",
      dataIndex: "metadata",
      key: "metadata",
      width: 400,
      render: (metadata) => (
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(metadata, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <Card
      title="Assessment Event Logs"
      extra={<Button onClick={refreshLogs}>Refresh</Button>}
      style={{ marginTop: 20 }}
    >
      <Table
        dataSource={logs}
        columns={columns}
        rowKey={(record, index) =>
          `${record.timestamp}-${record.eventType}-${index}`
        }
        pagination={{ pageSize: 100 }}
        scroll={{ x: 1200, y: 400 }}
        bordered
      />
    </Card>
  );
}
