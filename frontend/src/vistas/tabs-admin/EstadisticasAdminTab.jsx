import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../logica/UserContext';
import { Users, TrendingUp, DollarSign, Zap, Loader2, ArrowUpRight } from 'lucide-react';

const EstadisticasAdminTab = () => {
    const { token } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch('/api/admin/estadisticas', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                const payload = await res.json();
                setData(payload);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading || !data) {
        return (
            <div className="tab-container flex-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="animate-spin mb-16" size={48} color="#ff8c42" />
                    <p className="text-secondary glow-text">Cargando Inteligencia de Negocio...</p>
                </div>
            </div>
        );
    }

    const { kpis, charts } = data;

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                <div>
                    <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Estadísticas</h1>
                    <p className="text-secondary" style={{ fontSize: '1.1rem', marginTop: '8px' }}>Panel de control y rendimiento global</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', color: '#888' }}>
                    Actualizado: Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
                {[
                    { label: 'Usuarios Activos', value: kpis.active_users, trend: `+${kpis.user_trend}% este mes`, icon: <Users size={24} />, color: '#3b82f6' },
                    { label: 'Nuevos Registros', value: kpis.new_registrations, trend: 'Este mes', icon: <TrendingUp size={24} />, color: '#a855f7' },
                    { label: 'Ingresos', value: `$${(kpis.income_month / 1000000).toFixed(1)}M`, trend: 'Monto total mes', icon: <DollarSign size={24} />, color: '#2ecc71' },
                    { label: 'Asistencia', value: `${kpis.attendance_avg}%`, trend: 'Promedio vs total', icon: <Zap size={24} />, color: '#ff8c42' }
                ].map((kpi, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${kpi.color}15, transparent 70%)` }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ color: kpi.color, background: `${kpi.color}15`, padding: '12px', borderRadius: '12px' }}>{kpi.icon}</div>
                            <ArrowUpRight size={16} color="#444" />
                        </div>
                        <div>
                            <p style={{ color: '#888', fontSize: '15px', marginBottom: '4px' }}>{kpi.label}</p>
                            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>{kpi.value}</h2>
                            <p style={{ color: kpi.color, fontSize: '13px', marginTop: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {kpi.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '32px' }}>
                {/* Ingresos Mensuales */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>Ingresos Mensuales</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>Evolución histórica de facturación</p>
                    <div style={{ width: '100%', height: '260px', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px' }}>
                        {charts.monthly_income.map((d, i) => {
                            const max = Math.max(...charts.monthly_income.map(x => x.amount)) || 1;
                            const h = (d.amount / max) * 100;
                            return (
                                <div key={i} style={{ textAlign: 'center', flex: 1, maxWidth: '60px' }}>
                                    <div style={{ height: `${Math.max(10, h)}%`, background: 'var(--primary-gradient)', borderRadius: '8px 8px 4px 4px', margin: '0 auto', boxShadow: '0 4px 20px rgba(255,140,66,0.15)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: -25, left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#ff8c42', fontWeight: 'bold' }}>
                                            ${(d.amount / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '16px', fontWeight: '700' }}>{d.month}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Usuarios Activos Growth */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>Crecimiento Miembros</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>Base de usuarios acumulada</p>
                    <div style={{ width: '100%', height: '260px', position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#2ecc71" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M ${charts.user_growth.map((d, i) => `${(i * 400) / 5},${200 - (d.count / Math.max(...charts.user_growth.map(x => x.count))) * 180}`).join(' L ')} L 400,200 L 0,200 Z`}
                                fill="url(#lineGrad)"
                            />
                            <path
                                d={`M ${charts.user_growth.map((d, i) => `${(i * 400) / 5},${200 - (d.count / Math.max(...charts.user_growth.map(x => x.count))) * 180}`).join(' L ')}`}
                                fill="none"
                                stroke="#2ecc71"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                            {charts.user_growth.map((d, i) => (
                                <span key={i} style={{ fontSize: '10px', color: '#666', fontWeight: '600' }}>{d.month}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Actividad Semanal */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>Monitor de Actividad</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>Sesiones de entrenamiento completadas</p>
                    <div style={{ width: '100%', height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                        {charts.weekly_activity.map((d, i) => {
                            const max = Math.max(...charts.weekly_activity.map(x => x.count)) || 1;
                            const h = (d.count / max) * 100;
                            return (
                                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                                    <div style={{ height: `${Math.max(10, h)}%`, background: h === 100 ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)', borderRadius: '6px', margin: '0 8px', position: 'relative', transition: 'height 0.3s ease' }}>
                                        {h > 0 && <div style={{ position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontSize: '10px', color: '#fff' }}>{d.count}</div>}
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#666', marginTop: '16px', fontWeight: '600' }}>{d.day}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Distribución de Sesiones */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>Distribución de Entrenamiento</h3>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>Popularidad por categoría</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', height: '240px' }}>
                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="30" />
                                <circle cx="100" cy="100" r="70" fill="none" stroke="#ff8c42" strokeWidth="30" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.45)} transform="rotate(-90 100 100)" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(255,140,66,0.3))' }} />
                                <circle cx="100" cy="100" r="70" fill="none" stroke="#2ecc71" strokeWidth="30" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.25)} transform="rotate(72 100 100)" strokeLinecap="round" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{charts.types.reduce((a, b) => a + b.value, 0)}</p>
                                <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>SESIONES</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {charts.types.map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: i === 0 ? '#ff8c42' : i === 1 ? '#2ecc71' : '#3b82f6' }}></div>
                                        <span style={{ fontSize: '14px', color: '#ccc' }}>{t.name}</span>
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{t.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasAdminTab;
