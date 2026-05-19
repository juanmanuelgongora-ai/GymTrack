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
  { label: 'Semana 1', fecha: '01/05', peso: 60, variacion: '+3', progreso: 15 },
  { label: 'Semana 2', fecha: '08/05', peso: 64, variacion: '+4', progreso: 30 },
  { label: 'Semana 3', fecha: '15/05', peso: 68, variacion: '+4', progreso: 50 },
  { label: 'Semana 4', fecha: '22/05', peso: 72, variacion: '+4', progreso: 65 },
  { label: 'Semana 5', fecha: '29/05', peso: 75, variacion: '+3', progreso: 75 },
];

const defaultSummary = {
  ejercicio: 'Press Banca con Mancuernas',
  objetivo: 100,
  actual: 75,
  progreso: 75,
  maximo: 78,
  promedio_semanal: 14.8,
  mejor_sesion: 'Semana 5',
  sesiones_registradas: 5,
  ultima_actualizacion: 'Reciente',
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
  const wrapperRef = useRef(null);

  const objectiveOptions = useMemo(
    () => objectives.map(obj => ({
      ...obj,
      tipoConfig: OBJECTIVE_TYPE_CONFIG[obj.tipo] || OBJECTIVE_TYPE_CONFIG.default,
      estado_text: ESTADO_LABELS[obj.estado] || 'Activo',
    })),
    [objectives],
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
      const formattedObjective = formatObjective(selected);
      let fetchedData = null;
      try {
        const response = await fetch(`/api/hitos/${selected.id}/historial`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const payload = await response.json();
          fetchedData = payload.sesiones || payload.historial || payload.registros || payload.data;
          if (!Array.isArray(fetchedData)) fetchedData = null;
          setSummary(prev => ({
            ...prev,
            ejercicio: payload.ejercicio || formattedObjective.titulo,
            objetivo: payload.objetivo ?? formattedObjective.objetivo,
            actual: payload.actual ?? formattedObjective.actual,
            progreso: payload.progreso ?? formattedObjective.progreso,
            maximo: payload.maximo ?? formattedObjective.maximo,
            promedio_semanal: payload.promedio_semanal ?? formattedObjective.promedio_semanal,
            mejor_sesion: payload.mejor_sesion || formattedObjective.mejor_sesion,
            sesiones_registradas: payload.sesiones_registradas ?? formattedObjective.sesiones_registradas,
            ultima_actualizacion: payload.ultima_actualizacion || formattedObjective.ultima_actualizacion,
          }));
        }
      } catch (error) {
        console.warn('Historial no disponible para el objetivo:', error);
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

  const monthlyProgress = `${Math.min(100, Math.round(((chartData[chartData.length - 1]?.peso ?? summary.actual) - (chartData[0]?.peso ?? 0)) / Math.max(summary.objetivo, 1) * 100))}%`;
  const trend = calculateTrend(chartData);

  return (
    <motion.section
      className="force-progress-panel glass-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      ref={wrapperRef}
    >
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
    </motion.section>
  );
}
