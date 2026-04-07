import { useState } from 'react';
import {
  Play, Dumbbell, Activity, Target, Flame,
  BookOpen, ChevronRight, Award, Apple, BarChart3, CircleDot, User, Construction, LogOut
} from 'lucide-react';
import '../estilos/PanelClienteGYMTRACK.css';

// Import Tabs
import AlimentacionTab from './tabs/AlimentacionTab';
import ObjetivosTab from './tabs/ObjetivosTab';
import EjerciciosTab from './tabs/EjerciciosTab';
import PerfilEntrenadorTab from './tabs-entrenador/PerfilEntrenadorTab';
import RutinaTab from './tabs/RutinaTab';

const PanelClienteGYMTRACK = ({ setView }) => {
  const [activeTab, setActiveTab] = useState('inicio');

  const metricCards = [
    { title: '7', subtitle: 'Días consecutivos', icon: Flame, stat: '+2', trend: 'up' },
    { title: '24', subtitle: 'Entrenamientos este mes', icon: Activity, stat: '100%', trend: 'up' },
    { title: '-3.5', subtitle: 'kg perdidos en 30 días', icon: Target, stat: '-4.3%', trend: 'down' },
    { title: '5', subtitle: 'Logros desbloqueados', icon: Award, stat: 'Nuevo', trend: 'neutral' },
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
                <h1 className="glow-text">¡Hola, Juan Manuel!</h1>
                <p className="subtitle-text">Jueves, 5 de marzo de 2026</p>
              </div>
              <button className="primary-btn pulse-glow">
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
                      <span className="badge glass-badge">Hoy - Semana 4</span>
                      <span className="badge glass-badge">45-60 min</span>
                    </div>
                    <h2>Pecho & Tríceps</h2>
                    <p>6 ejercicios • Fuerza e hipertrofia</p>
                  </div>

                  <div className="exercise-list">
                    {exercises.map((ex) => (
                      <div className="exercise-item glass-panel" key={ex.id}>
                        <div className="exercise-number">{ex.id}</div>
                        <div className="exercise-info">
                          <h3>{ex.name}</h3>
                          <div className="exercise-details">
                            <span><Dumbbell size={14} /> {ex.sets}</span>
                            <span>•</span>
                            <span><Target size={14} /> {ex.weight}</span>
                            <span>•</span>
                            <span><Activity size={14} /> {ex.rest}</span>
                          </div>
                          <p className="exercise-note">{ex.note}</p>
                        </div>
                        <button className="secondary-btn">
                          <Play size={16} fill="currentColor" /> Iniciar
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="routine-actions">
                    <button className="primary-btn full-width">
                      <Play size={18} fill="currentColor" /> Comenzar Rutina
                    </button>
                    <button className="secondary-btn full-width">
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
                    <div className="goal-item">
                      <div className="goal-info">
                        <span>Perder peso</span>
                        <span className="goal-value">70%</span>
                      </div>
                      <div className="progress-bar"><div className="progress" style={{ width: '70%', background: 'linear-gradient(90deg, #ff6b35, #ff8c42)' }}></div></div>
                    </div>
                    <div className="goal-item">
                      <div className="goal-info">
                        <span>Aumentar fuerza</span>
                        <span className="goal-value">45%</span>
                      </div>
                      <div className="progress-bar"><div className="progress" style={{ width: '45%', background: 'linear-gradient(90deg, #ff6b35, #ff8c42)' }}></div></div>
                    </div>
                  </div>
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
                      <h4>1,450 <span>/ 2,100 kcal</span></h4>
                      <div className="progress-bar"><div className="progress" style={{ width: '69%', background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}></div></div>
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
                      <b>76.5 kg</b>
                    </div>
                    <div className="metric-row">
                      <span>IMC</span>
                      <b>24.1</b>
                    </div>
                    <div className="metric-row">
                      <span>Grasa corporal</span>
                      <b>18.2%</b>
                    </div>
                  </div>
                  <button className="secondary-btn full-width mt-1"><BarChart3 size={16} /> Historial Completo</button>
                </div>
              </section>
            </div>
          </>
        );
      case 'rutina':
        return <RutinaTab />;
      case 'objetivos':
        return <ObjetivosTab />;
      case 'alimentacion':
        return <AlimentacionTab />;
      case 'ejercicios':
        return <EjerciciosTab />;
      case 'perfil':
        return <PerfilEntrenadorTab />;
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
            <span className="user-name">Roberto Martín Gómez</span>
            <span className="user-level">Entrenador</span>
          </div>
          <div className="user-avatar">
            <User color="#fff" size={20} />
          </div>
          <button
            className="secondary-btn"
            style={{ padding: '8px', marginLeft: '12px', border: '1px solid rgba(255,107,53,0.3)', color: '#ff6b35', background: 'rgba(255,107,53,0.1)' }}
            title="Cerrar Sesión"
            onClick={() => setView('login')}
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
