import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../logica/UserContext';
import { User, Activity, Edit3, Save, BarChart3, MapPin, Building2, Calendar, Camera, Loader2, Plus, X, CreditCard, TrendingUp } from 'lucide-react';
import ForceProgressAnalytics from '../../componentes/ForceProgressAnalytics';
import '../../estilos/tabs.css';

const API_URL = '/api';

export default function PerfilTab({ onLogrosUnlocked, setView }) {
  const { token, userData, updateUser } = useUser();
  const clienteData = userData?.cliente || {};

  const [metricas, setMetricas] = useState([]);
  const [latestMetrica, setLatestMetrica] = useState(null);
  const [showMetricaForm, setShowMetricaForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fileInputRef = useRef(null);

  const [metricaFormData, setMetricaFormData] = useState({
    peso_kg: '', altura_cm: '', grasa_corporal: '', masa_muscular: '',
    pecho_cm: '', cintura_cm: '', cadera_cm: '', brazo_cm: '', muslo_cm: '', notas: ''
  });

  const [profileFormData, setProfileFormData] = useState({
    nombre: '',
    apellido: '',
    ubicacion: '',
    gimnasio_id: '',
    peso_kg: '',
    altura_cm: '',
    genero: '',
    fecha_nacimiento: ''
  });

  const [activeSection, setActiveSection] = useState('personal');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [perfilRes, metricasRes, latestRes] = await Promise.all([
        fetch(`${API_URL}/me/perfil`, { headers }),
        fetch(`${API_URL}/metricas`, { headers }),
        fetch(`${API_URL}/metricas/latest`, { headers })
      ]);

      if (perfilRes.ok) {
        const data = await perfilRes.json();
        updateUser(data.user);
        setProfileFormData({
          nombre: data.user?.nombre || '',
          apellido: data.user?.apellido || '',
          ubicacion: data.cliente?.ubicacion || '',
          gimnasio_id: data.cliente?.gimnasio_id || '',
          peso_kg: data.cliente?.peso_kg || '',
          altura_cm: data.cliente?.altura_cm || '',
          genero: data.cliente?.genero || '',
          fecha_nacimiento: data.cliente?.fecha_nacimiento || ''
        });
      }

      if (metricasRes.ok) setMetricas(await metricasRes.json());
      if (latestRes.ok) setLatestMetrica(await latestRes.json());
    } catch (err) {

      console.error('Error cargando datos:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditClick = () => {
    setProfileFormData({
      nombre: userData?.nombre || '',
      apellido: userData?.apellido || '',
      ubicacion: clienteData?.ubicacion || '',
      gimnasio_id: clienteData?.gimnasio_id || '',
      peso_kg: clienteData?.peso_kg || '',
      altura_cm: clienteData?.altura_cm || '',
      genero: clienteData?.genero || '',
      fecha_nacimiento: clienteData?.fecha_nacimiento || ''
    });
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/me/perfil`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileFormData)
      });

      if (res.ok) {
        const data = await res.json();
        setIsEditing(false);
        updateUser(data.user);
      } else {
        const err = await res.json();
        alert('Error al actualizar: ' + (err.message || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de conexión.');
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    setUploadingPhoto(true);
    try {
      const res = await fetch(`${API_URL}/me/perfil/foto`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ ...userData, foto_url: data.foto_url });
      } else {
        const err = await res.json();
        alert('Error al subir foto: ' + (err.message || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error al conectar con el servidor.');
    }
    setUploadingPhoto(false);
  };

  const handleSaveMetrica = async () => {
    setSaving(true);
    try {
      const body = {};
      Object.entries(metricaFormData).forEach(([k, v]) => { if (v !== '') body[k] = v; });
      const res = await fetch(`${API_URL}/metricas`, { method: 'POST', headers, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setMetricaFormData({
          peso_kg: '', altura_cm: '', grasa_corporal: '', masa_muscular: '',
          pecho_cm: '', cintura_cm: '', cadera_cm: '', brazo_cm: '', muslo_cm: '', notas: ''
        });
        setShowMetricaForm(false);
        fetchData();

        // Notificar logros si los hay
        if (data.logros_desbloqueados && data.logros_desbloqueados.length > 0) {
          if (onLogrosUnlocked) onLogrosUnlocked(data.logros_desbloqueados);
        } else {
          alert('Métrica guardada correctamente.');
        }
      } else {
        const err = await res.json();
        alert('Error al guardar: ' + (err.message || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de conexión.');
    }
    setSaving(false);
  };

  const userName = `${userData?.nombre || ''} ${userData?.apellido || ''}`.trim();
  const [imgError, setImgError] = useState(false);

  const initials = `${userData?.nombre?.charAt(0) || ''}${userData?.apellido?.charAt(0) || ''}`.toUpperCase();

  const calculateMembershipDays = (createdAt) => {
    if (!createdAt) return 0;
    const dateStr = createdAt.includes(' ') ? createdAt.replace(' ', 'T') : createdAt;
    const start = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
  };

  const diasMiembro = calculateMembershipDays(userData?.created_at);

  if (loading && !userData) {
    return (
      <div className="tab-container flex-center min-h-50">
        <Loader2 className="animate-spin" size={40} color="#ff6b35" />
      </div>
    );
  }

  const renderCondicionMedica = (condicion) => {
    if (!condicion) return <div className="data-row"><span className="data-label">Salud</span><span className="data-value">Sin reporte</span></div>;
    try {
      const parsed = typeof condicion === 'string' ? JSON.parse(condicion) : condicion;
      return (
        <>
          <div className="data-row"><span className="data-label">Estado de Salud</span><span className="data-value">{parsed.salud || 'N/A'}</span></div>
          <div className="data-row"><span className="data-label">Cirugías Previas</span><span className="data-value">{parsed.cirugia || 'N/A'}</span></div>
          <div className="data-row"><span className="data-label">Medicamentos</span><span className="data-value">{parsed.medicamentos || 'N/A'}</span></div>
          <div className="data-row"><span className="data-label">Condiciones</span><span className="data-value">{parsed.condiciones && parsed.condiciones.length > 0 ? parsed.condiciones.join(', ') : 'Ninguna'}</span></div>
          <div className="data-row"><span className="data-label">Lesiones</span><span className="data-value">{parsed.lesion || 'N/A'}</span></div>
          <div className="data-row"><span className="data-label">Horas de Sueño</span><span className="data-value">{parsed.sueno || 'N/A'} hrs</span></div>
        </>
      );
    } catch (e) {
      return <div className="data-row"><span className="data-label">Salud</span><span className="data-value">{condicion}</span></div>;
    }
  };

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="perfil-header p-24">
        <div className="perfil-avatar-container" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
          {userData?.foto_url && !imgError ? (
            <img
              src={userData.foto_url}
              alt=""
              onError={() => setImgError(true)}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b35' }}
            />
          ) : (
            <div className="perfil-avatar" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{initials || <User size={32} />}</div>
          )}
          <div className="avatar-edit-badge">
            {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} color="white" />}
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => { setImgError(false); handlePhotoUpload(e); }} style={{ display: 'none' }} accept="image/*" />
        </div>

        <div className="perfil-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="flex-align-center gap-12">
                {userName}
                {!isEditing && <button onClick={handleEditClick} className="icon-btn"><Edit3 size={18} /></button>}
              </h1>
              <div className="perfil-info-tags">
                <span className="perfil-tag"><Activity size={14} color="#ff6b35" /> {clienteData.nivel_actividad || 'Principiante'}</span>
                <span className="perfil-tag"><MapPin size={14} color="#ff6b35" /> {clienteData.ubicacion || 'Ubicación no definida'}</span>
                <span className="perfil-tag"><Building2 size={14} color="#ff6b35" /> {clienteData.gimnasio_id ? 'Gimnasio Asignado' : 'Sin Gimnasio'}</span>
                <span className="perfil-tag"><Calendar size={14} color="#4ade80" /> {diasMiembro} días como miembro</span>
              </div>
            </div>
            {setView && (
              <button
                className="secondary-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  borderColor: '#ff8c42', color: '#ff8c42'
                }}
                onClick={() => setView('shop')}
              >
                <CreditCard size={16} /> Gestionar Membresía
              </button>
            )}
          </div>

          <div className="perfil-stats">
            <div className="p-stat"><h3>{clienteData.peso_kg || latestMetrica?.peso_kg || '--'} <span className="text-secondary text-sm font-normal">kg</span></h3><p>Peso Actual</p></div>
            <div className="p-stat"><h3>{clienteData.altura_cm || '--'} <span className="text-secondary text-sm font-normal">cm</span></h3><p>Altura</p></div>
            <div className="p-stat"><h3>{clienteData.imc || latestMetrica?.imc || '--'}</h3><p>IMC</p></div>
          </div>
        </div>
      </div>

      <div className="filter-chips mb-24">
        <div className={`chip ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}><User size={14} /> Información Personal</div>
        <div className={`chip ${activeSection === 'estadisticas' ? 'active' : ''}`} onClick={() => setActiveSection('estadisticas')}><TrendingUp size={14} /> Estadísticas</div>
        <div className={`chip ${activeSection === 'metricas' ? 'active' : ''}`} onClick={() => setActiveSection('metricas')}><BarChart3 size={14} /> Historial Métrico</div>
      </div>

      {activeSection === 'personal' && (
        <div className="perfil-split">
          <div className="glass-panel p-24">
            <div className="flex-between mb-24">
              <h3 className="section-title flex-align-center gap-12"><User size={20} color="#ff6b35" /> {isEditing ? 'Editar Datos' : 'Datos Personales'}</h3>
              {isEditing && (
                <div className="flex gap-8">
                  <button className="secondary-btn btn-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
                  <button className="primary-btn btn-sm" onClick={handleUpdateProfile} disabled={saving}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="form-grid">
                <div className="grid-2">
                  <div className="form-group"><label>Nombre</label><input value={profileFormData.nombre} onChange={e => setProfileFormData({ ...profileFormData, nombre: e.target.value })} className="input-field" /></div>
                  <div className="form-group"><label>Apellido</label><input value={profileFormData.apellido} onChange={e => setProfileFormData({ ...profileFormData, apellido: e.target.value })} className="input-field" /></div>
                </div>
                <div className="form-group"><label>Ubicación</label><input value={profileFormData.ubicacion} onChange={e => setProfileFormData({ ...profileFormData, ubicacion: e.target.value })} className="input-field" /></div>
                <div className="grid-2">
                  <div className="form-group"><label>Género</label><select value={profileFormData.genero} onChange={e => setProfileFormData({ ...profileFormData, genero: e.target.value })} className="input-field"><option value="">Seleccionar...</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="Otro">Otro</option></select></div>
                  <div className="form-group"><label>F. Nacimiento</label><input type="date" value={profileFormData.fecha_nacimiento} onChange={e => setProfileFormData({ ...profileFormData, fecha_nacimiento: e.target.value })} className="input-field" /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label>Peso (kg)</label><input type="number" value={profileFormData.peso_kg} onChange={e => setProfileFormData({ ...profileFormData, peso_kg: e.target.value })} className="input-field" /></div>
                  <div className="form-group"><label>Altura (cm)</label><input type="number" value={profileFormData.altura_cm} onChange={e => setProfileFormData({ ...profileFormData, altura_cm: e.target.value })} className="input-field" /></div>
                </div>
              </div>
            ) : (
              <div className="data-list">
                <div className="data-row"><span className="data-label">Nombre Completo</span><span className="data-value">{userName}</span></div>
                <div className="data-row"><span className="data-label">Email</span><span className="data-value">{userData?.email}</span></div>
                <div className="data-row"><span className="data-label">Género</span><span className="data-value">{clienteData.genero === 'M' ? 'Masculino' : clienteData.genero === 'F' ? 'Femenino' : '--'}</span></div>
                <div className="data-row"><span className="data-label">F. Nacimiento</span><span className="data-value">{clienteData.fecha_nacimiento || '--'}</span></div>
                <div className="data-row"><span className="data-label">Edad</span><span className="data-value">{clienteData.edad ? `${clienteData.edad} años` : '--'}</span></div>
                <div className="data-row"><span className="data-label">Ubicación</span><span className="data-value">{clienteData.ubicacion || 'No definida'}</span></div>
              </div>
            )}
          </div>

          <div className="glass-panel p-24">
            <h3 className="section-title mb-24 flex-align-center gap-12"><Activity size={20} color="#ff6b35" /> Datos Físicos</h3>
            <div className="data-list">
              <div className="data-row"><span className="data-label">Altura</span><span className="data-value">{clienteData.altura_cm || '--'} cm</span></div>
              <div className="data-row"><span className="data-label">Peso Actual</span><span className="data-value">{clienteData.peso_kg || latestMetrica?.peso_kg || '--'} kg</span></div>
              <div className="data-row"><span className="data-label">IMC</span><span className="data-value">{clienteData.imc || latestMetrica?.imc || '--'}</span></div>
              <div className="data-row"><span className="data-label">Objetivo</span><span className="data-value">{clienteData.objetivo_principal || '--'}</span></div>
              {renderCondicionMedica(clienteData.condicion_medica)}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'metricas' && (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          <div className="flex-between mb-24">
            <h3 className="section-title flex-align-center gap-12"><BarChart3 size={20} color="#ff6b35" /> Historial de Métricas</h3>
            <button className="primary-btn btn-sm" onClick={() => setShowMetricaForm(!showMetricaForm)}>
              {showMetricaForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nueva Medición</>}
            </button>
          </div>

          {showMetricaForm && (
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
                      className="input-field"
                      placeholder={f.placeholder}
                      value={metricaFormData[f.name]}
                      onChange={e => setMetricaFormData(prev => ({ ...prev, [f.name]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Notas</label>
                <textarea
                  className="input-field"
                  placeholder="Observaciones adicionales..."
                  value={metricaFormData.notas}
                  onChange={e => setMetricaFormData(prev => ({ ...prev, notas: e.target.value }))}
                  style={{ minHeight: 60, resize: 'vertical' }}
                />
              </div>
              <button className="primary-btn" style={{ marginTop: 16, padding: '10px 24px' }} onClick={handleSaveMetrica} disabled={saving}>
                <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Medición'}
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            {metricas.length > 0 ? (
              metricas.map((m, idx) => (
                <div className="glass-panel p-24 flex-align-center gap-20" key={m.id || idx}>
                  <div style={{ background: 'rgba(255,107,53,0.1)', borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(m.fecha).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff6b35' }}>
                      {new Date(m.fecha).getDate()}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', flex: 1, textAlign: 'center' }}>
                    {m.peso_kg && <div><p className="text-secondary" style={{ fontSize: '0.7rem', marginBottom: 4 }}>Peso</p><p className="font-bold" style={{ fontSize: '1rem' }}>{m.peso_kg} kg</p></div>}
                    {m.imc && <div><p className="text-secondary" style={{ fontSize: '0.7rem', marginBottom: 4 }}>IMC</p><p className="font-bold" style={{ fontSize: '1rem' }}>{m.imc}</p></div>}
                    {m.grasa_corporal && <div><p className="text-secondary" style={{ fontSize: '0.7rem', marginBottom: 4 }}>Grasa</p><p className="font-bold" style={{ fontSize: '1rem' }}>{m.grasa_corporal}%</p></div>}
                    {m.masa_muscular && <div><p className="text-secondary" style={{ fontSize: '0.7rem', marginBottom: 4 }}>Músculo</p><p className="font-bold" style={{ fontSize: '1rem' }}>{m.masa_muscular} kg</p></div>}
                    {m.pecho_cm && <div><p className="text-secondary" style={{ fontSize: '0.7rem', marginBottom: 4 }}>Pecho</p><p className="font-bold" style={{ fontSize: '1rem' }}>{m.pecho_cm} cm</p></div>}
                  </div>
                  {m.notas && (
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', maxWidth: '150px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                      {m.notas}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-panel p-48 text-center">
                <BarChart3 size={48} color="rgba(255,107,53,0.3)" className="mb-16 mx-auto" />
                <h3>No hay mediciones registradas</h3>
                <p className="text-secondary">Tu historial de progreso aparecerá aquí conforme agregues nuevas mediciones.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'estadisticas' && (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          <ForceProgressAnalytics token={token} />
        </div>
      )}

      <style>{`
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .min-h-50 { min-height: 50vh; }
        .flex-align-center { display: flex; align-items: center; }
        .flex-between { display: flex; align-items: center; justify-content: space-between; }
        .gap-12 { gap: 12px; }
        .gap-8 { gap: 8px; }
        .mb-24 { margin-bottom: 24px; }
        .icon-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); padding: 4px; border-radius: 4px; }
        .icon-btn:hover { background: rgba(255,255,255,0.05); color: #ff6b35; }
        .btn-sm { padding: 6px 12px; font-size: 0.8rem; }
        .form-grid { display: grid; gap: 16px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group label { display: block; font-size: 0.78rem; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
        .input-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; color: #fff; width: 100%; font-size: 0.9rem; }
        .input-field:focus { border-color: #ff6b35; outline: none; }
        .data-list { display: grid; gap: 8px; }
        .avatar-edit-badge { position: absolute; bottom: 0; right: 0; background: #ff6b35; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid #1a1a1d; }
      `}</style>
    </div>
  );
}
