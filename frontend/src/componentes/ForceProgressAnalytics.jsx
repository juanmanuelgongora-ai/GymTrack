import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../logica/UserContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Target, Zap, TrendingUp, Dumbbell, Flag, Clock3, ArrowDownRight, CheckCircle2, TrendingDown } from 'lucide-react';

const fallbackData = [
  { label: 'Sesión 1', fecha: '...', peso: 0, variacion: '+0', progreso: 0 },
  { label: 'Sesión 2', fecha: '...', peso: 0, variacion: '+0', progreso: 0 },
];

const defaultSummary = {
  ejercicio: 'Sin ejercicio seleccionado',
  objetivo: 0,
  actual: 0,
  progreso: 0,
  maximo: 0,
  promedio_semanal: 0,
  mejor_sesion: '-',
  sesiones_registradas: 0,
  ultima_actualizacion: 'Sin registros',
};

const OBJECTIVE_TYPE_CONFIG = {
  fuerza: { icon: <TrendingUp size={16} />, color: '#ff6b35', label: 'Fuerza' },
  peso: { icon: <Target size={16} />, color: '#f97316', label: 'Peso' },
  hipertrofia: { icon: <Zap size={16} />, color: '#a855f7', label: 'Hipertrofia' },
  resistencia: { icon: <Flag size={16} />, color: '#eab308', label: 'Resistencia' },
  composicion: { icon: <Dumbbell size={16} />, color: '#0ea5e9', label: 'Composición' },
  default: { icon: <Clock3 size={16} />, color: '#8b5cf6', label: 'Objetivo' },
};

const ESTADO_LABELS = {
  en_progreso: 'Activo',
  completado: 'Completado',
  pausado: 'Pausado',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="force-tooltip glass-panel" style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="text-secondary" style={{ margin: 0, fontSize: '0.8rem' }}>{item.fecha}</p>
      <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.peso} kg</p>
      <p className="text-secondary" style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>Variación: {item.variacion}</p>
      <p className="text-secondary" style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>Progreso: {item.progreso}%</p>
    </div>
  );
};

const formatObjective = (objective = {}) => ({
  ...objective,
  objetivo: Number(objective.meta_valor ?? objective.valor_objetivo ?? 100),
  actual: Number(objective.valor_actual ?? objective.valor_inicial ?? 0),
  progreso: Number(objective.progreso_porcentaje ?? objective.progreso ?? 0),
  maximo: Number(objective.maximo ?? objective.valor_actual ?? objective.valor_inicial ?? 0),
  sesiones_registradas: Number(objective.sesiones_registradas ?? objective.registros ?? objective.sesiones ?? 1),
  mejor_sesion: objective.mejor_sesion || `Semana ${Math.max(1, Number(objective.sesiones_registradas ?? objective.registros ?? objective.sesiones ?? 1))}`,
  ultima_actualizacion: objective.updated_at || objective.fecha_limite || 'Reciente',
});

const buildFallbackData = (objective) => {
  const formatted = formatObjective(objective);
  const points = 5;
  const values = Array.from({ length: points }, (_, idx) => {
    const factor = idx / (points - 1);
    const peso = Math.round((formatted.valor_inicial ?? 60) + factor * (formatted.actual - (formatted.valor_inicial ?? 60)));
    return {
      label: `Semana ${idx + 1}`,
      fecha: `W${idx + 1}`,
      peso,
      variacion: idx === 0 ? '+0' : `${peso - Math.round((formatted.valor_inicial ?? 60) + (factor - 1 / (points - 1)) * (formatted.actual - (formatted.valor_inicial ?? 60)))} kg`,
      progreso: Math.min(100, Math.round((peso / Math.max(formatted.objetivo, 1)) * 100)),
    };
  });
  return values;
};

const calculateTrend = (data = []) => {
  if (data.length < 2) return 'Estable';
  const delta = data[data.length - 1].peso - data[0].peso;
  if (delta >= 8) return 'Tendencia Fuerte';
  if (delta >= 4) return 'Tendencia Positiva';
  if (delta >= 1) return 'Tendencia Suave';
  return 'Estable';
};

export default function ForceProgressAnalytics({ objectives = [] }) {
  const { token } = useUser();
  const [chartData, setChartData] = useState(fallbackData);
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [apiExercises, setApiExercises] = useState([]); // GT-55: Ejercicios reales con historia
  const wrapperRef = useRef(null);

  // Cargar lista de ejercicios con progreso (2+ sesiones)
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/analiticas/ejercicios', {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setApiExercises(data);
        }
      } catch (e) {
        console.error('Error fetching analytics exercises:', e);
      }
    };
    if (token) fetchExercises();
  }, [token]);

  const objectiveOptions = useMemo(
    () => {
      return apiExercises.map(obj => ({
        ...obj,
        tipoConfig: OBJECTIVE_TYPE_CONFIG[obj.tipo] || OBJECTIVE_TYPE_CONFIG.default,
        estado_text: 'Análisis Real',
      }));
    },
    [apiExercises],
  );

  useEffect(() => {
    if (!selectedId && objectiveOptions.length > 0) {
      const next = objectiveOptions.find(item => item.estado === 'en_progreso') || objectiveOptions[0];
      setSelectedId(next?.id);
    } else if (selectedId && !objectiveOptions.some(item => item.id === selectedId)) {
      const next = objectiveOptions.find(item => item.estado === 'en_progreso') || objectiveOptions[0];
      setSelectedId(next?.id);
    }
  }, [objectiveOptions, selectedId]);

  const selectedObjective = useMemo(
    () => objectiveOptions.find(item => item.id === selectedId) || objectiveOptions[0],
    [objectiveOptions, selectedId],
  );

  useEffect(() => {
    const handleClickOutside = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const loadObjectiveData = async selected => {
      if (!selected) return;
      setLoading(true);

      let fetchedData = null;
      try {
        const response = await fetch(`/api/analiticas/historial?ejercicio=${encodeURIComponent(selected.titulo)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const payload = await response.json();
          fetchedData = payload.sesiones;

          setSummary(prev => ({
            ...prev,
            ejercicio: payload.ejercicio,
            objetivo: payload.maximo * 1.2, // Sugerimos un +20% como meta visual
            actual: payload.actual,
            progreso: Math.round((payload.actual / (payload.maximo * 1.2)) * 100),
            maximo: payload.maximo,
            promedio_semanal: (payload.actual / Math.max(1, payload.sesiones_registradas)).toFixed(1),
            mejor_sesion: 'Récord',
            sesiones_registradas: payload.sesiones_registradas,
            ultima_actualizacion: payload.ultima_actualizacion,
          }));
        }
      } catch (error) {
        console.warn('Historial no disponible:', error);
      }

      if (fetchedData && fetchedData.length > 0) {
        setChartData(fetchedData.map((item, index) => ({
          label: item.label || `Semana ${index + 1}`,
          fecha: item.fecha || item.label || `Sesión ${index + 1}`,
          peso: Number(item.peso ?? item.valor ?? formattedObjective.actual),
          variacion: item.variacion || `${Number(item.peso ?? item.valor ?? formattedObjective.actual) - (Number(item.anterior ?? item.peso ?? item.valor ?? formattedObjective.actual) || 0)} kg`,
          progreso: Number(item.progreso ?? Math.min(100, Math.round(((item.peso ?? item.valor ?? formattedObjective.actual) / Math.max(formattedObjective.objetivo, 1)) * 100))),
        })));
      } else {
        setChartData(buildFallbackData(selected));
        setSummary(prev => ({
          ...prev,
          ejercicio: formattedObjective.titulo || formattedObjective.ejercicio || prev.ejercicio,
          objetivo: formattedObjective.objetivo,
          actual: formattedObjective.actual,
          progreso: formattedObjective.progreso,
          maximo: formattedObjective.maximo,
          promedio_semanal: formattedObjective.promedio_semanal,
          mejor_sesion: formattedObjective.mejor_sesion,
          sesiones_registradas: formattedObjective.sesiones_registradas,
          ultima_actualizacion: formattedObjective.ultima_actualizacion,
        }));
      }
      setLoading(false);
    };

    loadObjectiveData(selectedObjective);
  }, [selectedObjective, token]);

  const donutData = [
    { name: 'Progreso', value: summary.progreso },
    { name: 'Faltante', value: Math.max(0, 100 - summary.progreso) },
  ];

  const monthlyProgress = chartData.length >= 2
    ? `${Math.min(100, Math.round(((chartData[chartData.length - 1]?.peso ?? summary.actual) - (chartData[0]?.peso ?? 0)) / Math.max(summary.objetivo, 1) * 100))}%`
    : '0%';
  const trend = calculateTrend(chartData);

  return (
    <motion.section
      className="force-progress-panel glass-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      ref={wrapperRef}
    >
      {objectiveOptions.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', animation: 'fadeIn 0.6s ease' }}>
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            <TrendingUp size={64} className="text-brand" style={{ position: 'relative', zIndex: 1, opacity: 0.8 }} />
          </div>
          <h2 className="glow-text mb-16" style={{ fontSize: '24px' }}>Tus Gráficos de Fuerza se están cocinando</h2>
          <p className="text-secondary mb-32" style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Para mostrarte una línea de progreso significativa, necesitamos que registres **al menos 2 sesiones** de un mismo ejercicio.
          </p>
          <div className="glass-panel" style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,107,53,0.2)' }}>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} className="text-brand" />
              <span>¡Sigue con tus rutinas y tus récords aparecerán aquí automáticamente!</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="force-progress-header">
            <div>
              <h2>Progreso de Fuerza</h2>
              <p>Seguimiento de evolución por ejercicio</p>
            </div>

            <div className="force-selector">
              <button className="force-select-toggle" type="button" onClick={() => setDropdownOpen(prev => !prev)}>
                <span className="option-icon" style={{ background: selectedObjective?.tipoConfig?.color ?? '#ff6b35' }}>
                  {selectedObjective?.tipoConfig?.icon || <Target size={16} />}
                </span>
                <div className="option-copy">
                  <strong>{selectedObjective?.titulo || 'Selecciona un objetivo'}</strong>
                  <small>{selectedObjective?.tipoConfig?.label || 'Objetivo'} · {selectedObjective?.estado_text || 'Activo'}</small>
                </div>
                <ArrowDownRight size={18} className={dropdownOpen ? 'rotate' : ''} />
              </button>
              {dropdownOpen && (
                <div className="force-select-menu glass-panel">
                  {objectiveOptions.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`force-select-item ${item.id === selectedObjective?.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedId(item.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="option-icon" style={{ background: item.tipoConfig?.color || '#ff6b35' }}>
                        {item.tipoConfig?.icon}
                      </span>
                      <div className="option-copy">
                        <strong>{item.titulo}</strong>
                        <small>{item.tipoConfig?.label} · {item.estado_text}</small>
                      </div>
                      <span className={`option-status ${item.estado}`}>{item.estado_text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="force-progress-grid">
            <div className="force-progress-chart">
              <div className="chart-title">
                <span>Evolución de Fuerza</span>
                <small>{summary.ejercicio}</small>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ top: 8, right: 14, left: -10, bottom: 4 }}>
                    <defs>
                      <linearGradient id="forceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.35} />
                        <stop offset="90%" stopColor="rgba(255,107,53,0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#9698a6', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9698a6', fontSize: 12 }} width={34} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.14)', strokeDasharray: '3 3' }} />
                    <Area
                      type="monotone"
                      dataKey="peso"
                      stroke="none"
                      fill="url(#forceGradient)"
                      isAnimationActive={true}
                      animationDuration={1200}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      stroke="#ff6b35"
                      strokeWidth={3}
                      dot={{ fill: '#ff6b35', stroke: '#fff', strokeWidth: 3, r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={1200}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* GT-54: Resumen de métricas del ejercicio seleccionado */}
              {(() => {
                const pesoInicial = chartData[0]?.peso ?? summary.actual;
                const pesoMaximo = summary.maximo || Math.max(...chartData.map(d => d.peso));
                const incrementoKg = pesoMaximo - pesoInicial;
                const incrementoPct = pesoInicial > 0 ? ((incrementoKg / pesoInicial) * 100).toFixed(1) : '0.0';
                const isPositive = incrementoKg >= 0;
                const metrics = [
                  {
                    label: 'Peso Inicial',
                    value: `${pesoInicial} kg`,
                    icon: <Target size={18} color="#9698a6" />,
                    color: '#9698a6',
                    bg: 'rgba(150,152,166,0.08)',
                  },
                  {
                    label: 'Peso Máximo Actual',
                    value: `${pesoMaximo} kg`,
                    icon: <TrendingUp size={18} color="#ff6b35" />,
                    color: '#ff6b35',
                    bg: 'rgba(255,107,53,0.08)',
                  },
                  {
                    label: 'Incremento Total',
                    value: `${isPositive ? '+' : ''}${incrementoKg} kg / ${isPositive ? '+' : ''}${incrementoPct}%`,
                    icon: isPositive
                      ? <TrendingUp size={18} color="#4ade80" />
                      : <TrendingDown size={18} color="#f87171" />,
                    color: isPositive ? '#4ade80' : '#f87171',
                    bg: isPositive ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)',
                  },
                ];
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                    {metrics.map((m, i) => (
                      <div key={i} style={{ background: m.bg, border: `1px solid ${m.color}22`, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: `${m.color}15`, padding: '8px', borderRadius: '8px', display: 'flex' }}>
                          {m.icon}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9698a6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
                          <strong style={{ fontSize: '1rem', color: m.color, fontWeight: 700 }}>{m.value}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="force-progress-summary">
              <div className="summary-card chart-donut-card">
                <div className="summary-title">
                  <div>
                    <h3>Progreso del Objetivo</h3>
                    <p>Meta de fuerza a alcanzar</p>
                  </div>
                  <div className="donut-legend">
                    <span>{summary.actual} kg</span>
                    <small>/ {summary.objetivo} kg</small>
                  </div>
                </div>
                <div className="donut-chart">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={68}
                        outerRadius={88}
                        paddingAngle={4}
                        stroke="transparent"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#ff6b35' : '#2f3341'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center">
                    <span>{summary.progreso}%</span>
                    <small>Completado</small>
                  </div>
                </div>
                <div className="donut-meta">
                  <div>
                    <span>Actual</span>
                    <strong>{summary.actual} kg</strong>
                  </div>
                  <div>
                    <span>Objetivo</span>
                    <strong>{summary.objetivo} kg</strong>
                  </div>
                  <div>
                    <span>Falta</span>
                    <strong>{Math.max(0, 100 - summary.progreso)}%</strong>
                  </div>
                </div>
              </div>

              <div className="summary-card metrics-grid">
                <div className="metric-box">
                  <span>Peso máximo alcanzado</span>
                  <strong>{summary.maximo} kg</strong>
                </div>
                <div className="metric-box">
                  <span>Promedio semanal</span>
                  <strong>{summary.promedio_semanal} kg</strong>
                </div>
                <div className="metric-box">
                  <span>Mejor sesión</span>
                  <strong>{summary.mejor_sesion}</strong>
                </div>
                <div className="metric-box">
                  <span>Sesiones registradas</span>
                  <strong>{summary.sesiones_registradas}</strong>
                </div>
                <div className="metric-box">
                  <span>Progreso mensual</span>
                  <strong>{monthlyProgress}</strong>
                </div>
                <div className="metric-box">
                  <span>Última actualización</span>
                  <strong>{summary.ultima_actualizacion}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
}
