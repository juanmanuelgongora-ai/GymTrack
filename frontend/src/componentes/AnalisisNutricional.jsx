import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  PieChart, Pie, Cell 
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import '../estilos/AnalisisNutricional.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="an-tooltip glass-panel">
        <p className="an-tooltip-label">{label}</p>
        <p className="an-tooltip-value">
          <span style={{color: '#ff6b35', fontWeight: 'bold'}}>{payload[0].value}</span> kcal
        </p>
      </div>
    );
  }
  return null;
};

const AnalisisNutricional = ({ consumido, metas }) => {
  const kcal = consumido?.kcal || 0;
  const p = consumido?.p || 0;
  const c = consumido?.c || 0;
  const g = consumido?.g || 0;
  
  const mKcal = metas?.kcal || 2600;

  const calData = [
    { day: 'Mar', cal: 1800 },
    { day: 'Mié', cal: 1500 },
    { day: 'Jue', cal: 1800 },
    { day: 'Vie', cal: 2100 },
    { day: 'Sab', cal: 2400 },
    { day: 'Dom', cal: 2200 },
    { day: 'Hoy', cal: kcal },
  ];

  const totalMacros = p + c + g;
  const pPct = totalMacros > 0 ? ((p / totalMacros) * 100).toFixed(1) : 0;
  const cPct = totalMacros > 0 ? ((c / totalMacros) * 100).toFixed(1) : 0;
  const gPct = totalMacros > 0 ? ((g / totalMacros) * 100).toFixed(1) : 0;

  // Si no hay datos, mostrar todo en 0 para evitar que el donut de Recharts explote
  const chartMacroData = totalMacros > 0 ? [
    { name: 'Proteínas', value: p, pct: pPct, color: '#ff6b35' },
    { name: 'Carbohidratos', value: c, pct: cPct, color: '#3b82f6' },
    { name: 'Grasas', value: g, pct: gPct, color: '#eab308' }
  ] : [
    { name: 'Proteínas', value: 0.1, pct: 0, color: 'rgba(255,255,255,0.05)' }
  ];

  const legendMacroData = [
    { name: 'Proteínas', value: p, pct: pPct, color: '#ff6b35' },
    { name: 'Carbohidratos', value: c, pct: cPct, color: '#3b82f6' },
    { name: 'Grasas', value: g, pct: gPct, color: '#eab308' }
  ];

  return (
    <div className="an-container glass-panel">
      {/* HEADER PRINCIPAL */}
      <div className="an-main-header">
        <h2 className="an-title">Análisis Nutricional</h2>
      </div>

      <div className="an-grid">
        {/* GRÁFICA DE LÍNEAS - CALORÍAS */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>Consumo de Calorías (Últimos 7 días)</h3>
            <p>Evolución diaria de tu ingesta</p>
          </div>
          <div className="an-chart-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={calData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8a8a8e', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8a8a8e', fontSize: 12 }}
                  domain={[0, 3200]}
                  ticks={[0, 800, 1600, 2400, 3200]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <ReferenceLine y={mKcal} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" label={{ position: 'top', value: `Objetivo: ${mKcal} kcal`, fill: '#8a8a8e', fontSize: 11 }} />
                <Area 
                  type="monotone" 
                  dataKey="cal" 
                  stroke="#ff6b35" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCal)" 
                  activeDot={{ r: 6, fill: '#ff6b35', stroke: '#121214', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICA DE PASTEL - MACROS */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>Distribución de Macronutrientes (Hoy)</h3>
            <p>Relación porcentual de tus macros</p>
          </div>
          
          <div className="an-donut-layout">
            <div className="an-donut-chart">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartMacroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={totalMacros > 0 ? 5 : 0}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartMacroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="an-donut-legend">
              {legendMacroData.map((macro, idx) => (
                <div key={idx} className="an-legend-item">
                  <div className="an-legend-color" style={{ background: macro.color }}></div>
                  <div className="an-legend-info">
                    <span className="an-legend-name" style={{ color: macro.color }}>{macro.name}</span>
                    <span className="an-legend-value">{macro.value}g ({macro.pct}%)</span>
                  </div>
                </div>
              ))}

              <div className="an-optimal-balance">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Balance óptimo para tu objetivo de <strong style={{color: '#10b981'}}>Ganancia Muscular</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisNutricional;
