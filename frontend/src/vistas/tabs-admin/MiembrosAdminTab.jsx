import React from 'react';
import {
    Users,
    UserCheck,
    UserPlus,
    UserMinus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const MiembrosAdminTab = () => {
    // Mock user data based on the image
    const members = [
        { id: 1, name: 'Juan Manuel García López', joinDate: '15/01/2024', email: 'juan.garcia@email.com', phone: '+34 612 345 678', address: 'Calle Mayor 45, Madrid', role: 'Cliente', plan: 'Premium', status: 'Activo', initial: 'JM' },
        { id: 2, name: 'María González Ruiz', joinDate: '03/12/2023', email: 'maria.gonzalez@email.com', phone: '+34 623 456 789', address: 'Av. Constitución 12, Madrid', role: 'Entrenador', plan: 'Staff', status: 'Activo', initial: 'MG' },
        { id: 3, name: 'Carlos Fernández Soto', joinDate: '22/02/2024', email: 'carlos.fernandez@email.com', phone: '+34 634 567 890', address: 'Plaza España 8, Madrid', role: 'Cliente', plan: 'Básico', status: 'Activo', initial: 'CF' },
        { id: 4, name: 'Ana Martínez Pérez', joinDate: '10/11/2023', email: 'ana.martinez@email.com', phone: '+34 645 678 901', address: 'Calle Sol 23, Madrid', role: 'Entrenador', plan: 'Staff', status: 'Activo', initial: 'AM' },
        { id: 5, name: 'Pedro Sánchez Torres', joinDate: '05/09/2023', email: 'pedro.sanchez@email.com', phone: '+34 656 789 012', address: 'Gran Vía 101, Madrid', role: 'Cliente', plan: 'Premium', status: 'Inactivo', initial: 'PS' },
    ];

    const stats = [
        { label: 'Total', value: '10', detail: 'Miembros', icon: <Users size={20} /> },
        { label: 'Activos', value: '8', detail: '80% del total', icon: <UserCheck size={20} /> },
        { label: 'Clientes', value: '7', detail: '70% del total', icon: <Users size={20} /> },
        { label: 'Entrenadores', value: '3', detail: '30% del total', icon: <UserPlus size={20} /> },
    ];

    const actionButtonStyle = (bgColor, textColor) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        color: textColor,
        border: 'none',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    });

    const badgeStyle = (type) => {
        const colors = {
            Cliente: { bg: 'rgba(255,140,66,0.1)', color: '#ff8c42' },
            Entrenador: { bg: 'rgba(46,204,113,0.1)', color: '#2ecc71' },
            Premium: { bg: 'rgba(255,255,255,0.05)', color: '#fff' },
            Básico: { bg: 'rgba(255,255,255,0.05)', color: '#aaa' },
            Staff: { bg: 'rgba(255,140,66,0.1)', color: '#ff8c42' },
            Activo: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
            Inactivo: { bg: 'rgba(255,77,77,0.2)', color: '#ff4d4d' }
        };
        const style = colors[type] || colors.Premium;
        return {
            backgroundColor: style.bg,
            color: style.color,
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '600'
        };
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Miembros</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={actionButtonStyle('rgba(46,204,113,0.1)', '#2ecc71')}><UserPlus size={18} /> Añadir Entrenador</button>
                    <button style={actionButtonStyle('rgba(255,77,77,0.1)', '#ff4d4d')}><UserMinus size={18} /> Eliminar Entrenador</button>
                    <button style={actionButtonStyle('rgba(46,204,113,0.1)', '#2ecc71')}><UserPlus size={18} /> Añadir Cliente</button>
                    <button style={actionButtonStyle('rgba(255,77,77,0.1)', '#ff4d4d')}><UserMinus size={18} /> Eliminar Cliente</button>
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
                                <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px 0' }}>{stat.label}</p>
                                <h2 style={{ fontSize: '24px', margin: '0 0 2px 0' }}>{stat.value}</h2>
                                <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>{stat.detail}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={20} />
                    <input
                        placeholder="Buscar por nombre, email o teléfono..."
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            color: '#fff',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <button className="glass-panel" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', color: '#888' }}>
                    <Filter size={18} /> Filtros
                </button>
            </div>

            {/* Members Table */}
            <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Nombre</th>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Contacto</th>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Dirección</th>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Rol</th>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Plan</th>
                            <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '20px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px' }}>
                                            {member.initial}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{member.name}</p>
                                            <p style={{ margin: 0, color: '#666', fontSize: '11px' }}>Desde {member.joinDate}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px' }}>
                                            <Phone size={12} /> {member.phone}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '11px' }}>
                                            <Mail size={12} /> {member.email}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', color: '#888', fontSize: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={12} /> {member.address}
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}><span style={badgeStyle(member.role)}>{member.role}</span></td>
                                <td style={{ padding: '20px' }}><span style={badgeStyle(member.plan)}>{member.plan}</span></td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.status === 'Activo' ? '#2ecc71' : '#ff4d4d' }}></div>
                                        <span style={{ color: member.status === 'Activo' ? '#2ecc71' : '#ff4d4d', fontSize: '12px', fontWeight: '600' }}>{member.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}>
                                        <MoreVertical size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MiembrosAdminTab;
