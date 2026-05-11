import React, { useState, useEffect } from 'react';
import { Search, Dumbbell, PlayCircle, Star, ChevronRight, X, Clock, Activity, Target, Loader2, Filter, ArrowRight } from 'lucide-react';
import { useUser } from '../../logica/UserContext';
import '../../estilos/tabs.css';

const API_URL = '/api';

export default function EjerciciosTab() {
  const { token, userData } = useUser();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Cualquier Nivel');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const muscleGroups = ['Todas', 'Pecho', 'Espalda', 'Piernas', 'Bíceps', 'Tríceps', 'Hombros', 'Abdomen'];
  const levels = ['Cualquier Nivel', 'Principiante', 'Intermedio', 'Avanzado'];

  const clienteData = userData?.cliente || {};
  const userGoal = clienteData.objetivo_principal || 'Mantenimiento';
  const userLevel = clienteData.nivel_actividad || 'Principiante';

  const fetchExercises = async () => {
    if (!token) return;
    setLoading(true);
    try {
      let url = `${API_URL}/ejercicios?search=${search}`;
      if (selectedMuscle !== 'Todas') url += `&grupo_muscular=${selectedMuscle}`;
      if (selectedLevel !== 'Cualquier Nivel') url += `&dificultad=${selectedLevel}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExercises(data.ejercicios || []);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedMuscle, selectedLevel, token]);

  const toggleFavorite = async (ejercicioId) => {
    try {
      const response = await fetch(`${API_URL}/ejercicios/${ejercicioId}/toggle-favorito`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setExercises(exercises.map(ex =>
          ex.id === ejercicioId ? { ...ex, is_favorito: !ex.is_favorito } : ex
        ));
        if (selectedVideo?.id === ejercicioId) {
          setSelectedVideo({ ...selectedVideo, is_favorito: !selectedVideo.is_favorito });
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const getDynamicStats = (ex) => {
    let series = 3;
    let reps = "10-12";
    let rest = ex.tiempo_descanso || "60";

    if (userGoal.toLowerCase().includes('perder') || userGoal.toLowerCase().includes('grasa')) {
      reps = "12-15";
      series = 3;
      rest = "30-45";
    } else if (userGoal.toLowerCase().includes('volumen') || userGoal.toLowerCase().includes('masa') || userGoal.toLowerCase().includes('muscular')) {
      reps = "8-12";
      series = 4;
      rest = "90";
    }

    if (userLevel === 'Principiante') {
      series = Math.max(2, series - 1);
    } else if (userLevel === 'Avanzado') {
      series = series + 1;
    }

    return { series, reps, rest };
  };

  const filteredExercises = showOnlyFavorites
    ? exercises.filter(ex => ex.is_favorito)
    : exercises;

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <div className="flex-between">
          <div>
            <h1 className="glow-text">Biblioteca de Ejercicios</h1>
            <p className="subtitle-text">Personalizada para tu objetivo: <b>{userGoal}</b> ({userLevel})</p>
          </div>
          <button
            className={`secondary-btn ${showOnlyFavorites ? 'active' : ''}`}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={showOnlyFavorites ? { background: '#ff6b35', color: 'white', borderColor: '#ff6b35' } : {}}
          >
            <Star size={16} fill={showOnlyFavorites ? "white" : "none"} /> Favoritos
          </button>
        </div>
      </header>

      <div className="search-bar-container glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,107,53,0.2)' }}>
        <Search size={20} color="#ff6b35" />
        <input
          type="text"
          placeholder="Buscar ejercicios por nombre (ej: Press de Banca)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, padding: '10px', fontSize: '1rem', outline: 'none' }}
        />
      </div>

      <div className="filters-section mb-24">
        <div className="flex-align-center gap-8 mb-12">
          <Filter size={16} color="#ff6b35" />
          <span className="text-secondary text-xs uppercase font-bold tracking-wider">Filtrar por Músculo</span>
        </div>
        <div className="filter-chips">
          {muscleGroups.map(m => (
            <div
              key={m}
              className={`chip ${selectedMuscle === m ? 'active' : ''}`}
              onClick={() => setSelectedMuscle(m)}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="filters-section mb-32">
        <div className="flex-align-center gap-8 mb-12">
          <Activity size={16} color="#ff6b35" />
          <span className="text-secondary text-xs uppercase font-bold tracking-wider">Filtrar por Dificultad</span>
        </div>
        <div className="filter-chips">
          {levels.map(l => (
            <div
              key={l}
              className={`chip ${selectedLevel === l ? 'active' : ''}`}
              onClick={() => setSelectedLevel(l)}
            >
              {l}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-center py-48" style={{ display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
          <Loader2 className="animate-spin" size={48} color="#ff6b35" />
        </div>
      ) : (
        <div className="ejercicios-grid">
          {filteredExercises.length === 0 ? (
            <div className="glass-panel p-48 text-center" style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)' }}>
              <Dumbbell size={48} color="rgba(255,255,255,0.1)" className="mx-auto mb-16" />
              <p className="text-secondary text-lg">
                {showOnlyFavorites ? "No tienes ejercicios marcados como favoritos." : "No se encontraron ejercicios con estos filtros."}
              </p>
              <button className="link-btn mt-16" onClick={() => { setSearch(''); setSelectedMuscle('Todas'); setSelectedLevel('Cualquier Nivel'); setShowOnlyFavorites(false); }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const stats = getDynamicStats(ex);
              const muscleColor = '#ff6b35'; // Branded Orange
              
              return (
                <div className="ejercicio-card glass-panel" key={ex.id} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  overflow: 'hidden',
                  border: '1px solid rgba(255,107,53,0.1)'
                }}>
                  {/* Minimalist Image Area */}
                  <div className="ejercicio-icon-area" style={{ 
                    height: '160px', 
                    position: 'relative', 
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0a0a0c 0%, #1a1a1e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Minimalist Muscle Background */}
                    <div style={{ 
                      position: 'absolute', 
                      width: '120%', 
                      height: '120%', 
                      background: `radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)`,
                      filter: 'blur(30px)',
                      zIndex: 0
                    }}></div>

                    {/* Minimalist Icon / Illustration */}
                    <div className="muscle-illustration" style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <Dumbbell size={54} color={muscleColor} style={{ filter: 'drop-shadow(0 0 10px rgba(255,107,53,0.5))', opacity: 0.8 }} />
                       <span style={{ 
                         marginTop: '12px', 
                         fontSize: '10px', 
                         fontWeight: '900', 
                         color: muscleColor, 
                         letterSpacing: '3px', 
                         textTransform: 'uppercase',
                         opacity: 0.6
                       }}>{ex.grupo_muscular}</span>
                    </div>

                    {/* Subtle Video Preview (Visible on Hover if desired, but here we keep it clean) */}
                    {/* <img src={`https://img.youtube.com/vi/${ex.video_url?.split('/embed/')[1]}/hqdefault.jpg`} style={{ opacity: 0.1 }} /> */}
                    
                    <div className="exercise-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                      <span className="tag-sm" style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        backdropFilter: 'blur(4px)',
                        color: '#aaa',
                        fontSize: '9px'
                      }}>{ex.dificultad}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(ex.id); }}
                      className="fav-btn-float"
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '50%', 
                        padding: '8px', 
                        cursor: 'pointer', 
                        display: 'flex'
                      }}
                    >
                      <Star size={16} color={ex.is_favorito ? "#ff6b35" : "#555"} fill={ex.is_favorito ? "#ff6b35" : "none"} />
                    </button>
                  </div>

                  <div className="p-20" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>{ex.nombre}</h3>
                    <p style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>{ex.equipamiento}</p>
                    
                    <div className="flex-between mt-auto">
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase' }}>Series</span>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6b35' }}>{stats.series}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase' }}>Reps</span>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{stats.reps}</span>
                        </div>
                      </div>
                      
                      <button className="minimal-action-btn" onClick={() => setSelectedVideo(ex)}>
                        Técnica <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedVideo && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setSelectedVideo(null)}>
          <div className="glass-panel" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            <div className="modal-content-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div className="p-24">
                <div className="flex-align-center gap-12 mb-16">
                  <h2 className="glow-text" style={{ margin: 0 }}>{selectedVideo.nombre}</h2>
                  <Star
                    size={20}
                    color={selectedVideo.is_favorito ? "#ff6b35" : "#a1a1aa"}
                    fill={selectedVideo.is_favorito ? "#ff6b35" : "none"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleFavorite(selectedVideo.id)}
                  />
                </div>
                
                <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={selectedVideo.video_url}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className="p-24" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className="section-title mb-16" style={{ fontSize: '0.9rem', color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '1px' }}>Ficha Técnica</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div className="glass-panel p-12 text-center">
                    <p className="text-secondary text-xs mb-4">Descanso</p>
                    <p className="font-bold">{getDynamicStats(selectedVideo).rest}s</p>
                  </div>
                  <div className="glass-panel p-12 text-center">
                    <p className="text-secondary text-xs mb-4">Dificultad</p>
                    <p className="font-bold">{selectedVideo.dificultad}</p>
                  </div>
                </div>

                <div className="mb-24">
                  <span className="text-xs text-secondary mb-8 block">Grupo Muscular Principal</span>
                  <span className="tag-sm tag-brand">{selectedVideo.grupo_muscular}</span>
                </div>

                <div className="mb-24">
                  <span className="text-xs text-secondary mb-8 block">Equipamiento</span>
                  <span className="tag-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>{selectedVideo.equipamiento}</span>
                </div>

                <div className="description">
                  <span className="text-xs text-secondary mb-8 block">Instrucciones de Ejecución</span>
                  <p className="text-sm" style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                    {selectedVideo.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .minimal-action-btn { 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.05); 
          color: #aaa; 
          border-radius: 4px; 
          padding: 6px 12px; 
          font-size: 11px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 6px;
          transition: all 0.3s;
        }
        .minimal-action-btn:hover {
          background: #ff6b35;
          color: white;
          border-color: #ff6b35;
        }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .p-20 { padding: 20px; }
        .block { display: block; }
        .primary-btn-sm { background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3); color: #ff6b35; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .primary-btn-sm:hover { background: #ff6b35; color: white; }
        @media (max-width: 768px) {
          .modal-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
