import React from 'react';
import Icons from '../../logica/Icons';

const PaymentModal = ({ plan, onClose, onConfirm }) => (
    <div className="overlay">
        <div className="payment-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem' }}>Finalizar Pago</h2>
                <div style={{ cursor: 'pointer', color: '#666' }} onClick={onClose}>✕</div>
            </div>
            <div className="summary-box" style={{ background: '#0d0d0d', padding: 20, borderRadius: 12, marginBottom: 24 }}>
                <p style={{ color: '#888', marginBottom: '16px' }}>Resumen de Compra</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{plan.name}</span>
                    <span>$ {plan.price.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid #333', paddingTop: 12, fontSize: '1.2rem', fontWeight: 700, color: '#ff8c42', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total a Pagar:</span>
                    <span>$ {plan.price.toLocaleString()}</span>
                </div>
            </div>
            <p style={{ color: '#888', marginBottom: '16px' }}>Método de Pago</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#222', border: '1px solid #ff8c42', borderRadius: 12 }}>
                    <div style={{ background: '#ff8c42', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Check /></div>
                    <span>Tarjeta de Crédito/Débito</span>
                </div>
            </div>
            <div className="button-row">
                <button className="btn-secondary" style={{ flex: 1, marginRight: '16px' }} onClick={onClose}>Cancelar</button>
                <button className="btn-primary btn-green" style={{ flex: 1 }} onClick={onConfirm}>Confirmar Pago</button>
            </div>
        </div>
    </div>
);

export default PaymentModal;
