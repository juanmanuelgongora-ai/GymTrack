import React, { useState, useEffect } from 'react';
import { Activity, Play, Calendar, Zap, ArrowRight, CheckCircle2, Dumbbell, Clock, ShieldCheck, ListChecks, X, Timer, Target, WifiOff, Wifi, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../logica/UserContext';
import '../../estilos/tabs.css';

export default function RutinaTab({ autoStartPlan, setAutoStartPlan, rutinaActivaData, onLogrosUnlocked }) {
  const { token } = useUser();
  const [rutina, setRutina] = useState(rutinaActivaData?.plan_semanal?.dias || []);
  const [loading, setLoading] = useState(!rutinaActivaData);

  // States for exercise execution
  const [activeDay, setActiveDay] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState([]);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [isRoutineSequenceActive, setIsRoutineSequenceActive] = useState(false);
  const [rutinaId, setRutinaId] = useState(rutinaActivaData?.id || null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // increments each new calendar week

  // --- Helpers for ISO week number ---
  const getISOWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return { week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), year: d.getUTCFullYear() };
  };
  const weekSnapKey = (id) => `gymtrack_week_snap_${id}`;

  // Load progress from DB when rutinaActivaData is provided via props
  useEffect(() => {
    if (rutinaActivaData?._progreso_guardado && Object.keys(rutinaActivaData._progreso_guardado).length > 0) {
      setExerciseProgress(rutinaActivaData._progreso_guardado);
    }
  }, [rutinaActivaData]);

  // --- Weekly reset logic ---
  useEffect(() => {
    if (!rutinaId) return;
    const key = weekSnapKey(rutinaId);
    const { week: currentWeek, year: currentYear } = getISOWeek(new Date());
    const raw = localStorage.getItem(key);
    if (!raw) {
      // First time — save snapshot
      localStorage.setItem(key, JSON.stringify({ week: currentWeek, year: currentYear, weekOffset: 0 }));
      setWeekOffset(0);
    } else {
      const snap = JSON.parse(raw);
      if (snap.year !== currentYear || snap.week !== currentWeek) {
        // New week detected — reset progress
        const newOffset = (snap.weekOffset || 0) + 1;
        localStorage.setItem(key, JSON.stringify({ week: currentWeek, year: currentYear, weekOffset: newOffset }));
        // Clear local progress
        localStorage.removeItem(`gymtrack_rutina_${rutinaId}`);
        setExerciseProgress({});
        setWeekOffset(newOffset);
        // Also clear progress on backend
        if (token) {
          fetch('/api/rutinas/sync-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: JSON.stringify({ rutina_id: rutinaId, progreso_json: {} })
          }).catch(console.error);
        }
      } else {
        setWeekOffset(snap.weekOffset || 0);
      }
    }
  }, [rutinaId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync progress to backend database
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (rutinaId) {
      localStorage.setItem(`gymtrack_rutina_${rutinaId}`, JSON.stringify(exerciseProgress));
    }

    if (rutinaId && token && Object.keys(exerciseProgress).length > 0) {
      fetch('/api/rutinas/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rutina_id: rutinaId,
          progreso_json: exerciseProgress
        })
      }).catch(err => console.error('Sync progress error:', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [exerciseProgress, rutinaId, token]);

  useEffect(() => {
    let interval;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0 && activeExercise) {
      setIsResting(false);
      if (currentSet < (activeExercise?.series || 3)) {
        setCurrentSet(prev => prev + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft, currentSet, activeExercise]);

  const startExercise = (ejercicio) => {
    const exId = ejercicio.id || ejercicio.nombre || ejercicio.ejercicio_nombre;
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

    const restTime = parseInt(ejercicio.tiempo_descanso || ejercicio.descanso || '60');
    setActiveExercise({
      ...ejercicio,
      tiempo_descanso: isNaN(restTime) ? 60 : restTime
    });

    setCurrentWeight(ejercicio.peso_sugerido?.match(/\d+/)?.[0] || '');
    setCurrentReps(ejercicio.repeticiones?.match(/\d+/)?.[0] || '');
  };

  const closeExercise = () => {
    if (activeExercise) {
      const exId = activeExercise.id || activeExercise.nombre || activeExercise.ejercicio_nombre;
      setExerciseProgress(prev => ({
        ...prev,
        [exId]: { currentSet, completedSets }
      }));
    }

    if (hasNewActivity) {
      if (window.confirm("¿Deseas registrar este entrenamiento en tu historial antes de salir?")) {
        finishAndSaveRoutine();
        return;
      }
    }

    setActiveExercise(null);
    setIsResting(false);
    setIsRoutineSequenceActive(false);
    setHasNewActivity(false);
  };

  const startFullRoutine = (dayPlan) => {
    if (!dayPlan.ejercicios || dayPlan.ejercicios.length === 0) return;
    setActiveDay(dayPlan);
    setIsRoutineSequenceActive(true);
    setCurrentSequenceIndex(0);
    setSessionStartTime(Date.now());
    startExercise(dayPlan.ejercicios[0]);
  };

  useEffect(() => {
    if (autoStartPlan) {
      if (autoStartPlan.ejercicios && autoStartPlan.ejercicios.length === 1 && autoStartPlan.grupo_muscular) {
        setActiveDay(autoStartPlan);
        setIsRoutineSequenceActive(false);
        setSessionStartTime(Date.now());
        startExercise(autoStartPlan.ejercicios[0]);
      } else {
        startFullRoutine(autoStartPlan);
      }
      if (setAutoStartPlan) setAutoStartPlan(null);
    }
  }, [autoStartPlan, setAutoStartPlan]);

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
      finishAndSaveRoutine();
    }
  };

  const finishAndSaveRoutine = async () => {
    if (!activeDay || isSaving) return;
    setIsSaving(true);

    let finalProgress = { ...exerciseProgress };
    if (activeExercise) {
      const exId = activeExercise.id || activeExercise.nombre || activeExercise.ejercicio_nombre;
      finalProgress[exId] = { currentSet, completedSets };
      setExerciseProgress(finalProgress);
    }

    const duracionMs = sessionStartTime ? (Date.now() - sessionStartTime) : 0;
    const duracionMinutos = Math.max(1, Math.round(duracionMs / 60000));

    try {
      const response = await fetch('/api/entrenamientos/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rutina_id: rutinaId,
          dia_rutina: activeDay.dia || 'Día único',
          duracion_minutos: duracionMinutos,
          detalles_sesion: finalProgress
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (onLogrosUnlocked) {
          onLogrosUnlocked(result.logros_desbloqueados || []);
        }
        if (result.message.includes('completado')) {
          alert(result.message);
        } else if (!result.logros_desbloqueados || result.logros_desbloqueados.length === 0) {
          alert("¡Entrenamiento guardado con éxito!");
        }
      } else {
        const errorData = await response.json();
        alert("Error al guardar: " + (errorData.message || "Error desconocido"));
      }
    } catch (e) {
      console.error("Error saving routine session", e);
      alert("No se pudo conectar con el servidor para guardar el entrenamiento.");
    } finally {
      setIsSaving(false);
      setIsRoutineSequenceActive(false);
      setActiveExercise(null);
      setActiveDay(null);
      setHasNewActivity(false);
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
    const newCompleted = [...completedSets, {
      set: currentSet,
      peso: parseFloat(currentWeight) || 0,
      reps: parseInt(currentReps) || 0
    }];
    setCompletedSets(newCompleted);
    setHasNewActivity(true);

    const totalSeries = activeExercise?.series || 3;
    if (newCompleted.length >= totalSeries) {
      setIsResting(false);
    } else {
      setIsResting(true);
      setRestTimeLeft(activeExercise?.tiempo_descanso || 60);
    }
  };

  useEffect(() => {
    if (rutinaActivaData) return;
    const fetchRutina = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/rutinas/latest', {
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
            if (data.progreso_guardado && Object.keys(data.progreso_guardado).length > 0) {
              setExerciseProgress(data.progreso_guardado);
            } else {
              const saved = localStorage.getItem(`gymtrack_rutina_${data.rutina.id}`);
              if (saved) {
                try {
                  setExerciseProgress(JSON.parse(saved));
                } catch (err) {
                  console.error("Could not parse saved routine progress", err);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching routine', err);
      } finally {
        setLoading(false);
      }
    };
    if (token && !rutinaActivaData) fetchRutina();
  }, [token, rutinaActivaData]);

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

  const weekNumber = (rutina[0]?.semana_plan || 1) + weekOffset;

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
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: dayPlan.ejercicios?.length ? 1 : 0.5, ...(completed ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' } : {}) }}
                    onClick={() => startFullRoutine(dayPlan)}
                    disabled={!dayPlan.ejercicios?.length}
                  >
                    {completed ? <CheckCircle2 size={16} /> : <Play size={16} />} {completed ? 'Rutina completada' : 'Comenzar'}
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

      <div className="bg-glow" style={{ top: '20%', right: '-10%', background: 'radial-gradient(circle, rgba(255, 107, 53, 0.05) 0%, transparent 70%)' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)' }}></div>

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
                  <button className="primary-btn flex-align-center gap-8" onClick={() => startExercise({ ...ej, nombre: ej.nombre || ej.ejercicio_nombre || 'Ejercicio', series: ej.series || 3, repeticiones: ej.repeticiones || '10-12', tiempo_descanso: ej.tiempo_descanso || 60, peso_sugerido: ej.peso_sugerido || 'Moderado' })} style={{ padding: '8px 16px', ...((exerciseProgress[ej.id || ej.nombre || ej.ejercicio_nombre]?.completedSets?.length >= (ej.series || 3)) ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' } : {}) }}>
                    {(exerciseProgress[ej.id || ej.nombre || ej.ejercicio_nombre]?.completedSets?.length >= (ej.series || 3)) ? <CheckCircle2 size={16} /> : <Play size={16} />} {(exerciseProgress[ej.id || ej.nombre || ej.ejercicio_nombre]?.completedSets?.length >= (ej.series || 3)) ? 'Completado' : 'Iniciar'}
                  </button>
                </div>
              )) : (
                <p className="text-center text-secondary py-32">No hay ejercicios asignados para este día.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeExercise && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}
          >
            <motion.div
              className="glass-panel"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              style={{ maxWidth: '480px', width: '92%', textAlign: 'center', position: 'relative', padding: '24px 20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {!isOnline && (
                <div style={{
                  background: 'rgba(255, 68, 68, 0.15)',
                  border: '1px solid rgba(255, 68, 68, 0.4)',
                  color: '#ff4444',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <WifiOff size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Modo sin conexión</p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Tu progreso se guarda localmente.</p>
                  </div>
                </div>
              )}

              <button onClick={closeExercise} className="modal-close-btn" style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                <X size={20} />
              </button>

              <div className="exercise-header mb-16">
                <p className="text-brand mb-4" style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Ejecutando:</p>
                <h2 className="glow-text m-0" style={{ fontSize: '24px', lineHeight: '1.1', color: '#fff' }}>{activeExercise.nombre}</h2>
              </div>

              <div className="stats-grid-premium mb-20">
                <div className="stat-card-glass">
                  <span className="stat-icon-bg"><Dumbbell size={14} /></span>
                  <div className="stat-content">
                    <p className="stat-label">Series</p>
                    <p className="stat-value" style={{ fontSize: '16px' }}>{completedSets.length} <small>/ {activeExercise.series}</small></p>
                  </div>
                </div>
                <div className="stat-card-glass">
                  <span className="stat-icon-bg"><Target size={14} /></span>
                  <div className="stat-content">
                    <p className="stat-label">Reps</p>
                    <p className="stat-value" style={{ fontSize: '16px' }}>{activeExercise.repeticiones}</p>
                  </div>
                </div>
                <div className="stat-card-glass">
                  <span className="stat-icon-bg"><Timer size={14} /></span>
                  <div className="stat-content">
                    <p className="stat-label">Descanso</p>
                    <p className="stat-value text-brand" style={{ fontSize: '16px' }}>{activeExercise.tiempo_descanso}s</p>
                  </div>
                </div>
              </div>

              {isResting ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rest-container mb-24 glass-panel-premium"
                >
                  <div className="rest-timer-circle">
                    <Timer size={48} className="text-brand animate-pulse" />
                    <h3 className="timer-text">{restTimeLeft}<small>s</small></h3>
                  </div>
                  <p className="text-secondary mt-16">Tiempo de recuperación recomendado</p>
                  <p className="text-white font-bold opacity-80 mb-20">Siguiente: Serie {currentSet}</p>
                  <button className="secondary-btn-premium w-full" onClick={() => { setIsResting(false); setRestTimeLeft(0); if (currentSet < activeExercise.series) setCurrentSet(prev => prev + 1); }}>Saltar descanso</button>
                </motion.div>
              ) : completedSets.length >= activeExercise.series ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="completion-card-premium mb-24"
                >
                  <div className="success-icon-bg">
                    <Trophy size={48} color="#10b981" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-8">¡Ejercicio Completado!</h3>
                  <p className="text-secondary mb-24 max-w-280 mx-auto">Has superado todas las series. Tu progreso se ha sincronizado correctamente.</p>
                  <button
                    className="primary-btn-glow w-full"
                    onClick={() => {
                      if (isRoutineSequenceActive) {
                        nextExerciseInSequence();
                      } else {
                        finishAndSaveRoutine();
                      }
                    }}
                  >
                    {isRoutineSequenceActive
                      ? (currentSequenceIndex < activeDay.ejercicios.length - 1 ? 'Siguiente Ejercicio' : 'Finalizar Sesión')
                      : 'Cerrar y Guardar'}
                  </button>
                </motion.div>
              ) : (
                <div className="execution-card-premium mb-24">
                  <div className="set-indicator mb-16">
                    <span className="set-badge">Serie {currentSet}</span>
                    <p className="text-secondary mt-8" style={{ fontSize: '0.85rem' }}>Objetivo: <span className="text-white font-bold">{activeExercise.repeticiones} reps</span></p>
                  </div>

                  <div className="input-grid-premium mb-16">
                    <div className="input-group-modern">
                      <label>Peso (kg)</label>
                      <input
                        type="number"
                        value={currentWeight}
                        onChange={e => setCurrentWeight(e.target.value)}
                        placeholder="0"
                        style={{ padding: '12px', fontSize: '18px' }}
                      />
                    </div>
                    <div className="input-group-modern">
                      <label>Repeticiones</label>
                      <input
                        type="number"
                        value={currentReps}
                        onChange={e => setCurrentReps(e.target.value)}
                        placeholder="0"
                        style={{ padding: '12px', fontSize: '18px' }}
                      />
                    </div>
                  </div>

                  <button className="primary-btn-premium w-full" onClick={completeSet}>
                    <CheckCircle2 size={20} /> Confirmar Serie {currentSet}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
