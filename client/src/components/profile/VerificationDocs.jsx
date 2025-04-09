import React from "react";

const VerificationDocs = ({ status = "Pending", uploadedDocs = [] }) => {
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";

  const statusColor = isApproved
    ? "text-green-600"
    : isRejected
    ? "text-red-600"
    : "text-yellow-500";

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-sm">
      <p className="mb-2 font-medium text-gray-700">
        Status:{" "}
        <span className={`font-bold ${statusColor}`}>
          {status}
        </span>
      </p>

      {uploadedDocs && uploadedDocs.length > 0 ? (
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {uploadedDocs.map((doc, index) => (
            <li key={index}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
                title={`View ${doc.name}`}
              >
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          No documents uploaded yet.
        </p>
      )}
    </div>
  );
};

export default VerificationDocs;
