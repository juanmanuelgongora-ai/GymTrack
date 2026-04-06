import React from 'react';
import { Search, Dumbbell, PlayCircle, Star, ChevronRight } from 'lucide-react';
import '../../estilos/tabs.css';

export default function EjerciciosTab() {
  const exList = [
    { title: 'Press de Banca', muscle: 'Pecho', d: 'Intermedio', eq: 'Barra', se: '4 series', rp: '8-12 reps' },
    { title: 'Sentadilla Libre', muscle: 'Piernas', d: 'Intermedio', eq: 'Barra', se: '4 series', rp: '8-10 reps' },
    { title: 'Peso Muerto', muscle: 'Espalda', d: 'Avanzado', eq: 'Barra', se: '3 series', rp: '6-8 reps' },
    { title: 'Press Militar', muscle: 'Hombros', d: 'Intermedio', eq: 'Barra', se: '3 series', rp: '8-12 reps' },
    { title: 'Dominadas', muscle: 'Espalda', d: 'Intermedio', eq: 'Corporal', se: '3 series', rp: 'Al fallo' },
    { title: 'Curl de Bíceps', muscle: 'Brazos', d: 'Principiante', eq: 'Mancuerna', se: '3 series', rp: '12-15 reps' }
  ];

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <div className="flex-between">
          <div>
            <h1 className="glow-text">Biblioteca de Ejercicios</h1>
            <p className="subtitle-text">Explora más de 120 ejercicios con instrucciones detalladas</p>
          </div>
          <button className="secondary-btn"><Star size={16}/> Favoritos</button>
        </div>
      </header>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={20} color="#a1a1aa"/>
          <input type="text" placeholder="Buscar ejercicios..." />
        </div>
      </div>

      <div className="filter-chips mb-16">
        <div className="chip active">Todas</div>
        <div className="chip">🔥 Pecho</div>
        <div className="chip">🛡 Espalda</div>
        <div className="chip">🦵 Piernas</div>
        <div className="chip">💪 Brazos</div>
        <div className="chip">🧍 Hombros</div>
      </div>
      <div className="filter-chips mb-24" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <div className="chip active">Cualquier Nivel</div>
        <div className="chip">Principiante</div>
        <div className="chip">Intermedio</div>
        <div className="chip">Avanzado</div>
      </div>

      <div className="ejercicios-grid">
        {exList.map((ex, i) => (
          <div className="ejercicio-card glass-panel p-16" key={i}>
            <div className="flex-between mb-12">
              <div className="ejercicio-tags">
                <span className="tag-sm tag-brand">{ex.muscle}</span>
                <span className="tag-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>{ex.d}</span>
              </div>
              <Star size={18} color="#a1a1aa" style={{ cursor: 'pointer' }}/>
            </div>
            
            <h3 className="mb-4 text-lg">{ex.title}</h3>
            <div className="text-secondary text-xs mb-16 flex-align-center gap-8">
              <span className="flex-align-center gap-4"><Dumbbell size={12}/> {ex.eq}</span>
              <span>•</span>
              <span className="flex-align-center gap-4"><PlayCircle size={12}/> Video 2m</span>
            </div>

            <div className="ejercicio-icon-area">
              <Dumbbell size={40} color="rgba(255,255,255,0.1)"/>
            </div>

            <div className="flex-between">
              <div className="text-sm">
                <b>{ex.se}</b> <span className="text-secondary text-xs">x {ex.rp}</span>
              </div>
              <button className="link-btn" style={{ padding: 0 }}>Ver detalles <ChevronRight size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
