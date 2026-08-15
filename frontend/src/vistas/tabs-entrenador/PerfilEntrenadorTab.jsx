import React, { useState } from 'react';
import { User, Activity, Edit3, Settings, Shield, Award, Users, Bot, MapPin, Building2 } from 'lucide-react';
import '../../estilos/tabs.css';
import EstadisticasTab from './EstadisticasTab';
import CertificacionesTab from './CertificacionesTab';

const API_URL = '/api';

const PerfilEntrenadorTab = ({ userData, token }) => {
    const [subTab, setSubTab] = useState('informacion');
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (token) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
            const res = await fetch(`${API_URL}/me/perfil`, { headers });
            if (res.ok) {
                setPerfil(await res.json());
            }
        } catch (err) {
            console.error('Error cargando perfil:', err);
        }
        setLoading(false);
    };

    const user = perfil?.user || userData || {};
    const entrenador = perfil?.entrenador || user?.entrenador || {};

    const nombreCompleto = `${user.nombre || ''} ${user.apellido || ''}`.trim() || 'Entrenador';
    const initials = nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'E';

    const renderTiposEntrenamiento = (tipos) => {
        if (!tipos) return <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>--</span>;
        let arr = [];
        try {
            arr = JSON.parse(tipos);
        } catch {
            arr = tipos.toString().split(',').map(t => t.trim());
        }

        if (!Array.isArray(arr) || arr.length === 0) return <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>--</span>;

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', maxWidth: '280px' }}>
                {arr.map((tipo, idx) => (
                    <span key={idx} style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
                        {tipo}
                    </span>
                ))}
            </div>
        );
    };

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
        <div className="tab-content-wrapper" style={{ animation: 'fadeIn 0.5s ease', padding: '20px 0' }}>

            {/* Trainer Header Card */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #ff8c42, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 16px rgba(255, 107, 53, 0.3)' }}>
                            {initials}
                        </div>
                        <div>
                            <h1 className="glow-text" style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{nombreCompleto}</h1>
                            <div style={{ display: 'flex', gap: '16px', color: '#aaa', fontSize: '14px', alignItems: 'center' }}>
                                <span style={{ color: '#fff', background: '#d6541f', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Entrenador Personal</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> GYMTRACK</span>
                                {entrenador.especialidad && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={14} /> {entrenador.especialidad}</span>}
                            </div>
                        </div>
                    </div>
                    <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 size={16} /> Editar Perfil
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Capacidad Máxima</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>{entrenador.capacidad_maxima ?? '--'}</h2>
                    </div>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Años de Experiencia</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>{entrenador.experiencia_anios !== undefined && entrenador.experiencia_anios !== null ? entrenador.experiencia_anios : '--'} años</h2>
                    </div>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Sesiones este Mes</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>0</h2>
                    </div>
                </div>
            </div>

            {/* Sub-Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button onClick={() => setSubTab('informacion')} style={{ background: subTab === 'informacion' ? '#cf5c2a' : 'transparent', border: subTab === 'informacion' ? '1px solid #ff6b35' : '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                    <User size={16} /> Información Personal
                </button>
                <button onClick={() => setSubTab('estadisticas')} style={{ background: subTab === 'estadisticas' ? '#cf5c2a' : 'transparent', border: subTab === 'estadisticas' ? '1px solid #ff6b35' : '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                    <Activity size={16} /> Estadísticas
                </button>
                <button onClick={() => setSubTab('clientes')} style={{ background: subTab === 'clientes' ? '#cf5c2a' : 'transparent', border: subTab === 'clientes' ? '1px solid #ff6b35' : '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                    <Users size={16} /> Mis Clientes
                </button>
                <button onClick={() => setSubTab('certificaciones')} style={{ background: subTab === 'certificaciones' ? '#cf5c2a' : 'transparent', border: subTab === 'certificaciones' ? '1px solid #ff6b35' : '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                    <Award size={16} /> Certificaciones
                </button>
                <button onClick={() => setSubTab('fitbot')} style={{ background: subTab === 'fitbot' ? '#cf5c2a' : 'transparent', border: subTab === 'fitbot' ? '1px solid #ff6b35' : '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                    <Bot size={16} /> Fit Bot
                </button>
            </div>

            {/* Sub-Tabs Content */}
            {subTab === 'informacion' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,107,53,0.1)', padding: '10px', borderRadius: '50%' }}>
                                <User color="#ff6b35" size={20} />
                            </div>
                            <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>Datos Personales</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Nombre Completo</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{nombreCompleto}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Email</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{user.email || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Teléfono</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.contacto || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Edad</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.edad || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Dirección</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.direccion || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Rol</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px', textTransform: 'capitalize' }}>{user.rol || 'Entrenador'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,107,53,0.1)', padding: '10px', borderRadius: '50%' }}>
                                <Award color="#ff6b35" size={20} />
                            </div>
                            <h2 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>Datos Profesionales</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Especialización Principal</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.especialidad || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Certificación Principal</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.certificacion || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Horario de Trabajo</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{entrenador.horarios || '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Tipos de Entrenamiento</span>
                                {renderTiposEntrenamiento(entrenador.tipos_entrenamiento)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'estadisticas' && <EstadisticasTab />}

            {subTab === 'certificaciones' && <CertificacionesTab />}

            {/* ...other subtabs */}
        </div>
    );
};

export default PerfilEntrenadorTab;
