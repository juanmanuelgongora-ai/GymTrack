import React from 'react';
import { Apple, Flame, Droplet, Wheat, CheckCircle2 } from 'lucide-react';
import '../../estilos/tabs.css';

export default function AlimentacionTab() {
  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Mi Alimentación</h1>
        <p className="subtitle-text">Plan nutricional personalizado para alcanzar tus objetivos</p>
      </header>

      <div className="alimentacion-grid">
        <div className="alimentacion-main">
          <div className="glass-panel p-24 mb-24">
            <div className="flex-between mb-24">
              <div>
                <h3 className="section-title">Resumen Diario</h3>
                <p className="text-secondary text-sm">Miércoles, 5 de Marzo 2026</p>
              </div>
              <div className="icon-box"><Apple color="#ff6b35" /></div>
            </div>
            <div className="cals-progress-container mb-24">
              <div className="flex-between">
                <h2>800 <span className="text-secondary text-lg">/ 2320 kcal</span></h2>
                <h2 className="text-brand">34%</h2>
              </div>
              <div className="progress-bar-lg mt-8">
                <div className="progress-fill" style={{ width: '34%', background: 'linear-gradient(90deg, #ff6b35, #ff8c42)' }}></div>
              </div>
              <p className="text-brand text-sm mt-4">1520 kcal restantes hoy</p>
            </div>
            
            <div className="macros-grid">
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Proteínas</span> <span className="text-secondary">75g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">180g</b><span className="text-xs text-brand">41% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-orange" style={{ width: '41%' }}></div></div>
              </div>
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Carbohidratos</span> <span className="text-secondary">110g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">240g</b><span className="text-xs text-brand">45% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-blue" style={{ width: '45%' }}></div></div>
              </div>
              <div className="macro-card">
                <div className="flex-between text-sm mb-8"><span className="text-secondary">Grasas</span> <span className="text-secondary">20g</span></div>
                <div className="flex-between mb-8"><b className="text-lg">60g</b><span className="text-xs text-brand">33% del total</span></div>
                <div className="progress-bar"><div className="progress-fill bg-yellow" style={{ width: '33%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-24">
            <h3 className="section-title mb-8">Plan de Comidas</h3>
            <p className="text-secondary text-sm mb-24">5 comidas distribuidas durante el día</p>
            
            <div className="meal-timeline">
              {[
                { time: '07:00 AM', name: 'Desayuno', kcal: 620, p: 35, c: 65, g: 18, done: true, icon: <Flame size={20} color="#ff6b35"/> },
                { time: '10:30 AM', name: 'Media Mañana', kcal: 280, p: 25, c: 30, g: 8, done: true, icon: <Apple size={20} color="#4ade80"/> },
                { time: '01:00 PM', name: 'Almuerzo', kcal: 850, p: 55, c: 70, g: 18, done: false, icon: <Droplet size={20} color="#3b82f6"/> },
                { time: '05:00 PM', name: 'Merienda Pre-Entreno', kcal: 320, p: 20, c: 45, g: 6, done: false, icon: <Wheat size={20} color="#eab308"/> },
                { time: '08:30 PM', name: 'Cena', kcal: 530, p: 45, c: 40, g: 12, done: false, icon: <Droplet size={20} color="#a855f7"/> }
              ].map((meal, i) => (
                <div className="meal-item" key={i}>
                  <div className="meal-time">{meal.time}</div>
                  <div className="meal-card glass-panel">
                    <div className="meal-icon-box">{meal.icon}</div>
                    <div className="meal-info">
                      <div className="flex-align-center gap-12">
                        <h4>{meal.name}</h4>
                        {meal.done && <span className="badge-done"><CheckCircle2 size={12}/> Completado</span>}
                      </div>
                      <div className="meal-macros text-xs text-secondary mt-8">
                        <span className="text-brand mr-12"><Flame size={12}/> {meal.kcal} kcal</span>
                        <span>P: {meal.p}g</span> • <span>C: {meal.c}g</span> • <span>G: {meal.g}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="alimentacion-side">
          <h3 className="section-title mb-16">Recetas Sugeridas</h3>
          {['Bowl de Quinoa y Pollo', 'Smoothie Proteico Verde', 'Salmón con Verduras'].map((receta, i) => (
            <div className="recipe-card glass-panel mb-16" key={i}>
              <div className="recipe-img placeholder-img"></div>
              <div className="p-16">
                <span className="text-xs text-brand mb-4 d-block">Almuerzo / Cena</span>
                <h4 className="mb-8">{receta}</h4>
                <div className="flex-between text-xs text-secondary">
                  <span><Flame size={12}/> 25 min</span>
                  <span>450 kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
