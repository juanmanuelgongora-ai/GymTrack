import React, { useState, useEffect } from 'react';
import {
    Plus,
    Calendar,
    Clock,
    Users,
    CheckCircle,
    MoreVertical,
    Filter,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    X,
    Loader2
} from 'lucide-react';

const ClasesAdminTab = () => {
    const [clases, setClases] = useState([]);
    const [entrenadores, setEntrenadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newClase, setNewClase] = useState({
        nombre: '',
        instructor_id: '',
        sala: 'Sala A',
        horario_inicio: '08:00',
        horario_fin: '09:00',
        capacidad_max: 20,
        color: '#ff8c42'
    });

    const token = localStorage.getItem('gymtrack_token');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clasesRes, usersRes] = await Promise.all([
                fetch('/api/clases', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (clasesRes.ok) {
                const clasesData = await clasesRes.json();
                setClases(clasesData);
            }

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setEntrenadores(usersData.filter(u => u.rol === 'entrenador'));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateClase = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/clases', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClase)
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
                setNewClase({
                    nombre: '',
                    instructor_id: '',
                    sala: 'Sala A',
                    horario_inicio: '08:00',
                    horario_fin: '09:00',
                    capacidad_max: 20,
                    color: '#ff8c42'
                });
            }
        } catch (error) {
            console.error("Error creating class:", error);
        }
    };

    const stats = [
        { label: 'Clases Hoy', value: clases.length.toString(), icon: <BookOpen size={20} /> },
        { label: 'Asistencias', value: (clases.length * 12).toString(), icon: <Users size={20} /> }, // Mocked multiplier
        { label: 'Salas Activas', value: new Set(clases.map(c => c.sala)).size.toString(), icon: <CheckCircle size={20} /> },
        { label: 'Ocupación', value: '75%', icon: <Calendar size={20} /> },
    ];

    const salas = [
        { name: 'Sala A', status: 'Disponible', usage: 0 },
        { name: 'Sala Zen', status: 'Disponible', usage: 0 },
        { name: 'Sala Ciclo', status: 'Disponible', usage: 0 },
        { name: 'Zona Pesas', status: 'Disponible', usage: 0 },
    ].map(sala => {
        const inUse = clases.some(c => c.sala === sala.name && c.estado === 'en progreso');
        const scheduled = clases.some(c => c.sala === sala.name && c.estado === 'programada');
        return {
            ...sala,
            status: inUse ? 'Ocupada' : (scheduled ? 'Reservada' : 'Disponible'),
            usage: inUse ? 100 : (scheduled ? 40 : 0)
        };
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#ff8c42' }}>
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', position: 'relative' }}>
            {/* Modal Nueva Clase */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,140,66,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 className="glow-text">Nueva Clase</h2>
                            <X size={24} cursor="pointer" onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleCreateClase} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Nombre de la Clase</label>
                                <input
                                    type="text"
                                    className="glass-input"
                                    value={newClase.nombre}
                                    onChange={e => setNewClase({ ...newClase, nombre: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Instructor</label>
                                <select
                                    className="glass-input"
                                    value={newClase.instructor_id}
                                    onChange={e => setNewClase({ ...newClase, instructor_id: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                >
                                    <option value="">Seleccionar Entrenador</option>
                                    {entrenadores.map(e => (
                                        <option key={e.id} value={e.id} style={{ background: '#111' }}>{e.nombre} {e.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Horario Inicio</label>
                                    <input
                                        type="time"
                                        className="glass-input"
                                        value={newClase.horario_inicio}
                                        onChange={e => setNewClase({ ...newClase, horario_inicio: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Horario Fin</label>
                                    <input
                                        type="time"
                                        className="glass-input"
                                        value={newClase.horario_fin}
                                        onChange={e => setNewClase({ ...newClase, horario_fin: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Sala</label>
                                    <select
                                        className="glass-input"
                                        value={newClase.sala}
                                        onChange={e => setNewClase({ ...newClase, sala: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    >
                                        <option value="Sala A" style={{ background: '#111' }}>Sala A</option>
                                        <option value="Sala Zen" style={{ background: '#111' }}>Sala Zen</option>
                                        <option value="Sala Ciclo" style={{ background: '#111' }}>Sala Ciclo</option>
                                        <option value="Zona Pesas" style={{ background: '#111' }}>Zona Pesas</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' }}>Capacidad Max</label>
                                    <input
                                        type="number"
                                        className="glass-input"
                                        value={newClase.capacidad_max}
                                        onChange={e => setNewClase({ ...newClase, capacidad_max: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn pulse-glow" style={{ marginTop: '20px' }}>
                                Guardar Clase
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Clases</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)', fontWeight: '600' }} onClick={fetchData}>
                        <Filter size={20} /> Actualizar
                    </button>
                    <button onClick={() => setShowModal(true)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 32px',
                        borderRadius: '16px',
                        background: 'var(--primary-gradient)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255,140,66,0.3)'
                    }}>
                        <Plus size={22} /> Nueva Clase
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '48px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ color: '#ff8c42', background: 'rgba(255,140,66,0.1)', padding: '16px', borderRadius: '16px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: '#888', fontSize: '14px', margin: '0', fontWeight: '500' }}>{stat.label}</p>
                                <h2 style={{ fontSize: '32px', margin: '6px 0 0 0', fontWeight: '800' }}>{stat.value}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
                {/* Class List */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Clases de Hoy</h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#888', fontSize: '15px' }}>
                            <ChevronLeft size={24} cursor="pointer" />
                            <span style={{ color: '#fff', fontWeight: '700' }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                            <ChevronRight size={24} cursor="pointer" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {clases.length > 0 ? clases.map((clase) => (
                            <div key={clase.id} className="glass-panel" style={{
                                padding: '24px',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.01)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderLeft: `5px solid ${clase.color || '#ff8c42'}`,
                                transition: 'transform 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: `${clase.color || '#ff8c42'}15`,
                                        color: clase.color || '#ff8c42',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700' }}>{clase.nombre}</h4>
                                        <div style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '14px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {clase.instructor ? `${clase.instructor.nombre} ${clase.instructor.apellido}` : 'Sin instructor'}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {clase.horario_inicio.substring(0, 5)} - {clase.horario_fin.substring(0, 5)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>0/{clase.capacidad_max}</p>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '6px 14px',
                                        borderRadius: '100px',
                                        background: clase.estado === 'en progreso' ? 'rgba(255,140,66,0.1)' : (clase.estado === 'completa' ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)'),
                                        color: clase.estado === 'en progreso' ? '#ff8c42' : (clase.estado === 'completa' ? '#e74c3c' : '#2ecc71'),
                                        fontWeight: '700',
                                        textTransform: 'capitalize'
                                    }}>{clase.estado}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No hay clases programadas para hoy.</div>
                        )}
                    </div>
                </div>

                {/* Side Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '700' }}>Disponibilidad de Salas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {salas.map((sala, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ fontWeight: '700' }}>{sala.name}</span>
                                        <span style={{ color: sala.usage > 70 ? '#ff8c42' : '#2ecc71', fontWeight: '600' }}>{sala.status}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${sala.usage}%`,
                                            height: '100%',
                                            background: sala.usage > 90 ? '#ff4d4d' : (sala.usage > 60 ? '#ff8c42' : '#2ecc71'),
                                            borderRadius: '10px',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#ff8c42' }}>Capacidad General</h3>
                            <p style={{ margin: 0, fontSize: '48px', fontWeight: '900', color: '#fff' }}>
                                {Math.round((clases.filter(c => c.estado === 'en progreso').length / 4) * 100)}%
                            </p>
                            <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#aaa', lineHeight: '1.5' }}>El porcentaje se basa en las salas actualmente ocupadas con clases en curso.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesAdminTab;
