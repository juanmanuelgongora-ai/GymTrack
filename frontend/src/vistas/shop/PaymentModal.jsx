import React, { useState } from 'react';
import Icons from '../../logica/Icons';
import { CreditCard, Landmark, Wallet, ShieldCheck, Info } from 'lucide-react';

const PaymentModal = ({ plan, onClose, onConfirm, paymentError }) => {
    const [method, setMethod] = useState('tarjeta');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [saveMethod, setSaveMethod] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const renderMethodForm = () => {
        switch (method) {
            case 'tarjeta':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Nombre en la Tarjeta</label>
                            <input
                                type="text"
                                name="name"
                                value={cardData.name}
                                onChange={handleInput}
                                placeholder="JUAN PEREZ"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Número de Tarjeta</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    name="number"
                                    value={cardData.number}
                                    onChange={handleInput}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '12px 40px 12px 12px', color: 'white', width: '100%' }}
                                />
                                <CreditCard size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Vencimiento</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    value={cardData.expiry}
                                    onChange={handleInput}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white' }}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={cardData.cvv}
                                    onChange={handleInput}
                                    placeholder="***"
                                    maxLength="3"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white' }}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'paypal':
                return (
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(0,112,186,0.05)', borderRadius: '12px', border: '1px dashed #0070ba', animation: 'fadeIn 0.3s' }}>
                        <Wallet size={40} color="#0070ba" style={{ marginBottom: '16px' }} />
                        <p style={{ color: '#ccc', marginBottom: '16px' }}>Serás redirigido a PayPal para completar tu compra de forma segura.</p>
                        <div style={{ background: '#0070ba', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>
                            Pagar con PayPal
                        </div>
                    </div>
                );
            case 'transferencia':
                return (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid #333', animation: 'fadeIn 0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#ff8c42' }}>
                            <Info size={18} />
                            <h4 style={{ margin: 0 }}>Datos de Transferencia</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                                <span style={{ color: '#888' }}>Banco:</span>
                                <span>Bancolombia</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                                <span style={{ color: '#888' }}>Tipo:</span>
                                <span>Ahorros</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                                <span style={{ color: '#888' }}>Número:</span>
                                <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>457-000123-99</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                                * Envía el comprobante a pagos@gymtrack.com o súbelo en tu perfil tras confirmar.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="overlay" style={{ zIndex: 1000 }}>
            <div className="payment-modal" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Finalizar Pago</h2>
                    <div style={{ cursor: 'pointer', color: '#666', fontSize: '24px' }} onClick={onClose}>✕</div>
                </div>

                <div className="summary-box" style={{ background: 'rgba(255,140,66,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,140,66,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#888' }}>Membresía:</span>
                        <span style={{ fontWeight: '700' }}>{plan.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: '#ff8c42', borderTop: '1px solid rgba(255,140,66,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                        <span>Total a Pagar:</span>
                        <span>$ {plan.price.toLocaleString('es-CO')}</span>
                    </div>
                </div>

                {paymentError && (
                    <div style={{ background: 'rgba(255,77,77,0.12)', border: '1px solid rgba(255,77,77,0.4)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>&#9888;</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '700', color: '#ff4d4d', fontSize: '13px' }}>Pago rechazado</p>
                            <p style={{ margin: '4px 0 0 0', color: '#ffaaaa', fontSize: '13px', lineHeight: '1.5' }}>{paymentError}</p>
                        </div>
                    </div>
                )}

                <p style={{ color: paymentError ? '#ff8c42' : '#888', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: paymentError ? '700' : '400' }}>
                    {paymentError ? 'Intenta con otro método:' : 'Selecciona Método de Pago'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {[
                        { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                        { id: 'paypal', label: 'PayPal', icon: Wallet },
                        { id: 'transferencia', label: 'Banco', icon: Landmark },
                    ].map((m) => (
                        <div
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            style={{
                                padding: '16px 8px',
                                background: method === m.id ? 'rgba(255,140,66,0.1)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${method === m.id ? '#ff8c42' : '#333'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                transform: method === m.id ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            <m.icon size={20} color={method === m.id ? '#ff8c42' : '#888'} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: method === m.id ? 'white' : '#888' }}>{m.label}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    {renderMethodForm()}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => setMethod !== 'transferencia' && setSaveMethod(!saveMethod)}>
                    <input
                        type="checkbox"
                        checked={saveMethod}
                        onChange={() => { }}
                        disabled={method === 'transferencia'}
                        style={{ accentColor: '#ff8c42', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: method === 'transferencia' ? '#444' : '#ccc' }}>Guardar método para futuras compras</span>
                </div>

                <div style={{ background: 'rgba(46,204,113,0.1)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', border: '1px solid rgba(46,204,113,0.2)' }}>
                    <ShieldCheck size={18} color="#2ecc71" />
                    <span style={{ fontSize: '12px', color: '#2ecc71' }}>Pago 100% seguro y encriptado</span>
                </div>

                <div className="button-row" style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '16px' }} onClick={onClose}>Cancelar</button>
                    <button className="btn-primary btn-green" style={{ flex: 1, padding: '16px' }} onClick={() => onConfirm(method, cardData)}>Confirmar Pago</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
