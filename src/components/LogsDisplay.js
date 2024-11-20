import React from 'react';
import LogEntry from './LogEntry';

const LogsDisplay = ({ logs }) => (
  <div className="logs-display">
    {logs.length > 0 ? logs.map(log => <LogEntry key={log.id} log={log} />) : <p>No logs available</p>}
  </div>
);

export default LogsDisplay;
