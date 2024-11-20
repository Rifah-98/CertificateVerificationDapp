// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    enum Status { NotApproved, Approved, Rejected }

    struct Certificate {
        string name;
        string certificateId;
        string dateIssued;
        string issuerName;
        bytes32 encryptedIssuerName;
        Status status;
    }

    struct Log {
        uint timestamp;
        string certificateId;
        string action;
        string performedBy;
    }

    address public admin;
    mapping(string => Certificate) private certificates; // Maps certificate ID to Certificate
    string[] private certificateIds; // Array to keep track of all certificate IDs
    Log[] private logs;

    constructor() {
        admin = msg.sender;
    }

    event CertificateRequested(string certificateId, string name, string dateIssued, bytes32 encryptedIssuerName);
    event CertificateApproved(string certificateId);
    event CertificateRejected(string certificateId);
    event LogAdded(string action, string certificateId, string performedBy);

    // Encrypt issuer name using SHA-256
    function encryptIssuerName(string memory issuerName) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(issuerName));
    }

    // Request approval for a certificate
    function requestApproval(
        string memory name,
        string memory certificateId,
        string memory dateIssued,
        string memory issuerName
    ) public {
        Certificate storage cert = certificates[certificateId];
        require(cert.status == Status(0), "Certificate already exists");

        bytes32 encryptedIssuerName = encryptIssuerName(issuerName);

        certificates[certificateId] = Certificate({
            name: name,
            certificateId: certificateId,
            dateIssued: dateIssued,
            issuerName: issuerName,
            encryptedIssuerName: encryptedIssuerName,
            status: Status.NotApproved
        });

        certificateIds.push(certificateId); // Add certificateId to the array

        logs.push(Log({
            timestamp: block.timestamp,
            certificateId: certificateId,
            action: "Request Approval",
            performedBy: "University"
        }));

        emit CertificateRequested(certificateId, name, dateIssued, encryptedIssuerName);
    }

    // Approve a certificate
    function approveCertificate(string memory certificateId) public {
        Certificate storage cert = certificates[certificateId];
        require(cert.status == Status.NotApproved, "Certificate is not in pending status");

        cert.status = Status.Approved;

        logs.push(Log({
            timestamp: block.timestamp,
            certificateId: certificateId,
            action: "Approve Certificate",
            performedBy: "Admin"
        }));

        emit CertificateApproved(certificateId);
    }

    // Fetch the status of a specific certificate
    function checkStatus(string memory certificateId) public view returns (Status) {
        Certificate storage cert = certificates[certificateId];
        require(bytes(cert.certificateId).length != 0, "Certificate does not exist");
        return cert.status;
    }

    // Fetch all certificates
    function fetchAllCertificates() public view returns (
        string[] memory,
        string[] memory,
        string[] memory,
        string[] memory,
        bytes32[] memory,
        Status[] memory
    ) {
        uint totalCertificates = certificateIds.length;

        string[] memory names = new string[](totalCertificates);
        string[] memory ids = new string[](totalCertificates);
        string[] memory datesIssued = new string[](totalCertificates);
        string[] memory issuers = new string[](totalCertificates);
        bytes32[] memory encryptedIssuers = new bytes32[](totalCertificates);
        Status[] memory statuses = new Status[](totalCertificates);

        for (uint i = 0; i < totalCertificates; i++) {
            string memory certId = certificateIds[i];
            Certificate storage cert = certificates[certId];

            names[i] = cert.name;
            ids[i] = cert.certificateId;
            datesIssued[i] = cert.dateIssued;
            issuers[i] = cert.issuerName;
            encryptedIssuers[i] = cert.encryptedIssuerName;
            statuses[i] = cert.status;
        }

        return (names, ids, datesIssued, issuers, encryptedIssuers, statuses);
    }
}
