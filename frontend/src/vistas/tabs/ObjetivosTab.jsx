import React, { useState, useEffect } from 'react';
import { Target, Flag, Zap, TrendingUp, Calendar, ArrowRight, Plus, X, Save, Trash2, Edit3 } from 'lucide-react';
import '../../estilos/tabs.css';

const API_URL = '/api';

const TIPO_CONFIG = {
  peso: { icon: <Target size={20} />, color: '#ff6b35', label: 'Peso' },
  fuerza: { icon: <TrendingUp size={20} />, color: '#3b82f6', label: 'Fuerza' },
  hipertrofia: { icon: <Zap size={20} />, color: '#a855f7', label: 'Hipertrofia' },
  habito: { icon: <Calendar size={20} />, color: '#22c55e', label: 'Hábito' },
  resistencia: { icon: <Flag size={20} />, color: '#eab308', label: 'Resistencia' },
};

const ESTADO_LABELS = { en_progreso: 'En Progreso', completado: 'Completado', abandonado: 'Abandonado' };

export default function ObjetivosTab({ token }) {
  const [hitos, setHitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', tipo: 'peso', meta_valor: '', valor_actual: '', unidad: 'kg', fecha_limite: ''
  });

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' };

  useEffect(() => { fetchHitos(); }, []);

  const fetchHitos = async () => {
    setLoading(true);
    try {
      const url = filtroTipo ? `${API_URL}/hitos?tipo=${filtroTipo}` : `${API_URL}/hitos`;
      const res = await fetch(url, { headers });
      if (res.ok) setHitos(await res.json());
    } catch (err) { console.error('Error cargando hitos:', err); }
    setLoading(false);
  };

  useEffect(() => { fetchHitos(); }, [filtroTipo]);

  const handleCreate = async () => {
    if (!formData.titulo || !formData.meta_valor) return alert('Título y meta son obligatorios.');
    setSaving(true);
    try {
      const body = { ...formData };
      if (!body.fecha_limite) delete body.fecha_limite;
      if (!body.valor_actual) body.valor_actual = 0;
      const res = await fetch(`${API_URL}/hitos`, { method: 'POST', headers, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        setFormData({ titulo: '', descripcion: '', tipo: 'peso', meta_valor: '', valor_actual: '', unidad: 'kg', fecha_limite: '' });
        fetchHitos();
      } else { const e = await res.json(); alert('Error: ' + (e.message || JSON.stringify(e.errors))); }
    } catch (e) { alert('Error de conexión.'); }
    setSaving(false);
  };

  const handleUpdateProgress = async (id) => {
    if (!editValue || isNaN(editValue)) return;
    try {
      const res = await fetch(`${API_URL}/hitos/${id}`, { method: 'PUT', headers, body: JSON.stringify({ valor_actual: parseFloat(editValue) }) });
      if (res.ok) { setEditingId(null); setEditValue(''); fetchHitos(); }
    } catch (e) { alert('Error al actualizar.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este hito?')) return;
    try {
      const res = await fetch(`${API_URL}/hitos/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchHitos();
    } catch (e) { alert('Error al eliminar.'); }
  };

  const stats = {
    total: hitos.length,
    enProgreso: hitos.filter(h => h.estado === 'en_progreso').length,
    completados: hitos.filter(h => h.estado === 'completado').length,
  };

  if (loading) {
    return (
      <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,107,53,0.3)', borderTop: '3px solid #ff6b35', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p className="text-secondary">Cargando hitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="glow-text">Mis Objetivos</h1>
          <p className="subtitle-text">Define y alcanza tus metas fitness</p>
        </div>
        <button className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo Hito</>}
        </button>
      </header>

      {showForm && (
        <div className="glass-panel p-24" style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
          <h4 style={{ marginBottom: 16, color: '#ff6b35' }}>Crear Nuevo Hito</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Título *</label>
              <input className="input-element no-icon" placeholder="ej: Perder 5kg" value={formData.titulo}
                onChange={e => setFormData(p => ({ ...p, titulo: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Tipo *</label>
              <select value={formData.tipo} onChange={e => setFormData(p => ({ ...p, tipo: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }}>
                <option value="peso">Peso / Composición</option>
                <option value="fuerza">Fuerza</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="habito">Hábito / Constancia</option>
                <option value="resistencia">Resistencia</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Meta (valor numérico) *</label>
              <input className="input-element no-icon" placeholder="ej: 75" value={formData.meta_valor}
                onChange={e => setFormData(p => ({ ...p, meta_valor: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Unidad *</label>
              <input className="input-element no-icon" placeholder="ej: kg, rep, sesiones" value={formData.unidad}
                onChange={e => setFormData(p => ({ ...p, unidad: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Valor Actual</label>
              <input className="input-element no-icon" placeholder="ej: 0" value={formData.valor_actual}
                onChange={e => setFormData(p => ({ ...p, valor_actual: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Fecha Límite</label>
              <input type="date" value={formData.fecha_limite}
                onChange={e => setFormData(p => ({ ...p, fecha_limite: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%' }} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Descripción</label>
            <textarea placeholder="Descripción del hito..." value={formData.descripcion}
              onChange={e => setFormData(p => ({ ...p, descripcion: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', width: '100%', minHeight: 50, resize: 'vertical' }} />
          </div>
          <button className="primary-btn" style={{ marginTop: 16, padding: '10px 24px' }} onClick={handleCreate} disabled={saving}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Crear Hito'}
          </button>
        </div>
      )}

      <div className="filter-chips mb-8">
        <div className={`chip ${filtroTipo === '' ? 'active' : ''}`} onClick={() => setFiltroTipo('')}>Todos</div>
        <div className={`chip ${filtroTipo === 'peso' ? 'active' : ''}`} onClick={() => setFiltroTipo('peso')}>Peso</div>
        <div className={`chip ${filtroTipo === 'fuerza' ? 'active' : ''}`} onClick={() => setFiltroTipo('fuerza')}>Fuerza</div>
        <div className={`chip ${filtroTipo === 'hipertrofia' ? 'active' : ''}`} onClick={() => setFiltroTipo('hipertrofia')}>Hipertrofia</div>
        <div className={`chip ${filtroTipo === 'habito' ? 'active' : ''}`} onClick={() => setFiltroTipo('habito')}>Constancia</div>
        <div className={`chip ${filtroTipo === 'resistencia' ? 'active' : ''}`} onClick={() => setFiltroTipo('resistencia')}>Resistencia</div>
      </div>

      <div className="objetivos-stats">
        <div className="stat-box">
          <div className="icon-box"><Target color="#ff6b35" /></div>
          <div><h2>{stats.total}</h2><p>Total Objetivos</p></div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><Zap color="#ff6b35" /></div>
          <div><h2>{stats.enProgreso}</h2><p>En Progreso</p></div>
        </div>
        <div className="stat-box">
          <div className="icon-box"><Flag color="#4ade80" /></div>
          <div><h2>{stats.completados}</h2><p>Completados</p></div>
        </div>
      </div>

      {hitos.length === 0 ? (
        <div className="glass-panel p-24" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Target size={48} color="rgba(255,107,53,0.4)" style={{ marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>Sin hitos registrados</h3>
          <p className="text-secondary">Crea tu primer hito físico para comenzar a rastrear tu progreso.</p>
        </div>
      ) : (
        <div className="objetivos-grid">
          {hitos.map((hito) => {
            const cfg = TIPO_CONFIG[hito.tipo] || TIPO_CONFIG.peso;
            const isEditing = editingId === hito.id;
            const isDone = hito.estado === 'completado';
            return (
              <div className="objetivo-card glass-panel p-24" key={hito.id}>
                <div className="flex-between mb-16">
                  <div className="flex-align-center gap-12">
                    <div className="icon-box" style={{ width: 40, height: 40 }}>{cfg.icon}</div>
                    <div>
                      <h3>{hito.titulo}</h3>
                      <span className="text-secondary text-xs">{cfg.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`status-badge ${isDone ? 'status-done' : 'status-progress'}`}>{ESTADO_LABELS[hito.estado]}</div>
                    <button onClick={() => handleDelete(hito.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex' }} title="Eliminar">
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>

                {hito.descripcion && <p className="text-sm text-secondary mb-16">{hito.descripcion}</p>}

                <div className="mb-16">
                  <div className="flex-between text-sm mb-8">
                    <span>Progreso: <b>{hito.progreso_porcentaje}%</b></span>
                    <span className="text-brand">{hito.valor_actual} / {hito.meta_valor} {hito.unidad}</span>
                  </div>
                  <div className="progress-bar-lg">
                    <div className={`progress-fill ${isDone ? 'bg-green' : 'bg-orange'}`} style={{ width: `${Math.min(100, hito.progreso_porcentaje)}%` }}></div>
                  </div>
                </div>

                <div className="flex-between text-xs text-secondary mt-16 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {hito.fecha_limite ? (
                    <span className="flex-align-center gap-4"><Calendar size={12} /> Meta: {new Date(hito.fecha_limite).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  ) : <span />}

                  {!isDone && (
                    isEditing ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Nuevo valor"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 6, padding: '4px 8px', color: '#fff', width: 90, fontSize: '0.8rem' }}
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdateProgress(hito.id); }}
                        />
                        <button onClick={() => handleUpdateProgress(hito.id)} style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.4)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#ff6b35', fontSize: '0.8rem' }}>
                          <Save size={12} /> OK
                        </button>
                        <button onClick={() => { setEditingId(null); setEditValue(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                          <X size={14} color="rgba(255,255,255,0.5)" />
                        </button>
                      </div>
                    ) : (
                      <button className="link-btn" style={{ margin: 0 }} onClick={() => { setEditingId(hito.id); setEditValue(String(hito.valor_actual)); }}>
                        Actualizar <ArrowRight size={14} />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
