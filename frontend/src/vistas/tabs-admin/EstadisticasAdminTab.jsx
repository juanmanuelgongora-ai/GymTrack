import React from 'react';

const EstadisticasAdminTab = () => {
    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 className="glow-text" style={{ fontSize: '3rem', margin: '20px 0 40px' }}>Estadísticas</h1>

            {/* KPI Cards Placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {[
                    { label: 'Usuarios Activos', value: '248', trend: '+12% este mes', icon: '👥' },
                    { label: 'Nuevos Registros', value: '32', trend: 'Este mes', icon: '📈' },
                    { label: 'Ingresos', value: '€18.5k', trend: '+8% vs mes ant.', icon: '💰' },
                    { label: 'Asistencia', value: '78%', trend: 'Promedio semanal', icon: '⚡' }
                ].map((kpi, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ fontSize: '24px', background: 'rgba(255,140,66,0.1)', padding: '12px', borderRadius: '12px' }}>{kpi.icon}</div>
                            <div>
                                <p style={{ color: '#888', fontSize: '14px', marginBottom: '4px' }}>{kpi.label}</p>
                                <h2 style={{ fontSize: '28px', margin: 0 }}>{kpi.value}</h2>
                                <p style={{ color: '#2ecc71', fontSize: '12px', marginTop: '4px' }}>{kpi.trend}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid Placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Ingresos Mensuales */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Ingresos Mensuales</h3>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Evolución últimos 6 meses</p>
                    <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px' }}>
                        {[
                            { month: 'Oct', h: 40 }, { month: 'Nov', h: 60 }, { month: 'Dic', h: 50 },
                            { month: 'Ene', h: 70 }, { month: 'Feb', h: 80 }, { month: 'Mar', h: 90 }
                        ].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', width: '40px' }}>
                                <div style={{ height: `${d.h}%`, background: 'var(--primary-gradient)', borderRadius: '4px 4px 0 0', margin: '0 auto' }}></div>
                                <p style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>{d.month}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usuarios Activos */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Usuarios Activos</h3>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Crecimiento de miembros</p>
                    <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                            <polyline
                                fill="rgba(46, 204, 113, 0.1)"
                                stroke="#2ecc71"
                                strokeWidth="3"
                                points="0,150 100,140 200,120 300,100 400,90 500,80"
                                transform="scale(1, 1)"
                            />
                        </svg>
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '60%', background: 'linear-gradient(to top, rgba(46, 204, 113, 0.1), transparent)' }}></div>
                    </div>
                </div>

                {/* Asistencia Semanal */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Asistencia Semanal</h3>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Promedio de visitas por día</p>
                    <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px' }}>
                        {[
                            { day: 'L', h: 60, active: false }, { day: 'M', h: 70, active: false }, { day: 'M', h: 85, active: true },
                            { day: 'J', h: 75, active: false }, { day: 'V', h: 90, active: true }, { day: 'S', h: 80, active: true }, { day: 'D', h: 40, active: false }
                        ].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', width: '30px' }}>
                                <div style={{ height: `${d.h}%`, background: d.active ? 'var(--primary-gradient)' : '#555', borderRadius: '4px', margin: '0 auto' }}></div>
                                <p style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>{d.day}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tipos de Entrenamiento */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Tipos de Entrenamiento</h3>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Distribución por actividad</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', border: '25px solid #2c2c2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '25px solid #ff8c42', borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(45deg)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>4</p>
                                <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Categorías</p>
                            </div>
                            {/* Labels Placeholder */}
                            <div style={{ position: 'absolute', top: -30, right: -40, fontSize: '11px', color: '#ff8c42' }}>Cardio: 35%</div>
                            <div style={{ position: 'absolute', left: -40, top: 40, fontSize: '11px', color: '#888' }}>Pesas: 30%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasAdminTab;
