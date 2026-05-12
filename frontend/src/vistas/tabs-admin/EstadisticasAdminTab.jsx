import React from 'react';

const EstadisticasAdminTab = () => {
    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: '0 0 48px 0' }}>Estadísticas</h1>

            {/* KPI Cards Placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
                {[
                    { label: 'Usuarios Activos', value: '248', trend: '+12% este mes', icon: '👥' },
                    { label: 'Nuevos Registros', value: '32', trend: 'Este mes', icon: '📈' },
                    { label: 'Ingresos', value: '$4.2M', trend: '+8% vs mes ant.', icon: '💰' },
                    { label: 'Asistencia', value: '78%', trend: 'Promedio semanal', icon: '⚡' }
                ].map((kpi, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ fontSize: '32px', background: 'rgba(255,140,66,0.1)', padding: '16px', borderRadius: '16px' }}>{kpi.icon}</div>
                            <div>
                                <p style={{ color: '#888', fontSize: '15px', marginBottom: '6px' }}>{kpi.label}</p>
                                <h2 style={{ fontSize: '36px', margin: 0, fontWeight: '800' }}>{kpi.value}</h2>
                                <p style={{ color: '#2ecc71', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>{kpi.trend}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid Placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Ingresos Mensuales */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: '700' }}>Ingresos Mensuales</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Evolución últimos 6 meses</p>
                    <div style={{ width: '100%', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '32px' }}>
                        {[
                            { month: 'Oct', h: 40 }, { month: 'Nov', h: 60 }, { month: 'Dic', h: 50 },
                            { month: 'Ene', h: 70 }, { month: 'Feb', h: 80 }, { month: 'Mar', h: 90 }
                        ].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', width: '50px' }}>
                                <div style={{ height: `${d.h}%`, background: 'var(--primary-gradient)', borderRadius: '6px 6px 0 0', margin: '0 auto', boxShadow: '0 4px 15px rgba(255,140,66,0.2)' }}></div>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', fontWeight: '600' }}>{d.month}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usuarios Activos */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: '700' }}>Usuarios Activos</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Crecimiento de miembros</p>
                    <div style={{ width: '100%', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                        <svg width="100%" height="100%" viewBox="0 0 500 240" preserveAspectRatio="none" style={{ position: 'absolute' }}>
                            <polyline
                                fill="rgba(46, 204, 113, 0.1)"
                                stroke="#2ecc71"
                                strokeWidth="4"
                                points="0,200 100,180 200,140 300,100 400,80 500,60"
                            />
                        </svg>
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(46, 204, 113, 0.05), transparent)' }}></div>
                    </div>
                </div>

                {/* Asistencia Semanal */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: '700' }}>Asistencia Semanal</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Promedio de visitas por día</p>
                    <div style={{ width: '100%', height: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '32px' }}>
                        {[
                            { day: 'L', h: 60, active: false }, { day: 'M', h: 70, active: false }, { day: 'M', h: 85, active: true },
                            { day: 'J', h: 75, active: false }, { day: 'V', h: 90, active: true }, { day: 'S', h: 80, active: true }, { day: 'D', h: 40, active: false }
                        ].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', width: '40px' }}>
                                <div style={{ height: `${d.h}%`, background: d.active ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.1)', borderRadius: '6px', margin: '0 auto', boxShadow: d.active ? '0 4px 15px rgba(255,140,66,0.2)' : 'none' }}></div>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', fontWeight: '600' }}>{d.day}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tipos de Entrenamiento */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: '700' }}>Tipos de Entrenamiento</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Distribución por actividad</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <div style={{ position: 'relative', width: '220px', height: '220px', borderRadius: '50%', border: '30px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '30px solid #ff8c42', borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 10px rgba(255,140,66,0.4))' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>4</p>
                                <p style={{ fontSize: '12px', color: '#888', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>Categorías</p>
                            </div>
                            {/* Labels Placeholder */}
                            <div style={{ position: 'absolute', top: -30, right: -50, fontSize: '13px', color: '#ff8c42', fontWeight: '700' }}>Cardio: 35%</div>
                            <div style={{ position: 'absolute', left: -50, top: 40, fontSize: '13px', color: '#888', fontWeight: '700' }}>Pesas: 30%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasAdminTab;
