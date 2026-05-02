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
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Ingresos</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)' }}>
                        <Filter size={18} /> Filtrar
                    </button>
                    <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,140,66,0.3)', color: '#ff8c42', background: 'rgba(255,140,66,0.05)' }}>
                        <Download size={18} /> Exportar
                    </button>
                </div>
            </div>

            {/* Financial Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {financialCards.map((card, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ color: card.color, background: `${card.color}15`, padding: '10px', borderRadius: '12px' }}>
                                <DollarSign size={20} />
                            </div>
                            <span style={{ color: '#888', fontSize: '13px' }}>{card.label}</span>
                        </div>
                        <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{card.value}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: card.color, fontSize: '12px', fontWeight: '600' }}>
                            {card.icon} {card.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                {/* Distribution Chart */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Distribución de Ingresos</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Premium', value: '€3,399.55', perc: '45%', color: '#ff8c42' },
                                { label: 'Básica', value: '€2,799.30', perc: '35%', color: '#ffcc33' },
                                { label: 'Clases Individuales', value: '€1,200.00', perc: '15%', color: '#ff4d4d' },
                                { label: 'Otros', value: '€400.00', perc: '5%', color: '#2ecc71' }
                            ].map((cat, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${cat.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: cat.color }}>
                                            {cat.perc}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{cat.label}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>{cat.value}</p>
                                        </div>
                                    </div>
                                    <span style={{ color: '#2ecc71', fontSize: '11px', fontWeight: 'bold' }}>↗ 8%</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2c2c2e" strokeWidth="15" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff8c42" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="138.16" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>Total</p>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>€7,999</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card / Secondary Stat */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-gradient)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)' }}></div>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '40px', margin: 0 }}>+25%</h2>
                        <p style={{ fontSize: '16px', opacity: 0.8 }}>Incremento proyectado</p>
                        <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '16px' }}>Basado en el crecimiento actual de suscripciones Premium.</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Transacciones Recientes</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Últimas 10 operaciones</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Miembro</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Concepto</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Monto</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Método</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {tx.initial ? (
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#ff8c42' }}>
                                                {tx.initial}
                                            </div>
                                        ) : (
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,77,77,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4d' }}>
                                                {tx.icon}
                                            </div>
                                        )}
                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{tx.name || 'Gasto Operativo'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', color: '#888', fontSize: '13px' }}>{tx.concepto}</td>
                                <td style={{ padding: '16px 24px', fontWeight: '600', color: tx.monto.startsWith('+') ? '#2ecc71' : '#ff4d4d', fontSize: '13px' }}>
                                    {tx.monto}
                                </td>
                                <td style={{ padding: '16px 24px', color: '#888', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CreditCard size={14} /> {tx.metodo}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', color: '#666', fontSize: '12px' }}>{tx.fecha}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '100px',
                                        fontSize: '11px',
                                        fontWeight: '600',
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
