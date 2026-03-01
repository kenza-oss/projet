import React from 'react';

const CertificationBadge = ({ name }) => (
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
    {name}
  </span>
);

export default CertificationBadge;
