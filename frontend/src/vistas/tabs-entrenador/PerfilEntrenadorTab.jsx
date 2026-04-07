import React, { useState } from 'react';
import { User, Activity, Edit3, Settings, Shield, Award, Users, Bot, MapPin, Building2 } from 'lucide-react';
import '../../estilos/tabs.css';
import EstadisticasTab from './EstadisticasTab';
import CertificacionesTab from './CertificacionesTab';

const PerfilEntrenadorTab = () => {
    const [subTab, setSubTab] = useState('informacion');

    return (
        <div className="tab-content-wrapper" style={{ animation: 'fadeIn 0.5s ease', padding: '20px 0' }}>

            {/* Trainer Header Card */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #ff8c42, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 16px rgba(255, 107, 53, 0.3)' }}>
                            RM
                        </div>
                        <div>
                            <h1 className="glow-text" style={{ fontSize: '32px', margin: '0 0 8px 0' }}>Roberto Martín Gómez</h1>
                            <div style={{ display: 'flex', gap: '16px', color: '#aaa', fontSize: '14px', alignItems: 'center' }}>
                                <span style={{ color: '#fff', background: '#d6541f', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Entrenador Personal</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> Madrid, España</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={14} /> FitZone Center</span>
                            </div>
                        </div>
                    </div>
                    <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 size={16} /> Editar Perfil
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Clientes Activos</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>24</h2>
                    </div>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Años de Experiencia</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>8 años</h2>
                    </div>
                    <div style={{ background: '#1c1c1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Sesiones este Mes</p>
                        <h2 style={{ fontSize: '28px', color: '#fff', margin: 0 }}>87</h2>
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
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>Roberto Martín Gómez</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Email</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>roberto.martin@gymtrack.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Teléfono</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>+34 687 543 210</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Fecha de Nacimiento</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>22 de Julio, 1988</span>
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
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>Fuerza y Acondicionamiento</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Certificación Principal</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>NSCA-CPT</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Horario de Trabajo</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>L-V 7:00-21:00, S 9:00-14:00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Idiomas</span>
                                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>Español, Inglés</span>
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
