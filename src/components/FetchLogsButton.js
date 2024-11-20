import React from 'react';

const FetchLogsButton = ({ contract, setLogs }) => {
  // Function to fetch logs from the smart contract
  const fetchLogsFromContract = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }

    try {
      // Call fetchLogs function from the smart contract
      const logsFromContract = await contract.fetchLogs();

      // Map the logs to a suitable format for display
      const fetchedLogs = logsFromContract.map((log, index) => ({
        id: index,
        date: new Date(log.timestamp * 1000).toLocaleDateString(),
        action: log.action,
        performedBy: log.performedBy,
        certificateId: log.certificateId
      }));

      // Update the logs in the parent component
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <button className="fetch-logs-button" onClick={fetchLogsFromContract}>
      Fetch Logs
    </button>
  );
};

export default FetchLogsButton;
