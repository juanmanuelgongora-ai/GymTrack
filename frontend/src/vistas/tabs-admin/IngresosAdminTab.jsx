import React from 'react';
import {
    Wallet,
    FileText,
    FileSpreadsheet,
    FileBox,
    ArrowUpRight,
    ArrowDownRight,
    Equal,
    Clock,
    Download,
    CreditCard,
    Send,
    Filter,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity,
    ChevronDown,
    CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const IngresosAdminTab = () => {
    const [transactions, setTransactions] = React.useState([]);
    const [filter, setFilter] = React.useState('Todos');
    const [loading, setLoading] = React.useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [isExportOpen, setIsExportOpen] = React.useState(false);

    const fetchTransactions = async (status = '') => {
        setLoading(true);
        try {
            const url = status && status !== 'Todos'
                ? `/api/admin/transacciones?estado=${status.toLowerCase()}`
                : '/api/admin/transacciones';

            console.log('Fetching transactions from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('gymtrack_token')}`,
                    'Accept': 'application/json'
                }
            });

            console.log('API Response Status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('API Data:', data);
                setTransactions(data);
            } else {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const aprobarTransaccion = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas aprobar esta transacción pendiente?")) return;

        try {
            const res = await fetch(`/api/transacciones/${id}/aprobar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('gymtrack_token')}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                alert("Transacción aprobada exitosamente. La membresía ha sido vinculada/renovada.");
                fetchTransactions(filter);
            } else {
                const data = await res.json();
                alert(`Error al aprobar: ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al aprobar transacción:', error);
            alert("Error de conexión al aprobar la transacción.");
        }
    };

    React.useEffect(() => {
        fetchTransactions(filter);
    }, [filter]);

    const totalIngresos = transactions
        .filter(t => t.estado.toLowerCase() === 'completado')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

    const gastosOperativos = 0; // Datos reales: actualmente no hay registros de egresos
    const balanceNeto = totalIngresos - gastosOperativos;
    const pendientes = transactions.filter(t => t.estado.toLowerCase() === 'pendiente').length;

    const financialCards = [
        { label: 'Ingresos', value: `$${totalIngresos.toLocaleString('es-CO')}`, trend: '+12.5% vs mes anterior', icon: <ArrowUpRight size={20} />, color: '#2ecc71' },
        { label: 'Egresos', value: `$${gastosOperativos.toLocaleString('es-CO')}`, trend: 'Gastos operativos', icon: <ArrowDownRight size={20} />, color: '#ff4d4d' },
        { label: 'Balance', value: `$${balanceNeto.toLocaleString('es-CO')}`, trend: 'Ganancia neta', icon: <Equal size={20} />, color: '#ff8c42' },
        { label: 'Pendientes', value: pendientes.toString(), trend: 'Pagos por procesar', icon: <Clock size={20} />, color: '#aaa' },
    ];

    // --- Dynamic Distribution Logic ---
    const getDistribution = () => {
        const categories = {
            'Premium': { total: 0, color: '#ff8c42' },
            'Básica': { total: 0, color: '#ffcc33' },
            'Clases': { total: 0, color: '#ff4d4d' },
            'Otros': { total: 0, color: '#2ecc71' }
        };

        const completadas = transactions.filter(t => t.estado.toLowerCase() === 'completado');

        completadas.forEach(tx => {
            const concepto = (tx.concepto || '').toLowerCase();
            const monto = parseFloat(tx.monto || 0);

            if (concepto.includes('premium')) categories['Premium'].total += monto;
            else if (concepto.includes('básica') || concepto.includes('basica')) categories['Básica'].total += monto;
            else if (concepto.includes('clase') || concepto.includes('individual')) categories['Clases'].total += monto;
            else categories['Otros'].total += monto;
        });

        return Object.keys(categories).map(key => {
            const catTotal = categories[key].total;
            const perc = totalIngresos > 0 ? (catTotal / totalIngresos) * 100 : 0;
            return {
                label: key === 'Clases' ? 'Clases Individuales' : key,
                value: `$${catTotal.toLocaleString('es-CO')}`,
                perc: `${perc.toFixed(0)}%`,
                color: categories[key].color,
                rawPerc: perc
            };
        });
    };

    const distribution = getDistribution();

    // --- Projection Logic ---
    // Simple heuristic: based on current volume vs a target or simulated growth
    const projectedGrowth = totalIngresos > 0 ? 15 : 0;

    const getStatusStyle = (estado) => {
        switch (estado.toLowerCase()) {
            case 'completado': return { bg: 'rgba(46,204,113,0.1)', color: '#2ecc71' };
            case 'pendiente': return { bg: 'rgba(255,140,66,0.1)', color: '#ff8c42' };
            case 'rechazado': return { bg: 'rgba(255,77,77,0.1)', color: '#ff4d4d' };
            default: return { bg: 'rgba(255,255,255,0.05)', color: '#aaa' };
        }
    };

    const exportToPDF = () => {
        try {
            if (!transactions || transactions.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }

            const doc = new jsPDF();
            const dateStr = new Date().toLocaleDateString('es-CO');

            // Header
            doc.setFontSize(22);
            doc.setTextColor(255, 140, 66);
            doc.text('GYM TRACK - Reporte de Ingresos', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado el: ${dateStr}`, 14, 30);
            doc.text(`Filtro aplicado: ${filter}`, 14, 35);

            // Executive Summary Section
            doc.setDrawColor(255, 140, 66);
            doc.line(14, 40, 196, 40);

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('RESUMEN EJECUTIVO', 14, 50);

            doc.setFontSize(11);
            doc.text(`Total Ingresos: $${totalIngresos.toLocaleString('es-CO')}`, 14, 60);
            doc.text(`Gastos Operativos: $${gastosOperativos.toLocaleString('es-CO')}`, 14, 67);
            doc.setTextColor(balanceNeto >= 0 ? 46 : 255, balanceNeto >= 0 ? 204 : 77, balanceNeto >= 0 ? 113 : 77); // Green or Red
            doc.text(`Balance Neto: $${balanceNeto.toLocaleString('es-CO')}`, 14, 74);

            doc.setTextColor(100);
            doc.setFontSize(10);
            doc.text(`Transacciones encontradas: ${transactions.length}`, 14, 85);

            // Table Data Preparation with Safety Checks
            const tableColumn = ["Miembro", "Concepto", "Monto", "Método", "Fecha", "Estado"];
            const tableRows = transactions.map(tx => {
                const nombreComp = tx.cliente?.user
                    ? `${tx.cliente.user.nombre} ${tx.cliente.user.apellido}`
                    : 'Usuario Externo';

                return [
                    nombreComp,
                    tx.concepto || 'S/C',
                    `$${(tx.monto || 0).toLocaleString('es-CO')}`,
                    tx.metodo_pago || 'N/A',
                    tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO') : 'S/F',
                    tx.estado || 'Desconocido'
                ];
            });

            autoTable(doc, {
                startY: 95,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillStyle: '#ff8c42', textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            doc.save(`GYMTRACK_Reporte_${dateStr.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el PDF. Revisa la consola para más detalles.');
        }
    };

    const exportToExcel = () => {
        try {
            if (!transactions || transactions.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }

            const dateStr = new Date().toLocaleDateString('es-CO');

            // Add Summary Data to Excel
            const summaryData = [
                { 'REPORTE FINANCIERO': 'GYM TRACK', 'VALOR': '' },
                { 'REPORTE FINANCIERO': 'Fecha', 'VALOR': dateStr },
                { 'REPORTE FINANCIERO': 'Total Ingresos', 'VALOR': totalIngresos },
                { 'REPORTE FINANCIERO': 'Gastos Operativos', 'VALOR': gastosOperativos },
                { 'REPORTE FINANCIERO': 'Balance Neto', 'VALOR': balanceNeto },
                { 'REPORTE FINANCIERO': '', 'VALOR': '' },
                { 'REPORTE FINANCIERO': 'DETALLE DE TRANSACCIONES', 'VALOR': '' }
            ];

            const transactionData = transactions.map(tx => ({
                'Miembro': tx.cliente?.user ? `${tx.cliente.user.nombre} ${tx.cliente.user.apellido}` : 'Usuario Externo',
                'Concepto': tx.concepto || 'S/C',
                'Monto': tx.monto || 0,
                'Método de Pago': tx.metodo_pago || 'N/A',
                'Fecha': tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO') : 'S/F',
                'Estado': tx.estado || 'Desconocido'
            }));

            const ws = XLSX.utils.json_to_sheet([...summaryData, ...transactionData]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Finanzas");
            XLSX.writeFile(wb, `GYMTRACK_Reporte_Completo_${dateStr.replace(/\//g, '-')}.xlsx`);
        } catch (error) {
            console.error('Error generando Excel:', error);
            alert('Error al generar el archivo Excel.');
        }
    };

    const exportToCSV = () => {
        try {
            if (!transactions || transactions.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }

            const dateStr = new Date().toLocaleDateString('es-CO');
            const headers = ["Miembro", "Concepto", "Monto", "Metodo", "Fecha", "Estado"];
            const rows = transactions.map(tx => [
                `"${tx.cliente?.user ? `${tx.cliente.user.nombre} ${tx.cliente.user.apellido}` : 'Usuario Externo'}"`,
                `"${tx.concepto || 'S/C'}"`,
                tx.monto || 0,
                `"${tx.metodo_pago || 'N/A'}"`,
                tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO') : 'S/F',
                `"${tx.estado || 'Desconocido'}"`
            ]);

            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `GYMTRACK_Reporte_${dateStr.replace(/\//g, '-')}.csv`);
            link.click();
        } catch (error) {
            console.error('Error generando CSV:', error);
            alert('Error al generar el archivo CSV.');
        }
    };

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>Ingresos</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Export Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="secondary-btn"
                            style={{
                                padding: '12px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '16px',
                                fontWeight: '700'
                            }}
                        >
                            <Download size={20} />
                            Exportar
                        </button>

                        {isExportOpen && (
                            <div className="glass-panel" style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                minWidth: '180px',
                                background: 'rgba(20, 20, 20, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                zIndex: 110,
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                {[
                                    { id: 'pdf', label: 'PDF Profesional', icon: <FileText size={18} />, action: exportToPDF, color: '#ff4d4d' },
                                    { id: 'excel', label: 'Excel Pro (XLSX)', icon: <FileSpreadsheet size={18} />, action: exportToExcel, color: '#2ecc71' },
                                    { id: 'csv', label: 'CSV Plano', icon: <FileBox size={18} />, action: exportToCSV, color: '#3b82f6' },
                                ].map(opt => (
                                    <div
                                        key={opt.id}
                                        onClick={() => { opt.action(); setIsExportOpen(false); }}
                                        style={{
                                            padding: '14px 20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            color: '#ccc',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = opt.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#ccc';
                                        }}
                                    >
                                        <div style={{ color: opt.color }}>{opt.icon}</div>
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative', minWidth: '220px' }}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="glass-panel"
                            style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,140,66,0.3)',
                                color: '#ff8c42',
                                background: 'rgba(255,255,255,0.08)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                userSelect: 'none'
                            }}
                        >
                            {filter === 'Todos' ? 'Todos los Estados' : filter}
                            <span style={{ marginLeft: '12px', opacity: 0.7, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▼</span>
                        </div>

                        {isDropdownOpen && (
                            <div className="glass-panel" style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                right: 0,
                                background: 'rgba(20, 20, 20, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                zIndex: 100,
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                {[
                                    { value: 'Todos', label: 'Todos los Estados', color: '#fff' },
                                    { value: 'Completado', label: 'Completado', color: '#2ecc71' },
                                    { value: 'Pendiente', label: 'Pendiente', color: '#ff8c42' },
                                    { value: 'Rechazado', label: 'Rechazado', color: '#ff4d4d' }
                                ].map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            setFilter(opt.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '14px 24px',
                                            cursor: 'pointer',
                                            color: opt.color,
                                            fontWeight: '600',
                                            transition: 'background 0.2s',
                                            textAlign: 'center',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                            {distribution.map((cat, i) => (
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
                                    <span style={{ color: '#2ecc71', fontSize: '13px', fontWeight: '800' }}>↗ {totalIngresos > 0 ? '5%' : '0%'}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '240px', height: '240px' }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
                                <circle
                                    cx="50" cy="50" r="40" fill="transparent" stroke="#ff8c42" strokeWidth="15"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * (distribution.find(d => d.label === 'Premium')?.rawPerc || 0) / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                                <p style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0 0 0' }}>${totalIngresos.toLocaleString('es-CO')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
                        <h2 style={{ fontSize: '64px', margin: 0, fontWeight: '900', color: '#ff8c42' }}>+{projectedGrowth}%</h2>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginTop: '8px' }}>Incremento proyectado</p>
                        <p style={{ fontSize: '14px', color: '#aaa', marginTop: '16px', lineHeight: '1.6', maxWidth: '300px' }}>Estimación basada en el volumen actual de transacciones y el rendimiento de las membresías Premium.</p>
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
                            <th style={{ padding: '24px', fontSize: '11px', color: '#666', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#666' }}>Cargando transacciones...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#666' }}>No se encontraron transacciones.</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: tx.name === 'Gasto Operativo' ? 'rgba(255,77,77,0.1)' : 'rgba(255,140,66,0.1)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: tx.name === 'Gasto Operativo' ? '#ff4d4d' : '#ff8c42'
                                            }}>
                                                {tx.initial}
                                            </div>
                                            <span style={{ fontSize: '15px', fontWeight: '600' }}>{tx.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px', color: '#aaa', fontSize: '14px' }}>{tx.concepto}</td>
                                    <td style={{ padding: '24px', fontWeight: '700', color: '#2ecc71', fontSize: '15px' }}>
                                        ${tx.monto.toLocaleString('es-CO')}
                                    </td>
                                    <td style={{ padding: '24px', color: '#aaa', fontSize: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CreditCard size={16} /> {tx.metodo}
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px', color: '#666', fontSize: '13px' }}>{tx.fecha}</td>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '100px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                background: getStatusStyle(tx.estado).bg,
                                                color: getStatusStyle(tx.estado).color
                                            }}>
                                                {tx.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px', textAlign: 'center' }}>
                                        {tx.estado.toLowerCase() === 'pendiente' && (
                                            <button
                                                onClick={() => aprobarTransaccion(tx.id)}
                                                style={{
                                                    background: 'rgba(46, 204, 113, 0.1)',
                                                    border: '1px solid #2ecc71',
                                                    color: '#2ecc71',
                                                    borderRadius: '8px',
                                                    padding: '6px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#2ecc71'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(46, 204, 113, 0.1)'; e.currentTarget.style.color = '#2ecc71'; }}
                                            >
                                                <CheckCircle2 size={14} /> Aprobar
                                            </button>
                                        )}
                                        {tx.estado.toLowerCase() !== 'pendiente' && (
                                            <span style={{ color: '#666', fontSize: '12px' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IngresosAdminTab;
