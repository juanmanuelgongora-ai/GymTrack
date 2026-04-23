import React, { useState, useEffect } from 'react';
import { User, Activity, Edit3, Settings, Shield, ArrowRight, Plus, X, Save, BarChart3 } from 'lucide-react';
import '../../estilos/tabs.css';

const API_URL = '/api';

export default function PerfilTab({ token, userData, clienteData: fallbackCliente }) {
  const [perfil, setPerfil] = useState(null);
  const [metricas, setMetricas] = useState([]);
  const [latestMetrica, setLatestMetrica] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    peso_kg: '', altura_cm: '', grasa_corporal: '', masa_muscular: '',
    pecho_cm: '', cintura_cm: '', cadera_cm: '', brazo_cm: '', muslo_cm: '', notas: ''
  });
  const [activeSection, setActiveSection] = useState('personal');

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [perfilRes, metricasRes, latestRes] = await Promise.all([
        fetch(`${API_URL}/me/perfil`, { headers }),
        fetch(`${API_URL}/metricas`, { headers }),
        fetch(`${API_URL}/metricas/latest`, { headers })
      ]);
      if (perfilRes.ok) setPerfil(await perfilRes.json());
      if (metricasRes.ok) setMetricas(await metricasRes.json());
      if (latestRes.ok) setLatestMetrica(await latestRes.json());
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
    setLoading(false);
  };

  const handleSaveMetrica = async () => {
    setSaving(true);
    try {
      const body = {};
      Object.entries(formData).forEach(([k, v]) => { if (v !== '') body[k] = v; });
      const res = await fetch(`${API_URL}/metricas`, { method: 'POST', headers, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        setFormData({ peso_kg: '', altura_cm: '', grasa_corporal: '', masa_muscular: '', pecho_cm: '', cintura_cm: '', cadera_cm: '', brazo_cm: '', muslo_cm: '', notas: '' });
        fetchData();
      } else {
        const err = await res.json();
        alert('Error: ' + (err.message || JSON.stringify(err.errors)));
      }
    } catch (e) {
      alert('Error de conexión al servidor.');
    }
    setSaving(false);
  };

  const userName = perfil ? `${perfil.user?.nombre || ''} ${perfil.user?.apellido || ''}`.trim() : (userData ? `${userData.nombre} ${userData.apellido || ''}`.trim() : 'Usuario');
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const cliente = perfil?.cliente;

  if (loading) {
    return (
      <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,107,53,0.3)', borderTop: '3px solid #ff6b35', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p className="text-secondary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="perfil-header p-24">
        <div className="perfil-avatar">{initials}</div>
        <div className="perfil-info">
          <h1>{userName}</h1>
          <div className="perfil-info-tags">
            <span className="perfil-tag"><Activity size={14} className="mr-12" color="#ff6b35" /> {cliente?.nivel_actividad || 'Principiante'}</span>
            <span className="perfil-tag">📍 {perfil?.user?.email || userData?.email || ''}</span>
            <span className="perfil-tag"><Shield size={14} className="mr-12" color="#4ade80" /> GymTrack</span>
          </div>
          <div className="perfil-stats">
            <div className="p-stat"><h3>{latestMetrica?.peso_kg || cliente?.peso_kg || fallbackCliente?.peso_kg || '--'} <span className="text-secondary text-sm font-normal">kg</span></h3><p>Peso Actual</p></div>
            <div className="p-stat"><h3>{cliente?.altura_cm || latestMetrica?.altura_cm || fallbackCliente?.altura_cm || '--'} <span className="text-secondary text-sm font-normal">cm</span></h3><p>Altura</p></div>
            <div className="p-stat"><h3>{latestMetrica?.imc || cliente?.imc || fallbackCliente?.imc || '--'}</h3><p>IMC</p></div>
          </div>
        </div>
      </div>

      <div className="filter-chips mb-24">
        <div className={`chip ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}><User size={14} className="mr-12" /> Información Personal</div>
        <div className={`chip ${activeSection === 'metricas' ? 'active' : ''}`} onClick={() => setActiveSection('metricas')}><BarChart3 size={14} className="mr-12" /> Métricas Corporales</div>
        <div className={`chip ${activeSection === 'estadisticas' ? 'active' : ''}`} onClick={() => setActiveSection('estadisticas')}><Activity size={14} className="mr-12" /> Estadísticas</div>
      </div>

      {activeSection === 'personal' && (
        <div className="perfil-split">
          <div className="glass-panel p-24">
            <h3 className="section-title mb-24 flex-align-center gap-12"><User size={20} color="#ff6b35" /> Datos Personales</h3>
            <div className="data-row"><span className="data-label">Nombre Completo</span><span className="data-value">{userName}</span></div>
            <div className="data-row"><span className="data-label">Email</span><span className="data-value">{perfil?.user?.email || userData?.email || '--'}</span></div>
            <div className="data-row"><span className="data-label">Género</span><span className="data-value">{cliente?.genero === 'M' || fallbackCliente?.sexo === 'M' ? 'Masculino' : cliente?.genero === 'F' || fallbackCliente?.sexo === 'F' ? 'Femenino' : '--'}</span></div>
            <div className="data-row"><span className="data-label">Fecha de Nacimiento</span><span className="data-value">{cliente?.fecha_nacimiento || '--'}</span></div>
            <div className="data-row"><span className="data-label">Rol</span><span className="data-value" style={{ textTransform: 'capitalize' }}>{perfil?.user?.rol || userData?.rol || 'Cliente'}</span></div>
          </div>
          <div className="glass-panel p-24">
            <h3 className="section-title mb-24 flex-align-center gap-12"><Activity size={20} color="#ff6b35" /> Datos Físicos y Objetivos</h3>
            <div className="data-row"><span className="data-label">Altura</span><span className="data-value">{cliente?.altura_cm || fallbackCliente?.altura_cm || '--'} cm</span></div>
            <div className="data-row"><span className="data-label">Peso Actual</span><span className="data-value">{latestMetrica?.peso_kg || cliente?.peso_kg || fallbackCliente?.peso_kg || '--'} kg</span></div>
            <div className="data-row"><span className="data-label">IMC</span><span className="data-value">{latestMetrica?.imc || cliente?.imc || fallbackCliente?.imc || '--'}</span></div>
            <div className="data-row"><span className="data-label">Objetivo Principal</span><span className="data-value">{cliente?.objetivo_principal || fallbackCliente?.objetivo_principal || '--'}</span></div>
            <div className="data-row"><span className="data-label">Condición Médica</span><span className="data-value">{cliente?.condicion_medica || 'Ninguna reportada'}</span></div>
          </div>
        </div>
      )}

      {activeSection === 'metricas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 className="section-title flex-align-center gap-12"><BarChart3 size={20} color="#ff6b35" /> Historial de Métricas</h3>
            <button className="primary-btn" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => setShowForm(!showForm)}>
              {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nueva Medición</>}
            </button>
          </div>

          {showForm && (
            <div className="glass-panel p-24" style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
              <h4 style={{ marginBottom: 16, color: '#ff6b35' }}>Registrar Nueva Medición</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Peso (kg)', name: 'peso_kg', placeholder: 'ej: 75' },
                  { label: 'Altura (cm)', name: 'altura_cm', placeholder: 'ej: 175' },
                  { label: 'Grasa Corporal (%)', name: 'grasa_corporal', placeholder: 'ej: 18' },
                  { label: 'Masa Muscular (kg)', name: 'masa_muscular', placeholder: 'ej: 35' },
                  { label: 'Pecho (cm)', name: 'pecho_cm', placeholder: 'ej: 100' },
                  { label: 'Cintura (cm)', name: 'cintura_cm', placeholder: 'ej: 80' },
                  { label: 'Cadera (cm)', name: 'cadera_cm', placeholder: 'ej: 95' },
                  { label: 'Brazo (cm)', name: 'brazo_cm', placeholder: 'ej: 35' },
                  { label: 'Muslo (cm)', name: 'muslo_cm', placeholder: 'ej: 55' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{f.label}</label>
                    <input
                      className="input-element no-icon"
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={e => setFormData(prev => ({ ...prev, [f.name]: e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Notas</label>
                <textarea
                  className="input-element no-icon"
                  placeholder="Observaciones adicionales..."
                  value={formData.notas}
                  onChange={e => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%', fontSize: '0.85rem', minHeight: 60, resize: 'vertical' }}
                />
              </div>
              <button className="primary-btn" style={{ marginTop: 16, padding: '10px 24px' }} onClick={handleSaveMetrica} disabled={saving}>
                <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Medición'}
              </button>
            </div>
          )}

          {metricas.length === 0 ? (
            <div className="glass-panel p-24" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <BarChart3 size={48} color="rgba(255,107,53,0.4)" style={{ marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Sin mediciones registradas</h3>
              <p className="text-secondary">Registra tu primera medición corporal para comenzar a trackear tu progreso.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {metricas.map((m, i) => (
                <div className="glass-panel p-24" key={m.id || i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255,107,53,0.1)', borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 70 }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{new Date(m.fecha).toLocaleDateString('es-ES', { month: 'short' })}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>{new Date(m.fecha).getDate()}</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                    {m.peso_kg && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Peso</span><div style={{ fontWeight: 600 }}>{m.peso_kg} kg</div></div>}
                    {m.imc && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>IMC</span><div style={{ fontWeight: 600 }}>{m.imc}</div></div>}
                    {m.grasa_corporal && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Grasa</span><div style={{ fontWeight: 600 }}>{m.grasa_corporal}%</div></div>}
                    {m.masa_muscular && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Músculo</span><div style={{ fontWeight: 600 }}>{m.masa_muscular} kg</div></div>}
                    {m.pecho_cm && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Pecho</span><div style={{ fontWeight: 600 }}>{m.pecho_cm} cm</div></div>}
                    {m.cintura_cm && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Cintura</span><div style={{ fontWeight: 600 }}>{m.cintura_cm} cm</div></div>}
                    {m.brazo_cm && <div><span className="text-secondary" style={{ fontSize: '0.75rem' }}>Brazo</span><div style={{ fontWeight: 600 }}>{m.brazo_cm} cm</div></div>}
                    {m.notas && <div style={{ width: '100%', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>📝 {m.notas}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'estadisticas' && (
        <div className="glass-panel p-24" style={{ textAlign: 'center', padding: '48px' }}>
          <Activity size={48} color="rgba(255,107,53,0.4)" style={{ marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>Estadísticas de Entrenamiento</h3>
          <p className="text-secondary">Las estadísticas se generarán automáticamente conforme registres tus entrenamientos y métricas.</p>
        </div>
      )}
    </div>
  );
}
