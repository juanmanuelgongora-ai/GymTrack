import React, { useState } from 'react';
import {
    Activity,
    Users,
    Calendar,
    DollarSign,
    Bell,
    LogOut,
    User as UserIcon,
    MapPin,
    Clock
} from 'lucide-react';
import EstadisticasAdminTab from './tabs-admin/EstadisticasAdminTab';
import MiembrosAdminTab from './tabs-admin/MiembrosAdminTab';
import ClasesAdminTab from './tabs-admin/ClasesAdminTab';
import IngresosAdminTab from './tabs-admin/IngresosAdminTab';

const PanelAdminGYMTRACK = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('estadisticas');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'estadisticas': return <EstadisticasAdminTab />;
            case 'miembros': return <MiembrosAdminTab />;
            case 'clases': return <ClasesAdminTab />;
            case 'ingresos': return <IngresosAdminTab />;
            default: return <EstadisticasAdminTab />;
        }
    };

    const tabs = [
        { id: 'estadisticas', label: 'Estadísticas', icon: <Activity size={20} /> },
        { id: 'miembros', label: 'Miembros', icon: <Users size={20} /> },
        { id: 'clases', label: 'Clases', icon: <Calendar size={20} /> },
        { id: 'ingresos', label: 'Ingresos', icon: <DollarSign size={20} /> },
    ];

    const currentDate = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <div style={{
            backgroundColor: '#0d0d0d',
            minHeight: '100vh',
            color: '#fff',
            fontFamily: 'var(--font-main)',
            padding: '40px'
        }}>
            {/* Header */}
            <div className="glass-panel" style={{
                padding: '32px',
                borderRadius: '24px',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--primary-gradient)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--primary-glow)'
                    }}>
                        <UserIcon size={40} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Panel de Administración</h1>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px' }}>
                            <span style={{
                                background: 'rgba(255,140,66,0.2)',
                                color: '#ff8c42',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontWeight: '600'
                            }}>Admin</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                                <MapPin size={14} /> FitZone Center
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                                <Clock size={14} /> {currentDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <div className="glass-panel" style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Bell size={24} />
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#ff4d4d',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            border: '2px solid #0d0d0d'
                        }}>3</div>
                    </div>
                    <div
                        onClick={onLogout}
                        className="glass-panel"
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255,77,77,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#ff4d4d',
                            border: '1px solid rgba(255,77,77,0.2)'
                        }}
                    >
                        <LogOut size={24} />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '40px'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 32px',
                            borderRadius: '16px',
                            border: activeTab === tab.id ? '1px solid #ff8c42' : '1px solid rgba(255,255,255,0.05)',
                            background: activeTab === tab.id ? 'rgba(255,140,66,0.1)' : 'rgba(255,255,255,0.02)',
                            color: activeTab === tab.id ? '#fff' : '#888',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <div style={{ color: activeTab === tab.id ? '#ff8c42' : '#888' }}>
                            {tab.icon}
                        </div>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ width: '100%' }}>
                {renderTabContent()}
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px', color: '#444', fontSize: '13px' }}>
                © 2026 GYM TRACK Admin Panel. Todos los derechos reservados.
            </div>
        </div >
    );
};

export default PanelAdminGYMTRACK;
