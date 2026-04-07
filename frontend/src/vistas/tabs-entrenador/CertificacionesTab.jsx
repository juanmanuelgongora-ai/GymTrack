import React from 'react';
import { Award, Plus, CheckCircle, AlertCircle, Download, Trash2, Calendar, FileText, Building2 } from 'lucide-react';

const CertificacionesTab = () => {
    const certList = [
        { title: 'NSCA-CPT (Certified Personal Trainer)', issuer: 'National Strength and Conditioning Association', tags: ['Entrenamiento Personal'], status: 'Vigente', obtained: '15 de Marzo, 2018', expires: '15 de Marzo, 2026', certNum: 'NSCA-CPT-2018-4521' },
        { title: 'ISSA CrossFit Level 2 Trainer', issuer: 'International Sports Sciences Association', tags: ['Especialización'], status: 'Por Vencer', obtained: '22 de Julio, 2019', expires: '22 de Julio, 2025', certNum: 'ISSA-CF2-2019-8934' },
        { title: 'Certificación en Nutrición Deportiva', issuer: 'International Society of Sports Nutrition', tags: ['Nutrición Deportiva'], status: 'Vigente', obtained: '10 de Enero, 2020', expires: '10 de Enero, 2028', certNum: 'ISSN-ND-2020-1234' },
        { title: 'Primeros Auxilios y RCP', issuer: 'Cruz Roja Española', tags: ['Primeros Auxilios'], status: 'Vencido', obtained: '5 de Septiembre, 2022', expires: '5 de Septiembre, 2024', certNum: 'CRR-RCP-2022-5678' },
        { title: 'Especialización en Entrenamiento Funcional', issuer: 'Functional Training Institute', tags: ['Especialización'], status: 'Vigente', obtained: '18 de Abril, 2021', expires: '-', certNum: 'FTI-EF-2021-9812' }
    ];

    const getStatusColor = (status) => {
        if (status === 'Vigente') return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' };
        if (status === 'Por Vencer') return { color: '#ffb703', bg: 'rgba(255, 183, 3, 0.1)', border: '1px solid rgba(255, 183, 3, 0.3)' };
        return { color: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Mis Certificaciones</h2>
                    <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Gestiona tus certificados profesionales y acreditaciones</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#22c55e', border: 'none', padding: '12px 24px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Plus size={18} /> Agregar Certificado
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '10px' }}>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Total Certificados</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>5</h3>
                    </div>
                    <Award size={24} color="#ffb703" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Vigentes</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#22c55e' }}>3</h3>
                    </div>
                    <CheckCircle size={24} color="#22c55e" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Por Vencer</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#ffb703' }}>1</h3>
                    </div>
                    <AlertCircle size={24} color="#ffb703" />
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Vencidos</p>
                        <h3 style={{ margin: 0, fontSize: '28px', color: '#ff4d4d' }}>1</h3>
                    </div>
                    <AlertCircle size={24} color="#ff4d4d" />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {certList.map((cert, idx) => {
                    const currentStatus = getStatusColor(cert.status);
                    return (
                        <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #3a3a3c' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: 48, height: 48, background: '#2c2c2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award color="#ff6b35" size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fff' }}>{cert.title}</h3>
                                        <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={12} /> {cert.issuer}</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {cert.tags.map(t => (
                                                <span key={t} style={{ padding: '4px 10px', background: '#333', borderRadius: '8px', fontSize: '11px', color: '#ccc' }}>{t}</span>
                                            ))}
                                            <span style={{ padding: '4px 10px', background: currentStatus.bg, border: currentStatus.border, color: currentStatus.color, borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {cert.status === 'Vigente' ? <CheckCircle size={10} /> : <AlertCircle size={10} />} {cert.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ padding: '8px', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#ff6b35', cursor: 'pointer', display: 'flex' }}><Download size={16} /></button>
                                    <button style={{ padding: '8px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', borderRadius: '8px', color: '#ff4d4d', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div style={{ background: '#1c1c1e', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><Calendar size={12} /> Fecha de Obtención</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.obtained}</b>
                                </div>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><Calendar size={12} /> Fecha de Expiración</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.expires}</b>
                                </div>
                                <div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}><FileText size={12} /> Número de Certificado</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{cert.certNum}</b>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CertificacionesTab;
