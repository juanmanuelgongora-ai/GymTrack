import React, { useState, useEffect } from 'react';
import { useUser } from '../../logica/UserContext';
import { 
  Trophy, Zap, Flame, TrendingUp, Activity, Award, Lock, 
  Loader2, Star, CheckCircle2, Calendar
} from 'lucide-react';
import '../../estilos/tabs.css';

const ICON_MAP = {
  Zap: <Zap size={24} />,
  Flame: <Flame size={24} />,
  Trophy: <Trophy size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Activity: <Activity size={24} />,
  Award: <Award size={24} />,
  Star: <Star size={24} />,
};

export default function LogrosTab() {
  const { token } = useUser();
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogros();
  }, []);

  const fetchLogros = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logros', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        setLogros(await res.json());
      }
    } catch (err) {
      console.error('Error cargando logros:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="tab-container flex-center" style={{ minHeight: '40vh' }}>
        <Loader2 className="animate-spin" size={40} color="#ff6b35" />
      </div>
    );
  }

  const obtenidos = logros.filter(l => l.obtenido);
  const pendientes = logros.filter(l => !l.obtenido);

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Sistema de Logros</h1>
        <p className="subtitle-text">Desbloquea insignias y demuestra tu disciplina</p>
      </header>

      <div className="objetivos-stats">
        <div className="stat-box">
          <div className="icon-box"><Trophy color="#ff6b35" /></div>
          <div>
            <h2>{obtenidos.length}</h2>
            <p>Logros Desbloqueados</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><Star color="#ff6b35" /></div>
          <div>
            <h2>{obtenidos.reduce((acc, l) => acc + l.puntos, 0)}</h2>
            <p>Puntos de Prestigio</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><CheckCircle2 color="#4ade80" /></div>
          <div>
            <h2>{Math.round((obtenidos.length / logros.length) * 100) || 0}%</h2>
            <p>Progreso Total</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-24 flex-align-center gap-12">
          <Award size={20} color="#ff6b35" /> 
          Tus Insignias
        </h3>
        <div className="logros-grid">
          {logros.map(logro => (
            <div 
              key={logro.id} 
              className={`logro-card ${logro.obtenido ? 'unlocked' : 'locked'}`}
              title={logro.descripcion}
            >
              {!logro.obtenido && (
                <div className="lock-icon">
                  <Lock size={12} color="rgba(255,255,255,0.4)" />
                </div>
              )}
              <div className="logro-badge-container">
                {ICON_MAP[logro.icono] || <Award size={24} />}
              </div>
              <div className="logro-info">
                <h4>{logro.nombre}</h4>
                <p>{logro.descripcion}</p>
                {logro.obtenido && (
                  <div className="logro-date">
                    <Calendar size={10} style={{ marginRight: 4 }} />
                    {new Date(logro.fecha_obtencion).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 12, fontSize: 10, fontWeight: 800, color: logro.obtenido ? '#ff6b35' : 'rgba(255,255,255,0.2)' }}>
                +{logro.puntos} PTS
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
