import React, { useState, useEffect } from 'react';
import { Users, Search, User, Activity, Edit3, Save, AlertTriangle, Target, HeartPulse, ChevronRight, X, CheckCircle2, Calendar, Scale, TrendingUp, Dumbbell, Plus, Mail, BarChart2 } from 'lucide-react';
import '../../estilos/tabs.css';


export default function ClientesEntrenadorTab() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const tokenStr = localStorage.getItem('gymtrack_token') || localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/entrenador/clientes', {
          headers: { 'Authorization': `Bearer ${tokenStr}`, 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch (err) {
        console.error("Error fetching clientes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const [selectedClient, setSelectedClient] = useState(null);
  const [activeClientTab, setActiveClientTab] = useState('resumen');
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthFormData, setHealthFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientData, setNewClientData] = useState({ nombre: '', email: '', objetivo: '' });

  // Búsqueda por nombre u objetivo
  const filteredClients = clientes.filter(c => {
    const term = searchTerm.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(term);
    const objMatch = c.healthInfo?.objetivos_acordados?.toLowerCase().includes(term);
    return nameMatch || objMatch;
  });

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setHealthFormData(client.healthInfo);
    setIsEditingHealth(false);
    setActiveClientTab('resumen');
  };

  const handleSaveHealthInfo = async () => {
    try {
      const tokenStr = localStorage.getItem('gymtrack_token') || localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/api/entrenador/clientes/${selectedClient.id}/health`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokenStr}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(healthFormData)
      });

      if (res.ok) {
        setClientes(prevClientes =>
          prevClientes.map(c =>
            c.id === selectedClient.id ? { ...c, healthInfo: healthFormData } : c
          )
        );
        setSelectedClient(prev => ({ ...prev, healthInfo: healthFormData }));
        setIsEditingHealth(false);
        setNotification('Información de salud actualizada correctamente');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (err) {
      console.error("Error guardando datos de salud", err);
    }
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    // Simular agregado de cliente
    setNotification(`Invitación enviada a ${newClientData.nombre} (${newClientData.email})`);
    setShowAddModal(false);
    setNewClientData({ nombre: '', email: '', objetivo: '' });
    setTimeout(() => setNotification(''), 4000);
  };

  const getLastVisit = (client) => {
    if (client.sesiones && client.sesiones.length > 0) {
      return new Date(client.sesiones[0].created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return 'Sin visitas';
  };

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="tab-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="glow-text flex-align-center gap-12">
            <Users size={28} color="#ff6b35" /> Gestión de Clientes
          </h1>
          <p className="subtitle-text">Visualiza el progreso de tus clientes, filtra por objetivos y administra sus perfiles.</p>
        </div>
        <button
          className="primary-btn flex-align-center gap-12 hover-scale"
          onClick={() => setShowAddModal(true)}
          style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px' }}
        >
          <Plus size={18} /> Añadir Cliente
        </button>
      </header>

      {notification && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
          <CheckCircle2 size={20} color="#10b981" />
          {notification}
        </div>
      )}

      {/* Modal Añadir Cliente */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '16px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Invitar Nuevo Cliente</h3>
              <X size={20} color="#aaa" style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Nombre Completo</label>
                <input required type="text" className="input-field" placeholder="Ej. Juan Pérez" value={newClientData.nombre} onChange={(e) => setNewClientData({ ...newClientData, nombre: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Correo Electrónico</label>
                <input required type="email" className="input-field" placeholder="juan@ejemplo.com" value={newClientData.email} onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Objetivo Principal (Opcional)</label>
                <input type="text" className="input-field" placeholder="Ej. Pérdida de peso" value={newClientData.objetivo} onChange={(e) => setNewClientData({ ...newClientData, objetivo: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '10px' }}>Enviar Invitación</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px' }}>
        {/* Lista de Clientes (Sidebar) */}
        <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#aaa" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Buscar por nombre u objetivo..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '44px', width: '100%', margin: 0, fontSize: '13px' }}
              />
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '10px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                <p>Cargando clientes...</p>
              </div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    background: selectedClient?.id === client.id ? 'rgba(255, 107, 53, 0.15)' : 'transparent',
                    border: selectedClient?.id === client.id ? '1px solid rgba(255, 107, 53, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => { if (selectedClient?.id !== client.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={(e) => { if (selectedClient?.id !== client.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b35', fontWeight: 'bold', flexShrink: 0 }}>
                    {client.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.name}</h4>
                    <span style={{ fontSize: '11px', color: '#aaa', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {client.healthInfo?.objetivos_acordados || 'Sin objetivo principal'}
                    </span>
                  </div>
                  <ChevronRight size={16} color={selectedClient?.id === client.id ? '#ff6b35' : '#666'} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                <User size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p>No se encontraron clientes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Área Principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedClient ? (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {/* Info Básica */}
              <div className="glass-panel p-24 mb-24" style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
                <button onClick={() => setSelectedClient(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}><X size={20} /></button>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '24px' }}>{selectedClient.name}</h2>
                  <div style={{ display: 'flex', gap: '16px', color: '#aaa', fontSize: '14px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {selectedClient.email}</span>
                    <span>Edad: {selectedClient.age} años</span>
                    <span style={{ color: '#4ade80' }}>Plan: {selectedClient.plan}</span>
                  </div>
                </div>
              </div>

              <div className="filter-chips mb-24" style={{ paddingBottom: '10px' }}>
                <div className={`chip ${activeClientTab === 'resumen' ? 'active' : ''}`} onClick={() => setActiveClientTab('resumen')}><Activity size={14} /> Resumen y Salud</div>
                <div className={`chip ${activeClientTab === 'progreso' ? 'active' : ''}`} onClick={() => setActiveClientTab('progreso')}><TrendingUp size={14} /> Métricas y Objetivos</div>
                <div className={`chip ${activeClientTab === 'estadisticas' ? 'active' : ''}`} onClick={() => setActiveClientTab('estadisticas')}><BarChart2 size={14} /> Estadísticas</div>
                <div className={`chip ${activeClientTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveClientTab('asistencia')}><Calendar size={14} /> Historial de Asistencia</div>
              </div>

              {/* Pestaña: Resumen y Salud */}
              {activeClientTab === 'resumen' && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  {/* Sección de Información Médica y Fitness */}
                  <div className="glass-panel p-24">
                    <div className="flex-between mb-24">
                      <h3 className="section-title flex-align-center gap-12" style={{ margin: 0 }}>
                        <HeartPulse size={20} color="#ff6b35" />
                        Información de Salud y Fitness
                      </h3>
                      {!isEditingHealth ? (
                        <button className="primary-btn btn-sm" onClick={() => setIsEditingHealth(true)}>
                          <Edit3 size={16} /> Actualizar Perfil
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="secondary-btn btn-sm" onClick={() => { setIsEditingHealth(false); setHealthFormData(selectedClient.healthInfo); }}>
                            <X size={16} /> Cancelar
                          </button>
                          <button className="primary-btn btn-sm" onClick={handleSaveHealthInfo}>
                            <Save size={16} /> Guardar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gap: '20px' }}>
                      <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                          <Activity size={16} color="#3b82f6" /> Condiciones Médicas Relevantes
                        </label>
                        {isEditingHealth ? (
                          <textarea className="input-field" value={healthFormData.condiciones_medicas} onChange={(e) => setHealthFormData({ ...healthFormData, condiciones_medicas: e.target.value })} placeholder="Ej: Asma, Hipertensión, Diabetes..." style={{ minHeight: '80px', resize: 'vertical' }} />
                        ) : (
                          <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{selectedClient.healthInfo?.condiciones_medicas || 'Ninguna registrada.'}</p>
                        )}
                      </div>

                      <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                          <AlertTriangle size={16} color="#ef4444" /> Lesiones Activas o Crónicas
                        </label>
                        {isEditingHealth ? (
                          <textarea className="input-field" value={healthFormData.lesiones_activas} onChange={(e) => setHealthFormData({ ...healthFormData, lesiones_activas: e.target.value })} placeholder="Ej: Esguince tobillo, dolor lumbar crónico..." style={{ minHeight: '80px', resize: 'vertical' }} />
                        ) : (
                          <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{selectedClient.healthInfo?.lesiones_activas || 'Ninguna registrada.'}</p>
                        )}
                      </div>

                      <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                          <AlertTriangle size={16} color="#eab308" /> Restricciones de Movimiento
                        </label>
                        {isEditingHealth ? (
                          <textarea className="input-field" value={healthFormData.restricciones_movimiento} onChange={(e) => setHealthFormData({ ...healthFormData, restricciones_movimiento: e.target.value })} placeholder="Ej: No realizar saltos, evitar ejercicios con impacto en rodillas..." style={{ minHeight: '80px', resize: 'vertical' }} />
                        ) : (
                          <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{selectedClient.healthInfo?.restricciones_movimiento || 'Ninguna registrada.'}</p>
                        )}
                      </div>

                      <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                          <Target size={16} color="#4ade80" /> Objetivos Fitness Acordados
                        </label>
                        {isEditingHealth ? (
                          <textarea className="input-field" value={healthFormData.objetivos_acordados} onChange={(e) => setHealthFormData({ ...healthFormData, objetivos_acordados: e.target.value })} placeholder="Ej: Pérdida de peso (5kg), Hipertrofia..." style={{ minHeight: '80px', resize: 'vertical' }} />
                        ) : (
                          <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{selectedClient.healthInfo?.objetivos_acordados || 'Ningún objetivo registrado.'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña: Métricas y Objetivos */}
              {activeClientTab === 'progreso' && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div className="glass-panel p-24 mb-24">
                    <h3 className="section-title flex-align-center gap-12 mb-24"><Scale size={20} color="#ff6b35" /> Métricas Corporales Actuales</h3>
                    {selectedClient.metricas && selectedClient.metricas.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {(() => {
                          const latest = selectedClient.metricas[0];
                          return (
                            <>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Peso</p>
                                <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{latest.peso_kg || '--'} kg</p>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>IMC</p>
                                <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{latest.imc || '--'}</p>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Grasa Corporal</p>
                                <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{latest.grasa_corporal || '--'}%</p>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Masa Muscular</p>
                                <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{latest.masa_muscular || '--'} kg</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No hay métricas registradas para este cliente.</p>
                    )}
                  </div>

                  <div className="glass-panel p-24">
                    <h3 className="section-title flex-align-center gap-12 mb-24"><Target size={20} color="#4ade80" /> Objetivos Activos</h3>
                    {selectedClient.objetivos && selectedClient.objetivos.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {selectedClient.objetivos.map(obj => (
                          <div key={obj.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>{obj.titulo}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#aaa' }}>
                              <span>Progreso: {obj.progreso_porcentaje}%</span>
                              <span>{obj.valor_actual} / {obj.meta_valor} {obj.unidad}</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, obj.progreso_porcentaje)}%`, height: '100%', background: obj.estado === 'completado' ? '#4ade80' : '#ff6b35' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No hay objetivos activos para este cliente.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Pestaña: Estadísticas con Gráficos */}
              {activeClientTab === 'estadisticas' && (() => {
                const metricas = [...(selectedClient.metricas || [])].reverse(); // oldest first
                const sesiones = selectedClient.sesiones || [];

                // SVG Line Chart helper
                const LineChart = ({ data, valueKey, label, color, unit = '' }) => {
                  if (!data || data.length < 2) return (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: 13 }}>
                      Se necesitan al menos 2 mediciones para mostrar el gráfico.
                    </div>
                  );
                  const W = 420, H = 140, pad = { top: 12, right: 12, bottom: 28, left: 38 };
                  const vals = data.map(d => parseFloat(d[valueKey]) || 0).filter(v => v > 0);
                  if (!vals.length) return <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: 13 }}>Sin datos suficientes.</div>;
                  const min = Math.min(...vals), max = Math.max(...vals);
                  const range = max - min || 1;
                  const cx = (i) => pad.left + (i / (vals.length - 1)) * (W - pad.left - pad.right);
                  const cy = (v) => pad.top + ((max - v) / range) * (H - pad.top - pad.bottom);
                  const pts = vals.map((v, i) => `${cx(i)},${cy(v)}`).join(' ');
                  const areaClose = `${cx(vals.length - 1)},${H - pad.bottom} ${cx(0)},${H - pad.bottom}`;
                  const labels = data.filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1);
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const y = pad.top + t * (H - pad.top - pad.bottom);
                        const val = max - t * range;
                        return (
                          <g key={t}>
                            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <text x={pad.left - 4} y={y + 4} textAnchor="end" fill="#555" fontSize="9">{val.toFixed(1)}</text>
                          </g>
                        );
                      })}
                      {/* Area */}
                      <polygon points={`${pts} ${areaClose}`} fill={`url(#grad-${valueKey})`} />
                      {/* Line */}
                      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                      {/* Dots */}
                      {vals.map((v, i) => (
                        <circle key={i} cx={cx(i)} cy={cy(v)} r="3.5" fill={color} stroke="#1a1a2e" strokeWidth="1.5" />
                      ))}
                      {/* X axis labels */}
                      {labels.map((d, i) => {
                        const idx = data.indexOf(d);
                        return (
                          <text key={i} x={cx(idx)} y={H - pad.bottom + 14} textAnchor="middle" fill="#555" fontSize="9">
                            {new Date(d.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </text>
                        );
                      })}
                    </svg>
                  );
                };

                // Training frequency per week from sesiones
                const freqMap = {};
                sesiones.forEach(s => {
                  const d = new Date(s.created_at);
                  const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)}`;
                  freqMap[week] = (freqMap[week] || 0) + 1;
                });
                const freqData = Object.entries(freqMap).sort().slice(-8).map(([w, v]) => ({ label: w.split('-W')[1] ? `S${w.split('-W')[1]}` : w, value: v }));
                const freqMax = Math.max(...freqData.map(d => d.value), 1);

                const latestMetrica = selectedClient.metricas?.[0];

                return (
                  <div style={{ animation: 'fadeIn 0.4s ease' }}>

                    {/* KPI cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
                      {[
                        { label: 'Peso Actual', value: latestMetrica?.peso_kg ? `${latestMetrica.peso_kg} kg` : '--', color: '#ff6b35', sub: metricas.length > 1 ? `${(latestMetrica.peso_kg - metricas[0].peso_kg).toFixed(1)} kg vs inicio` : 'Primera medición' },
                        { label: 'IMC Actual', value: latestMetrica?.imc ? latestMetrica.imc.toFixed(1) : '--', color: '#3b82f6', sub: latestMetrica?.imc < 25 ? 'Normal' : latestMetrica?.imc < 30 ? 'Sobrepeso' : 'Obesidad' },
                        { label: 'Masa Muscular', value: latestMetrica?.masa_muscular ? `${latestMetrica.masa_muscular} kg` : '--', color: '#4ade80', sub: metricas.length > 1 && latestMetrica?.masa_muscular && metricas[0]?.masa_muscular ? `+${(latestMetrica.masa_muscular - metricas[0].masa_muscular).toFixed(1)} kg` : '' },
                        { label: 'Grasa Corporal', value: latestMetrica?.grasa_corporal ? `${latestMetrica.grasa_corporal}%` : '--', color: '#eab308', sub: 'Última medición' },
                      ].map(({ label, value, color, sub }) => (
                        <div key={label} style={{ background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                          <p style={{ margin: '0 0 4px', color: '#aaa', fontSize: 11 }}>{label}</p>
                          <p style={{ margin: '0 0 4px', color, fontSize: 22, fontWeight: 700 }}>{value}</p>
                          <p style={{ margin: 0, color: '#666', fontSize: 10 }}>{sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

                      {/* Weight Chart */}
                      <div className="glass-panel p-24">
                        <h4 style={{ margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Scale size={16} color="#ff6b35" /> Evolución del Peso
                        </h4>
                        <LineChart data={metricas} valueKey="peso_kg" label="Peso" color="#ff6b35" unit="kg" />
                        {metricas.length > 1 && (() => {
                          const diff = (parseFloat(metricas[metricas.length - 1]?.peso_kg) - parseFloat(metricas[0]?.peso_kg)).toFixed(1);
                          return <p style={{ margin: '8px 0 0', fontSize: 12, textAlign: 'center', color: parseFloat(diff) < 0 ? '#4ade80' : '#ff6b35' }}>
                            {parseFloat(diff) < 0 ? '▼' : '▲'} {Math.abs(diff)} kg desde el inicio
                          </p>;
                        })()}
                      </div>

                      {/* Muscle Mass Chart */}
                      <div className="glass-panel p-24">
                        <h4 style={{ margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Dumbbell size={16} color="#4ade80" /> Masa Muscular
                        </h4>
                        <LineChart data={metricas} valueKey="masa_muscular" label="Masa Muscular" color="#4ade80" unit="kg" />
                      </div>

                      {/* IMC Chart */}
                      <div className="glass-panel p-24">
                        <h4 style={{ margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Activity size={16} color="#3b82f6" /> Evolución IMC
                        </h4>
                        <LineChart data={metricas} valueKey="imc" label="IMC" color="#3b82f6" />
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8, fontSize: 10, color: '#555' }}>
                          {[['<18.5', 'Bajo peso', '#3b82f6'], ['18.5-25', 'Normal', '#4ade80'], ['25-30', 'Sobrepeso', '#eab308'], ['>30', 'Obesidad', '#ef4444']].map(([r, l, c]) => (
                            <span key={r} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} /> {l} ({r})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Training frequency bar chart */}
                      <div className="glass-panel p-24">
                        <h4 style={{ margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <BarChart2 size={16} color="#a855f7" /> Frecuencia Semanal de Entrenamientos
                        </h4>
                        {freqData.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, paddingBottom: 20, position: 'relative' }}>
                            {freqData.map(({ label, value }) => (
                              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                <span style={{ fontSize: 9, color: '#a855f7', marginBottom: 3, fontWeight: 700 }}>{value}</span>
                                <div style={{ width: '100%', background: 'rgba(168,85,247,0.15)', borderRadius: '4px 4px 0 0', border: '1px solid rgba(168,85,247,0.3)', height: `${Math.max(4, (value / freqMax) * 80)}px`, transition: 'height 0.5s' }} />
                                <span style={{ fontSize: 9, color: '#555', marginTop: 4 }}>{label}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p style={{ color: '#555', textAlign: 'center', padding: 20, fontSize: 13 }}>Sin datos de entrenamientos.</p>}
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666', textAlign: 'center' }}>
                          Total: {sesiones.length} sesiones registradas
                        </p>
                      </div>
                    </div>

                    {/* Cuerpo – measurements table */}
                    {metricas.length > 0 && (
                      <div className="glass-panel p-24">
                        <h4 style={{ margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Scale size={16} color="#ff6b35" /> Historial de Mediciones Corporales
                        </h4>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr>
                                {['Fecha', 'Peso (kg)', 'IMC', 'Grasa %', 'Músculo (kg)', 'Cintura cm', 'Pecho cm'].map(col => (
                                  <th key={col} style={{ padding: '8px 12px', color: '#666', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid #333', whiteSpace: 'nowrap' }}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[...metricas].reverse().map((m, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  <td style={{ padding: '10px 12px', color: '#aaa' }}>{new Date(m.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                                  <td style={{ padding: '10px 12px', color: '#ff6b35', fontWeight: 700 }}>{m.peso_kg || '--'}</td>
                                  <td style={{ padding: '10px 12px', color: '#3b82f6' }}>{m.imc ? parseFloat(m.imc).toFixed(1) : '--'}</td>
                                  <td style={{ padding: '10px 12px', color: '#eab308' }}>{m.grasa_corporal ? `${m.grasa_corporal}%` : '--'}</td>
                                  <td style={{ padding: '10px 12px', color: '#4ade80' }}>{m.masa_muscular || '--'}</td>
                                  <td style={{ padding: '10px 12px', color: '#ccc' }}>{m.cintura_cm || '--'}</td>
                                  <td style={{ padding: '10px 12px', color: '#ccc' }}>{m.pecho_cm || '--'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Pestaña: Historial de Asistencia */}
              {activeClientTab === 'asistencia' && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div className="glass-panel p-24 mb-24">
                    <h3 className="section-title flex-align-center gap-12 mb-24"><Calendar size={20} color="#3b82f6" /> Historial de Entrenamientos</h3>
                    {selectedClient.sesiones && selectedClient.sesiones.length > 0 ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{selectedClient.sesiones.length}</p>
                            <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0 0' }}>Sesiones Totales</p>
                          </div>
                          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ color: '#4ade80', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{selectedClient.sesiones.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length}</p>
                            <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0 0' }}>Sesiones este mes</p>
                          </div>
                          <div style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ color: '#ff6b35', fontSize: '18px', fontWeight: 'bold', margin: 0, marginTop: '4px' }}>
                              {new Date(selectedClient.sesiones[0].created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </p>
                            <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0 0' }}>Última Sesión</p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>Últimas Sesiones</h4>
                          {selectedClient.sesiones.slice(0, 5).map((sesion, idx) => (
                            <div key={sesion.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                  <Dumbbell size={20} color="#fff" />
                                </div>
                                <div>
                                  <p style={{ margin: 0, color: '#fff', fontWeight: 'bold' }}>Día {sesion.dia_rutina || 'Libre'}</p>
                                  <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '12px' }}>{new Date(sesion.created_at).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'inline-block', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Completado</span>
                                <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '12px' }}>{sesion.duracion_minutos || '--'} min</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>El cliente no ha registrado sesiones de entrenamiento.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Vista General (Tabla/Grid de todos los clientes) cuando no hay seleccionado */
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Vista General de Clientes</h2>
                <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '14px' }}>Selecciona un cliente para ver más detalles o revisar su tabla general de progreso.</p>
              </div>
              <div style={{ padding: '20px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', color: '#888', fontSize: '13px', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Cliente</th>
                      <th style={{ padding: '12px 16px', color: '#888', fontSize: '13px', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Objetivo Principal</th>
                      <th style={{ padding: '12px 16px', color: '#888', fontSize: '13px', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Nivel/Plan</th>
                      <th style={{ padding: '12px 16px', color: '#888', fontSize: '13px', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Última Visita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(client => (
                      <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => handleSelectClient(client)} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ margin: 0, color: '#fff', fontWeight: '500' }}>{client.name}</p>
                              <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>
                          {client.healthInfo?.objetivos_acordados || <span style={{ color: '#666', fontStyle: 'italic' }}>No definido</span>}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-block', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                            {client.plan}
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: '#aaa', fontSize: '14px' }}>
                          {getLastVisit(client)}
                        </td>
                      </tr>
                    ))}
                    {filteredClients.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No se encontraron clientes que coincidan con la búsqueda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
