import React, { useState, useEffect, useRef } from 'react';
import { Award, Plus, CheckCircle, AlertCircle, Download, Trash2, Calendar, FileText, Building2, X, Loader2 } from 'lucide-react';
import { useUser } from '../../logica/UserContext';

const API_URL = '/api';

const CertificacionesTab = () => {
    const { token } = useUser();
    const [certList, setCertList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [newCert, setNewCert] = useState({
        titulo: '',
        emisor: '',
        fecha_obtencion: '',
        fecha_expiracion: '',
        archivo: null
    });

    const fileInputRef = useRef(null);

    const fetchCertificados = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/entrenador/certificados`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCertList(data);
            }
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificados();
    }, []);

    const handleFileChange = (e) => {
        setNewCert({ ...newCert, archivo: e.target.files[0] });
    };

    const handleUpload = async () => {
        if (!newCert.titulo || !newCert.archivo) {
            alert('Por favor complete el título y seleccione un archivo.');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('titulo', newCert.titulo);
            formData.append('emisor', newCert.emisor);
            formData.append('fecha_obtencion', newCert.fecha_obtencion);
            formData.append('fecha_expiracion', newCert.fecha_expiracion);
            formData.append('archivo', newCert.archivo);

            const response = await fetch(`${API_URL}/entrenador/certificados`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                setShowModal(false);
                setNewCert({ titulo: '', emisor: '', fecha_obtencion: '', fecha_expiracion: '', archivo: null });
                fetchCertificados();
            } else {
                const error = await response.json();
                alert('Error al subir certificado: ' + (error.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error uploading certificate:', error);
            alert('Error al conectar con el servidor.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este certificado?')) return;

        try {
            const response = await fetch(`${API_URL}/entrenador/certificados/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                fetchCertificados();
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
        }
    };

    const handleDownload = async (cert) => {
        try {
            const response = await fetch(`${API_URL}/entrenador/certificados/${cert.id}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // Prettify filename if possible
                const filename = cert.path.split('/').pop() || 'certificado';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('No se pudo descargar el certificado.');
            }
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    const getStatusColor = (cert) => {
        if (!cert.fecha_expiracion) return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', status: 'Vigente' };

        const now = new Date();
        const expires = new Date(cert.fecha_expiracion);
        const diffMonths = (expires - now) / (1000 * 60 * 60 * 24 * 30);

        if (expires < now) return { color: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', status: 'Vencido' };
        if (diffMonths < 3) return { color: '#ffb703', bg: 'rgba(255, 183, 3, 0.1)', border: '1px solid rgba(255, 183, 3, 0.3)', status: 'Por Vencer' };

        return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', status: 'Vigente' };
    };

    const stats = {
        total: certList.length,
        vigentes: certList.filter(c => getStatusColor(c).status === 'Vigente').length,
        porVencer: certList.filter(c => getStatusColor(c).status === 'Por Vencer').length,
        vencidos: certList.filter(c => getStatusColor(c).status === 'Vencido').length
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Mis Certificaciones</h2>
                    <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Gestiona tus certificados profesionales y acreditaciones</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#22c55e', border: 'none', padding: '12px 24px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    <Plus size={18} /> Agregar Certificado
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '10px' }}>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Total Certificados</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>{stats.total}</h3>
                    </div>
                    <Award size={24} color="#ffb703" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Vigentes</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#22c55e' }}>{stats.vigentes}</h3>
                    </div>
                    <CheckCircle size={24} color="#22c55e" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Por Vencer</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#ffb703' }}>{stats.porVencer}</h3>
                    </div>
                    <AlertCircle size={24} color="#ffb703" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Vencidos</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#ff4d4d' }}>{stats.vencidos}</h3>
                    </div>
                    <AlertCircle size={24} color="#ff4d4d" />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                        Cargando certificados...
                    </div>
                ) : certList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed #333' }}>
                        <Award size={48} color="#444" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: '#888', margin: '0 0 8px 0' }}>No tienes certificados registrados</h3>
                        <p style={{ color: '#555', fontSize: '14px' }}>Sube tus acreditaciones para mejorar tu perfil profesional</p>
                    </div>
                ) : certList.map((cert, idx) => {
                    const statusInfo = getStatusColor(cert);
                    return (
                        <div key={cert.id || idx} className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #3a3a3c' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: 48, height: 48, background: '#2c2c2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award color="#ff6b35" size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fff' }}>{cert.titulo}</h3>
                                        <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={12} /> {cert.emisor || 'No especificado'}</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span style={{ padding: '4px 10px', background: statusInfo.bg, border: statusInfo.border, color: statusInfo.color, borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {statusInfo.status === 'Vigente' ? <CheckCircle size={10} /> : <AlertCircle size={10} />} {statusInfo.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleDownload(cert)}
                                        style={{ padding: '8px', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#ff6b35', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cert.id)}
                                        style={{ padding: '8px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', borderRadius: '8px', color: '#ff4d4d', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ background: '#1c1c1e', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><Calendar size={12} /> Fecha de Obtención</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.fecha_obtencion ? new Date(cert.fecha_obtencion).toLocaleDateString() : 'N/A'}</b>
                                </div>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><Calendar size={12} /> Fecha de Expiración</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.fecha_expiracion ? new Date(cert.fecha_expiracion).toLocaleDateString() : 'N/A'}</b>
                                </div>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><FileText size={12} /> Archivo</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.path ? cert.path.split('/').pop() : 'N/A'}</b>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal para Agregar Certificado */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '30px', borderRadius: '16px', border: '1px solid #444', animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Agregar Nuevo Certificado</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="field-group">
                                <label className="field-label">Título de la Certificación *</label>
                                <input
                                    className="input-element"
                                    placeholder="Ej: Personal Trainer Certification"
                                    value={newCert.titulo}
                                    onChange={(e) => setNewCert({ ...newCert, titulo: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Ente Emisor</label>
                                <input
                                    className="input-element"
                                    placeholder="Ej: NSCA, ISSA, Cruz Roja"
                                    value={newCert.emisor}
                                    onChange={(e) => setNewCert({ ...newCert, emisor: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="field-group">
                                    <label className="field-label">Fecha Obtención</label>
                                    <input
                                        type="date"
                                        className="input-element"
                                        value={newCert.fecha_obtencion}
                                        onChange={(e) => setNewCert({ ...newCert, fecha_obtencion: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label className="field-label">Fecha Expiración</label>
                                    <input
                                        type="date"
                                        className="input-element"
                                        value={newCert.fecha_expiracion}
                                        onChange={(e) => setNewCert({ ...newCert, fecha_expiracion: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label">Archivo del Certificado * (PDF, JPG, PNG)</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        padding: '20px',
                                        border: '2px dashed #444',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: newCert.archivo ? '#22c55e' : '#888'
                                    }}
                                >
                                    {newCert.archivo ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <CheckCircle size={18} /> {newCert.archivo.name}
                                        </div>
                                    ) : (
                                        'Haz clic para seleccionar un archivo'
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading || !newCert.titulo || !newCert.archivo}
                                style={{
                                    marginTop: '8px',
                                    padding: '12px',
                                    background: '#ff6b35',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    opacity: (uploading || !newCert.titulo || !newCert.archivo) ? 0.6 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {uploading ? <Loader2 className="animate-spin" size={18} /> : null}
                                {uploading ? 'Subiendo...' : 'Guardar Certificado'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificacionesTab;
