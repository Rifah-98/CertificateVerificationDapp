import React from 'react';

const LogEntry = ({ log }) => (
  <div className="log-entry">
    <p><strong>Date:</strong> {log.date}</p>
    <p><strong>Action:</strong> {log.action}</p>
    <p><strong>Certificate ID:</strong> {log.certificateId}</p>
  </div>
);

export default LogEntry;
