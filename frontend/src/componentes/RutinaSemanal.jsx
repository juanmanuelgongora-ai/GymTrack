import React from 'react';
import { Calendar, CheckCircle2, Clock, Zap, ShieldCheck, ListChecks, Play } from 'lucide-react';
import '../estilos/tabs.css'; // Utilizamos los estilos existentes de RutinaTab

const RutinaSemanal = ({ dias, exerciseProgress, weekNumber, onStartRoutine, onViewDetails }) => {
  const isDayCompleted = (dayPlan) => {
    if (!dayPlan.ejercicios || dayPlan.ejercicios.length === 0) return false;
    return dayPlan.ejercicios.every(ej => {
      const exId = ej.id || ej.nombre || ej.ejercicio_nombre;
      const progress = exerciseProgress[exId];
      if (!progress) return false;
      return progress.completedSets.length >= (ej.series || 3);
    });
  };

  if (!dias || dias.length === 0) return null;

  return (
    <section className="rutina-semanal-section" style={{ animation: 'fadeIn 0.8s ease', marginTop: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="glow-text" style={{ fontSize: '28px', margin: 0 }}>Mi Rutina Semanal</h2>
          <p className="subtitle-text" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Visualiza tu progreso y objetivos para esta semana</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderColor: 'var(--color-brand-primary)', borderRadius: '12px' }}>
          <Calendar size={18} color="#ff6b35" />
          <span style={{ fontWeight: 'bold' }}>Semana {weekNumber || 1}</span>
        </div>
      </header>

      <div className="rutinas-grid-historia">
        {dias.map((dayPlan, index) => {
          const completed = isDayCompleted(dayPlan);
          const cardColor = completed ? '#10b981' : 'var(--brand-orange, #ff6f00)';
          const cardGradient = completed
            ? 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(20,20,20,0.8) 100%)'
            : 'linear-gradient(145deg, rgba(255,111,0,0.05) 0%, rgba(20,20,20,0.8) 100%)';

          return (
            <div
              key={index}
              className={`glass-panel rutina-card-premium ${completed ? 'day-completed' : ''}`}
              style={{ borderColor: completed ? 'rgba(16,185,129,0.5)' : 'rgba(255,111,0,0.2)', background: cardGradient }}
            >
              <div className="card-header-premium">
                <span className="day-badge" style={{ background: completed ? cardColor : 'rgba(255,111,0,0.1)', color: completed ? '#fff' : cardColor, borderColor: completed ? cardColor : 'rgba(255,111,0,0.2)' }}>{dayPlan.dia}</span>
                <h2 className="muscle-group-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {dayPlan.grupo_muscular}
                  {completed && <CheckCircle2 size={18} color="#10b981" />}
                </h2>
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
                    <span className="detail-value">{dayPlan.semana_plan || weekNumber || 1}</span>
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

              <div className="card-actions" style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                <button
                  className="primary-btn"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: dayPlan.ejercicios?.length ? 1 : 0.5, ...(completed ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' } : {}) }}
                  onClick={() => onStartRoutine(dayPlan)}
                  disabled={!dayPlan.ejercicios?.length}
                >
                  {completed ? <CheckCircle2 size={16} /> : <Play size={16} />} {completed ? 'Rutina completada' : 'Comenzar'}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => onViewDetails(dayPlan)}
                  style={{ flex: 1, borderColor: completed ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)' }}
                >
                  Detalles
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default RutinaSemanal;
