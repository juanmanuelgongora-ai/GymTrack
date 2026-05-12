import { useState, useEffect } from 'react';
import { useUser } from '../logica/UserContext';
import {
  Play, Dumbbell, Activity, Target, Flame, CheckCircle2,
  BookOpen, ChevronRight, Award, Apple, BarChart3, CircleDot, User, Construction, LogOut
} from 'lucide-react';
import '../estilos/PanelClienteGYMTRACK.css';

// Import Tabs
import AlimentacionTab from './tabs/AlimentacionTab';
import ObjetivosTab from './tabs/ObjetivosTab';
import EjerciciosTab from './tabs/EjerciciosTab';
import PerfilTab from './tabs/PerfilTab';
import RutinaTab from './tabs/RutinaTab';
import LogrosTab from './tabs/LogrosTab';
import AchievementNotification from '../componentes/AchievementNotification';
import StreakBadge from '../componentes/StreakBadge';

const PanelClienteGYMTRACK = ({ onLogout, activeTab, setActiveTab, autoStartPlan, setAutoStartPlan }) => {
  const { token, userData } = useUser();
  const clienteData = userData?.cliente || {};

  const userFirstName = userData?.nombre || 'Usuario';
  const [navImgError, setNavImgError] = useState(false);
  const userInitials = `${userData?.nombre?.charAt(0) || ''}${userData?.apellido?.charAt(0) || ''}`.toUpperCase();
  const [stats, setStats] = useState({ entrenamientos_mes: 0, racha_dias: 0, progreso_fuerza: 0, progreso_peso: 0, variacion_peso: 0 });
  const [todayRoutine, setTodayRoutine] = useState(null);
  const [rutinaData, setRutinaData] = useState(null);
  const [hitos, setHitos] = useState([]);
  const [logrosCount, setLogrosCount] = useState(0);
  const [newLogros, setNewLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exerciseProgress, setExerciseProgress] = useState({});

  const handleLogrosUnlocked = (logros) => {
    if (logros && logros.length > 0) {
      setNewLogros(logros);
      setLogrosCount(prev => prev + logros.length);
    }
    // Siempre actualizamos las estadísticas (racha, etc) independientemente de si hay logros
    fetchStats();
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const statsRes = await fetch('/api/entrenamientos/stats', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
      if (statsRes.ok) {
        const dataStats = await statsRes.json();
        setStats({
          entrenamientos_mes: dataStats.entrenamientos_mes,
          racha_dias: dataStats.racha_dias,
          progreso_fuerza: dataStats.progreso_fuerza || 0,
          progreso_peso: dataStats.progreso_peso || 0,
          variacion_peso: dataStats.variacion_peso || 0
        });
      }
    } catch (e) {
      console.error("Error updating stats:", e);
    }
  };

  useEffect(() => {
    if (rutinaData && rutinaData.id) {
      // progreso_guardado from DB takes priority; fallback to localStorage
      if (rutinaData._progreso_guardado && Object.keys(rutinaData._progreso_guardado).length > 0) {
        setExerciseProgress(rutinaData._progreso_guardado);
      } else {
        const saved = localStorage.getItem(`gymtrack_rutina_${rutinaData.id}`);
        if (saved) {
          try {
            setExerciseProgress(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }, [rutinaData]);

  const isTodayCompleted = (dayPlan) => {
    if (!dayPlan || !dayPlan.ejercicios || dayPlan.ejercicios.length === 0) return false;
    return dayPlan.ejercicios.every(ej => {
      const exId = ej.id || ej.nombre || ej.ejercicio_nombre;
      const progress = exerciseProgress[exId];
      if (!progress) return false;
      return progress.completedSets.length >= (ej.series || 3);
    });
  };

  useEffect(() => {
    if (activeTab === 'inicio' && token) {
      const fetchData = async () => {
        try {
          const [routineRes, statsRes, hitosRes, logrosRes] = await Promise.all([
            fetch('/api/rutinas/latest', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
            fetch('/api/entrenamientos/stats', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
            fetch('/api/hitos', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
            fetch('/api/logros', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } })
          ]);

          if (routineRes.ok) {
            const data = await routineRes.json();
            if (data.rutina?.plan_semanal?.dias) {
              // Attach progreso_guardado from DB to the rutina object
              const rutinaWithProgress = { ...data.rutina, _progreso_guardado: data.progreso_guardado || null };
              setRutinaData(rutinaWithProgress);
              const dias = data.rutina.plan_semanal.dias;
              let dayIndex = (new Date().getDay() + 6) % 7;
              if (dayIndex >= dias.length) dayIndex = dias.length - 1;
              setTodayRoutine(dias[dayIndex]);
            }
          }
          if (statsRes.ok) {
            const dataStats = await statsRes.json();
            setStats({
              entrenamientos_mes: dataStats.entrenamientos_mes,
              racha_dias: dataStats.racha_dias,
              progreso_fuerza: dataStats.progreso_fuerza || 0,
              progreso_peso: dataStats.progreso_peso || 0,
              variacion_peso: dataStats.variacion_peso || 0
            });
          }
          if (hitosRes.ok) {
            const dataHitos = await hitosRes.json();
            setHitos(Array.isArray(dataHitos) ? dataHitos : []);
          }
          if (logrosRes.ok) {
            const dataLogros = await logrosRes.json();
            setLogrosCount(dataLogros.filter(l => l.obtenido).length);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [activeTab, token]);

  const metricCards = [
    { title: stats.racha_dias.toString(), subtitle: 'Días consecutivos', icon: Flame, stat: '-', trend: 'neutral' },
    { title: stats.entrenamientos_mes.toString(), subtitle: 'Entrenamientos este mes', icon: Activity, stat: `${stats.progreso_fuerza}%`, trend: stats.progreso_fuerza > 50 ? 'up' : 'neutral' },
    { title: stats.variacion_peso.toString(), subtitle: 'kg variados este mes', icon: Target, stat: stats.variacion_peso <= 0 ? 'Meta' : 'Aviso', trend: stats.variacion_peso <= 0 ? 'up' : 'down' },
    { title: logrosCount.toString(), subtitle: 'Logros desbloqueados', icon: Award, stat: 'Estatus', trend: 'neutral' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <>
            <header className="dashboard-header" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <h1 className="glow-text" style={{ margin: 0 }}>¡Hola, {userFirstName}!</h1>
                  <p className="subtitle-text">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <StreakBadge count={stats.racha_dias} loading={loading} />
              </div>
              <button className="primary-btn pulse-glow" onClick={() => {
                if (todayRoutine) {
                  setAutoStartPlan(todayRoutine);
                  setActiveTab('rutina');
                }
              }}>
                <Play size={20} fill="currentColor" />
                Iniciar Entrenamiento
              </button>
            </header>

            <section className="metrics-grid" style={{ animation: 'fadeIn 0.6s ease' }}>
              {metricCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div className={`metric-card card-${idx + 1}`} key={idx}>
                    <div className="metric-header">
                      <div className="metric-icon-box">
                        <IconComponent size={24} color="#fff" />
                      </div>
                      <span className={`metric-stat stat-${card.trend}`}>{card.stat}</span>
                    </div>
                    <div className="metric-content">
                      <h2>{card.title}</h2>
                      <p>{card.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="dashboard-split" style={{ animation: 'fadeIn 0.7s ease' }}>
              <section className="routine-section">
                <div
                  className={`routine-card ${isTodayCompleted(todayRoutine) ? 'day-completed' : ''}`}
                  style={isTodayCompleted(todayRoutine) ? { borderColor: 'rgba(16,185,129,0.5)', background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(20,20,20,0.8) 100%)' } : {}}
                >
                  <div className="routine-banner">
                    <div className="banner-details">
                      <span className="badge glass-badge" style={isTodayCompleted(todayRoutine) ? { background: '#10b981', color: 'white' } : {}}>Hoy - {todayRoutine?.dia || 'Día 1'}</span>
                      <span className="badge glass-badge">{todayRoutine?.duracion_estimada || '45-60 min'}</span>
                    </div>
                    <h2>
                      {todayRoutine?.grupo_muscular || 'Día de descanso'}
                    </h2>
                    <p>{todayRoutine?.ejercicios?.length || 0} ejercicios • {todayRoutine?.intensidad || 'Baja'}</p>
                  </div>

                  <div className="exercise-list">
                    {todayRoutine?.ejercicios?.map((ex, idx) => (
                      <div className="exercise-item glass-panel" key={idx}>
                        <div className="exercise-number">{idx + 1}</div>
                        <div className="exercise-info">
                          <h3>{ex.nombre}</h3>
                          <div className="exercise-details">
                            <span><Dumbbell size={14} /> {ex.series} x {ex.repeticiones}</span>
                            <span>•</span>
                            <span><Activity size={14} /> {ex.descanso || '60s'}</span>
                          </div>
                        </div>
                        {exerciseProgress[ex.id || ex.nombre || ex.ejercicio_nombre]?.completedSets?.length >= (ex.series || 3) ? (
                          <div className="completed-badge" style={{ padding: '8px', color: '#10b981' }}>
                            <CheckCircle2 size={20} />
                          </div>
                        ) : (
                          <button className="secondary-btn" onClick={() => {
                            setAutoStartPlan({ ...todayRoutine, ejercicios: [ex] });
                            setActiveTab('rutina');
                          }}>
                            <Play size={16} fill="currentColor" /> Iniciar
                          </button>
                        )}
                      </div>
                    ))}
                    {!todayRoutine && !loading && (
                      <p className="text-secondary text-center py-24">No tienes rutina asignada para hoy.</p>
                    )}
                    {loading && (
                      <p className="text-secondary text-center py-24">Cargando tu rutina de hoy...</p>
                    )}
                  </div>

                  <div className="routine-actions">
                    <button className="primary-btn full-width" onClick={() => {
                      if (todayRoutine) {
                        setAutoStartPlan(todayRoutine);
                        setActiveTab('rutina');
                      }
                    }} style={isTodayCompleted(todayRoutine) ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' } : {}}>
                      {isTodayCompleted(todayRoutine) ? <CheckCircle2 size={18} /> : <Play size={18} fill="currentColor" />} {isTodayCompleted(todayRoutine) ? 'Repetir Rutina' : 'Comenzar Rutina'}
                    </button>
                    <button className="secondary-btn full-width" onClick={() => setActiveTab('rutina')}>
                      <BookOpen size={18} /> Ver Detalles
                    </button>
                  </div>
                </div>
              </section>

              <section className="sidebar-section">
                <div className="sidebar-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon-box"><Activity size={20} color="#ff6b35" /></div>
                    <div>
                      <h3>Actividad Semanal</h3>
                      <p>Últimos 7 días</p>
                    </div>
                    <button className="link-btn">Ver más <ChevronRight size={16} /></button>
                  </div>
                  <div className="activity-days">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => (
                      <div className={`day ${idx < 6 ? 'active' : ''}`} key={day}>
                        <span>{day}</span>
                        <div className="day-indicator">{idx < 6 ? '✓' : '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon-box"><Target size={20} color="#ff6b35" /></div>
                    <h3>Mis Objetivos</h3>
                  </div>
                  <div className="goal-list">
                    {hitos.length > 0 ? hitos.slice(0, 3).map((hito, idx) => (
                      <div className="goal-item" key={idx}>
                        <div className="goal-info">
                          <span>{hito.titulo}</span>
                          <span className="goal-value">{hito.progreso_porcentaje}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{
                              width: `${Math.min(100, hito.progreso_porcentaje)}%`,
                              background: hito.progreso_porcentaje >= 100
                                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                : 'linear-gradient(90deg, #ff6b35, #ff8c42)'
                            }}
                          ></div>
                        </div>
                      </div>
                    )) : (
                      <>
                        <div className="goal-item">
                          <div className="goal-info">
                            <span>Perder peso</span>
                            <span className="goal-value">{stats.progreso_peso}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress" style={{ width: `${stats.progreso_peso}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}></div></div>
                        </div>
                        <div className="goal-item">
                          <div className="goal-info">
                            <span>Aumentar fuerza</span>
                            <span className="goal-value">{stats.progreso_fuerza}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress" style={{ width: `${stats.progreso_fuerza}%`, background: 'linear-gradient(90deg, #ff6b35, #ff8c42)' }}></div></div>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="link-btn mt-1" onClick={() => setActiveTab('objetivos')}>
                    Ver todos los hitos <ChevronRight size={16} />
                  </button>
                </div>

                <div className="sidebar-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon-box"><BarChart3 size={20} color="#a855f7" /></div>
                    <div>
                      <h3>Métricas Corporales</h3>
                      <p>Actualizado hoy</p>
                    </div>
                  </div>
                  <div className="metrics-list">
                    <div className="metric-row">
                      <span>Peso actual</span>
                      <b>{clienteData.peso_kg ? `${clienteData.peso_kg} kg` : '0 kg'}</b>
                    </div>
                    <div className="metric-row">
                      <span>IMC</span>
                      <b>{clienteData.imc ? clienteData.imc : '0.0'}</b>
                    </div>
                    <div className="metric-row">
                      <span>Altura</span>
                      <b>{clienteData.altura_cm ? `${clienteData.altura_cm} cm` : '0 cm'}</b>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        );
      case 'rutina':
        return <RutinaTab
          autoStartPlan={autoStartPlan}
          setAutoStartPlan={setAutoStartPlan}
          rutinaActivaData={rutinaData}
          onLogrosUnlocked={handleLogrosUnlocked}
        />;
      case 'objetivos':
        return <ObjetivosTab onLogrosUnlocked={handleLogrosUnlocked} />;
      case 'alimentacion':
        return <AlimentacionTab />;
      case 'ejercicios':
        return <EjerciciosTab />;
      case 'perfil':
        return <PerfilTab onLogrosUnlocked={handleLogrosUnlocked} />;
      case 'logros':
        return <LogrosTab />;
      default:
        return (
          <div className="placeholder-container glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', marginTop: '40px', minHeight: '50vh' }}>
            <Construction size={40} color="#ff6b35" />
            <h2 className="glow-text">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} en Construcción</h2>
            <button className="secondary-btn" onClick={() => setActiveTab('inicio')}>Volver al Inicio</button>
          </div>
        );
    }
  };

  return (
    <div className="panel-cliente-wrapper">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setActiveTab('inicio')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-icon"><Activity color="#fff" size={24} /></div>
          <div className="brand-text">
            <h2>GYM TRACK</h2>
            <p>Entrena con datos, mejora con resultados</p>
          </div>
        </div>
        <div className="nav-links">
          {['inicio', 'rutina', 'objetivos', 'logros', 'alimentacion', 'ejercicios', 'perfil'].map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'inicio' && <Dumbbell size={18} />}
              {tab === 'rutina' && <Activity size={18} />}
              {tab === 'objetivos' && <Target size={18} />}
              {tab === 'logros' && <Award size={18} />}
              {tab === 'alimentacion' && <Apple size={18} />}
              {tab === 'ejercicios' && <Dumbbell size={18} />}
              {tab === 'perfil' && <CircleDot size={18} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{userFirstName}</span>
            <span className="user-level">Nivel {clienteData.nivel_actividad || 'Principiante'}</span>
          </div>
          <div className="user-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: userData?.foto_url && !navImgError ? 'transparent' : '#ff6b35', fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>
            {userData?.foto_url && !navImgError ? (
              <img
                src={userData.foto_url}
                alt=""
                onError={() => setNavImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              userInitials || <User color="#fff" size={20} />
            )}
          </div>
          <button className="secondary-btn" style={{ padding: '8px', marginLeft: '12px', color: '#ff6b35' }} onClick={onLogout} title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className="dashboard-main">{renderContent()}</main>
      <AchievementNotification
        achievements={newLogros}
        onClose={() => setNewLogros([])}
      />
    </div>
  );
};

export default PanelClienteGYMTRACK;
