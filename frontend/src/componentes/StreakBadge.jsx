import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import '../estilos/StreakBadge.css';

const StreakBadge = ({ count = 0, loading = false }) => {
  const [prevCount, setPrevCount] = useState(count);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (count > prevCount) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 600);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  if (loading) {
    return (
      <div className="streak-badge-container" style={{ opacity: 0.5 }}>
        <div className="streak-icon-wrapper">
          <div className="streak-glow"></div>
          <Flame size={20} className="streak-flame animate-pulse" color="#555" />
        </div>
        <div className="streak-info">
          <div className="streak-count" style={{ width: '20px', height: '20px', background: '#333', borderRadius: '4px' }}></div>
          <div className="streak-label">...</div>
        </div>
      </div>
    );
  }

  const isLost = count === 0;
  
  // Determine tier
  let tierClass = '';
  if (count >= 100) tierClass = 'streak-tier-100';
  else if (count >= 30) tierClass = 'streak-tier-30';
  else if (count >= 7) tierClass = 'streak-tier-7';

  return (
    <div className={`streak-badge-container ${tierClass} ${isLost ? 'streak-lost' : ''} ${isUpdating ? 'streak-updating' : ''}`}>
      <div className="streak-icon-wrapper">
        <div className="streak-glow"></div>
        <Flame 
          size={32} 
          className="streak-flame" 
          fill={isLost ? "#555" : (count >= 100 ? "#ec4899" : (count >= 30 ? "#fbbf24" : "#ff6b35"))} 
          color={isLost ? "#555" : (count >= 100 ? "#ec4899" : (count >= 30 ? "#fbbf24" : "#ff6b35"))} 
        />
      </div>
      <div className="streak-info">
        <span className="streak-count">{count}</span>
        <span className="streak-label">{count === 1 ? 'día de racha' : 'días de racha'}</span>
      </div>
    </div>
  );
};

export default StreakBadge;
