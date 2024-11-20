const ApprovalList = ({ certificates, onApprove, onReject }) => (
  <div className="approval-list">
    {certificates.map((cert) => (
      <div key={cert.certificateId} className="certificate-item">
        <p>Name: {cert.name}</p>
        <p>Certificate ID: {cert.certificateId}</p>
        <p>Date Issued: {cert.dateIssued}</p>
        <p>Status: {cert.status}</p>
        <p>Encrypted issuer Code : {cert.encryptedIssuer}</p>
        <button onClick={() => onApprove(cert.certificateId)}>Verify Certificate</button>
      </div>
    ))}
  </div>
);

export default ApprovalList;
