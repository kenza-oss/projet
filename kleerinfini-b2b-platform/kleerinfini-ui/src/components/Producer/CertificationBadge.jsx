import React from 'react';

const CertificationBadge = ({ name }) => (
  <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
    {name}
  </span>
);

export default CertificationBadge;
