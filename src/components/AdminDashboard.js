import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LogsDisplay from './LogsDisplay';
import ApprovalList from './ApprovalList';

const AdminDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [logs, setLogs] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const contractAddress = "0x58bB957276D88795165B631add7361f9F21B624B";
  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "dateIssued",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "encryptedIssuerName",
          "type": "bytes32"
        }
      ],
      "name": "CertificateRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        }
      ],
      "name": "CertificateApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        }
      ],
      "name": "CertificateRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "action",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "performedBy",
          "type": "string"
        }
      ],
      "name": "LogAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "issuerName",
          "type": "string"
        }
      ],
      "name": "encryptIssuerName",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "dateIssued",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "issuerName",
          "type": "string"
        }
      ],
      "name": "requestApproval",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fetchAllCertificates",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        },
        {
          "internalType": "enum CertificateVerification.Status[]",
          "name": "",
          "type": "uint8[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        }
      ],
      "name": "approveCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "certificateId",
          "type": "string"
        }
      ],
      "name": "checkStatus",
      "outputs": [
        {
          "internalType": "enum CertificateVerification.Status",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  
  
  
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };
    connectWallet();
  }, []);

  const fetchCertificates = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }
  
    try {
      const [names, ids, datesIssued, issuers, encryptedIssuers, statuses] = await contract.fetchAllCertificates();
      const fetchedCertificates = ids.map((certificateId, index) => ({
        name: names[index],
        certificateId: certificateId,
        dateIssued: datesIssued[index],
        issuer: issuers[index],
        encryptedIssuer: encryptedIssuers[index], // No need for hexlify, as it is already a string
        status: statuses[index] === 0 ? "Pending" : statuses[index] === 1 ? "Approved" : "Rejected",
      }));
  
      setCertificates(fetchedCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const approveCertificate = async (certificateId) => {
    if (!contract) return;

    try {
      const tx = await contract.approveCertificate(certificateId);
      await tx.wait();
      alert(`Certificate ${certificateId} approved.`);
      fetchCertificates();
    } catch (error) {
      console.error("Error approving certificate:", error);
      alert("Failed to approve certificate.");
    }
  };

  const rejectCertificate = async (certificateId) => {
    if (!contract) return;

    try {
      const tx = await contract.rejectCertificate(certificateId);
      await tx.wait();
      alert(`Certificate ${certificateId} rejected.`);
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      alert("Failed to reject certificate.");
    }
  };

  return (
    <div className="admin-dashboard">
      <header>Verify Certificate Dashboard</header>

      <button onClick={fetchCertificates}>Fetch Certificates</button>

      <ApprovalList
        certificates={certificates}
        onApprove={approveCertificate}
        onReject={rejectCertificate}
      />

    </div>
  );
};

export default AdminDashboard;
