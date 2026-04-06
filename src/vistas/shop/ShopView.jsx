import React from 'react';
import Icons from '../../logica/Icons';

const ShopView = ({ selectedPlan, setSelectedPlan, setShowPayment, setView }) => {
    const plans = [
        { name: 'Plan Mensual', price: 180000, duration: '1 mes', perks: ['Acceso completo', 'Clases grupales', 'Asesoría inicial', 'IA Recomendaciones', 'IA Plan entrenamiento'] },
        { name: 'Plan Trimestral', price: 480000, duration: '3 meses', popular: true, perks: ['Acceso completo', 'Clases grupales', 'IA Recomendaciones', 'IA Plan entrenamiento', '15% Descuento'] },
        { name: 'Plan Anual', price: 1680000, duration: '12 meses', perks: ['Todo lo anterior', 'Nutrición deportiva', '30% Descuento'] }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1100px', animation: 'fadeIn 0.4s' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                <button className="btn-secondary" style={{ padding: '12px 20px' }} onClick={() => setView('register')}>←</button>
                <div><h1 style={{ fontSize: '2.4rem' }}>Pagos y Tienda</h1><p style={{ color: '#888' }}>Renueva tu membresía o compra productos del gimnasio</p></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <button className="btn-primary" style={{ flex: 1 }}>Renovar Membresía</button>
                <button className="btn-secondary" style={{ flex: 1 }}>Tienda de Productos</button>
            </div>
            <div className="plans-grid">
                {plans.map((p, i) => (
                    <div key={i} className={`plan-card ${selectedPlan?.name === p.name ? 'selected' : ''}`} onClick={() => setSelectedPlan(p)}>
                        {p.popular && <div className="popular-badge">MÁS POPULAR</div>}
                        <div className="plan-title">{p.name}</div>
                        <div style={{ color: '#888' }}>{p.duration}</div>
                        <div className="plan-price">$ {p.price.toLocaleString()}</div>
                        <ul className="feature-list">{p.perks.map((f, j) => <li key={j} className="feature-item"><Icons.Check /> {f}</li>)}</ul>
                    </div>
                ))}
            </div>
            <button className="btn-primary btn-green" style={{ width: '100%', marginTop: '40px', padding: '24px' }} disabled={!selectedPlan} onClick={() => setShowPayment(true)}>
                Proceder al Pago - $ {selectedPlan ? selectedPlan.price.toLocaleString() : '0'}
            </button>
        </div>
    );
};

export default ShopView;
