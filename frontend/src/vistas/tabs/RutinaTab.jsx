import React, { useState, useEffect } from 'react';
import { Activity, Play, Calendar, Zap, ArrowRight, CheckCircle2, Dumbbell, Clock, ShieldCheck, ListChecks, X, Timer, Target } from 'lucide-react';
import '../../estilos/tabs.css';

export default function RutinaTab({ token }) {
  const [rutina, setRutina] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for exercise execution
  const [activeDay, setActiveDay] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState([]);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [isRoutineSequenceActive, setIsRoutineSequenceActive] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [rutinaId, setRutinaId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (rutinaId) {
      localStorage.setItem(`gymtrack_rutina_${rutinaId}`, JSON.stringify(exerciseProgress));
    }
  }, [exerciseProgress, rutinaId]);

  useEffect(() => {
    let interval;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0 && activeExercise) {
      setIsResting(false);
      // Wait for user to be ready for next set if we want manual start, but story says:
      // "Al completar cada serie, el cliente la confirma y el sistema activa el temporizador de descanso automáticamente."
      if (currentSet < (activeExercise?.series || 3)) {
        setCurrentSet(prev => prev + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft, currentSet, activeExercise]);

  const startExercise = (ejercicio) => {
    setActiveExercise(ejercicio);
    const exId = ejercicio.id || ejercicio.nombre;
    const progress = exerciseProgress[exId];
    if (progress) {
      setCurrentSet(progress.currentSet);
      setCompletedSets(progress.completedSets);
    } else {
      setCurrentSet(1);
      setCompletedSets([]);
    }
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const closeExercise = () => {
    if (activeExercise) {
      const exId = activeExercise.id || activeExercise.nombre || activeExercise.ejercicio_nombre;
      setExerciseProgress(prev => ({
        ...prev,
        [exId]: { currentSet, completedSets }
      }));
    }
    setActiveExercise(null);
    setIsResting(false);
    setIsRoutineSequenceActive(false);
  };

  const startFullRoutine = (dayPlan) => {
    if (!dayPlan.ejercicios || dayPlan.ejercicios.length === 0) return;
    setActiveDay(dayPlan);
    setIsRoutineSequenceActive(true);
    setCurrentSequenceIndex(0);
    startExercise(dayPlan.ejercicios[0]);
  };

  const nextExerciseInSequence = () => {
    if (activeExercise) {
      const exId = activeExercise.id || activeExercise.nombre || activeExercise.ejercicio_nombre;
      setExerciseProgress(prev => ({
        ...prev,
        [exId]: { currentSet, completedSets }
      }));
    }

    if (currentSequenceIndex < activeDay.ejercicios.length - 1) {
      const nextIdx = currentSequenceIndex + 1;
      setCurrentSequenceIndex(nextIdx);
      startExercise(activeDay.ejercicios[nextIdx]);
    } else {
      setIsRoutineSequenceActive(false);
      setActiveExercise(null);
      setActiveDay(null);
    }
  };

  const isDayCompleted = (dayPlan) => {
    if (!dayPlan.ejercicios || dayPlan.ejercicios.length === 0) return false;
    return dayPlan.ejercicios.every(ej => {
      const exId = ej.id || ej.nombre || ej.ejercicio_nombre;
      const progress = exerciseProgress[exId];
      if (!progress) return false;
      return progress.completedSets.length >= (ej.series || 3);
    });
  };

  const completeSet = () => {
    const newCompleted = [...completedSets, currentSet];
    setCompletedSets(newCompleted);

    const totalSeries = activeExercise?.series || 3;
    if (newCompleted.length >= totalSeries) {
      setIsResting(false);
    } else {
      setIsResting(true);
      setRestTimeLeft(activeExercise?.tiempo_descanso || 60);
    }
  };

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
            setRutinaId(data.rutina.id);
            setRutina(data.rutina.plan_semanal.dias || []);

            // Load from localStorage if present
            const saved = localStorage.getItem(`gymtrack_rutina_${data.rutina.id}`);
            if (saved) {
              try {
                setExerciseProgress(JSON.parse(saved));
              } catch (e) {
                console.error("Could not parse saved routine progress");
              }
            }
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
          {rutina.map((dayPlan, index) => {
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
                  <h2 className="muscle-group-title flex-align-center gap-8">
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

                <div className="card-actions" style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                  <button
                    className="primary-btn"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: dayPlan.ejercicios?.length ? 1 : 0.5 }}
                    onClick={() => startFullRoutine(dayPlan)}
                    disabled={!dayPlan.ejercicios?.length}
                  >
                    <Play size={16} /> {completed ? 'Repetir' : 'Comenzar'}
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => setActiveDay(dayPlan)}
                    style={{ flex: 1, borderColor: completed ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)' }}
                  >
                    Detalles
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Background decoration */}
      <div className="bg-glow" style={{ top: '20%', right: '-10%', background: 'radial-gradient(circle, rgba(255, 107, 53, 0.05) 0%, transparent 70%)' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' }}></div>

      {/* Day Details Modal */}
      {activeDay && !activeExercise && !isRoutineSequenceActive && (
        <div className="modal-overlay" onClick={() => setActiveDay(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div className="glass-panel p-24" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-24">
              <h2 className="glow-text m-0" style={{ fontSize: '20px' }}>Rutina: {activeDay.dia}</h2>
              <button onClick={() => setActiveDay(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <p className="text-secondary mb-24">Grupo Muscular: <span className="text-white">{activeDay.grupo_muscular}</span></p>

            <div className="ejercicios-list">
              {activeDay.ejercicios?.length > 0 ? activeDay.ejercicios.map((ej, idx) => (
                <div key={idx} className="glass-panel p-16 mb-16 flex-between" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <h3 className="text-lg mb-8">{ej.nombre || ej.ejercicio_nombre || 'Ejercicio'}</h3>
                    <div className="text-secondary text-xs flex-align-center gap-12">
                      <span className="flex-align-center gap-4"><Activity size={14} /> {ej.series || 3} Series</span>
                      <span className="flex-align-center gap-4"><Target size={14} /> {ej.repeticiones || '10-12'} Reps</span>
                    </div>
                  </div>
                  <button className="primary-btn flex-align-center gap-8" onClick={() => startExercise({ ...ej, nombre: ej.nombre || ej.ejercicio_nombre || 'Ejercicio', series: ej.series || 3, repeticiones: ej.repeticiones || '10-12', tiempo_descanso: ej.tiempo_descanso || 60, peso_sugerido: ej.peso_sugerido || 'Moderado' })} style={{ padding: '8px 16px' }}>
                    <Play size={16} /> Iniciar
                  </button>
                </div>
              )) : (
                <p className="text-center text-secondary py-32">No hay ejercicios asignados para este día.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Execution Modal */}
      {activeExercise && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}>
          <div className="glass-panel p-32" style={{ maxWidth: '500px', width: '95%', textAlign: 'center', position: 'relative' }}>
            <button onClick={closeExercise} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}><X size={24} /></button>

            <h2 className="glow-text mb-24" style={{ fontSize: '24px', paddingRight: '20px' }}>{activeExercise.nombre}</h2>

            <div className="stats-grid mb-32" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="glass-panel p-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-secondary text-xs mb-4">Series</p>
                <p className="text-xl font-bold">{completedSets.length} / {activeExercise.series}</p>
              </div>
              <div className="glass-panel p-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-secondary text-xs mb-4">Reps</p>
                <p className="text-xl font-bold">{activeExercise.repeticiones}</p>
              </div>
              <div className="glass-panel p-12" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-secondary text-xs mb-4">Descanso</p>
                <p className="text-xl font-bold text-brand">{activeExercise.tiempo_descanso}s</p>
              </div>
            </div>

            {isResting ? (
              <div className="timer-container mb-32 glass-panel py-32 px-16" style={{ borderColor: 'var(--brand-orange)', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 80%)' }}>
                <Timer size={48} className="text-brand mb-16 mx-auto animate-pulse" />
                <h3 className="text-4xl font-bold mb-8 glow-text" style={{ fontSize: '48px' }}>{restTimeLeft}s</h3>
                <p className="text-secondary mb-16">Recomendado descansar antes de la Serie {currentSet}</p>
                <button className="secondary-btn w-full" onClick={() => { setIsResting(false); setRestTimeLeft(0); if (currentSet < activeExercise.series) setCurrentSet(prev => prev + 1); }}>Saltar descanso</button>
              </div>
            ) : completedSets.length >= activeExercise.series ? (
              <div className="completion-container mb-32 glass-panel py-32 px-16" style={{ borderColor: '#10b981', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 80%)' }}>
                <CheckCircle2 size={56} color="#10b981" className="mb-16 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-8">¡Ejercicio Completado!</h3>
                <p className="text-secondary mb-24">Has completado todas las series satisfactoriamente.</p>
                <button
                  className="primary-btn w-full py-16"
                  style={{ background: '#10b981', color: 'white' }}
                  onClick={() => {
                    if (isRoutineSequenceActive) {
                      nextExerciseInSequence();
                    } else {
                      closeExercise();
                    }
                  }}
                >
                  {isRoutineSequenceActive
                    ? (currentSequenceIndex < activeDay.ejercicios.length - 1 ? 'Siguiente Ejercicio' : 'Finalizar Rutina')
                    : 'Continuar'}
                </button>
              </div>
            ) : (
              <div className="execution-container mb-32">
                <div className="glass-panel p-24 mb-24 text-center">
                  <h3 className="text-2xl font-bold text-white mb-8">Serie {currentSet}</h3>
                  <p className="text-secondary">Prepárate y realiza <span className="text-white font-bold">{activeExercise.repeticiones}</span> repeticiones.</p>

                  <div className="mt-16 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-secondary mb-4">PESO SUGERIDO</p>
                    <p className="text-lg font-bold text-brand">{activeExercise.peso_sugerido || 'Moderado / A tu capacidad'}</p>
                  </div>
                </div>

                <button className="primary-btn w-full flex-align-center justify-center gap-8 py-16" onClick={completeSet} style={{ fontSize: '1.1rem' }}>
                  <CheckCircle2 size={24} /> Confirmar Serie {currentSet}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
