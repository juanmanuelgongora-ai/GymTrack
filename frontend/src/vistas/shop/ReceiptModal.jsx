import React from 'react';
import { CheckCircle2, Download, X, Calendar, CreditCard, Receipt, FileText } from 'lucide-react';

const ReceiptModal = ({ transaction, plan, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '480px', width: '100%', padding: '40px',
                borderRadius: '24px', position: 'relative',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(46, 204, 113, 0.1)', border: '2px solid #2ecc71',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px auto', color: '#2ecc71'
                    }}>
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>¡Pago Exitoso!</h2>
                    <p style={{ color: '#aaa', margin: 0 }}>Tu membresía ha sido renovada correctamente.</p>
                </div>

                {/* Receipt Details */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
                    padding: '24px', border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '32px'
                }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8c42' }}>
                        <Receipt size={18} /> Detalle de Transacción
                    </h3>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={14} /> ID Transacción
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{transaction.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} /> Fecha y Hora
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(transaction.fecha).toLocaleString('es-CO')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#888', fontSize: '14px' }}>Concepto</span>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{transaction.concepto}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CreditCard size={14} /> Método de Pago
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '14px', textTransform: 'capitalize' }}>
                                {transaction.metodo_pago.replace('_', ' ')}
                            </span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Total Pagado</span>
                            <span style={{ color: '#2ecc71', fontSize: '20px', fontWeight: '900' }}>
                                ${parseFloat(transaction.monto).toLocaleString('es-CO')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="secondary-btn"
                        style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => window.print()}
                    >
                        <Download size={18} /> Guardar
                    </button>
                    <button
                        className="primary-btn"
                        style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#ff8c42' }}
                        onClick={onClose}
                    >
                        <CheckCircle2 size={18} /> Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
