import React, { useState, useEffect } from 'react';
import { Users, Search, User, Activity, Edit3, Save, AlertTriangle, Target, HeartPulse, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import '../../estilos/tabs.css';

export default function ClientesEntrenadorTab() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const tokenStr = localStorage.getItem('gymtrack_token');
        const res = await fetch('/api/entrenador/clientes', {
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
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthFormData, setHealthFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  const filteredClients = clientes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setHealthFormData(client.healthInfo);
    setIsEditingHealth(false);
  };

  const handleSaveHealthInfo = async () => {
    try {
      const tokenStr = localStorage.getItem('gymtrack_token');
      const res = await fetch(`/api/entrenador/clientes/${selectedClient.id}/health`, {
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

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="tab-header" style={{ marginBottom: '24px' }}>
        <h1 className="glow-text flex-align-center gap-12">
          <Users size={28} color="#ff6b35" /> Gestión de Clientes
        </h1>
        <p className="subtitle-text">Administra tus clientes y personaliza su información de salud para mejores rutinas.</p>
      </header>

      {notification && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
          <CheckCircle2 size={20} color="#10b981" />
          {notification}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px' }}>
        {/* Lista de Clientes (Sidebar) */}
        <div className="glass-panel" style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#aaa" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="input-field" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '44px', width: '100%', margin: 0 }}
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
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b35', fontWeight: 'bold' }}>
                    {client.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: '#fff' }}>{client.name}</h4>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{client.plan}</span>
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

        {/* Detalle del Cliente y Formulario de Salud */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedClient ? (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {/* Info Básica */}
              <div className="glass-panel p-24 mb-24" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '24px' }}>{selectedClient.name}</h2>
                  <div style={{ display: 'flex', gap: '16px', color: '#aaa', fontSize: '14px' }}>
                    <span>Email: {selectedClient.email}</span>
                    <span>Edad: {selectedClient.age} años</span>
                    <span style={{ color: '#4ade80' }}>Plan: {selectedClient.plan}</span>
                  </div>
                </div>
              </div>

              {/* Sección de Información Médica y Fitness */}
              <div className="glass-panel p-24">
                <div className="flex-between mb-24">
                  <h3 className="section-title flex-align-center gap-12" style={{ margin: 0 }}>
                    <HeartPulse size={20} color="#ff6b35" /> 
                    Información de Salud y Fitness
                    <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#ccc', fontWeight: 'normal' }}>Privado (Solo Entrenador)</span>
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
                  {/* Condiciones Médicas */}
                  <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                      <Activity size={16} color="#3b82f6" /> Condiciones Médicas Relevantes
                    </label>
                    {isEditingHealth ? (
                      <textarea 
                        className="input-field" 
                        value={healthFormData.condiciones_medicas}
                        onChange={(e) => setHealthFormData({...healthFormData, condiciones_medicas: e.target.value})}
                        placeholder="Ej: Asma, Hipertensión, Diabetes..."
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                        {selectedClient.healthInfo.condiciones_medicas || 'Ninguna registrada.'}
                      </p>
                    )}
                  </div>

                  {/* Lesiones Activas */}
                  <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                      <AlertTriangle size={16} color="#ef4444" /> Lesiones Activas o Crónicas
                    </label>
                    {isEditingHealth ? (
                      <textarea 
                        className="input-field" 
                        value={healthFormData.lesiones_activas}
                        onChange={(e) => setHealthFormData({...healthFormData, lesiones_activas: e.target.value})}
                        placeholder="Ej: Esguince tobillo, dolor lumbar crónico..."
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                        {selectedClient.healthInfo.lesiones_activas || 'Ninguna registrada.'}
                      </p>
                    )}
                  </div>

                  {/* Restricciones de Movimiento */}
                  <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                      <AlertTriangle size={16} color="#eab308" /> Restricciones de Movimiento
                    </label>
                    {isEditingHealth ? (
                      <textarea 
                        className="input-field" 
                        value={healthFormData.restricciones_movimiento}
                        onChange={(e) => setHealthFormData({...healthFormData, restricciones_movimiento: e.target.value})}
                        placeholder="Ej: No realizar saltos, evitar ejercicios con impacto en rodillas..."
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                        {selectedClient.healthInfo.restricciones_movimiento || 'Ninguna registrada.'}
                      </p>
                    )}
                  </div>

                  {/* Objetivos Fitness */}
                  <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' }}>
                      <Target size={16} color="#4ade80" /> Objetivos Fitness Acordados
                    </label>
                    {isEditingHealth ? (
                      <textarea 
                        className="input-field" 
                        value={healthFormData.objetivos_acordados}
                        onChange={(e) => setHealthFormData({...healthFormData, objetivos_acordados: e.target.value})}
                        placeholder="Ej: Pérdida de peso (5kg), Hipertrofia..."
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ color: '#ccc', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                        {selectedClient.healthInfo.objetivos_acordados || 'Ningún objetivo registrado.'}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <Users size={64} style={{ opacity: 0.2, marginBottom: '20px' }} />
              <h2 style={{ color: '#fff', marginBottom: '10px' }}>Selecciona un cliente</h2>
              <p>Haz clic en un cliente de la lista para ver y gestionar su información de salud.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
