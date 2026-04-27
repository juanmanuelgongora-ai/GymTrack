import React, { useState } from 'react';
import { Apple, Flame, Droplet, Wheat, CheckCircle2, Circle, Clock } from 'lucide-react';
import '../../estilos/tabs.css';

export default function AlimentacionTab() {
  
  const [meals, setMeals] = useState([
    { id: 1, time: '07:00 AM', name: 'Desayuno', kcal: 620, p: 35, c: 65, g: 18, done: true, icon: Flame, iconColor: '#ff6b35' },
    { id: 2, time: '10:30 AM', name: 'Media Mañana', kcal: 280, p: 25, c: 30, g: 8, done: false, icon: Apple, iconColor: '#4ade80' },
    { id: 3, time: '01:00 PM', name: 'Almuerzo', kcal: 850, p: 55, c: 70, g: 18, done: false, icon: Droplet, iconColor: '#3b82f6' },
    { id: 4, time: '05:00 PM', name: 'Merienda Pre-Entreno', kcal: 320, p: 20, c: 45, g: 6, done: false, icon: Wheat, iconColor: '#eab308' },
    { id: 5, time: '08:30 PM', name: 'Cena', kcal: 530, p: 45, c: 40, g: 12, done: false, icon: Droplet, iconColor: '#a855f7' }
  ]);

  // Metas Diarias
  const metaKcal = 2600;
  const metaP = 180;
  const metaC = 250;
  const metaG = 80;

  // Calculo dinamico en base a las comidas marcadas como "done"
  const consumido = meals.filter(m => m.done).reduce((acc, current) => {
    return {
       kcal: acc.kcal + current.kcal,
       p: acc.p + current.p,
       c: acc.c + current.c,
       g: acc.g + current.g
    }
  }, { kcal: 0, p: 0, c: 0, g: 0 });

  const kcalPercent = Math.min(100, Math.round((consumido.kcal / metaKcal) * 100));
  const pPercent = Math.min(100, Math.round((consumido.p / metaP) * 100));
  const cPercent = Math.min(100, Math.round((consumido.c / metaC) * 100));
  const gPercent = Math.min(100, Math.round((consumido.g / metaG) * 100));

  const toggleMeal = (id) => {
    setMeals(meals.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Mi Alimentación</h1>
        <p className="subtitle-text">Plan nutricional personalizado para alcanzar tus objetivos</p>
      </header>

      <div className="alimentacion-grid">
        <div className="alimentacion-main">
          
          {/* Tarjeta de Resumen Dinamico */}
          <div className="glass-panel p-24 mb-24" style={{ transition: 'all 0.3s ease' }}>
            <div className="flex-between mb-24">
              <div>
                <h3 className="section-title">Resumen Diario</h3>
                <p className="text-secondary text-sm">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="icon-box"><Apple color="#ff6b35" /></div>
            </div>
            
            <div className="cals-progress-container mb-24">
              <div className="flex-between">
                <h2>{consumido.kcal} <span className="text-secondary text-lg">/ {metaKcal} kcal</span></h2>
                <h2 className="text-brand">{kcalPercent}%</h2>
              </div>
              <div className="progress-bar-lg mt-8">
                <div className="progress-fill" style={{ width: `${kcalPercent}%`, background: 'linear-gradient(90deg, #ff6b35, #ff8c42)' }}></div>
              </div>
              <p className="text-brand text-sm mt-4">
                {metaKcal - consumido.kcal > 0 
                  ? `${metaKcal - consumido.kcal} kcal restantes hoy`
                  : `¡Metas calóricas alcanzadas!`}
              </p>
            </div>
            
            {/* Macros Actualizados en Tiempo Real */}
            <div className="macros-grid">
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Proteínas</span> <span className="text-secondary">{consumido.p}g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">{metaP}g</b><span className="text-xs text-brand">{pPercent}% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-orange" style={{ width: `${pPercent}%` }}></div></div>
              </div>
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Carbohidratos</span> <span className="text-secondary">{consumido.c}g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">{metaC}g</b><span className="text-xs text-brand">{cPercent}% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-blue" style={{ width: `${cPercent}%` }}></div></div>
              </div>
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Grasas</span> <span className="text-secondary">{consumido.g}g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">{metaG}g</b><span className="text-xs text-brand">{gPercent}% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-yellow" style={{ width: `${gPercent}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-24">
            <h3 className="section-title mb-8">Plan de Comidas</h3>
            <p className="text-secondary text-sm mb-24">Marca las comidas que vayas consumiendo</p>
            
            <div className="meal-timeline">
              {meals.map((meal) => {
                const IconComponent = meal.icon;
                return (
                 <div className="meal-item" key={meal.id}>
                    <div className="meal-time">{meal.time}</div>
                    
                    <div 
                      className="meal-card glass-panel" 
                      onClick={() => toggleMeal(meal.id)}
                      style={{ 
                        cursor: 'pointer', 
                        border: meal.done ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: meal.done ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="meal-icon-box" style={{ background: meal.done ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)' }}>
                        <IconComponent size={20} color={meal.done ? '#4ade80' : meal.iconColor} />
                      </div>
                      <div className="meal-info" style={{ flex: 1 }}>
                        <div className="flex-between gap-12">
                          <h4 style={{ color: meal.done ? '#fff' : '#ccc' }}>{meal.name}</h4>
                          <button 
                            style={{ 
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              color: meal.done ? '#4ade80' : '#888'
                            }}
                          >
                            {meal.done ? <CheckCircle2 size={18}/> : <Circle size={18}/>}
                            <span style={{ fontSize: '12px' }}>{meal.done ? 'Completado' : 'Registrar'}</span>
                          </button>
                        </div>
                        <div className="meal-macros text-xs text-secondary mt-8" style={{ opacity: meal.done ? 0.7 : 1 }}>
                          <span className="text-brand mr-12" style={{ color: meal.done ? '#4ade80' : '#ff6b35' }}>
                            <Flame size={12}/> {meal.kcal} kcal
                          </span>
                          <span>P: {meal.p}g</span> • <span>C: {meal.c}g</span> • <span>G: {meal.g}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="alimentacion-side">
          <h3 className="section-title mb-16">Recetas Sugeridas</h3>
          {['Bowl de Quinoa y Salmón', 'Smoothie Proteico Verde', 'Wrap de Pollo y Vegetales'].map((receta, i) => (
            <div className="recipe-card glass-panel mb-16" style={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)'} }} key={i}>
              <div className="recipe-img placeholder-img" style={{ background: 'linear-gradient(45deg, #2a2a2a, #333)' }}></div>
              <div className="p-16">
                <span className="text-xs text-brand mb-4 d-block" style={{ color: '#ff6b35' }}>Almuerzo / Cena</span>
                <h4 className="mb-8">{receta}</h4>
                <div className="flex-between text-xs text-secondary">
                  <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Clock size={12}/> 25 min</span>
                  <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Flame size={12}/> 450 kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
