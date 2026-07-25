import React, { useState, useEffect, useCallback } from 'react';
import { Apple, Flame, Droplet, Wheat, CheckCircle2, Circle, Clock, Edit2, Save, X, Sparkles, RefreshCw, Bot } from 'lucide-react';
import AnalisisNutricional from '../../componentes/AnalisisNutricional';
import '../../estilos/tabs.css';
import { useUser } from '../../logica/UserContext';

const API_URL = '/api';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Map img_query keywords to curated Unsplash photo IDs
const IMG_FALLBACKS = {
  default: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  breakfast: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  oatmeal: 'https://images.unsplash.com/photo-1517673551578-42892f4a2c51?w=400&q=80',
  yogurt: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&q=80',
  chicken: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80',
  salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80',
  eggs: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&q=80',
  smoothie: 'https://images.unsplash.com/photo-1553530979-3e1e3cf4a2ea?w=400&q=80',
  fruit: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
  nuts: 'https://images.unsplash.com/photo-1611058527285-3d8b6a0b1b87?w=400&q=80',
  broccoli: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
  vegetables: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=400&q=80',
  pasta: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=400&q=80',
  sandwich: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80',
  soup: 'https://images.unsplash.com/photo-1547592167-fa1e88e58f4b?w=400&q=80',
};

function getMealImage(imgQuery) {
  if (!imgQuery) return IMG_FALLBACKS.default;
  const lower = imgQuery.toLowerCase();
  for (const key of Object.keys(IMG_FALLBACKS)) {
    if (lower.includes(key)) return IMG_FALLBACKS[key];
  }
  return IMG_FALLBACKS.default;
}

const metaKcal = 2200, metaP = 160, metaC = 230, metaG = 70;

export default function AlimentacionTab({ token }) {
  const { userData } = useUser();
  const userId = userData?.id || 'guest';

  const [plan, setPlan] = useState(null);          // 7-day plan from API
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [mejorando, setMejorando] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0); // index 0-6
  const [doneMap, setDoneMap] = useState({});        // { "Lunes-1": true, ... }
  const [editingMeal, setEditingMeal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [botInstruction, setBotInstruction] = useState('');
  const [showBotInput, setShowBotInput] = useState(false);
  const [botMsg, setBotMsg] = useState('');

  const storageKey = `gymtrack_done_${userId}`;
  const today = new Date().toDateString();

  // Load done-state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) setDoneMap(parsed.done || {});
      }
    } catch (_) { }
  }, [storageKey, today]);

  // Persist done-state
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ date: today, done: doneMap }));
  }, [doneMap, storageKey, today]);

  // Load plan from API
  const loadPlan = useCallback(async () => {
    if (!token) {
      setLoading(false); // No token yet – stop spinner and show empty state
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/alimentacion`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan); // null if no plan yet
      }
    } catch (_) { }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      const res = await fetch(`${API_URL}/alimentacion/generar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
      }
    } catch (_) { }
    setGenerando(false);
  };

  const handleMejorar = async () => {
    if (!botInstruction.trim()) return;
    setMejorando(true);
    setBotMsg('');
    try {
      const res = await fetch(`${API_URL}/ia/mejorar-alimentacion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ instruccion: botInstruction }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
        setBotMsg('✅ Plan actualizado por FitBot. ¡Revisa los cambios!');
        setBotInstruction('');
        setShowBotInput(false);
      } else {
        setBotMsg('❌ No se pudo mejorar el plan. Intenta de nuevo.');
      }
    } catch (_) { setBotMsg('❌ Error de conexión.'); }
    setMejorando(false);
  };

  const toggleDone = (day, mealId) => {
    const key = `${day}-${mealId}`;
    setDoneMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startEdit = (meal) => {
    setEditingMeal(meal.id);
    setEditForm({ ...meal });
  };

  const saveEdit = async () => {
    if (!plan) return;
    const updatedPlan = {
      dias: plan.dias.map(d => {
        if (d.dia !== currentDay.dia) return d;
        return { ...d, comidas: d.comidas.map(m => m.id === editingMeal ? { ...editForm, id: m.id } : m) };
      })
    };
    setPlan(updatedPlan);
    setEditingMeal(null);
    // Persist to backend
    await fetch(`${API_URL}/alimentacion`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ plan_json: updatedPlan }),
    }).catch(() => { });
  };

  const currentDay = plan?.dias?.[selectedDay] || null;
  const meals = currentDay?.comidas || [];

  const todayDayName = DIAS_SEMANA[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const doneToday = meals.filter(m => doneMap[`${currentDay?.dia}-${m.id}`]);
  const consumido = doneToday.reduce((acc, m) => ({
    kcal: acc.kcal + (m.kcal || 0),
    p: acc.p + (m.p || 0),
    c: acc.c + (m.c || 0),
    g: acc.g + (m.g || 0),
  }), { kcal: 0, p: 0, c: 0, g: 0 });

  if (loading) return (
    <div className="tab-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ textAlign: 'center', color: '#aaa' }}>
        <RefreshCw size={32} color="#ff6b35" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
        <p>Cargando tu plan de alimentación...</p>
      </div>
    </div>
  );

  if (!plan) return (
    <div className="tab-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 40px rgba(255,107,53,0.3)' }}>
        <Apple size={40} color="#fff" />
      </div>
      <h2 style={{ color: '#fff', marginBottom: 8 }}>Sin plan de alimentación</h2>
      <p style={{ color: '#aaa', maxWidth: 440, marginBottom: 28 }}>
        Aún no tienes un plan nutricional. Deja que nuestra IA te cree uno personalizado según tus objetivos y métricas.
      </p>
      <button
        onClick={handleGenerar}
        disabled={generando}
        style={{ padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <Sparkles size={18} />
        {generando ? 'Generando tu plan...' : 'Generar Plan con IA'}
      </button>
    </div>
  );

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <h1 className="glow-text">Mi Alimentación</h1>
        <p className="subtitle-text">Plan nutricional personalizado para 7 días</p>
      </header>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
        {DIAS_SEMANA.map((dia, i) => {
          const isToday = dia === todayDayName;
          const isSelected = i === selectedDay;
          return (
            <button
              key={dia}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: isSelected ? 700 : 400, fontFamily: 'inherit',
                background: isSelected ? 'linear-gradient(135deg,#ff6b35,#ff8c42)' : isToday ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.06)',
                color: isSelected ? '#fff' : isToday ? '#ff8c42' : '#aaa',
                border: isSelected ? 'none' : isToday ? '1px solid rgba(255,107,53,0.4)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 4px 16px rgba(255,107,53,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {dia}
              {isToday && !isSelected && <span style={{ marginLeft: 4, fontSize: 10, background: '#ff6b35', color: '#fff', padding: '1px 5px', borderRadius: 8 }}>Hoy</span>}
            </button>
          );
        })}
      </div>

      <div className="alimentacion-grid">
        <div className="alimentacion-main">

          {/* Summary Card */}
          <div className="glass-panel p-24 mb-24">
            <div className="flex-between mb-24">
              <div>
                <h3 className="section-title">Resumen — {currentDay?.dia}</h3>
                <p className="text-secondary text-sm">{consumido.kcal} / {metaKcal} kcal consumidas</p>
              </div>
              <div className="icon-box"><Apple color="#ff6b35" /></div>
            </div>
            <div className="progress-bar-lg mt-8" style={{ marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((consumido.kcal / metaKcal) * 100))}%`, background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#aaa' }}>
              {[['P', consumido.p, metaP, '#ff6b35'], ['C', consumido.c, metaC, '#3b82f6'], ['G', consumido.g, metaG, '#eab308']].map(([l, v, t, cl]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cl }} />
                  <b style={{ color: '#fff' }}>{l}:</b> {v}g / {t}g
                </span>
              ))}
            </div>
          </div>

          {/* Meal Cards */}
          <div className="glass-panel p-24">
            <h3 className="section-title mb-8">Comidas del {currentDay?.dia}</h3>
            <p className="text-secondary text-sm mb-24">Marca las comidas que vayas consumiendo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {meals.map((meal) => {
                const doneKey = `${currentDay.dia}-${meal.id}`;
                const isDone = !!doneMap[doneKey];
                const imgUrl = getMealImage(meal.img_query);
                const isEditing = editingMeal === meal.id;

                return (
                  <div key={meal.id} className="glass-panel" style={{ overflow: 'hidden', border: isDone ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.05)', background: isDone ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.03)', transition: 'all 0.3s' }}>
                    {/* Image bar */}
                    <div style={{ position: 'relative', height: 110, backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75))' }} />
                      <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                        <span style={{ fontSize: 11, color: '#ff8c42', fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 10 }}>{meal.hora}</span>
                        {' '}
                        <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{meal.nombre}</span>
                      </div>
                      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                        {!isEditing && (
                          <button onClick={() => startEdit(meal)} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>
                            <Edit2 size={13} />
                          </button>
                        )}
                        <button onClick={() => toggleDone(currentDay.dia, meal.id)} style={{ background: isDone ? 'rgba(34,197,94,0.8)' : 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>
                          {isDone ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: 14 }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <input value={editForm.descripcion || ''} onChange={e => setEditForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }} />
                          <div style={{ display: 'flex', gap: 8 }}>
                            {[['kcal', 'kcal'], ['p', 'Prot.'], ['c', 'Carbs'], ['g', 'Grasas']].map(([k, lbl]) => (
                              <div key={k} style={{ flex: 1 }}>
                                <label style={{ fontSize: 10, color: '#aaa' }}>{lbl}</label>
                                <input type="number" value={editForm[k] || 0} onChange={e => setEditForm(p => ({ ...p, [k]: Number(e.target.value) }))} style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '5px 8px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }} />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditingMeal(null)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><X size={12} /> Cancelar</button>
                            <button onClick={saveEdit} style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}><Save size={12} /> Guardar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: 13 }}>{meal.descripcion}</p>
                          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#aaa' }}>
                            <span style={{ color: '#ff8c42', fontWeight: 700 }}><Flame size={11} style={{ verticalAlign: 'middle' }} /> {meal.kcal} kcal</span>
                            <span>P: {meal.p}g</span>
                            <span>C: {meal.c}g</span>
                            <span>G: {meal.g}g</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <AnalisisNutricional consumido={consumido} metas={{ kcal: metaKcal, p: metaP, c: metaC, g: metaG }} />
        </div>

        {/* Sidebar */}
        <div className="alimentacion-side">

          {/* FitBot Improve Card */}
          <div className="glass-panel p-24" style={{ marginBottom: 24, borderColor: 'rgba(255,107,53,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: 14 }}>Mejorar con FitBot</h4>
                <p style={{ margin: 0, fontSize: 11, color: '#ff8c42' }}>Pídele cambios a la IA</p>
              </div>
            </div>
            {botMsg && <p style={{ color: botMsg.startsWith('✅') ? '#4ade80' : '#ef4444', fontSize: 12, marginBottom: 10 }}>{botMsg}</p>}
            {!showBotInput ? (
              <button onClick={() => setShowBotInput(true)} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: '#ff8c42', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                ✨ Pídele algo a FitBot...
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  value={botInstruction}
                  onChange={e => setBotInstruction(e.target.value)}
                  placeholder="Ej: Hazlo más bajo en carbohidratos, agrega más vegetales en el almuerzo..."
                  rows={3}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setShowBotInput(false); setBotInstruction(''); }} style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 12 }}>Cancelar</button>
                  <button onClick={handleMejorar} disabled={mejorando || !botInstruction.trim()} style={{ flex: 2, padding: '9px', borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', border: 'none', color: '#fff', cursor: mejorando ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700 }}>
                    {mejorando ? 'Mejorando...' : '🚀 Mejorar Plan'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Regenerate */}
          <div className="glass-panel p-24" style={{ marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: 14 }}>Regenerar Plan</h4>
            <p style={{ margin: '0 0 14px 0', color: '#888', fontSize: 12 }}>Pide una nueva propuesta nutricional personalizada con IA.</p>
            <button onClick={handleGenerar} disabled={generando} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#ccc', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <RefreshCw size={14} style={{ animation: generando ? 'spin 1s linear infinite' : 'none' }} />
              {generando ? 'Generando...' : 'Nuevo plan con IA'}
            </button>
          </div>

          {/* Totals for selected day */}
          <div className="glass-panel p-24">
            <h4 style={{ margin: '0 0 14px 0', color: '#fff', fontSize: 14 }}>Totales del día</h4>
            {meals.reduce((acc, m) => {
              const totals = { kcal: acc.kcal + m.kcal, p: acc.p + m.p, c: acc.c + m.c, g: acc.g + m.g };
              return totals;
            }, { kcal: 0, p: 0, c: 0, g: 0 }) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(() => {
                    const t = meals.reduce((acc, m) => ({ kcal: acc.kcal + (m.kcal || 0), p: acc.p + (m.p || 0), c: acc.c + (m.c || 0), g: acc.g + (m.g || 0) }), { kcal: 0, p: 0, c: 0, g: 0 });
                    return [['Calorías', t.kcal, 'kcal', '#ff8c42'], ['Proteínas', t.p, 'g', '#ff6b35'], ['Carbohidratos', t.c, 'g', '#3b82f6'], ['Grasas', t.g, 'g', '#eab308']].map(([l, v, u, cl]) => (
                      <div key={l} className="flex-between" style={{ fontSize: 13 }}>
                        <span style={{ color: '#aaa' }}>{l}</span>
                        <span style={{ fontWeight: 700, color: cl }}>{v}{u}</span>
                      </div>
                    ));
                  })()}
                </div>
              )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
