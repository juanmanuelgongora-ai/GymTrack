import React from 'react';
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
    BookOpen
} from 'lucide-react';

const ClasesAdminTab = () => {
    const todayClasses = [
        { id: 1, name: 'CrossFit Avanzado', instructor: 'Ana Martínez', time: '08:00 - 09:30', room: 'Sala A', capacity: '15/20', status: 'En progreso', color: '#ff8c42' },
        { id: 2, name: 'Yoga Restaurativo', instructor: 'Miguel Hernández', time: '10:00 - 11:00', room: 'Sala Zen', capacity: '12/15', status: 'Programada', color: '#2ecc71' },
        { id: 3, name: 'Spinning HIIT', instructor: 'Sergio Díaz', time: '12:00 - 13:00', room: 'Sala Ciclo', capacity: '20/25', status: 'Programada', color: '#3498db' },
        { id: 4, name: 'Power Lifting', instructor: 'Carlos Ruiz', time: '16:00 - 17:30', room: 'Zona Pesas', capacity: '8/10', status: 'Programada', color: '#f1c40f' },
        { id: 5, name: 'Zumba Fitness', instructor: 'Elena Rodríguez', time: '18:00 - 19:00', room: 'Sala Principal', capacity: '30/30', status: 'Completa', color: '#e74c3c' },
    ];

    const stats = [
        { label: 'Clases Hoy', value: '12', icon: <BookOpen size={20} /> },
        { label: 'Asistencias', value: '145', icon: <Users size={20} /> },
        { label: 'Salas Activas', value: '4', icon: <CheckCircle size={20} /> },
        { label: 'Ocupación', value: '82%', icon: <Calendar size={20} /> },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Clases</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)' }}>
                        <Filter size={18} /> Filtrar
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'var(--primary-gradient)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: 'var(--primary-glow)'
                    }}>
                        <Plus size={20} /> Nueva Clase
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: '#ff8c42', background: 'rgba(255,140,66,0.1)', padding: '10px', borderRadius: '12px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: '#888', fontSize: '13px', margin: '0' }}>{stat.label}</p>
                                <h2 style={{ fontSize: '24px', margin: '4px 0 0 0' }}>{stat.value}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                {/* Class List */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Clases de Hoy</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#666', fontSize: '14px' }}>
                            <ChevronLeft size={20} cursor="pointer" />
                            <span style={{ color: '#fff', fontWeight: '600' }}>Miércoles, 14 Mar</span>
                            <ChevronRight size={20} cursor="pointer" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {todayClasses.map((clase) => (
                            <div key={clase.id} className="glass-panel" style={{
                                padding: '20px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderLeft: `4px solid ${clase.color}`
                            }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: `${clase.color}15`,
                                        color: clase.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{clase.name}</h4>
                                        <div style={{ display: 'flex', gap: '12px', color: '#666', fontSize: '12px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {clase.instructor}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {clase.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700' }}>{clase.capacity}</p>
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '4px 10px',
                                        borderRadius: '100px',
                                        background: clase.status === 'En progreso' ? 'rgba(255,140,66,0.1)' : 'rgba(46,204,113,0.1)',
                                        color: clase.status === 'En progreso' ? '#ff8c42' : '#2ecc71',
                                        fontWeight: '600'
                                    }}>{clase.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar / Quick Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Disponibilidad de Salas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { name: 'Sala A', status: 'Ocupada', usage: 100 },
                                { name: 'Sala Zen', status: 'Disponible', usage: 0 },
                                { name: 'Zona Pesas', status: 'Alta Demanda', usage: 80 },
                                { name: 'Piscina', status: 'Mantenimiento', usage: 10 }
                            ].map((sala, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ fontWeight: '600' }}>{sala.name}</span>
                                        <span style={{ color: sala.usage > 70 ? '#ff8c42' : '#2ecc71' }}>{sala.status}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${sala.usage}%`,
                                            height: '100%',
                                            background: sala.usage > 90 ? '#ff4d4d' : (sala.usage > 60 ? '#ff8c42' : '#2ecc71'),
                                            borderRadius: '10px'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', background: 'var(--primary-gradient)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)' }}></div>
                        <div style={{ position: 'relative' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Capacidad General</h3>
                            <p style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>85%</p>
                            <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>El gimnasio está operando cerca de su capacidad máxima.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesAdminTab;
