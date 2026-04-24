import { useState } from 'react';
import {
  LayoutDashboard, Users, Activity, Calendar, MonitorPlay, LineChart, User,
  HelpCircle, Settings, Play, ChevronRight, CircleDollarSign, BarChart3, Clock,
  LogOut, TrendingUp, Construction, Dumbbell
} from 'lucide-react';
import '../estilos/PanelClienteGYMTRACK.css';

// Import Tabs
import PerfilEntrenadorTab from './tabs-entrenador/PerfilEntrenadorTab';

const PanelEntrenadorGYMTRACK = ({ setView, userData, userAuth, onLogout }) => {
  const [activeTab, setActiveTab] = useState('inicio');

  const data = userData || userAuth?.user || {};
  const userName = `${data.nombre || 'Entrenador'} ${data.apellido || ''}`.trim();
  const firstName = data.nombre || 'Entrenador';
  const especialidad = data.entrenador?.especialidad || 'Entrenador';

  // Datos simulados para el Dashboard del Entrenador
  const metricas = [
    { title: '$4,250', subtitle: 'Ingresos del mes', icon: CircleDollarSign, stat: '+12%', trend: 'up' },
    { title: '42', subtitle: 'Clientes activos', icon: Users, stat: '+3', trend: 'up' },
    { title: '8', subtitle: 'Clases pendientes', icon: Calendar, stat: 'Hoy', trend: 'neutral' },
    { title: '95%', subtitle: 'Retención', icon: TrendingUp, stat: 'Top', trend: 'up' },
  ];

  const proximasClases = [
    { id: 1, name: 'Clase de HIIT', time: '10:00 AM', clients: 12, status: 'Próxima' },
    { id: 2, name: 'Entrenamiento Funcional', time: '02:00 PM', clients: 8, status: 'Hoy' },
    { id: 3, name: 'Yoga y Estiramiento', time: '05:30 PM', clients: 15, status: 'Hoy' },
  ];

  const nuevosClientes = [
    { id: 1, name: 'Carlos Mendoza', goal: 'Pérdida de peso', joined: 'Ayer' },
    { id: 2, name: 'Laura Gómez', goal: 'Hipertrofia', joined: 'Hace 2 días' },
    { id: 3, name: 'Andrés Felipe', goal: 'Acondicionamiento', joined: 'Hace 3 días' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <>
            <header className="dashboard-header" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div>
                <h1 className="glow-text">¡Bienvenido de nuevo, {firstName}!</h1>
                <p className="subtitle-text">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button className="primary-btn pulse-glow">
                <Play size={20} fill="currentColor" />
                Iniciar Sesión en Vivo
              </button>
            </header>

            <section className="metrics-grid" style={{ animation: 'fadeIn 0.6s ease' }}>
              {metricas.map((card, idx) => {
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

                {/* Resumen Semanal Chart Widget mockup */}
                <div className="sidebar-card glass-panel" style={{ marginBottom: '20px' }}>
                  <div className="card-header">
                    <div className="header-icon-box"><BarChart3 size={20} color="#ff6b35" /></div>
                    <div>
                      <h3>Resumen Semanal</h3>
                      <p>Rendimiento e ingresos</p>
                    </div>
                  </div>
                  <div className="activity-days" style={{ height: '150px', alignItems: 'flex-end', paddingTop: '20px' }}>
                    {/* Simulated Bars */}
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div className="day active" key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: `${height}px`, background: 'linear-gradient(to top, #ff6b35, #ff8c42)', borderRadius: '4px' }}></div>
                          <span>{day}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Próximas Clases List */}
                <div className="routine-card p-4">
                  <div className="card-header" style={{ marginBottom: '15px' }}>
                    <div className="header-icon-box"><Calendar size={20} color="#ff6b35" /></div>
                    <h3 style={{ color: 'white', fontWeight: 'bold' }}>Próximas Clases</h3>
                  </div>
                  <div className="exercise-list">
                    {proximasClases.map((clase) => (
                      <div className="exercise-item glass-panel" key={clase.id}>
                        <div className="exercise-icon" style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <Clock size={24} color="#ff6b35" />
                        </div>
                        <div className="exercise-info" style={{ marginLeft: '15px', flex: 1 }}>
                          <h3>{clase.name}</h3>
                          <div className="exercise-details">
                            <span><Users size={14} /> {clase.clients} inscritos</span>
                            <span>•</span>
                            <span style={{ color: '#ff6b35' }}>{clase.time}</span>
                          </div>
                        </div>
                        <button className="secondary-btn">
                          Ver Detalles
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="sidebar-section">

                {/* Nuevos Clientes Widget */}
                <div className="sidebar-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon-box"><Users size={20} color="#3b82f6" /></div>
                    <div>
                      <h3>Nuevos Clientes</h3>
                      <p>Últimos 7 días</p>
                    </div>
                    <button className="link-btn">Todos <ChevronRight size={16} /></button>
                  </div>
                  <div className="metrics-list">
                    {nuevosClientes.map(cliente => (
                      <div className="metric-row" key={cliente.id} style={{ alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} color="#3b82f6" />
                          </div>
                          <div>
                            <b style={{ display: 'block', fontSize: '14px' }}>{cliente.name}</b>
                            <span style={{ fontSize: '12px', opacity: 0.7 }}>{cliente.goal}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{cliente.joined}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingresos del Mes */}
                <div className="sidebar-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon-box"><CircleDollarSign size={20} color="#42ff6e" /></div>
                    <div>
                      <h3>Ingresos del Mes</h3>
                      <p>Progreso hacia la meta</p>
                    </div>
                  </div>
                  <div className="nutrition-info">
                    <div className="cals">
                      <h4>$4,250 <span>/ $5,000</span></h4>
                      <div className="progress-bar"><div className="progress" style={{ width: '85%', background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}></div></div>
                    </div>
                    <div className="macros" style={{ marginTop: '15px' }}>
                      <div className="macro"><CircleDollarSign size={12} color="#ff6b35" /> Planes Básicos <b>$1,200</b></div>
                      <div className="macro"><CircleDollarSign size={12} color="#a855f7" /> Planes Premium <b>$3,050</b></div>
                    </div>
                  </div>
                  <button className="secondary-btn full-width mt-1"><LineChart size={16} /> Ver Reporte Financiero</button>
                </div>

              </section>
            </div>
          </>
        );

      // Placeholder para el resto de pestañas requeridas
      case 'clientes':
      case 'rutinas':
      case 'calendario':
      case 'clases':
      case 'finanzas':
      case 'ayuda':
      case 'configuracion':
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
              <LayoutDashboard size={18} /> Volver al Resumen
            </button>
          </div>
        );

      case 'perfil':
        return <PerfilEntrenadorTab />;

      default:
        return null;
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
            <p>Portal para Entrenadores</p>
          </div>
        </div>
        <div className="nav-links" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          <button className={`nav-btn ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
            <LayoutDashboard size={18} /> Panel
          </button>
          <button className={`nav-btn ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>
            <Users size={18} /> Clientes
          </button>
          <button className={`nav-btn ${activeTab === 'rutinas' ? 'active' : ''}`} onClick={() => setActiveTab('rutinas')}>
            <Dumbbell size={18} /> Rutinas
          </button>
          <button className={`nav-btn ${activeTab === 'calendario' ? 'active' : ''}`} onClick={() => setActiveTab('calendario')}>
            <Calendar size={18} /> Calendario
          </button>
          <button className={`nav-btn ${activeTab === 'clases' ? 'active' : ''}`} onClick={() => setActiveTab('clases')}>
            <MonitorPlay size={18} /> Clases
          </button>
          <button className={`nav-btn ${activeTab === 'finanzas' ? 'active' : ''}`} onClick={() => setActiveTab('finanzas')}>
            <LineChart size={18} /> Finanzas
          </button>
          <button className={`nav-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
            <User size={18} /> Perfil
          </button>
          <button className={`nav-btn ${activeTab === 'ayuda' ? 'active' : ''}`} onClick={() => setActiveTab('ayuda')}>
            <HelpCircle size={18} /> Ayuda
          </button>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-level">{especialidad}</span>
          </div>
          <div className="user-avatar">
            <User color="#fff" size={20} />
          </div>
          <button className={`nav-btn ${activeTab === 'configuracion' ? 'active' : ''}`} style={{ padding: '8px', marginLeft: '12px' }} title="Configuración" onClick={() => setActiveTab('configuracion')}>
            <Settings size={18} />
          </button>
          <button
            className="secondary-btn"
            style={{ padding: '8px', marginLeft: '8px', border: '1px solid rgba(255,107,53,0.3)', color: '#ff6b35', background: 'rgba(255,107,53,0.1)' }}
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

export default PanelEntrenadorGYMTRACK;

