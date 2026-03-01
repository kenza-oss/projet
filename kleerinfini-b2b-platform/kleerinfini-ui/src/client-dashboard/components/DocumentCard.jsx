// src/components/ReceivedDocumentCard.jsx
import React from 'react';
import { FaDownload } from 'react-icons/fa';

const DocumentCard = ({ title, type, fileUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition">
      <div>
        <h3 className="text-lg font-bold text-black mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
      <a
        href={fileUrl}
        download
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FaDownload /> Télécharger
      </a>
    </div>
  );
};

export default DocumentCard;
