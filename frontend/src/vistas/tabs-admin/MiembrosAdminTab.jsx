import React, { useState, useEffect } from 'react';
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
    MapPin,
    X,
    Check,
    AlertTriangle,
    Loader2
} from 'lucide-react';

const MiembrosAdminTab = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null); // stores user to deactivate/activate

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'cliente'
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('gymtrack_token');
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('gymtrack_token');
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowAddModal(false);
                setFormData({ nombre: '', apellido: '', email: '', password: '', rol: 'cliente' });
                fetchMembers();
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            const token = localStorage.getItem('gymtrack_token');
            const response = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                setShowConfirmModal(null);
                fetchMembers();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const filteredMembers = members.filter(m =>
        `${m.nombre} ${m.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total', value: members.length, detail: 'Miembros', icon: <Users size={20} /> },
        { label: 'Activos', value: members.filter(m => m.activo).length, detail: `${Math.round((members.filter(m => m.activo).length / (members.length || 1)) * 100)}% del total`, icon: <UserCheck size={20} /> },
        { label: 'Clientes', value: members.filter(m => m.rol === 'cliente').length, detail: 'Usuarios base', icon: <Users size={20} /> },
        { label: 'Entrenadores', value: members.filter(m => m.rol === 'entrenador').length, detail: 'Staff técnico', icon: <UserPlus size={20} /> },
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
            cliente: { bg: 'rgba(255,140,66,0.1)', color: '#ff8c42' },
            entrenador: { bg: 'rgba(46,204,113,0.1)', color: '#2ecc71' },
            admin: { bg: 'rgba(255,255,255,0.1)', color: '#fff' },
            Activo: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
            Inactivo: { bg: 'rgba(255,77,77,0.2)', color: '#ff4d4d' }
        };
        const style = colors[type?.toLowerCase()] || colors.admin;
        return {
            backgroundColor: style.bg,
            color: style.color,
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'capitalize'
        };
    };

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Miembros</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={actionButtonStyle('rgba(46,204,113,0.1)', '#2ecc71')}
                    >
                        <UserPlus size={20} /> Añadir Miembro
                    </button>
                    <button
                        onClick={fetchMembers}
                        style={actionButtonStyle('rgba(255,255,255,0.05)', '#fff')}
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '48px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', transition: 'transform 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ color: '#ff8c42', background: 'rgba(255,140,66,0.1)', padding: '16px', borderRadius: '16px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: '#888', fontSize: '14px', margin: '0 0 6px 0', fontWeight: '500' }}>{stat.label}</p>
                                <h2 style={{ fontSize: '32px', margin: '0 0 4px 0', fontWeight: '800' }}>{stat.value}</h2>
                                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{stat.detail}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={24} />
                    <input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 18px 18px 60px',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            color: '#fff',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <button className="glass-panel" style={{ padding: '12px 28px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', color: '#aaa', fontWeight: '600' }}>
                    <Filter size={20} /> Filtros
                </button>
            </div>

            {/* Members Table */}
            <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 16px' }} />
                        Cargando miembros...
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Nombre</th>
                                <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Contacto</th>
                                <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Rol</th>
                                <th style={{ padding: '20px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '20px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px' }}>
                                                {member.nombre[0]}{member.apellido[0]}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{member.nombre} {member.apellido}</p>
                                                <p style={{ margin: 0, color: '#666', fontSize: '11px' }}>ID: {member.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '12px' }}>
                                            <Mail size={12} /> {member.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}><span style={badgeStyle(member.rol)}>{member.rol}</span></td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.activo ? '#2ecc71' : '#ff4d4d' }}></div>
                                            <span style={{ color: member.activo ? '#2ecc71' : '#ff4d4d', fontSize: '12px', fontWeight: '600' }}>
                                                {member.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <button
                                            onClick={() => setShowConfirmModal(member)}
                                            style={{
                                                background: member.activo ? 'rgba(255,77,77,0.1)' : 'rgba(46,204,113,0.1)',
                                                color: member.activo ? '#ff4d4d' : '#2ecc71',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {member.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,140,66,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>Añadir Miembro</h2>
                            <X size={24} cursor="pointer" onClick={() => setShowAddModal(false)} />
                        </div>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                placeholder="Nombre"
                                required
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                            <input
                                placeholder="Apellido"
                                required
                                value={formData.apellido}
                                onChange={e => setFormData({ ...formData, apellido: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                            <input
                                placeholder="Contraseña Inicial"
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                            <select
                                value={formData.rol}
                                onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <button type="submit" style={{ marginTop: '12px', padding: '14px', borderRadius: '12px', background: 'var(--primary-gradient)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                                Crear Miembro
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="glass-panel" style={{ width: '360px', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
                        <div style={{ background: showConfirmModal.activo ? 'rgba(255,77,77,0.1)' : 'rgba(46,204,113,0.1)', color: showConfirmModal.activo ? '#ff4d4d' : '#2ecc71', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>¿Confirmar acción?</h2>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5', marginBottom: '32px' }}>
                            Estás a punto de {showConfirmModal.activo ? 'desactivar' : 'activar'} a <strong>{showConfirmModal.nombre}</strong>.
                            {showConfirmModal.activo && ' Su acceso al sistema será revocado pero su historial se mantendrá intacto.'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowConfirmModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button
                                onClick={() => toggleUserStatus(showConfirmModal)}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: showConfirmModal.activo ? '#ff4d4d' : '#2ecc71', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiembrosAdminTab;
