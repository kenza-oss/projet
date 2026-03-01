import React, { useState, useEffect } from 'react';
import { Scale, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="h-10 bg-gray-100 rounded"></div>
    <div className="h-10 bg-gray-100 rounded"></div>
    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
  </div>
);

const LegalVariableWidget = () => {
  const [loading, setLoading] = useState(true);
  const [variables, setVariables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      try {
        const dummyData = [
          {
            key_code: 'FSPE_REIMBURSEMENT_RATE',
            display_name: 'Taux de remboursement FSPE',
            value: 60.0,
            unit: '%',
            article_number: 'Art. 3 de l\'Arrêté interministériel n°24',
            source_link: 'http://www.joradp.dz/'
          },
          {
            key_code: 'LOGISTICS_SUBSIDY',
            display_name: 'Subvention Transport',
            value: 50.0,
            unit: '%',
            article_number: 'Art. 12 de la Loi de Finances',
            source_link: 'http://www.joradp.dz/'
          }
        ];
        setVariables(dummyData);
        setLoading(false);
      } catch (err) {
        setError("Service de vérification temporairement indisponible");
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4 text-red-700">
        <AlertCircle size={24} />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.04)] h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Scale size={24} />
        </div>
        <h3 className="text-2xl font-bold text-[#050B18]">Variables Légales (JORADP)</h3>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Skeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {variables.map((v, i) => (
              <div key={i} className="group p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold uppercase text-gray-500">{v.display_name}</span>
                  <span className="text-2xl font-black text-blue-700">{v.value}{v.unit}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <FileText size={14} className="text-blue-500" />
                    <span>{v.article_number}</span>
                  </div>
                  <a
                    href={v.source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-700 uppercase hover:text-blue-900 transition-colors"
                  >
                    Source officielle <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LegalVariableWidget;
