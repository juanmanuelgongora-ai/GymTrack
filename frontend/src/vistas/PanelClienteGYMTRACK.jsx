import { useState, useEffect } from 'react';
import {
  Play, Dumbbell, Activity, Target, Flame,
  BookOpen, ChevronRight, Award, Apple, BarChart3, CircleDot, User, Construction, LogOut
} from 'lucide-react';
import '../estilos/PanelClienteGYMTRACK.css';

// Import Tabs
import AlimentacionTab from './tabs/AlimentacionTab';
import ObjetivosTab from './tabs/ObjetivosTab';
import EjerciciosTab from './tabs/EjerciciosTab';
import PerfilTab from './tabs/PerfilTab';
import RutinaTab from './tabs/RutinaTab';

const PanelClienteGYMTRACK = ({ setView, token, userData: remoteUserData, userAuth, onLogout, activeTab, setActiveTab, autoStartPlan, setAutoStartPlan }) => {

  const userData = remoteUserData || userAuth?.user || {};
  const clienteData = userData.cliente || {};

  const userName = `${userData.nombre || 'Usuario'} ${userData.apellido || ''}`.trim();
  const userFirstName = userData.nombre || 'Usuario';
  const [stats, setStats] = useState({ entrenamientos_mes: 0, racha_dias: 0, progreso_fuerza: 0, progreso_peso: 0, variacion_peso: 0 });
  const [todayRoutine, setTodayRoutine] = useState(null);
  const [rutinaData, setRutinaData] = useState(null);
  const [hitos, setHitos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'inicio' && token) {
      const fetchData = async () => {
        try {
          const [routineRes, statsRes, hitosRes] = await Promise.all([
            fetch('/api/rutinas/latest', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
            fetch('/api/entrenamientos/stats', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
            fetch('/api/hitos', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } })
          ]);

          if (routineRes.ok) {
            const data = await routineRes.json();
            if (data.rutina?.plan_semanal?.dias) {
              setRutinaData(data.rutina);
              const dias = data.rutina.plan_semanal.dias;
              // Map current day of week to Día 1, Día 2, etc. (Simplification: Day index 0=Mon, 1=Tue...)
              let dayIndex = (new Date().getDay() + 6) % 7;
              if (dayIndex >= dias.length) {
                dayIndex = dias.length - 1; // Fallback to last day
              }
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
    { title: hitos.length.toString(), subtitle: 'Logros desbloqueados', icon: Award, stat: 'Nuevo', trend: 'neutral' },
  ];

  const exercises = [
    { id: 1, name: 'Press de Banca Plano', sets: '4 x 8-10', weight: '80 kg', rest: '90s', note: '1RM: 100kg' },
    { id: 2, name: 'Press Inclinado', sets: '3 x 10-12', weight: '32 kg', rest: '60s', note: '+5kg última vez' },
    { id: 3, name: 'Aperturas', sets: '3 x 12-15', weight: '18 kg', rest: '45s', note: 'Hipertrofia' },
    { id: 4, name: 'Fondos', sets: '3 x 10-12', weight: 'Peso', rest: '60s', note: 'Volumen' },
    { id: 5, name: 'Extensión Tríceps', sets: '3 x 12-15', weight: '35 kg', rest: '45s', note: 'Pump' },
    { id: 6, name: 'Press Francés', sets: '3 x 10-12', weight: '25 kg', rest: '45s', note: 'Aislamiento' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <>
            <header className="dashboard-header" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div>
                <h1 className="glow-text">¡Hola, {userFirstName}!</h1>
                <p className="subtitle-text">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button className="primary-btn pulse-glow" onClick={() => {
                if (todayRoutine) {
                  // eslint-disable-next-line react/prop-types
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
                <div className="routine-card">
                  <div className="routine-banner">
                    <div className="banner-details">
                      <span className="badge glass-badge">Hoy - {todayRoutine?.dia || 'Día 1'}</span>
                      <span className="badge glass-badge">{todayRoutine?.duracion_estimada || '45-60 min'}</span>
                    </div>
                    <h2>{todayRoutine?.grupo_muscular || 'Día de descanso'}</h2>
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
                        <button className="secondary-btn" onClick={() => {
                          setAutoStartPlan({ ...todayRoutine, ejercicios: [ex] });
                          setActiveTab('rutina');
                        }}>
                          <Play size={16} fill="currentColor" /> Iniciar
                        </button>
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
                    }}>
                      <Play size={18} fill="currentColor" /> Comenzar Rutina
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
                    <div className="header-icon-box"><Apple size={20} color="#42ff6e" /></div>
                    <div>
                      <h3>Nutrición Hoy</h3>
                      <p>Plan de volumen</p>
                    </div>
                  </div>
                  <div className="nutrition-info">
                    <div className="cals">
                      <h4>0 <span>/ 2,100 kcal</span></h4>
                      <div className="progress-bar"><div className="progress" style={{ width: '0%', background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}></div></div>
                    </div>
                    <div className="macros">
                      <div className="macro"><CircleDot size={12} color="#ff6b35" /> Proteínas <b>95g</b></div>
                      <div className="macro"><CircleDot size={12} color="#3b82f6" /> Carbos <b>180g</b></div>
                      <div className="macro"><CircleDot size={12} color="#eab308" /> Grasas <b>45g</b></div>
                    </div>
                  </div>
                  <button className="secondary-btn full-width mt-1"><Apple size={16} /> Ver Plan Completo</button>
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
                  <button className="secondary-btn full-width mt-1"><BarChart3 size={16} /> Historial Completo</button>
                </div>
              </section>
            </div>
          </>
        );
      case 'rutina':
        return <RutinaTab token={token} autoStartPlan={autoStartPlan} setAutoStartPlan={setAutoStartPlan} rutinaActivaData={rutinaData} />;
      case 'objetivos':
        return <ObjetivosTab token={token} />;
      case 'alimentacion':
        return <AlimentacionTab />;
      case 'ejercicios':
        return <EjerciciosTab token={token} userData={userData} />;
      case 'perfil':
        return <PerfilTab token={token} userData={userData} clienteData={clienteData} />;
      default:
        return (
          <div className="placeholder-container glass-panel" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', textAlign: 'center', marginTop: '40px', minHeight: '50vh', animation: 'fadeIn 0.4s ease'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 107, 53, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
              border: '1px solid rgba(255, 107, 53, 0.3)', boxShadow: '0 0 30px rgba(255, 107, 53, 0.2)'
            }}>
              <Construction size={40} color="#ff6b35" />
            </div>
            <h2 className="glow-text" style={{ fontSize: '32px', marginBottom: '16px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} en Construcción</h2>
            <p className="subtitle-text" style={{ maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
              Este módulo será diseñado e implementado próximamente siguiendo la paleta de colores y el estilo de la vista principal.
            </p>
            <button className="secondary-btn" onClick={() => setActiveTab('inicio')}>
              <Dumbbell size={18} /> Volver al Inicio
            </button>
          </div>
        );
    }
  };

  return (
    <div className="panel-cliente-wrapper">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setActiveTab('inicio')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-icon">
            <Activity color="#fff" size={24} />
          </div>
          <div className="brand-text">
            <h2>GYM TRACK</h2>
            <p>Entrena con datos, mejora con resultados</p>
          </div>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
            <Dumbbell size={18} /> Inicio
          </button>
          <button className={`nav-btn ${activeTab === 'rutina' ? 'active' : ''}`} onClick={() => setActiveTab('rutina')}>
            <Activity size={18} /> Mi Rutina
          </button>
          <button className={`nav-btn ${activeTab === 'objetivos' ? 'active' : ''}`} onClick={() => setActiveTab('objetivos')}>
            <Target size={18} /> Objetivos
          </button>
          <button className={`nav-btn ${activeTab === 'alimentacion' ? 'active' : ''}`} onClick={() => setActiveTab('alimentacion')}>
            <Apple size={18} /> Alimentación
          </button>
          <button className={`nav-btn ${activeTab === 'ejercicios' ? 'active' : ''}`} onClick={() => setActiveTab('ejercicios')}>
            <Dumbbell size={18} /> Ejercicios
          </button>
          <button className={`nav-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
            <CircleDot size={18} /> Perfil
          </button>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{userFirstName}</span>
            <span className="user-level">Nivel {clienteData.nivel_actividad || 'Principiante'}</span>
          </div>
          <div className="user-avatar">
            <User color="#fff" size={20} />
          </div>
          <button
            className="secondary-btn"
            style={{ padding: '8px', marginLeft: '12px', border: '1px solid rgba(255,107,53,0.3)', color: '#ff6b35', background: 'rgba(255,107,53,0.1)' }}
            title="Cerrar Sesión"
            onClick={onLogout || (() => setView('login'))}
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default PanelClienteGYMTRACK;
