import React from 'react';
import { Play, Activity, Dumbbell, Timer, CheckCircle2, Flame, BookOpen, Clock, Zap } from 'lucide-react';
import '../estilos/RutinaDelDia.css';

const RutinaDelDia = ({
  todayRoutine,
  isTodayCompleted,
  exerciseProgress,
  loading,
  isToday = true,
  dateString,
  onStartExercise,
  onStartRoutine,
  onViewDetails
}) => {
  if (loading) {
    return (
      <div className="rd-skeleton-container glass-panel">
        <div className="rd-skeleton-banner animate-pulse"></div>
        <div className="rd-skeleton-content">
          <div className="rd-skeleton-line rd-w-3/4 animate-pulse"></div>
          <div className="rd-skeleton-line rd-w-1/2 animate-pulse"></div>
          <div className="rd-skeleton-cards">
            <div className="rd-skeleton-card animate-pulse"></div>
            <div className="rd-skeleton-card animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!todayRoutine) {
    return (
      <div className="rd-empty-state glass-panel">
        <Flame size={48} color="#ff6b35" opacity={0.5} />
        <h3>Día de Descanso</h3>
        <p>No tienes una rutina asignada para hoy. ¡Aprovecha para recuperarte!</p>
      </div>
    );
  }

  // Calculate some stats
  const totalEjercicios = todayRoutine?.ejercicios?.length || 0;
  
  // Date formatting
  const todayDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });
  
  const formattedDate = dateString || (todayDate.charAt(0).toUpperCase() + todayDate.slice(1));

  return (
    <section className="rd-container">
      <div className="rd-card">
        
        {/* HEADER DE LA RUTINA */}
        <div className="rd-header">
          <div className="rd-header-overlay"></div>
          <div className="rd-header-content">
            <div className="rd-badges-top">
              {isToday && (
                <span className="rd-badge rd-badge-primary">
                  <Flame size={14} /> Rutina de Hoy
                </span>
              )}
              {isTodayCompleted && (
                <span className="rd-badge rd-badge-success">
                  <CheckCircle2 size={14} /> Completada
                </span>
              )}
            </div>
            
            <h2 className="rd-title">{todayRoutine.grupo_muscular || 'Entrenamiento del día'}</h2>
            
            <div className="rd-badges-bottom">
              <span className="rd-info-badge"><Clock size={14} /> {todayRoutine.duracion_estimada || '45-60 min'}</span>
              <span className="rd-info-badge"><Zap size={14} /> {todayRoutine.intensidad || 'Media'}</span>
              <span className="rd-info-badge"><Dumbbell size={14} /> {totalEjercicios} ejercicios</span>
            </div>
          </div>
        </div>

        <div className="rd-body">
          {/* INFORMACIÓN GENERAL */}
          <div className="rd-general-info">
            <div className="rd-info-item">
              <span className="rd-info-label">DÍA DEL PLAN</span>
              <span className="rd-info-value">{todayRoutine.dia || 'Día 1'}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label">FECHA</span>
              <span className="rd-info-value">{formattedDate}</span>
            </div>
          </div>

          {/* LISTADO DE EJERCICIOS */}
          <div className="rd-exercises">
            <h3 className="rd-section-title">Ejercicios</h3>
            
            <div className="rd-exercise-list">
              {todayRoutine.ejercicios?.map((ex, idx) => {
                const progress = exerciseProgress[ex.id || ex.nombre || ex.ejercicio_nombre];
                const completedSets = progress?.completedSets?.length || 0;
                const targetSets = ex.series || 3;
                const isExCompleted = completedSets >= targetSets;

                return (
                  <div key={idx} className={`rd-exercise-item ${isExCompleted ? 'rd-ex-completed' : ''}`}>
                    <div className="rd-ex-icon-wrapper">
                      {isExCompleted ? <CheckCircle2 size={18} color="#10b981" /> : <Play size={18} color="#ff6b35" />}
                    </div>
                    
                    <div className="rd-ex-details">
                      <h4>{ex.nombre}</h4>
                      <div className="rd-ex-meta">
                        <span>{ex.series} series</span>
                        <span className="rd-dot">•</span>
                        <span>{ex.repeticiones} reps</span>
                        {ex.descanso && (
                          <>
                            <span className="rd-dot">•</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Timer size={12} /> {ex.descanso}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="rd-ex-action">
                      {isExCompleted ? (
                        <span className="rd-text-success">Completado</span>
                      ) : (
                        <button 
                          className="rd-btn-icon" 
                          onClick={() => onStartExercise(ex)}
                          title="Iniciar ejercicio"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="rd-actions">
            <button 
              className={`rd-btn-primary ${isTodayCompleted ? 'rd-btn-success' : ''}`}
              onClick={onStartRoutine}
            >
              {isTodayCompleted ? <CheckCircle2 size={18} /> : <Play size={18} fill="currentColor" />}
              {isTodayCompleted ? 'Repetir Rutina' : 'Comenzar'}
            </button>
            
            <button className="rd-btn-secondary" onClick={onViewDetails}>
              <BookOpen size={18} /> Ver Detalles
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RutinaDelDia;
