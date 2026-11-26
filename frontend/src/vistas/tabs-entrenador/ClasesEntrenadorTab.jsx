import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Users,
    Play,
    CheckCircle,
    Loader2,
    RefreshCw,
    MapPin
} from 'lucide-react';

const ClasesEntrenadorTab = () => {
    const [clases, setClases] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('gymtrack_token');

    const fetchMyClasses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/clases', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setClases(data);
            }
        } catch (error) {
            console.error("Error fetching my classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/clases/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: newStatus })
            });
            if (res.ok) {
                fetchMyClasses();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#ff6b35' }}>
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="glow-text">Mis Clases</h1>
                    <p style={{ color: '#888' }}>Gestiona tus sesiones grupales y supervisa el aforo.</p>
                </div>
                <button
                    onClick={fetchMyClasses}
                    style={{ padding: '10px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <RefreshCw size={18} /> Actualizar
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {clases.length > 0 ? clases.map((clase) => (
                    <div key={clase.id} className="glass-panel" style={{
                        padding: '30px',
                        borderRadius: '24px',
                        borderLeft: `6px solid ${clase.color || '#ff6b35'}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '100px',
                                background: 'rgba(255,255,255,0.05)',
                                fontSize: '12px',
                                color: '#aaa',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                ID: {clase.id}
                            </span>
                            <span style={{
                                fontSize: '12px',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                background: clase.estado === 'en progreso' ? 'rgba(255,107,53,0.1)' : (clase.estado === 'completa' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)'),
                                color: clase.estado === 'en progreso' ? '#ff6b35' : (clase.estado === 'completa' ? '#22c55e' : '#888'),
                                fontWeight: '700',
                                textTransform: 'capitalize'
                            }}>
                                {clase.estado}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '22px', marginBottom: '15px', color: 'white' }}>{clase.nombre}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa' }}>
                                <Clock size={16} /> <span>{clase.horario_inicio.substring(0, 5)} - {clase.horario_fin.substring(0, 5)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa' }}>
                                <MapPin size={16} /> <span>{clase.sala}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa' }}>
                                <Users size={16} /> <span>Capacidad: {clase.capacidad_max} alumnos</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {clase.estado === 'programada' && (
                                <button
                                    onClick={() => handleUpdateStatus(clase.id, 'en progreso')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'var(--primary-gradient)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Play size={18} fill="white" /> Iniciar Clase
                                </button>
                            )}
                            {clase.estado === 'en progreso' && (
                                <button
                                    onClick={() => handleUpdateStatus(clase.id, 'completa')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'rgba(34,197,94,0.1)',
                                        color: '#22c55e',
                                        border: '1px solid rgba(34,197,94,0.3)',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CheckCircle size={18} /> Finalizar Clase
                                </button>
                            )}
                            {clase.estado === 'completa' && (
                                <div style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.02)',
                                    color: '#555',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    Sesión Finalizada
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1', color: '#666' }}>
                        <Calendar size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <p>No tienes clases asignadas para hoy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClasesEntrenadorTab;
