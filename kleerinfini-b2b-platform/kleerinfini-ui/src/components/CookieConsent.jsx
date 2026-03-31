import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieConsent.css';

const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="cookie-consent-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="cookie-consent-banner">
        <div className="cookie-content">
          <h3>{t('cookies.title')}</h3>
          <p>{t('cookies.description')}</p>
        </div>
        <div className="cookie-actions">
          <button 
            className="cookie-btn cookie-btn-secondary" 
            onClick={handleReject}
          >
            {t('cookies.reject')}
          </button>
          <button 
            className="cookie-btn cookie-btn-primary" 
            onClick={handleAccept}
          >
            {t('cookies.accept')}
          </button>
          <button 
            className="cookie-btn cookie-btn-text"
            onClick={() => window.open('/privacy', '_blank')}
          >
            {t('cookies.manage')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
