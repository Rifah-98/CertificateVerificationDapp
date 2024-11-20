import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UniversityPage = () => {
  // State variables for certificate details and blockchain interaction
  const [certificateDetails, setCertificateDetails] = useState({
    name: '',
    certificateId: '',
    dateIssued: '',
    issuerName: '',
    status: 'Pending'
  });
  const [status, setStatus] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Contract address and ABI
  const contractAddress = "0x58bB957276D88795165B631add7361f9F21B624B"; // Replace with your contract address
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
  
  
  
  
  

  // Connect to Ethereum wallet and contract on component mount
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
        alert("Metamask connected");
      } catch (error) {
        console.error("Error connecting to wallet: ", error);
      }
    };
    connectWallet();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertificateDetails({ ...certificateDetails, [name]: value });
  };

  // Function to request approval for a certificate
  const handleRequestApproval = () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }

    try {
      const { name, certificateId, dateIssued, issuerName } = certificateDetails;
      const tx = contract.requestApproval(name, certificateId, dateIssued, issuerName);
      console.log("Approval requested for:", certificateDetails);
      setStatus("Approval requested");
    } catch (error) {
      console.error("Error requesting approval:", error);
      alert("Failed to request approval.");
    }
  };

  // Function to check the status of a certificate
  const handleCheckStatus = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }
  
    try {
      const certificateId = certificateDetails.certificateId;
      const statusCode = await contract.checkStatus(certificateId);
      const statusText = statusCode === 0 ? "Not Verified" : statusCode === 1 ? "Verified" : "Rejected";
      setStatus(`Current status: ${statusText}`);
    } catch (error) {
      console.error("Error checking certificate status:", error);
      alert("Failed to check status.");
    }
  };

  return (
    <div className="university-page">
      <h2>University - Certificate Management</h2>
      <form>
        <label>
          Certificate Name:
          <input
            type="text"
            name="name"
            value={certificateDetails.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Certificate ID:
          <input
            type="text"
            name="certificateId"
            value={certificateDetails.certificateId}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Date Issued:
          <input
            type="date"
            name="dateIssued"
            value={certificateDetails.dateIssued}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Issuer Code:
          <input
            type="text"
            name="issuerName"
            value={certificateDetails.issuerName}
            onChange={handleInputChange}
          />
        </label>
        <div>
          <button type="button" onClick={handleRequestApproval}>
            Request Approval
          </button>
          <button type="button" onClick={handleCheckStatus}>
            Check Status
          </button>
        </div>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default UniversityPage;
