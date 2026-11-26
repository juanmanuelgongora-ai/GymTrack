import React, { useState, useEffect } from 'react';
import { Flame, RefreshCcw, Users, Clock, TrendingUp, Activity, Star, PieChart } from 'lucide-react';

const EstadisticasTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/entrenador/estadisticas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas');
                }
                
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error al obtener estadísticas del entrenador", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div style={{ color: '#ff6b35', fontSize: '18px' }}>Cargando estadísticas...</div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { i: Flame, label: 'Racha Actual', sub: 'Seguida', val: stats.racha_dias, unit: 'días', c: '#ff6b35' },
        { i: RefreshCcw, label: 'Sesiones este Mes', sub: 'Impartidas', val: stats.sesiones_mes, unit: 'Sesiones', c: '#ff8c42' },
        { i: Users, label: 'Nuevos Clientes', sub: 'Captados este mes', val: `+${stats.nuevos_clientes}`, unit: 'Clientes', c: '#22c55e' },
        { i: Clock, label: 'Tiempo Total', sub: 'Horas trabajadas', val: stats.horas_totales, unit: 'h', c: '#cf5c2a' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Estadísticas de Desempeño</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Métricas de tu rendimiento profesional y distribución de trabajo</p>
            </div>

            {/* Top Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {statCards.map((card, idx) => (
                    <div key={idx} className="glass-panel hover-scale" style={{ padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,107,53,0.2)', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ padding: '10px', background: `rgba(${parseInt(card.c.slice(1,3), 16)},${parseInt(card.c.slice(3,5), 16)},${parseInt(card.c.slice(5,7), 16)},0.1)`, borderRadius: '50%', border: `1px solid ${card.c}40` }}>
                                <card.i color={card.c} size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#eee', fontSize: '13px' }}>{card.label}</h4>
                                <p style={{ margin: 0, color: '#888', fontSize: '11px' }}>{card.sub}</p>
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
                
                {/* Actividad Semanal */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Actividad Semanal</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Horas o sesiones impartidas</p>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,107,53,0.1)', borderRadius: '8px' }}>
                            <Activity color="#ff6b35" size={20} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', borderBottom: '1px solid #444', borderLeft: '1px solid #444', padding: '10px 10px 0 20px', gap: '8px', position: 'relative' }}>
                        {/* Lineas guias */}
                        <div style={{ position:'absolute', top:'20%', left:0, width:'100%', height:'1px', background:'rgba(255,255,255,0.05)' }}></div>
                        <div style={{ position:'absolute', top:'50%', left:0, width:'100%', height:'1px', background:'rgba(255,255,255,0.05)' }}></div>
                        <div style={{ position:'absolute', top:'80%', left:0, width:'100%', height:'1px', background:'rgba(255,255,255,0.05)' }}></div>
                        
                        {stats.actividad_semanal.map((b, i) => (
                            <div key={i} style={{ width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', height: '100%' }}>
                                <div style={{ width: '100%', height: `${b.h}%`, background: `linear-gradient(to top, #ff6b35, #ff8c42)`, borderRadius: '6px 6px 0 0', position: 'absolute', bottom: 0, transition: 'height 1s ease-out' }}></div>
                                <span style={{ marginTop: '10px', fontSize: '12px', color: '#aaa', position: 'absolute', bottom: '-25px' }}>{b.d}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', margin: '35px 0 0 0' }}>
                        <b>{stats.actividad_semanal.filter(d => d.h > 0).length}/7</b> días trabajados esta semana
                    </p>
                </div>

                {/* Satisfacción de Clientes */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Satisfacción de Clientes</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Basado en valoraciones recientes</p>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,183,3,0.1)', borderRadius: '8px' }}>
                            <Star color="#ffb703" size={20} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#ffb703', lineHeight: '1', textShadow: '0 0 20px rgba(255,183,3,0.3)' }}>
                            {stats.satisfaccion.promedio}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '15px 0' }}>
                            {[1,2,3,4,5].map(s => (
                                <Star key={s} fill={s <= Math.round(stats.satisfaccion.promedio) ? "#ffb703" : "none"} stroke={s <= Math.round(stats.satisfaccion.promedio) ? "none" : "#555"} size={24} />
                            ))}
                        </div>
                        <p style={{ color: '#aaa', fontSize: '13px' }}>Basado en {stats.satisfaccion.total_valoraciones} valoraciones</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '10px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Excelente</span>
                            <b style={{ fontSize: '20px', color: '#22c55e' }}>{stats.satisfaccion.desglose.excelente}</b>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Bueno</span>
                            <b style={{ fontSize: '20px', color: '#3b82f6' }}>{stats.satisfaccion.desglose.bueno}</b>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Regular</span>
                            <b style={{ fontSize: '20px', color: '#ff4d4d' }}>{stats.satisfaccion.desglose.regular}</b>
                        </div>
                    </div>
                </div>

                {/* Tipos de Entrenamiento */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', gridColumn: 'span 2', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', color: '#fff' }}>Distribución de Entrenamientos</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>Porcentaje de tipos de entrenamiento impartidos este mes</p>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,107,53,0.1)', borderRadius: '8px' }}>
                            <PieChart color="#ff6b35" size={20} />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '60%' }}>
                            {stats.tipos_entrenamiento.map((tipo, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                                    <span style={{ width: 14, height: 14, borderRadius: '4px', background: tipo.color, boxShadow: `0 0 8px ${tipo.color}80` }}></span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '13px', color: '#ccc' }}>{tipo.nombre}</span>
                                        <b style={{ color: '#fff', fontSize: '16px' }}>{tipo.porcentaje}%</b>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Pure CSS Donut Chart logic representation */}
                        <div style={{ 
                            width: '180px', height: '180px', borderRadius: '50%', position: 'relative',
                            background: `conic-gradient(
                                ${stats.tipos_entrenamiento[0]?.color} 0% ${stats.tipos_entrenamiento[0]?.porcentaje}%,
                                ${stats.tipos_entrenamiento[1]?.color} ${stats.tipos_entrenamiento[0]?.porcentaje}% ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje}%,
                                ${stats.tipos_entrenamiento[2]?.color} ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje}% ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje + stats.tipos_entrenamiento[2]?.porcentaje}%,
                                ${stats.tipos_entrenamiento[3]?.color} ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje + stats.tipos_entrenamiento[2]?.porcentaje}% ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje + stats.tipos_entrenamiento[2]?.porcentaje + stats.tipos_entrenamiento[3]?.porcentaje}%,
                                ${stats.tipos_entrenamiento[4]?.color} ${stats.tipos_entrenamiento[0]?.porcentaje + stats.tipos_entrenamiento[1]?.porcentaje + stats.tipos_entrenamiento[2]?.porcentaje + stats.tipos_entrenamiento[3]?.porcentaje}% 100%
                            )`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ width: '130px', height: '130px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <b style={{ fontSize: '24px', color: '#fff', display: 'block' }}>100%</b>
                                    <span style={{ fontSize: '11px', color: '#888' }}>Total Impartido</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EstadisticasTab;
