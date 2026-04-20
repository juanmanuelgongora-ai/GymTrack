import React, { useState, useEffect } from 'react';
import { Activity, Play, Calendar, Zap, ArrowRight, CheckCircle2, Dumbbell, Clock, ShieldCheck, ListChecks } from 'lucide-react';
import '../../estilos/tabs.css';

export default function RutinaTab({ token }) {
  const [rutina, setRutina] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/rutinas/latest', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.rutina && data.rutina.plan_semanal) {
            setRutina(data.rutina.plan_semanal.dias || []);
          }
        }
      } catch (e) {
        console.error('Error fetching routine', e);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRutina();
  }, [token]);

  if (loading) {
    return (
      <div className="tab-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="loader-container">
          <Activity className="animate-pulse text-brand" size={48} />
          <p className="glow-text mt-16">Diseñando tu plan maestro...</p>
        </div>
      </div>
    );
  }

  const weekNumber = rutina[0]?.semana_plan || 1;

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header mb-32">
        <div className="flex-between">
          <div>
            <h1 className="glow-text">Mi Rutina Semanal</h1>
            <p className="subtitle-text">Visualiza tu progreso y objetivos para esta semana</p>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderColor: 'var(--color-brand-primary)' }}>
            <Calendar size={18} className="text-brand" />
            <span style={{ fontWeight: 'bold' }}>Semana {weekNumber}</span>
          </div>
        </div>
      </header>

      {rutina.length === 0 ? (
        <div className="glass-panel p-32 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Activity size={48} className="mb-16 text-secondary" style={{ opacity: 0.3 }} />
          <p className="text-secondary">No se encontró ninguna rutina activa.</p>
          <button className="primary-btn mt-24">Generar Nueva Rutina</button>
        </div>
      ) : (
        <div className="rutinas-grid-historia">
          {rutina.map((dayPlan, index) => (
            <div key={index} className="glass-panel rutina-card-premium">
              <div className="card-header-premium">
                <span className="day-badge">{dayPlan.dia}</span>
                <h2 className="muscle-group-title">{dayPlan.grupo_muscular}</h2>
              </div>

              <div className="card-divider"></div>

              <div className="card-details-grid">
                <div className="detail-item">
                  <Clock size={16} className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Duración</span>
                    <span className="detail-value">{dayPlan.duracion_estimada || '45 min'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Zap size={16} className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Intensidad</span>
                    <span className="detail-value">{dayPlan.intensidad || 'Media'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <ShieldCheck size={16} className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Semana</span>
                    <span className="detail-value">{dayPlan.semana_plan || weekNumber}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <ListChecks size={16} className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Ejercicios</span>
                    <span className="detail-value">{dayPlan.ejercicios?.length || 0} ejs</span>
                  </div>
                </div>
              </div>

              <div className="card-actions mt-24">
                <button className="premium-action-btn">
                  <span>Ver rutina completa</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Background decoration */}
      <div className="bg-glow" style={{ top: '20%', right: '-10%', background: 'radial-gradient(circle, rgba(255, 107, 53, 0.05) 0%, transparent 70%)' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' }}></div>
    </div>
  );
}
