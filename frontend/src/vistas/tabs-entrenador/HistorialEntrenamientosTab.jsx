import React, { useState } from 'react';
import { Activity, Clock, Target, CalendarDays, TrendingUp, CheckCircle2, User, Search } from 'lucide-react';

const HistorialEntrenamientosTab = () => {
    const [selectedClient, setSelectedClient] = useState(1);

    const clientesMock = [
        { id: 1, name: 'Carlos Mendoza', avatarColor: '#3b82f6' },
        { id: 2, name: 'Laura Gómez', avatarColor: '#a855f7' },
        { id: 3, name: 'Andrés Felipe', avatarColor: '#22c55e' },
        { id: 4, name: 'Valentina Rojas', avatarColor: '#ef4444' }
    ];

    // Diferentes datos simulados por cliente para mostrar reactividad
    const historialData = {
        1: {
            asistencia: 83, diasActivos: 5, diasPlanificados: 6, minutosTotales: 340,
            dias: [
                { day: 'Lun', height: '40%', min: 45 }, { day: 'Mar', height: '60%', min: 60 },
                { day: 'Mié', height: '0%', min: 0 }, { day: 'Jue', height: '50%', min: 50 },
                { day: 'Vie', height: '65%', min: 65 }, { day: 'Sáb', height: '90%', min: 120 },
                { day: 'Dom', height: '0%', min: 0 }
            ]
        },
        2: {
            asistencia: 100, diasActivos: 4, diasPlanificados: 4, minutosTotales: 210,
            dias: [
                { day: 'Lun', height: '50%', min: 50 }, { day: 'Mar', height: '0%', min: 0 },
                { day: 'Mié', height: '60%', min: 60 }, { day: 'Jue', height: '0%', min: 0 },
                { day: 'Vie', height: '50%', min: 50 }, { day: 'Sáb', height: '50%', min: 50 },
                { day: 'Dom', height: '0%', min: 0 }
            ]
        },
        3: {
            asistencia: 40, diasActivos: 2, diasPlanificados: 5, minutosTotales: 90,
            dias: [
                { day: 'Lun', height: '45%', min: 45 }, { day: 'Mar', height: '0%', min: 0 },
                { day: 'Mié', height: '0%', min: 0 }, { day: 'Jue', height: '45%', min: 45 },
                { day: 'Vie', height: '0%', min: 0 }, { day: 'Sáb', height: '0%', min: 0 },
                { day: 'Dom', height: '0%', min: 0 }
            ]
        },
        4: {
            asistencia: 90, diasActivos: 6, diasPlanificados: 6, minutosTotales: 420,
            dias: [
                { day: 'Lun', height: '70%', min: 70 }, { day: 'Mar', height: '70%', min: 70 },
                { day: 'Mié', height: '65%', min: 65 }, { day: 'Jue', height: '0%', min: 0 },
                { day: 'Vie', height: '80%', min: 80 }, { day: 'Sáb', height: '90%', min: 90 },
                { day: 'Dom', height: '45%', min: 45 }
            ]
        }
    };

    const currentData = historialData[selectedClient];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Historial de Entrenamientos</h2>
                    <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Visualiza la actividad y rendimiento de tus clientes</p>
                </div>
                
                {/* Selector de Clientes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Search size={16} color="#aaa" />
                    <select 
                        value={selectedClient} 
                        onChange={(e) => setSelectedClient(parseInt(e.target.value))}
                        style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '15px', cursor: 'pointer' }}
                    >
                        {clientesMock.map(c => (
                            <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Metricas Resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderLeft: '4px solid #ff6b35' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '10px' }}>
                            <TrendingUp color="#ff6b35" size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Porcentaje de Asistencia</p>
                            <h3 style={{ color: '#fff', fontSize: '28px', margin: 0 }}>{currentData.asistencia}%</h3>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${currentData.asistencia}%`, height: '100%', background: 'linear-gradient(90deg, #ff6b35, #ff8c42)', borderRadius: '3px' }}></div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderLeft: '4px solid #22c55e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px' }}>
                            <CheckCircle2 color="#22c55e" size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Días Activos / Planificados</p>
                            <h3 style={{ color: '#fff', fontSize: '28px', margin: 0 }}>{currentData.diasActivos} <span style={{ fontSize: '18px', color: '#666' }}>/ {currentData.diasPlanificados}</span></h3>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(currentData.diasActivos / currentData.diasPlanificados) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: '3px' }}></div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                            <Clock color="#3b82f6" size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Minutos Totales Entrenados</p>
                            <h3 style={{ color: '#fff', fontSize: '28px', margin: 0 }}>{currentData.minutosTotales} <span style={{ fontSize: '16px', color: '#666' }}>min</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grafico de Barras - Actividad ultimos 7 dias */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '8px' }}>
                            <CalendarDays color="#ff6b35" size={20} />
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Actividad de los últimos 7 días</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ff6b35' }}></span>
                        <span style={{ color: '#aaa', fontSize: '12px' }}>Minutos de entrenamiento</span>
                    </div>
                </div>

                <div style={{ 
                    position: 'relative', 
                    height: '250px', 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginTop: '20px'
                }}>
                    {/* Lineas horizontales de fondo */}
                    <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', bottom: '50%' }}></div>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', bottom: '100%' }}></div>
                    
                    {currentData.dias.map((d, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', zIndex: 2 }}>
                            {/* Tooltip on hover simulation */}
                            {d.min > 0 && (
                                <div style={{ 
                                    marginBottom: '8px', 
                                    background: 'rgba(0,0,0,0.6)', 
                                    color: '#fff', 
                                    fontSize: '12px', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    opacity: 0.9
                                }}>
                                    {d.min}m
                                </div>
                            )}
                            
                            {/* Barra */}
                            <div style={{ 
                                width: '100%', 
                                height: d.height, 
                                background: d.min > 0 ? 'linear-gradient(to top, #ff6b35, #ff8c42)' : 'rgba(255,255,255,0.05)', 
                                borderRadius: '6px 6px 0 0',
                                transition: 'height 0.4s ease',
                                boxShadow: d.min > 0 ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                             }}></div>
                             
                             {/* Etiqueta de dia */}
                            <span style={{ 
                                marginTop: '15px', 
                                fontSize: '13px', 
                                color: d.min > 0 ? '#fff' : '#666',
                                fontWeight: d.min > 0 ? '600' : 'normal'
                            }}>
                                {d.day}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HistorialEntrenamientosTab;
