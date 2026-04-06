import React from 'react';
import { Target, Flag, Zap, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import '../../estilos/tabs.css';

export default function ObjetivosTab() {
  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Mis Objetivos</h1>
        <p className="subtitle-text">Define y alcanza tus metas fitness</p>
      </header>

      <div className="filter-chips mb-8">
        <div className="chip active">Todos</div>
        <div className="chip">Peso</div>
        <div className="chip">Fuerza</div>
        <div className="chip">Hipertrofia</div>
        <div className="chip">Constancia</div>
      </div>

      <div className="objetivos-stats">
        <div className="stat-box">
          <div className="icon-box"><Target color="#ff6b35"/></div>
          <div><h2>6</h2><p>Total Objetivos</p></div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><Zap color="#ff6b35"/></div>
          <div><h2>5</h2><p>En Progreso</p></div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><Flag color="#4ade80"/></div>
          <div><h2>1</h2><p>Casi Completados</p></div>
        </div>
      </div>

      <div className="objetivos-grid">
        {[
          { icon: <Target/>, title: 'Perder Peso', desc: 'Alcanzar 75 kg de peso corporal', type: 'Composición', prog: 68, val: '72.6 / 75 kg', st: 'En Progreso', end: '30 May 2026' },
          { icon: <TrendingUp/>, title: 'Press de Banca 120kg', desc: 'Aumentar 1RM en press de banca', type: 'Fuerza', prog: 82, val: '100 / 120 kg', st: 'En Progreso', end: '15 Jul 2026' },
          { icon: <Zap/>, title: 'Ganar Masa Muscular', desc: 'Aumentar 2kg de masa magra', type: 'Hipertrofia', prog: 33, val: '1 / 3 kg', st: 'En Progreso', end: '10 Ago 2026' },
          { icon: <Calendar/>, title: 'Constancia Mensual', desc: 'Entrenar 18 sesiones al mes', type: 'Hábito', prog: 94, val: '17 / 18 sesiones', st: 'Casi Completado', end: '31 Mar 2026', done: true }
        ].map((ob, i) => (
          <div className="objetivo-card glass-panel p-24" key={i}>
            <div className="flex-between mb-16">
              <div className="flex-align-center gap-12">
                <div className="icon-box" style={{ width: 40, height: 40 }}>{ob.icon}</div>
                <div>
                  <h3>{ob.title}</h3>
                  <span className="text-secondary text-xs">{ob.type}</span>
                </div>
              </div>
              <div className={`status-badge ${ob.done ? 'status-done' : 'status-progress'}`}>{ob.st}</div>
            </div>
            <p className="text-sm text-secondary mb-16">{ob.desc}</p>
            
            <div className="mb-16">
              <div className="flex-between text-sm mb-8">
                <span>Progreso: <b>{ob.prog}%</b></span>
                <span className="text-brand">{ob.val}</span>
              </div>
              <div className="progress-bar-lg">
                <div className={`progress-fill ${ob.done ? 'bg-green' : 'bg-orange'}`} style={{ width: `${ob.prog}%` }}></div>
              </div>
            </div>

            <div className="flex-between text-xs text-secondary mt-16 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="flex-align-center gap-4"><Calendar size={12}/> Meta: {ob.end}</span>
              <button className="link-btn" style={{ margin: 0 }}>Actualizar <ArrowRight size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
