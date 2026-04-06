import React from 'react';
import { User, Activity, Edit3, Settings, Shield, ArrowRight } from 'lucide-react';
import '../../estilos/tabs.css';

export default function PerfilTab() {
  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      
      <div className="perfil-header p-24">
        <div className="perfil-avatar">JM</div>
        <div className="perfil-info">
          <h1>Juan Manuel García López</h1>
          <div className="perfil-info-tags">
            <span className="perfil-tag"><Activity size={14} className="mr-12" color="#ff6b35"/> Intermedio</span>
            <span className="perfil-tag">📍 Madrid, España</span>
            <span className="perfil-tag"><Shield size={14} className="mr-12" color="#4ade80"/> FitZone Center</span>
          </div>
          <div className="perfil-stats">
            <div className="p-stat"><h3>429 <span className="text-secondary text-sm font-normal">días</span></h3><p>Miembro desde</p></div>
            <div className="p-stat"><h3>82.5 <span className="text-secondary text-sm font-normal">kg</span></h3><p>Peso Actual</p></div>
            <div className="p-stat"><h3>178 <span className="text-secondary text-sm font-normal">cm</span></h3><p>Altura</p></div>
          </div>
        </div>
        <button className="secondary-btn" style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
          <Edit3 size={16}/> Editar Perfil
        </button>
      </div>

      <div className="filter-chips mb-24">
        <div className="chip active"><User size={14} className="mr-12"/> Información Personal</div>
        <div className="chip"><Activity size={14} className="mr-12"/> Estadísticas</div>
        <div className="chip"><Settings size={14} className="mr-12"/> Fit Bot</div>
      </div>

      <div className="perfil-split">
        <div className="glass-panel p-24">
          <h3 className="section-title mb-24 flex-align-center gap-12"><User size={20} color="#ff6b35"/> Datos Personales</h3>
          <div className="data-row"><span className="data-label">Nombre Completo</span><span className="data-value">Juan Manuel García López</span></div>
          <div className="data-row"><span className="data-label">Email</span><span className="data-value">juanmanuel@gymtrack.com</span></div>
          <div className="data-row"><span className="data-label">Teléfono</span><span className="data-value">+34 612 345 678</span></div>
          <div className="data-row"><span className="data-label">Fecha de Nacimiento</span><span className="data-value">15 de Marzo, 1995</span></div>
          <div className="data-row"><span className="data-label">Edad</span><span className="data-value">31 años</span></div>
          <div className="data-row"><span className="data-label">Género</span><span className="data-value">Masculino</span></div>
          <div className="data-row"><span className="data-label">Dirección</span><span className="data-value">Calle 30, #12 - 56</span></div>
          <div className="data-row"><span className="data-label">Número de Etretat</span><span className="data-value">+34 612 345 678</span></div>
        </div>

        <div className="glass-panel p-24">
          <h3 className="section-title mb-24 flex-align-center gap-12"><Activity size={20} color="#ff6b35"/> Datos Físicos y Objetivos</h3>
          <div className="data-row"><span className="data-label">Altura</span><span className="data-value">178 cm</span></div>
          <div className="data-row"><span className="data-label">Peso Actual</span><span className="data-value">82.5 kg</span></div>
          <div className="data-row"><span className="data-label">IMC</span><span className="data-value">26.1 <span className="text-secondary text-xs">(Normal)</span></span></div>
          <div className="data-row"><span className="data-label">Nivel de Entrenamiento</span><span className="data-value">Intermedio</span></div>
          <div className="data-row"><span className="data-label">Objetivo Principal</span><span className="data-value">Mejora de condición física</span></div>
          <div className="data-row"><span className="data-label">Membresía Válida</span><span className="data-value">1 de Enero, 2024</span></div>
          
          <div className="flex-between text-xs text-secondary mt-24 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span>Última actualización: Ayer</span>
            <button className="link-btn" style={{ margin: 0 }}>Actualizar <ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
