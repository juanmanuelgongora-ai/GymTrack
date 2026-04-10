import React, { useState, useEffect } from 'react';
import { Activity, Play, Calendar, Zap, ArrowRight, CheckCircle2, Dumbbell } from 'lucide-react';
import '../../estilos/tabs.css';

export default function RutinaTab({ token }) {
  const [rutina, setRutina] = useState(null);
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

  const pastRoutines = [
    { name: 'Pecho & Tríceps', date: 'Ayer', kc: 450, t: '60m', e: 6 },
    { name: 'Espalda & Bíceps', date: 'Hace 3 días', kc: 520, t: '75m', e: 7 },
    { name: 'Piernas', date: 'Hace 5 días', kc: 600, t: '80m', e: 7 }
  ];

  if (loading) {
    return <div className="tab-container" style={{ textAlign: 'center', padding: '50px' }}><p className="glow-text">Cargando rutina IA...</p></div>;
  }

  const routineDays = rutina && rutina.length > 0 ? rutina : [];
  const todayRoutine = routineDays[0];
  const upcomingRoutines = routineDays.slice(1);

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Mi Rutina IA</h1>
        <p className="subtitle-text">Programa semanal generado dinámicamente y personalizado</p>
      </header>

      <div className="alimentacion-grid">
        <div className="alimentacion-main">

          <div className="flex-between mb-24">
            <h3 className="section-title">Rutinas de la Semana 4</h3>
            <button className="secondary-btn"><Calendar size={16} /> Cambiar Plan</button>
          </div>

          {routineDays.length === 0 ? (
            <div className="glass-panel p-24 mb-24"><p>No se encontró ninguna rutina. Asegúrate de completar el proceso de Onboarding.</p></div>
          ) : (
            <>
              {todayRoutine && (
                <div className="glass-panel p-24 mb-24" style={{
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(20,20,22,0.9) 100%)',
                  border: '1px solid rgba(255, 107, 53, 0.2)'
                }}>
                  <div className="flex-between mb-8">
                    <span className="badge-done" style={{ background: 'rgba(255,107,53,0.15)', color: '#ff8c42', border: 'none' }}>{todayRoutine.dia || 'Hoy'}</span>
                    <span className="text-sm text-secondary">{todayRoutine.ejercicios?.length || 0} Ejercicios</span>
                  </div>
                  <h2 className="mb-16" style={{ fontSize: '32px' }}>{todayRoutine.grupo_muscular || 'Entrenamiento de hoy'}</h2>

                  <div className="flex-align-center gap-12 text-sm text-secondary mb-24">
                    {todayRoutine.ejercicios?.map((ej, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <p><Dumbbell size={14} /> <b>{ej.nombre}</b>: {ej.series}x{ej.repeticiones} (Descanso: {ej.descanso})</p>
                      </div>
                    ))}
                  </div>

                  <button className="primary-btn w-full"><Play size={20} fill="currentColor" /> Iniciar Entrenamiento</button>
                </div>
              )}

              {upcomingRoutines.length > 0 && <h3 className="section-title mb-16 mt-32">Próximas Sesiones</h3>}

              {upcomingRoutines.map((r, i) => (
                <div className="glass-panel p-24 mb-16" key={i}>
                  <div className="flex-between mb-8">
                    <span className="badge-done" style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: 'none' }}>{r.dia}</span>
                    <span className="text-sm text-secondary">{r.ejercicios?.length || 0} Ejercicios</span>
                  </div>
                  <div className="flex-between">
                    <h2 className="mb-8" style={{ fontSize: '24px' }}>{r.grupo_muscular}</h2>
                    <button className="link-btn" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Ver <ArrowRight size={14} /></button>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

        <div className="alimentacion-side">
          <h3 className="section-title mb-16">Historial Reciente</h3>
          {pastRoutines.map((r, i) => (
            <div className="glass-panel p-24 mb-16" key={i}>
              <div className="flex-between mb-8">
                <span className="text-xs text-brand">{r.date}</span>
                <span className="badge-done" style={{ padding: '2px 8px', fontSize: '10px' }}><CheckCircle2 size={10} /> Hecho</span>
              </div>
              <h4 className="mb-12">{r.name}</h4>
              <div className="flex-between text-xs text-secondary mt-16 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span>🔥 {r.kc} kcal</span>
                <span>⏱ {r.t}</span>
                <span>💪 {r.e} ejs</span>
              </div>
            </div>
          ))}
          <button className="secondary-btn w-full mt-16">Ver Historial Completo</button>
        </div>
      </div>
    </div>
  );
}
