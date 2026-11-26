import express from 'express';
import cors from 'cors';
import PDFDocument from 'pdfkit-table';
import ExcelJS from 'exceljs';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Permitir payloads de datos grandes

/**
 * Endpoints
 */

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'GymTrack Report Microservice Running...' });
});

app.post('/api/export/pdf', async (req, res) => {
    try {
        const { transactions, summary } = req.body;
        console.log(`[POST /api/export/pdf] Received request with ${transactions?.length || 0} transactions`);

        if (!transactions || !summary) {
            console.error('Missing data in request');
            return res.status(400).json({ error: 'Missing data' });
        }

        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(22).fillColor('#ff8c42').text('GYMTRACK', { align: 'center' });
        doc.fontSize(14).fillColor('#333333').text('Reporte Financiero', { align: 'center' });
        doc.moveDown(2);

        // Summary
        doc.fontSize(12).fillColor('#000000');
        doc.text(`Total Ingresos: $${summary.totalIngresos.toLocaleString()}`);
        doc.text(`Gastos Operativos: $${summary.gastosOperativos.toLocaleString()}`);

        const balanceColor = summary.balanceNeto >= 0 ? '#2ecc71' : '#e74c3c';
        doc.fillColor(balanceColor).text(`Balance Neto: $${summary.balanceNeto.toLocaleString()}`);
        doc.moveDown(2);

        // Table
        const table = {
            title: "Detalle de Transacciones",
            headers: ["Miembro", "Concepto", "Monto", "Metodo", "Fecha", "Estado"],
            rows: transactions.map(t => [
                t.Miembro,
                t.Concepto,
                `$${parseFloat(t.Monto || 0).toLocaleString()}`,
                t.Metodo || 'N/A',
                t.Fecha || 'S/F',
                t.Estado || 'Desc.'
            ]),
        };

        await doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(9),
            prepareRow: () => doc.font("Helvetica").fontSize(9).fillColor('#444444')
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        if (!res.headersSent) res.status(500).send('Error generating PDF');
    }
});

app.post('/api/export/excel', async (req, res) => {
    try {
        const { transactions, summary } = req.body;

        if (!transactions || !summary) {
            return res.status(400).json({ error: 'Missing data' });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Finanzas');

        // Styles
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 30;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 15;
        sheet.getColumn(6).width = 15;

        // Header Summary
        sheet.addRow(['REPORTE FINANCIERO', 'VALOR']).font = { bold: true };
        sheet.addRow(['Total Ingresos', summary.totalIngresos]);
        sheet.addRow(['Gastos Operativos', summary.gastosOperativos]);
        sheet.addRow(['Balance Neto', summary.balanceNeto]);

        sheet.addRow(['']);

        // Transaction Headers
        const headerRow = sheet.addRow(["Miembro", "Concepto", "Monto", "Método", "Fecha", "Estado"]);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF8C42' }
            };
        });

        // Loop rows
        transactions.forEach(t => {
            sheet.addRow([t.Miembro, t.Concepto, parseFloat(t.Monto || 0), t.Metodo || '-', t.Fecha || '-', t.Estado || '-']);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        if (!res.headersSent) res.status(500).send('Error generating Excel');
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`[GymTrack Reportes] Microservicio escuchando en el puerto ${PORT}`));
