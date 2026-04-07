import React from 'react';
import { Flame, RefreshCcw, Users, Clock, TrendingUp, Activity, Star, PieChart } from 'lucide-react';

const EstadisticasTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: '10px' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Estadísticas</h2>
            <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Seguimiento de tu desempeño como entrenador y progreso de tus clientes</p>
        </div>

        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[{ i: Flame, label: 'Racha Actual', sub: 'Seguida', val: '12', unit: 'días', c: '#ff6b35' },
            { i: RefreshCcw, label: 'Sesiones este Mes', sub: 'Sesiones', val: '87', unit: 'Sesiones', c: '#ff8c42' },
            { i: Users, label: 'Clientes Nuevos', sub: '+5 este mes', val: '+5', unit: 'Clientes', c: '#22c55e' },
            { i: Clock, label: 'Tiempo Total', sub: 'Este mes', val: '174', unit: 'h', c: '#cf5c2a' }
            ].map((card, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <card.i color={card.c} size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', color: '#ccc', fontSize: '13px' }}>{card.label}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '11px' }}>{card.sub}</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: card.c }}>{card.val}</span>
                        <span style={{ color: '#aaa', fontSize: '12px', marginLeft: '6px' }}>{card.unit}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Progreso Promedio de Clientes</h3>
                        <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Últimos 6 Meses</p>
                    </div>
                    <TrendingUp color="#ff6b35" size={20} />
                </div>
                {/* Chart Placeholder */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    <span style={{ padding: '6px 12px', border: '1px solid #ff6b35', borderRadius: '8px', color: '#ff6b35', fontSize: '12px', background: 'rgba(255,107,53,0.1)' }}>Peso Perdido</span>
                    <span style={{ padding: '6px 12px', border: '1px solid #333', borderRadius: '8px', color: '#aaa', fontSize: '12px' }}>Fuerza Ganada</span>
                    <span style={{ padding: '6px 12px', border: '1px solid #333', borderRadius: '8px', color: '#aaa', fontSize: '12px' }}>Masa Muscular</span>
                </div>
                <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative', borderBottom: '1px solid #444', borderLeft: '1px solid #444', padding: '10px 0 0 10px' }}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <polyline fill="none" stroke="#ff6b35" strokeWidth="2" points="0,40 20,40 40,30 60,35 80,25 100,20" />
                        <circle cx="0" cy="40" r="3" fill="#ff6b35" />
                        <circle cx="20" cy="40" r="3" fill="#ff6b35" />
                        <circle cx="40" cy="30" r="3" fill="#ff6b35" />
                        <circle cx="60" cy="35" r="3" fill="#ff6b35" />
                        <circle cx="80" cy="25" r="3" fill="#ff6b35" />
                        <circle cx="100" cy="20" r="3" fill="#ff6b35" />
                    </svg>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Actividad Semanal</h3>
                        <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Esta semana</p>
                    </div>
                    <Activity color="#ff6b35" size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', borderBottom: '1px solid #444', borderLeft: '1px solid #444', padding: '10px 10px 0 20px', gap: '8px' }}>
                    {[{ h: '60%', d: 'L' }, { h: '0%', d: 'M' }, { h: '70%', d: 'X' }, { h: '0%', d: 'J' }, { h: '90%', d: 'V' }, { h: '80%', d: 'S' }, { h: '0%', d: 'D' }].map((b, i) => (
                        <div key={i} style={{ width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: b.h, background: '#ff6b35', borderRadius: '4px 4px 0 0' }}></div>
                            <span style={{ marginTop: '10px', fontSize: '12px', color: '#aaa', position: 'absolute', bottom: '6px' }}>{b.d}</span>
                        </div>
                    ))}
                </div>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', margin: '15px 0 0 0' }}><b>5/7</b> días trabajados</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Satisfacción de Clientes</h3>
                        <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Últimos 30 días</p>
                    </div>
                    <Star color="#ff6b35" size={20} />
                </div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#ff6b35', lineHeight: '1' }}>4.8</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '15px 0' }}>
                        <Star fill="#ffb703" stroke="none" size={20} />
                        <Star fill="#ffb703" stroke="none" size={20} />
                        <Star fill="#ffb703" stroke="none" size={20} />
                        <Star fill="#ffb703" stroke="none" size={20} />
                        <Star fill="#ffb703" stroke="#333" size={20} />
                    </div>
                    <p style={{ color: '#aaa', fontSize: '12px' }}>Basado en 24 valoraciones</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <div style={{ border: '1px solid #333', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#aaa', display: 'block' }}>Excelente</span>
                        <b style={{ fontSize: '20px', color: '#fff' }}>20</b>
                    </div>
                    <div style={{ border: '1px solid #333', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#aaa', display: 'block' }}>Bueno</span>
                        <b style={{ fontSize: '20px', color: '#fff' }}>3</b>
                    </div>
                    <div style={{ border: '1px solid #333', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#aaa', display: 'block' }}>Regular</span>
                        <b style={{ fontSize: '20px', color: '#fff' }}>1</b>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Tipos de Entrenamiento</h3>
                        <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Distribución este mes</p>
                    </div>
                    <PieChart color="#ffb703" size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ccc' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff4d4d' }}></span> Fuerza <b style={{ marginLeft: '20px', color: '#fff' }}>30%</b></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ccc' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></span> Cardio <b style={{ marginLeft: '20px', color: '#fff' }}>28%</b></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ccc' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }}></span> Funcional <b style={{ marginLeft: '20px', color: '#fff' }}>20%</b></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ccc' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#a855f7' }}></span> Movilidad <b style={{ marginLeft: '20px', color: '#fff' }}>15%</b></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ccc' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#64748b' }}></span> Otros <b style={{ marginLeft: '20px', color: '#fff' }}>7%</b></div>
                    </div>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '25px solid transparent', borderTopColor: '#ff4d4d', borderRightColor: '#22c55e', borderBottomColor: '#3b82f6', borderLeftColor: '#a855f7', transform: 'rotate(45deg)' }}></div>
                </div>
            </div>
        </div>
    </div>
);

export default EstadisticasTab;
