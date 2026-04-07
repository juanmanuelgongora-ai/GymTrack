import React from 'react';
import { User, Activity, Edit3, Settings, Shield, ArrowRight } from 'lucide-react';
import '../../estilos/tabs.css';

export default function PerfilTab({ userData = {}, clienteData = {} }) {
  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      
      <div className="perfil-header p-24">
        <div className="perfil-avatar">{userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}</div>
        <div className="perfil-info">
          <h1>{userData.nombre || 'Usuario'} {userData.apellido || ''}</h1>
          <div className="perfil-info-tags">
            <span className="perfil-tag"><Activity size={14} className="mr-12" color="#ff6b35"/> Principiante</span>
            <span className="perfil-tag">📍 Gimnasio GYMTRACK</span>
          </div>
          <div className="perfil-stats">
            <div className="p-stat"><h3>0 <span className="text-secondary text-sm font-normal">días</span></h3><p>Miembro desde</p></div>
            <div className="p-stat"><h3>{clienteData.peso_kg || '0'} <span className="text-secondary text-sm font-normal">kg</span></h3><p>Peso Actual</p></div>
            <div className="p-stat"><h3>{clienteData.altura_cm || '0'} <span className="text-secondary text-sm font-normal">cm</span></h3><p>Altura</p></div>
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
          <div className="data-row"><span className="data-label">Nombre Completo</span><span className="data-value">{userData.nombre || ''} {userData.apellido || ''}</span></div>
          <div className="data-row"><span className="data-label">Email</span><span className="data-value">{userData.email || 'No registrado'}</span></div>
          <div className="data-row"><span className="data-label">Edad</span><span className="data-value">{clienteData.edad || 'No especificada'}</span></div>
          <div className="data-row"><span className="data-label">Género</span><span className="data-value">{clienteData.sexo === 'M' ? 'Masculino' : clienteData.sexo === 'F' ? 'Femenino' : 'No especificado'}</span></div>
        </div>

        <div className="glass-panel p-24">
          <h3 className="section-title mb-24 flex-align-center gap-12"><Activity size={20} color="#ff6b35"/> Datos Físicos y Objetivos</h3>
          <div className="data-row"><span className="data-label">Altura</span><span className="data-value">{clienteData.altura_cm ? `${clienteData.altura_cm} cm` : 'No especificada'}</span></div>
          <div className="data-row"><span className="data-label">Peso Actual</span><span className="data-value">{clienteData.peso_kg ? `${clienteData.peso_kg} kg` : 'No especificado'}</span></div>
          <div className="data-row"><span className="data-label">IMC</span><span className="data-value">{clienteData.imc || '0.0'} <span className="text-secondary text-xs">{(clienteData.imc && clienteData.imc < 18.5) ? '(Bajo Peso)' : (clienteData.imc && clienteData.imc < 25) ? '(Normal)' : (clienteData.imc && clienteData.imc < 30) ? '(Sobrepeso)' : '(Bajo progreso)'}</span></span></div>
          <div className="data-row"><span className="data-label">Nivel de Entrenamiento</span><span className="data-value">Principiante</span></div>
          <div className="data-row"><span className="data-label">Condición de Salud</span><span className="data-value">{clienteData.objetivo_principal || 'No especificada'}</span></div>
          <div className="data-row"><span className="data-label">Miembro Desde</span><span className="data-value">Hoy</span></div>
          
          <div className="flex-between text-xs text-secondary mt-24 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span>Última actualización: Hoy</span>
            <button className="link-btn" style={{ margin: 0 }}>Actualizar <ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
