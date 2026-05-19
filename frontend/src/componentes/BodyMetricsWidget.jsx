import { motion } from 'framer-motion';
import { Activity, ArrowDownRight, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';

const getImcState = (imc) => {
  if (imc < 18.5) return { label: 'Bajo peso', color: 'rgba(96, 165, 250, 0.95)' };
  if (imc < 25) return { label: 'Normal', color: 'rgba(34, 197, 94, 0.95)' };
  if (imc < 30) return { label: 'Sobrepeso', color: 'rgba(245, 158, 11, 0.95)' };
  return { label: 'Obesidad', color: 'rgba(239, 68, 68, 0.95)' };
};

const formatDifference = (value, unit) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}${unit}`;
};

const buildTrend = (delta) => {
  if (delta <= -0.25) return { icon: ArrowDownRight, status: 'positive', label: 'Mejorando' };
  if (delta >= 0.25) return { icon: ArrowUpRight, status: 'negative', label: 'Aumentando' };
  return { icon: ArrowUpRight, status: 'neutral', label: 'Estable' };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BodyMetricsWidget = ({ clienteData = {}, onViewHistory }) => {
  const currentWeight = parseFloat(clienteData.peso_kg) || 78.4;
  const previousWeight = clienteData.peso_anterior !== undefined
    ? parseFloat(clienteData.peso_anterior)
    : currentWeight - 1.2;
  const weightDelta = parseFloat((currentWeight - previousWeight).toFixed(1));
  const weightTrend = buildTrend(weightDelta);

  const imc = parseFloat(clienteData.imc) || 22.4;
  const imcState = getImcState(imc);
  const imcPosition = clamp((imc - 14) / (34 - 14), 0, 1) * 100;

  const currentBodyFat = parseFloat(clienteData.grasa_corporal) || parseFloat(clienteData.grasa) || 16.8;
  const previousBodyFat = clienteData.grasa_anterior !== undefined
    ? parseFloat(clienteData.grasa_anterior)
    : currentBodyFat + 0.9;
  const bodyFatDelta = parseFloat((currentBodyFat - previousBodyFat).toFixed(1));
  const bodyFatTrend = buildTrend(bodyFatDelta);

  const evolutionItems = [
    { label: 'Progreso', value: `${Math.abs(weightDelta).toFixed(1)} kg`, accent: weightTrend.status === 'positive' ? 'good' : weightTrend.status === 'negative' ? 'alert' : 'neutral' },
    { label: 'IMC', value: imcState.label, accent: 'clean' },
    { label: 'Grasa', value: `${currentBodyFat.toFixed(1)}%`, accent: bodyFatTrend.status === 'positive' ? 'good' : bodyFatTrend.status === 'negative' ? 'alert' : 'neutral' }
  ];

  return (
    <motion.section
      className="body-metrics-widget glass-panel"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="widget-topbar">
        <div className="widget-title-group">
          <div className="widget-icon-box">
            <Activity size={18} color="#fff" />
          </div>
          <div>
            <h3>Métricas Corporales</h3>
            <p>Actualizado hoy</p>
          </div>
        </div>
        <div className="widget-chip">Premium</div>
      </div>

      <div className="widget-overview-grid">
        <motion.div
          className="weight-card"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="widget-section-label">
            <span>Peso actual</span>
            <div className={`trend-pill pill-${weightTrend.status}`}>
              <weightTrend.icon size={14} />
              {weightTrend.label}
            </div>
          </div>
          <div className="weight-value">
            <span>{currentWeight.toFixed(1)}</span>
            <small>kg</small>
          </div>
          <p className="metric-note">{formatDifference(weightDelta, ' kg')} respecto al último registro</p>
        </motion.div>

        <motion.div
          className="imc-card"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="widget-section-label">
            <span>IMC</span>
            <span className="imc-state" style={{ color: imcState.color }}>{imcState.label}</span>
          </div>
          <div className="imc-value-row">
            <span>{imc.toFixed(1)}</span>
            <div className="imc-hint">Salud</div>
          </div>
          <div className="imc-range-bar">
            <div className="imc-range-track">
              <div className="imc-range-progress" style={{ width: `${imcPosition}%`, background: `linear-gradient(90deg, rgba(255, 107, 53, 0.95), rgba(255, 140, 66, 0.65))` }} />
              <div className="imc-range-knob" style={{ left: `${imcPosition}%`, boxShadow: `0 0 18px rgba(255, 107, 53, 0.35)` }} />
            </div>
            <div className="imc-range-labels">
              <span>16</span>
              <span>34</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="widget-bodyfat-grid">
        <motion.div className="bodyfat-card" whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
          <div className="widget-section-label">
            <span>Grasa corporal</span>
            <div className={`trend-pill pill-${bodyFatTrend.status}`}>
              <bodyFatTrend.icon size={14} />
              {bodyFatTrend.label}
            </div>
          </div>
          <div className="bodyfat-value">
            <span>{currentBodyFat.toFixed(1)}%</span>
          </div>
          <p className="metric-note">{formatDifference(bodyFatDelta, '%')} desde el último registro</p>
        </motion.div>

        <motion.div className="summary-card" whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
          <div className="widget-section-label">
            <span>Resumen</span>
            <Sparkles size={16} color="#fff" />
          </div>
          <div className="summary-grid">
            {evolutionItems.map((item) => (
              <div className={`summary-item summary-${item.accent}`} key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="summary-indicator" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <button className="history-button" type="button" onClick={onViewHistory}>
        <span>Ver Historial Completo</span>
        <TrendingUp size={16} />
      </button>
    </motion.section>
  );
};

export default BodyMetricsWidget;
