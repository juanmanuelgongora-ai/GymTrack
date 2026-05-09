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
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Clases</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)', fontWeight: '600' }}>
                        <Filter size={20} /> Filtrar
                    </button>
                    <button style={{
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
                            <span style={{ color: '#fff', fontWeight: '700' }}>Miércoles, 14 Mar</span>
                            <ChevronRight size={24} cursor="pointer" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {todayClasses.map((clase) => (
                            <div key={clase.id} className="glass-panel" style={{
                                padding: '24px',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.01)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderLeft: `5px solid ${clase.color}`,
                                transition: 'transform 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: `${clase.color}15`,
                                        color: clase.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700' }}>{clase.name}</h4>
                                        <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '14px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {clase.instructor}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {clase.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>{clase.capacity}</p>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '6px 14px',
                                        borderRadius: '100px',
                                        background: clase.status === 'En progreso' ? 'rgba(255,140,66,0.1)' : 'rgba(46,204,113,0.1)',
                                        color: clase.status === 'En progreso' ? '#ff8c42' : '#2ecc71',
                                        fontWeight: '700'
                                    }}>{clase.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '700' }}>Disponibilidad de Salas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { name: 'Sala A', status: 'Ocupada', usage: 100 },
                                { name: 'Sala Zen', status: 'Disponible', usage: 0 },
                                { name: 'Zona Pesas', status: 'Alta Demanda', usage: 80 },
                                { name: 'Piscina', status: 'Mantenimiento', usage: 10 }
                            ].map((sala, i) => (
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
                            <p style={{ margin: 0, fontSize: '48px', fontWeight: '900', color: '#fff' }}>85%</p>
                            <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#aaa', lineHeight: '1.5' }}>El gimnasio está operando cerca de su capacidad máxima. Considera habilitar salas adicionales.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesAdminTab;
