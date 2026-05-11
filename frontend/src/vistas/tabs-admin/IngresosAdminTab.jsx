import React from 'react';
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Equal,
    Clock,
    Filter,
    Download,
    CreditCard,
    Send,
    Wallet
} from 'lucide-react';

const IngresosAdminTab = () => {
    const transactions = [
        { id: 1, name: 'Juan Manuel García López', concepto: 'Membresía Premium', monto: '+€79.99', metodo: 'Tarjeta', fecha: '14/03/2026', estado: 'Completado', initial: 'JM' },
        { id: 2, name: 'Laura Jiménez Mora', concepto: 'Membresía Premium', monto: '+€79.99', metodo: 'Transferencia', fecha: '14/03/2026', estado: 'Completado', initial: 'LJ' },
        { id: 3, name: 'Miguel Hernández Vega', concepto: 'Clase Personal - Yoga', monto: '+€25.00', metodo: 'Efectivo', fecha: '13/03/2026', estado: 'Completado', initial: 'MH' },
        { id: 4, name: 'Carlos Fernández Soto', concepto: 'Membresía Básica', monto: '+€39.99', metodo: 'Tarjeta', fecha: '13/03/2026', estado: 'Completado', initial: 'CF' },
        { id: 5, name: 'David López Navarro', concepto: 'Renovación Membresía Básica', monto: '+€39.99', metodo: 'PayPal', fecha: '12/03/2026', estado: 'Completado', initial: 'DL' },
        { id: 6, name: 'Ana Martínez Pérez', concepto: 'Clase Grupal - Spinning', monto: '+€15.00', metodo: 'Tarjeta', fecha: '12/03/2026', estado: 'Pendiente', initial: 'AM' },
        { id: 7, name: 'Equipamiento', concepto: 'Compra equipamiento nuevo', monto: '-€450.00', metodo: 'Transferencia', fecha: '11/03/2026', estado: 'Completado', icon: <Wallet size={16} /> },
    ];

    const financialCards = [
        { label: 'Ingresos', value: '€304.95', trend: '+12.5% vs mes anterior', icon: <ArrowUpRight size={20} />, color: '#2ecc71' },
        { label: 'Egresos', value: '€1650.00', trend: 'Gastos operativos', icon: <ArrowDownRight size={20} />, color: '#ff4d4d' },
        { label: 'Balance', value: '-€1345.05', trend: 'Ganancia neta', icon: <Equal size={20} />, color: '#ff8c42' },
        { label: 'Pendientes', value: '1', trend: 'Pagos por procesar', icon: <Clock size={20} />, color: '#aaa' },
    ];

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Ingresos</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)', fontWeight: '600' }}>
                        <Filter size={20} /> Filtrar
                    </button>
                    <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)', fontWeight: '600' }}>
                        <Download size={20} /> Exportar
                    </button>
                </div>
            </div>

            {/* Financial Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '48px' }}>
                {financialCards.map((card, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ color: card.color, background: `${card.color}15`, padding: '14px', borderRadius: '16px' }}>
                                <DollarSign size={24} />
                            </div>
                            <span style={{ color: '#888', fontSize: '15px', fontWeight: '500' }}>{card.label}</span>
                        </div>
                        <h2 style={{ fontSize: '36px', margin: '0 0 12px 0', fontWeight: '800' }}>{card.value}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: card.color, fontSize: '14px', fontWeight: '700' }}>
                            {card.icon} {card.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '48px' }}>
                {/* Distribution Chart */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h3 style={{ margin: '0 0 32px 0', fontSize: '22px', fontWeight: '700' }}>Distribución de Ingresos</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { label: 'Premium', value: '€3,399.55', perc: '45%', color: '#ff8c42' },
                                { label: 'Básica', value: '€2,799.30', perc: '35%', color: '#ffcc33' },
                                { label: 'Clases Individuales', value: '€1,200.00', perc: '15%', color: '#ff4d4d' },
                                { label: 'Otros', value: '€400.00', perc: '5%', color: '#2ecc71' }
                            ].map((cat, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2.5px solid ${cat.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: cat.color }}>
                                            {cat.perc}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{cat.label}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>{cat.value}</p>
                                        </div>
                                    </div>
                                    <span style={{ color: '#2ecc71', fontSize: '13px', fontWeight: '800' }}>↗ 8%</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '240px', height: '240px' }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff8c42" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="138.16" strokeLinecap="round" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                                <p style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0 0 0' }}>€7,999</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card / Secondary Stat */}
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
                        <h2 style={{ fontSize: '64px', margin: 0, fontWeight: '900', color: '#ff8c42' }}>+25%</h2>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginTop: '8px' }}>Incremento proyectado</p>
                        <p style={{ fontSize: '14px', color: '#aaa', marginTop: '16px', lineHeight: '1.6', maxWidth: '300px' }}>Basado en el crecimiento actual de suscripciones Premium y membresías corporativas.</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Transacciones Recientes</h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#666' }}>Últimas 10 operaciones del sistema</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Miembro</th>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Concepto</th>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Monto</th>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Método</th>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha</th>
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {tx.initial ? (
                                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,140,66,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#ff8c42' }}>
                                                {tx.initial}
                                            </div>
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,77,77,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4d' }}>
                                                {tx.icon}
                                            </div>
                                        )}
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}>{tx.name || 'Gasto Operativo'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '24px', color: '#aaa', fontSize: '14px' }}>{tx.concepto}</td>
                                <td style={{ padding: '24px', fontWeight: '700', color: tx.monto.startsWith('+') ? '#2ecc71' : '#ff4d4d', fontSize: '15px' }}>
                                    {tx.monto}
                                </td>
                                <td style={{ padding: '24px', color: '#aaa', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <CreditCard size={16} /> {tx.metodo}
                                    </div>
                                </td>
                                <td style={{ padding: '24px', color: '#666', fontSize: '13px' }}>{tx.fecha}</td>
                                <td style={{ padding: '24px' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '100px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        background: tx.estado === 'Completado' ? 'rgba(46,204,113,0.1)' : 'rgba(255,140,66,0.1)',
                                        color: tx.estado === 'Completado' ? '#2ecc71' : '#ff8c42'
                                    }}>
                                        {tx.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IngresosAdminTab;
