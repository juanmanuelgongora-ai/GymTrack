import React, { useState, useEffect } from 'react';
import { Apple, ChevronRight, Plus, Droplets, Target, Activity } from 'lucide-react';
import '../estilos/ResumenNutricional.css';
import { useUser } from '../logica/UserContext';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const ResumenNutricional = ({ nutricionData, onViewPlan, onLogFood }) => {
  const { token, userData } = useUser();
  const userId = userData?.id || 'guest';
  const [apiPlan, setApiPlan] = useState(null);
  const [doneMap, setDoneMap] = useState({});

  const todayDayName = DIAS_SEMANA[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayStr = new Date().toDateString();

  // Load done state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`gymtrack_done_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          setDoneMap(parsed.done || {});
        }
      }
    } catch (_) { }
  }, [userId, todayStr]);

  // Fetch plan from API if not provided in props
  useEffect(() => {
    if (nutricionData) return;
    if (!token) return;

    let isMounted = true;
    fetch('/api/alimentacion', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.plan) {
          setApiPlan(data.plan);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [token, nutricionData]);

  // Calculate real values for today
  let data;

  if (nutricionData) {
    data = nutricionData;
  } else if (apiPlan && apiPlan.dias) {
    const todayPlan = apiPlan.dias.find((d) => d.dia === todayDayName) || apiPlan.dias[0];
    const meals = todayPlan?.comidas || [];

    let targetKcal = 0, targetP = 0, targetC = 0, targetG = 0;
    let consumedKcal = 0, consumedP = 0, consumedC = 0, consumedG = 0;

    meals.forEach((m) => {
      const kcal = m.kcal || 0;
      const p = m.p || 0;
      const c = m.c || 0;
      const g = m.g || 0;

      targetKcal += kcal;
      targetP += p;
      targetC += c;
      targetG += g;

      const doneKey = `${todayPlan.dia}-${m.id}`;
      if (doneMap[doneKey]) {
        consumedKcal += kcal;
        consumedP += p;
        consumedC += c;
        consumedG += g;
      }
    });

    data = {
      calorias_consumidas: consumedKcal,
      calorias_objetivo: targetKcal || 2200,
      proteinas_consumidas: consumedP,
      proteinas_objetivo: targetP || 150,
      carbos_consumidos: consumedC,
      carbos_objetivo: targetC || 220,
      grasas_consumidas: consumedG,
      grasas_objetivo: targetG || 65,
      agua_consumida: 1.5,
      agua_objetivo: 2.5,
    };
  } else {
    // Fallback if no plan created yet
    data = {
      calorias_consumidas: 0,
      calorias_objetivo: 2000,
      proteinas_consumidas: 0,
      proteinas_objetivo: 140,
      carbos_consumidos: 0,
      carbos_objetivo: 200,
      grasas_consumidas: 0,
      grasas_objetivo: 60,
      agua_consumida: 1.0,
      agua_objetivo: 2.5,
    };
  }

  const calProgress = Math.min(100, Math.round((data.calorias_consumidas / data.calorias_objetivo) * 100)) || 0;
  const proProgress = Math.min(100, Math.round((data.proteinas_consumidas / data.proteinas_objetivo) * 100)) || 0;
  const carbProgress = Math.min(100, Math.round((data.carbos_consumidos / data.carbos_objetivo) * 100)) || 0;
  const fatProgress = Math.min(100, Math.round((data.grasas_consumidas / data.grasas_objetivo) * 100)) || 0;

  const isCompleted = calProgress >= 100;
  const statusText = isCompleted ? 'Completado' : 'En progreso';

  return (
    <div className="rn-widget">
      {/* HEADER */}
      <div className="rn-header">
        <div className="rn-header-left">
          <div className="rn-icon-box">
            <Apple size={20} color="#ff6b35" />
          </div>
          <div>
            <h3 className="rn-title">Nutrición de Hoy</h3>
            <p className="rn-subtitle">Resumen diario</p>
          </div>
        </div>
        <div className={`rn-badge ${isCompleted ? 'rn-badge-success' : 'rn-badge-active'}`}>
          {statusText}
        </div>
      </div>

      {/* CALORÍAS PRINCIPALES */}
      <div className="rn-calories-section">
        <div className="rn-cal-header">
          <div>
            <span className="rn-cal-value">{data.calorias_consumidas}</span>
            <span className="rn-cal-target">/ {data.calorias_objetivo} kcal</span>
          </div>
          <span className="rn-cal-percent">{calProgress}% completado</span>
        </div>

        <div className="rn-progress-track">
          <div
            className="rn-progress-fill"
            style={{
              width: `${calProgress}%`,
              background: isCompleted ? '#10b981' : 'linear-gradient(90deg, #ff6b35, #ff8c42)',
              boxShadow: isCompleted ? '0 0 15px rgba(16,185,129,0.4)' : '0 0 15px rgba(255,107,53,0.4)',
            }}
          ></div>
        </div>
        <p className="rn-cal-remaining">Faltan {Math.max(0, data.calorias_objetivo - data.calorias_consumidas)} kcal para tu objetivo</p>
      </div>

      {/* MACRONUTRIENTES */}
      <div className="rn-macros-grid">
        <div className="rn-macro-card">
          <div className="rn-macro-header">
            <span className="rn-macro-label">Proteínas</span>
            <Target size={12} className="rn-macro-icon" style={{ color: '#3b82f6' }} />
          </div>
          <div className="rn-macro-values">
            <span className="rn-macro-current">{data.proteinas_consumidas}g</span>
            <span className="rn-macro-total">/ {data.proteinas_objetivo}g</span>
          </div>
          <div className="rn-mini-track"><div className="rn-mini-fill" style={{ width: `${proProgress}%`, background: '#3b82f6' }}></div></div>
        </div>

        <div className="rn-macro-card">
          <div className="rn-macro-header">
            <span className="rn-macro-label">Carbos</span>
            <Activity size={12} className="rn-macro-icon" style={{ color: '#eab308' }} />
          </div>
          <div className="rn-macro-values">
            <span className="rn-macro-current">{data.carbos_consumidos}g</span>
            <span className="rn-macro-total">/ {data.carbos_objetivo}g</span>
          </div>
          <div className="rn-mini-track"><div className="rn-mini-fill" style={{ width: `${carbProgress}%`, background: '#eab308' }}></div></div>
        </div>

        <div className="rn-macro-card">
          <div className="rn-macro-header">
            <span className="rn-macro-label">Grasas</span>
            <Droplets size={12} className="rn-macro-icon" style={{ color: '#a855f7' }} />
          </div>
          <div className="rn-macro-values">
            <span className="rn-macro-current">{data.grasas_consumidas}g</span>
            <span className="rn-macro-total">/ {data.grasas_objetivo}g</span>
          </div>
          <div className="rn-mini-track"><div className="rn-mini-fill" style={{ width: `${fatProgress}%`, background: '#a855f7' }}></div></div>
        </div>
      </div>

      {/* EXTRA INFO - AGUA */}
      <div className="rn-extra-info">
        <div className="rn-water-section">
          <div className="rn-water-icon">
            <Droplets size={14} color="#0ea5e9" />
          </div>
          <div className="rn-water-details">
            <span className="rn-water-label">Agua consumida</span>
            <span className="rn-water-value">{data.agua_consumida}L / {data.agua_objetivo}L</span>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="rn-actions">
        <button className="rn-btn-primary" onClick={onViewPlan}>
          Ver Plan Alimenticio <ChevronRight size={16} />
        </button>
        <button className="rn-btn-icon" onClick={onLogFood} title="Registrar comida">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};


export default ResumenNutricional;
