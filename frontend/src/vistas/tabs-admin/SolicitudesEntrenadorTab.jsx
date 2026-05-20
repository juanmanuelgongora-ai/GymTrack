import React, { useState, useEffect } from 'react';
import {
    UserCheck,
    UserX,
    User,
    Mail,
    Award,
    Briefcase,
    CheckCircle,
    XCircle,
    FileText,
    Clock
} from 'lucide-react';

const API_URL = '/api';

const SolicitudesEntrenadorTab = () => {
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntrenador, setSelectedEntrenador] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [showRechazoDialog, setShowRechazoDialog] = useState(false);

    useEffect(() => {
        fetchPendientes();
    }, []);

    const fetchPendientes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('gymtrack_token');
            const res = await fetch(`${API_URL}/admin/entrenadores/pendientes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setPendientes(data);
            }
        } catch (error) {
            console.error('Error fetching pendientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('gymtrack_token');
            const res = await fetch(`${API_URL}/admin/entrenadores/${id}/aprobar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                setSelectedEntrenador(null);
                fetchPendientes();
            }
        } catch (error) {
            console.error('Error approving:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('gymtrack_token');
            const res = await fetch(`${API_URL}/admin/entrenadores/${id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motivo: motivoRechazo })
            });
            if (res.ok) {
                setSelectedEntrenador(null);
                setShowRechazoDialog(false);
                setMotivoRechazo('');
                fetchPendientes();
            }
        } catch (error) {
            console.error('Error rejecting:', error);
        }
    };

    const handleDownloadCertificado = async () => {
        try {
            const token = localStorage.getItem('gymtrack_token');
            const res = await fetch(`${API_URL}/admin/entrenadores/${selectedEntrenador.id}/certificado`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const filename = selectedEntrenador.certificado_path.split('/').pop() || 'certificado';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('No se pudo descargar el archivo u ocurrió un error.');
            }
        } catch (error) {
            console.error('Error downloading:', error);
            alert('Error al intentar descargar el archivo.');
        }
    };

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Solicitudes</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ff8c42' }}>Cargando solicitudes pendientes...</div>
            ) : pendientes.length === 0 && !selectedEntrenador ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                    <CheckCircle size={64} style={{ color: '#2ecc71', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Todo al día</h2>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>No hay solicitudes de entrenadores pendientes de revisión.</p>
                </div>
            ) : null}

            {selectedEntrenador ? (
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', position: 'relative' }}>
                    <button
                        onClick={() => { setSelectedEntrenador(null); setShowRechazoDialog(false); }}
                        style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Volver
                    </button>

                    <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{selectedEntrenador.user?.nombre} {selectedEntrenador.user?.apellido}</h2>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa' }}><Mail size={16} /> {selectedEntrenador.user?.email}</p>

                            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff8c42', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Datos Personales</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <p><strong>Edad:</strong> {selectedEntrenador.edad || 'N/A'}</p>
                                        <p><strong>Género:</strong> {selectedEntrenador.genero || 'N/A'}</p>
                                        <p><strong>Contacto:</strong> {selectedEntrenador.contacto || 'N/A'}</p>
                                        <p><strong>Dirección:</strong> {selectedEntrenador.direccion || 'N/A'}</p>
                                        <p style={{ gridColumn: '1 / -1' }}><strong>Contacto de Emergencia:</strong> {selectedEntrenador.emergencia || 'N/A'}</p>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff8c42', display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={18} /> Perfil Profesional</h4>
                                    <p><strong>Especialidad:</strong> {selectedEntrenador.especialidad}</p>
                                    <p><strong>Experiencia:</strong> {selectedEntrenador.experiencia_anios} años</p>
                                    <p><strong>Capacidad Máxima:</strong> {selectedEntrenador.capacidad_maxima} alumnos</p>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff8c42', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} /> Certificaciones y Objetivos</h4>
                                    <p><strong>Certificación:</strong> {selectedEntrenador.certificacion}</p>
                                    <p><strong>Objetivos:</strong> {selectedEntrenador.objetivos_profesionales}</p>
                                    {selectedEntrenador.certificado_path && (
                                        <div style={{ marginTop: '10px' }}>
                                            <button
                                                onClick={handleDownloadCertificado}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#2ecc71', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '16px' }}>
                                                <FileText size={16} /> Descargar Certificado Adjunto
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '380px' }}>
                            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', position: 'sticky', top: '24px', border: '1px solid rgba(255,140,66,0.3)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', background: 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98))' }}>
                                <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8c42' }}>
                                    <CheckCircle size={22} /> Decisión Final
                                </h3>
                                {!showRechazoDialog ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                                        <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>
                                            Revisa bien los credenciales antes de tomar una decisión. Una notificación se enviará automáticamente por correo al postulante.
                                        </p>
                                        <button
                                            onClick={() => handleApprove(selectedEntrenador.id)}
                                            style={{ padding: '16px', borderRadius: '16px', background: 'var(--primary-gradient)', color: '#fff', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)', transition: 'transform 0.2s, boxShadow 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <UserCheck size={22} /> Aprobar y Dar Acceso
                                        </button>
                                        <button
                                            onClick={() => setShowRechazoDialog(true)}
                                            style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,77,77,0.05)', border: '1px solid rgba(255,77,77,0.5)', color: '#ff4d4d', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.05)'}
                                        >
                                            <UserX size={22} /> Rechazar Solicitud
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ animation: 'slideInRight 0.3s ease' }}>
                                        <div style={{ background: 'rgba(255,77,77,0.1)', padding: '16px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #ff4d4d' }}>
                                            <h4 style={{ margin: '0 0 6px 0', color: '#ff4d4d', fontSize: '15px' }}>Redactar Rechazo</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#ccc', lineHeight: '1.4' }}>Detalla claramente el porqué se denegó la solicitud para que el entrenador pueda corregirlo externamente.</p>
                                        </div>

                                        <textarea
                                            value={motivoRechazo}
                                            onChange={(e) => setMotivoRechazo(e.target.value)}
                                            placeholder="Ej. Faltan años de experiencia requeridos, certificación inválida..."
                                            style={{ width: '100%', minHeight: '130px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                                        />

                                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                            <button
                                                onClick={() => handleReject(selectedEntrenador.id)}
                                                disabled={!motivoRechazo.trim()}
                                                style={{ flex: 1, padding: '14px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: motivoRechazo.trim() ? 'pointer' : 'not-allowed', opacity: motivoRechazo.trim() ? 1 : 0.5 }}>
                                                Enviar Rechazo
                                            </button>
                                            <button
                                                onClick={() => { setShowRechazoDialog(false); setMotivoRechazo(''); }}
                                                style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : pendientes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {pendientes.map((entrenador) => (
                        <div key={entrenador.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setSelectedEntrenador(entrenador)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'rgba(255,140,66,0.1)', color: '#ff8c42', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{entrenador.user?.nombre} {entrenador.user?.apellido}</h3>
                                    <span style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> Postulante {entrenador.especialidad}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                <span style={{ color: '#aaa', fontSize: '14px' }}>Exp: {entrenador.experiencia_anios} años</span>
                                <span style={{ color: '#ff8c42', fontSize: '14px', fontWeight: 'bold' }}>Ver Detalles →</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SolicitudesEntrenadorTab;
