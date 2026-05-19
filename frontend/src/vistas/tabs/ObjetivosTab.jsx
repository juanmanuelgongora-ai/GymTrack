import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../logica/UserContext';
import { Target, Flag, Zap, TrendingUp, Calendar, ArrowRight, Plus, X, Save, Trash2, Loader2, BarChart3, Scale } from 'lucide-react';
import '../../estilos/tabs.css';

const API_URL = '/api';

const TIPO_CONFIG = {
  peso: { icon: <Scale size={20} />, color: '#ff6b35', label: 'Peso' },
  fuerza: { icon: <TrendingUp size={20} />, color: '#3b82f6', label: 'Fuerza' },
  hipertrofia: { icon: <Zap size={20} />, color: '#a855f7', label: 'Hipertrofia' },
  habito: { icon: <Calendar size={20} />, color: '#22c55e', label: 'Constancia' },
  resistencia: { icon: <Flag size={20} />, color: '#eab308', label: 'Resistencia' },
  composicion: { icon: <BarChart3 size={20} />, color: '#ec4899', label: 'Composición' },
};

const ESTADO_LABELS = { en_progreso: 'En Progreso', completado: 'Completado', abandonado: 'Abandonado' };

export default function ObjetivosTab({ onLogrosUnlocked }) {
  const { token } = useUser();
  const [hitos, setHitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'peso',
    valor_inicial: '',
    meta_valor: '',
    valor_actual: '',
    unidad: 'kg',
    fecha_limite: ''
  });

  const fetchHitos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };
      const url = filtroTipo ? `${API_URL}/hitos?tipo=${filtroTipo}` : `${API_URL}/hitos`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        console.log('Hitos cargados:', data);
        setHitos(data);
      } else {
        console.error('Error al cargar hitos:', res.status);
      }
    } catch (err) {
      console.error('Error de red al cargar hitos:', err);
    }
    setLoading(false);
  }, [token, filtroTipo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHitos();
  }, [fetchHitos]);

  const handleCreate = async () => {
    if (!formData.titulo || !formData.meta_valor) return alert('Título y meta son obligatorios.');
    setSaving(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      const body = {
        ...formData,
        valor_inicial: parseFloat(formData.valor_inicial) || 0,
        meta_valor: parseFloat(formData.meta_valor),
        valor_actual: parseFloat(formData.valor_actual) || parseFloat(formData.valor_inicial) || 0
      };

      if (!body.fecha_limite) delete body.fecha_limite;

      const res = await fetch(`${API_URL}/hitos`, { method: 'POST', headers, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        setFormData({ titulo: '', descripcion: '', tipo: 'peso', valor_inicial: '', meta_valor: '', valor_actual: '', unidad: 'kg', fecha_limite: '' });
        fetchHitos();
      } else {
        const e = await res.json();
        alert('Error: ' + (e.message || JSON.stringify(e.errors)));
      }
    } catch (err) {
      alert('Error de conexión.');
    }
    setSaving(false);
  };

  const handleUpdateProgress = async (id) => {
    if (!editValue || isNaN(editValue)) return;
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const res = await fetch(`${API_URL}/hitos/${id}`, { method: 'PUT', headers, body: JSON.stringify({ valor_actual: parseFloat(editValue) }) });
      if (res.ok) {
        const data = await res.json();
        setEditingId(null);
        setEditValue('');
        fetchHitos();

        // Notificar logros si se desbloquearon
        if (data.logros_desbloqueados && data.logros_desbloqueados.length > 0) {
          console.log('Logros desbloqueados detectados:', data.logros_desbloqueados);
          if (onLogrosUnlocked) onLogrosUnlocked(data.logros_desbloqueados);
        }
      }
    } catch (err) {
      alert('Error al actualizar.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este hito?')) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
      const res = await fetch(`${API_URL}/hitos/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchHitos();
    } catch (err) {
      alert('Error al eliminar.');
    }
  };

  const stats = {
    total: hitos.length,
    enProgreso: hitos.filter(h => h.estado === 'en_progreso').length,
    completados: hitos.filter(h => h.estado === 'completado').length,
  };

  if (loading && hitos.length === 0) {
    return (
      <div className="tab-container flex-center min-h-50">
        <Loader2 className="animate-spin" size={40} color="#ff6b35" />
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
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Título del Objetivo *</label>
              <input className="input-field" placeholder="ej: Llegar a los 75kg de peso corporal" value={formData.titulo}
                onChange={e => setFormData(p => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Categoría *</label>
              <select className="input-field" value={formData.tipo} onChange={e => setFormData(p => ({ ...p, tipo: e.target.value }))} style={{ background: '#1a1a1d' }}>
                <option value="peso">Peso</option>
                <option value="fuerza">Fuerza</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="habito">Constancia</option>
                <option value="resistencia">Resistencia</option>
                <option value="composicion">Composición</option>
              </select>
            </div>
            <div>
              <label className="form-label">Unidad de Medida *</label>
              <input className="input-field" placeholder="ej: kg, rep, sesiones" value={formData.unidad}
                onChange={e => setFormData(p => ({ ...p, unidad: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Valor Inicial *</label>
              <input className="input-field" type="number" placeholder="ej: 80" value={formData.valor_inicial}
                onChange={e => setFormData(p => ({ ...p, valor_inicial: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Valor Meta *</label>
              <input className="input-field" type="number" placeholder="ej: 75" value={formData.meta_valor}
                onChange={e => setFormData(p => ({ ...p, meta_valor: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Valor Actual (opcional)</label>
              <input className="input-field" type="number" placeholder="ej: 80" value={formData.valor_actual}
                onChange={e => setFormData(p => ({ ...p, valor_actual: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Fecha Límite</label>
              <input className="input-field" type="date" value={formData.fecha_limite}
                onChange={e => setFormData(p => ({ ...p, fecha_limite: e.target.value }))} />
            </div>
          </div>
          <button className="primary-btn mt-24" onClick={handleCreate} disabled={saving}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Objetivo'}
          </button>
        </div>
      )}

      <div className="filter-chips mb-24">
        <div className={`chip ${filtroTipo === '' ? 'active' : ''}`} onClick={() => setFiltroTipo('')}>Todos</div>
        {Object.keys(TIPO_CONFIG).map(key => (
          <div key={key} className={`chip ${filtroTipo === key ? 'active' : ''}`} onClick={() => setFiltroTipo(key)}>
            {TIPO_CONFIG[key].label}
          </div>
        ))}
      </div>

      <div className="objetivos-stats mb-24">
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
        <div className="glass-panel p-48 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Target size={48} color="rgba(255,107,53,0.2)" className="mb-16 mx-auto" />
          <h3 style={{ color: 'rgba(255,255,255,0.5)' }}>Sin hitos registrados</h3>
          <p className="text-secondary">No hay objetivos en esta categoría. Crea uno nuevo para empezar.</p>
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
                    <div className="icon-box" style={{ width: 40, height: 40, background: `${cfg.color}15` }}>
                      {React.cloneElement(cfg.icon, { color: cfg.color })}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{hito.titulo}</h3>
                      <span className="text-secondary text-xs">{cfg.label}</span>
                    </div>
                  </div>
                  <div className="flex-align-center gap-8">
                    <div className={`status-badge ${isDone ? 'status-done' : 'status-progress'}`}>{ESTADO_LABELS[hito.estado]}</div>
                    <button onClick={() => handleDelete(hito.id)} className="icon-btn-danger" title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {hito.descripcion && <p className="text-sm text-secondary mb-16" style={{ opacity: 0.7 }}>{hito.descripcion}</p>}

                <div className="mb-20">
                  <div className="flex-between text-sm mb-8">
                    <span className="font-bold">{hito.progreso_porcentaje}% Completado</span>
                    <span className="text-brand font-bold">{hito.valor_actual} / {hito.meta_valor} <span className="text-secondary font-normal">{hito.unidad}</span></span>
                  </div>
                  <div className="progress-bar-lg" style={{ height: 10, background: 'rgba(255,255,255,0.05)' }}>
                    <div className={`progress-fill ${isDone ? 'bg-green' : 'bg-orange'}`}
                      style={{
                        width: `${Math.min(100, hito.progreso_porcentaje)}%`,
                        boxShadow: `0 0 10px ${isDone ? '#4ade8050' : '#ff6b3550'}`
                      }}>
                    </div>
                  </div>
                  <div className="flex-between text-xs text-secondary mt-8">
                    <span>Inicio: {hito.valor_inicial} {hito.unidad}</span>
                    <span>Meta: {hito.meta_valor} {hito.unidad}</span>
                  </div>
                </div>

                <div className="flex-between text-xs text-secondary mt-16 pt-16 border-top-thin">
                  {hito.fecha_limite ? (
                    <span className="flex-align-center gap-4"><Calendar size={12} /> Límite: {new Date(hito.fecha_limite).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  ) : <span>Sin fecha límite</span>}

                  {!isDone && (
                    isEditing ? (
                      <div className="flex-align-center gap-6">
                        <input value={editValue} onChange={e => setEditValue(e.target.value)} className="input-field-sm"
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdateProgress(hito.id); }} autoFocus />
                        <button onClick={() => handleUpdateProgress(hito.id)} className="primary-btn-sm"><Save size={12} /> OK</button>
                        <button onClick={() => { setEditingId(null); setEditValue(''); }} className="icon-btn-sm"><X size={14} /></button>
                      </div>
                    ) : (
                      <button className="link-btn" onClick={() => { setEditingId(hito.id); setEditValue(String(hito.valor_actual)); }}>
                        Actualizar Avance <ArrowRight size={14} />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .min-h-50 { min-height: 50vh; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-align-center { display: flex; align-items: center; }
        .gap-12 { gap: 12px; }
        .gap-8 { gap: 8px; }
        .gap-6 { gap: 6px; }
        .gap-4 { gap: 4px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-16 { margin-bottom: 16px; }
        .mt-24 { margin-top: 24px; }
        .form-label { display: block; font-size: 0.78rem; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
        .input-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; color: #fff; width: 100%; transition: all 0.3s; }
        .input-field:focus { border-color: #ff6b35; outline: none; background: rgba(255,255,255,0.08); }
        .input-field-sm { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,107,53,0.3); border-radius: 6px; padding: 4px 8px; color: #fff; width: 80px; font-size: 0.8rem; }
        .primary-btn-sm { background: rgba(255,107,53,0.15); border: 1px solid rgba(255,107,53,0.4); border-radius: 6px; padding: 4px 8px; cursor: pointer; color: #ff6b35; display: flex; align-items: center; gap: 4px; font-size: 0.8rem; }
        .icon-btn-sm { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); }
        .icon-btn-danger { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); border-radius: 6px; padding: 4px; cursor: pointer; color: #ef4444; display: flex; transition: all 0.3s; }
        .icon-btn-danger:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; }
        .status-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-progress { background: rgba(255,107,53,0.1); color: #ff6b35; border: 1px solid rgba(255,107,53,0.2); }
        .status-done { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .bg-orange { background: linear-gradient(90deg, #ff6b35, #ff8c61); }
        .bg-green { background: linear-gradient(90deg, #4ade80, #22c55e); }
        .border-top-thin { border-top: 1px solid rgba(255,255,255,0.05); }
        .font-bold { font-weight: 700; }
        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>
    </div>
  );
}
