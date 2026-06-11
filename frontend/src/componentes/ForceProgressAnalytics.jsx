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
import { Target, Zap, TrendingUp, Dumbbell, Flag, Clock3, ArrowDownRight, CheckCircle2 } from 'lucide-react';

const fallbackData = [
  { label: 'Semana 1', fecha: 'W1', peso: 0, variacion: '+0', progreso: 0 },
  { label: 'Semana 2', fecha: 'W2', peso: 0, variacion: '+0', progreso: 0 },
  { label: 'Semana 3', fecha: 'W3', peso: 0, variacion: '+0', progreso: 0 },
  { label: 'Semana 4', fecha: 'W4', peso: 0, variacion: '+0', progreso: 0 },
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
  id: objective.id ?? objective.id_hito ?? objective.titulo ?? Math.random().toString(36).slice(2),
  titulo: objective.titulo ?? objective.nombre ?? 'Objetivo',
  tipo: objective.tipo ?? 'fuerza',
  estado: objective.estado ?? 'en_progreso',
  objetivo: Number(objective.meta_valor ?? objective.valor_objetivo ?? 100),
  actual: Number(objective.valor_actual ?? objective.valor_inicial ?? 0),
  progreso: Number(objective.progreso_porcentaje ?? objective.progreso ?? 0),
  maximo: Number(objective.maximo ?? objective.valor_actual ?? objective.valor_inicial ?? 0),
  sesiones_registradas: Number(objective.sesiones_registradas ?? objective.registros ?? objective.sesiones ?? 1),
  promedio_semanal: Number(objective.promedio_semanal ?? 0).toFixed(1),
  mejor_sesion: objective.mejor_sesion || `Semana ${Math.max(1, Number(objective.sesiones_registradas ?? objective.registros ?? objective.sesiones ?? 1))}`,
  ultima_actualizacion: objective.updated_at ?? objective.fecha_limite ?? 'Reciente',
});

const buildFallbackData = (objective) => {
  const formatted = formatObjective(objective);
  const points = 5;
  const initial = Number(objective.valor_inicial ?? 60);
  const current = Math.max(formatted.actual, initial);
  return Array.from({ length: points }, (_, idx) => {
    const factor = idx / (points - 1);
    const peso = Math.round(initial + factor * (current - initial));
    const anterior = idx === 0 ? initial : Math.round(initial + ((idx - 1) / (points - 1)) * (current - initial));
    return {
      label: `Semana ${idx + 1}`,
      fecha: `W${idx + 1}`,
      peso,
      variacion: idx === 0 ? '+0' : `${peso - anterior} kg`,
      progreso: Math.min(100, Math.round((peso / Math.max(formatted.objetivo, 1)) * 100)),
    };
  });
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
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [objectiveOptions, setObjectiveOptions] = useState([]);
  const wrapperRef = useRef(null);

  const getStatusLabel = (status) => ESTADO_LABELS[status] || 'Activo';

  useEffect(() => {
    if (objectives && objectives.length > 0) {
      setObjectiveOptions(objectives);
      return;
    }

    const fetchObjectives = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/hitos?tipo=fuerza', {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setObjectiveOptions(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Error fetching force objectives:', e);
      }
    };

    fetchObjectives();
  }, [objectives, token]);

  const formattedOptions = useMemo(
    () => objectiveOptions.map(item => ({
      ...formatObjective(item),
      tipoConfig: OBJECTIVE_TYPE_CONFIG[item.tipo] || OBJECTIVE_TYPE_CONFIG.default,
      estado_text: getStatusLabel(item.estado),
    })),
    [objectiveOptions],
  );

  useEffect(() => {
    if (!selectedId && formattedOptions.length > 0) {
      const next = formattedOptions.find(item => item.estado === 'en_progreso') || formattedOptions[0];
      setSelectedId(next?.id);
    } else if (selectedId && !formattedOptions.some(item => item.id === selectedId)) {
      const next = formattedOptions.find(item => item.estado === 'en_progreso') || formattedOptions[0];
      setSelectedId(next?.id);
    }
  }, [formattedOptions, selectedId]);

  const selectedObjective = useMemo(
    () => formattedOptions.find(item => item.id === selectedId) || formattedOptions[0],
    [formattedOptions, selectedId],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    const loadObjectiveData = async (selected) => {
      if (!selected) return;
      setSummary(defaultSummary);
      setChartData(fallbackData);
      let history = null;
      const formatted = formatObjective(selected);
      try {
        const response = await fetch(`/api/hitos/${selected.id}/historial`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (response.ok) {
          const payload = await response.json();
          history = payload.historial || payload.sesiones || payload.data || null;
          if (payload.actual !== undefined) formatted.actual = Number(payload.actual);
          if (payload.maximo !== undefined) formatted.maximo = Number(payload.maximo);
          if (payload.progreso !== undefined) formatted.progreso = Number(payload.progreso);
          if (payload.promedio_semanal !== undefined) formatted.promedio_semanal = Number(payload.promedio_semanal).toFixed(1);
          if (payload.mejor_sesion !== undefined) formatted.mejor_sesion = payload.mejor_sesion;
          if (payload.sesiones_registradas !== undefined) formatted.sesiones_registradas = Number(payload.sesiones_registradas);
          if (payload.ultima_actualizacion) formatted.ultima_actualizacion = payload.ultima_actualizacion;
        }
      } catch (error) {
        console.warn('Objective history not available:', error);
      }

      const chartPoints = (history && Array.isArray(history) && history.length > 0)
        ? history.map((item, index) => {
          const peso = Number(item.peso ?? item.valor ?? formatted.actual);
          const previous = Number(history[index - 1]?.peso ?? history[index - 1]?.valor ?? formatted.actual);
          return {
            label: item.label || `Sesión ${index + 1}`,
            fecha: item.fecha || item.label || `Semana ${index + 1}`,
            peso,
            variacion: index === 0 ? '+0' : `${peso - previous} kg`,
            progreso: Number(item.progreso ?? Math.min(100, Math.round((peso / Math.max(formatted.objetivo, 1)) * 100))),
          };
        })
        : buildFallbackData(formatted);

      setChartData(chartPoints);
      setSummary({
        ejercicio: formatted.titulo,
        objetivo: formatted.objetivo,
        actual: formatted.actual,
        progreso: Math.min(100, formatted.progreso),
        maximo: formatted.maximo,
        promedio_semanal: formatted.promedio_semanal,
        mejor_sesion: formatted.mejor_sesion,
        sesiones_registradas: formatted.sesiones_registradas,
        ultima_actualizacion: formatted.ultima_actualizacion,
      });
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
      {formattedOptions.length === 0 ? (
        <div className="force-placeholder">
          <div className="placeholder-graphic">
            <TrendingUp size={64} className="text-brand" />
          </div>
          <h2 className="glow-text">No hay objetivos de fuerza disponibles</h2>
          <p className="text-secondary">Agrega un nuevo objetivo para que el panel se active y tus progresos se visualicen automáticamente.</p>
        </div>
      ) : (
        <>
          <div className="force-progress-header">
            <div>
              <h2>Progreso de Fuerza</h2>
              <p className="text-secondary">Tus estadísticas cambian al seleccionar un objetivo o ejercicio.</p>
            </div>
            <div className="force-selector">
              <button className="force-select-toggle" type="button" onClick={() => setDropdownOpen(prev => !prev)}>
                <span className="option-icon" style={{ background: selectedObjective?.tipoConfig?.color || '#ff6b35' }}>
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
                  {formattedOptions.map(item => (
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
                <span>Evolución del ejercicio</span>
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
                    <Area type="monotone" dataKey="peso" stroke="none" fill="url(#forceGradient)" isAnimationActive animationDuration={1200} />
                    <Line type="monotone" dataKey="peso" stroke="#ff6b35" strokeWidth={3} dot={{ fill: '#ff6b35', stroke: '#0d0d0d', strokeWidth: 3, r: 5 }} activeDot={{ r: 7 }} animationDuration={1200} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="force-mini-metrics">
                {[
                  { label: 'Peso inicial', value: `${chartData[0]?.peso ?? summary.actual} kg`, accent: '#9698a6' },
                  { label: 'Peso máximo', value: `${summary.maximo} kg`, accent: '#ff6b35' },
                  { label: 'Incremento total', value: `${Math.max(0, summary.maximo - (chartData[0]?.peso ?? summary.actual))} kg`, accent: '#22c55e' },
                ].map((metric, index) => (
                  <motion.div key={index} className="force-mini-card" whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                    <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{metric.label}</span>
                    <strong style={{ display: 'block', marginTop: 8, color: metric.accent }}>{metric.value}</strong>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="force-progress-summary">
              <div className="summary-card chart-donut-card">
                <div className="summary-title">
                  <div>
                    <h3>Progreso del objetivo</h3>
                    <p className="text-secondary">Meta de fuerza a alcanzar</p>
                  </div>
                  <div className="donut-legend">
                    <span>{summary.actual} kg</span>
                    <small>/ {summary.objetivo} kg</small>
                  </div>
                </div>
                <div className="donut-chart">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={donutData} dataKey="value" startAngle={90} endAngle={-270} innerRadius={68} outerRadius={88} paddingAngle={4} stroke="transparent">
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
                {[{
                  label: 'Mejor marca', value: summary.mejor_sesion,
                }, {
                  label: 'Promedio semanal', value: `${summary.promedio_semanal} kg`,
                }, {
                  label: 'Sesiones registradas', value: `${summary.sesiones_registradas}`,
                }, {
                  label: 'Progreso mensual', value: monthlyProgress,
                }, {
                  label: 'Tendencia', value: trend,
                }, {
                  label: 'Última actualización', value: summary.ultima_actualizacion,
                }].map((item, index) => (
                  <div className="metric-box force-summary-card" key={index}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
}
