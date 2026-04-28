import React, { useState, useEffect } from 'react';
import { Trophy, X, Star } from 'lucide-react';

export default function AchievementNotification({ achievements, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievements && achievements.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievements]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  if (!achievements || achievements.length === 0) return null;

  return (
    <div className={`achievement-toast-container ${visible ? 'show' : 'hide'}`}>
      {achievements.map((logro, idx) => (
        <div key={logro.id || idx} className="achievement-toast glass-panel">
          <div className="toast-icon-box">
            <Trophy size={24} color="#fff" />
          </div>
          <div className="toast-content">
            <span className="toast-tag">¡LOGRO DESBLOQUEADO!</span>
            <h4>{logro.nombre}</h4>
            <p>{logro.descripcion}</p>
            <div className="toast-points">
              <Star size={12} fill="#ff6b35" color="#ff6b35" /> +{logro.puntos} Puntos
            </div>
          </div>
          <button className="toast-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
      ))}
      <style>{`
        .achievement-toast-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }
        
        .achievement-toast {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          min-width: 320px;
          max-width: 400px;
          background: rgba(20, 20, 25, 0.95) !important;
          border: 1px solid rgba(255, 107, 53, 0.4) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(255,107,53,0.1) !important;
          border-radius: 16px;
          transform: translateX(120%);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .achievement-toast-container.show .achievement-toast {
          transform: translateX(0);
        }
        
        .achievement-toast-container.hide .achievement-toast {
          transform: translateX(150%);
        }
        
        .toast-icon-box {
          width: 54px;
          height: 54px;
          background: var(--color-brand-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(255,107,53,0.3);
          flex-shrink: 0;
        }
        
        .toast-content h4 {
          margin: 4px 0;
          font-size: 16px;
          color: white;
        }
        
        .toast-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--color-brand-primary);
          letter-spacing: 1px;
        }
        
        .toast-content p {
          margin: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
        
        .toast-points {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #ff6b35;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px;
        }
        
        .toast-close:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
