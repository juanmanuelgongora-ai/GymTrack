import React, { useState, useEffect } from 'react';
import { Search, Dumbbell, PlayCircle, Star, ChevronRight, X, Clock, Activity, Target } from 'lucide-react';
import '../../estilos/tabs.css';

export default function EjerciciosTab({ token, userData }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Cualquier Nivel');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const muscleGroups = ['Todas', 'Pecho', 'Espalda', 'Piernas', 'Bíceps', 'Tríceps', 'Hombros', 'Abdomen'];
  const levels = ['Cualquier Nivel', 'Principiante', 'Intermedio', 'Avanzado'];

  const clienteData = userData?.cliente || {};
  const userGoal = clienteData.objetivo_principal || 'Mantenimiento';
  const userLevel = clienteData.nivel_actividad || 'Principiante';

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        let url = `http://127.0.0.1:8000/api/ejercicios?search=${search}`;
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

    const timer = setTimeout(() => {
      fetchExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedMuscle, selectedLevel, token]);

  // Dynamic series and reps calculation
  const getDynamicStats = (ex) => {
    let series = 3;
    let reps = "10-12";
    let rest = ex.tiempo_descanso || "60";

    // Goal Logic
    if (userGoal.toLowerCase().includes('perder') || userGoal.toLowerCase().includes('grasa')) {
      reps = "12-15";
      series = 3;
      rest = "30-45";
    } else if (userGoal.toLowerCase().includes('volumen') || userGoal.toLowerCase().includes('masa') || userGoal.toLowerCase().includes('muscular')) {
      reps = "8-12";
      series = 4;
      rest = "90";
    }

    // Level Logic
    if (userLevel === 'Principiante') {
      series = Math.max(2, series - 1);
    } else if (userLevel === 'Avanzado') {
      series = series + 1;
    }

    return { series, reps, rest };
  };

  return (
    <div className="tab-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <header className="tab-header">
        <div className="flex-between">
          <div>
            <h1 className="glow-text">Biblioteca de Ejercicios</h1>
            <p className="subtitle-text">Personalizada para tu objetivo: <b>{userGoal}</b> ({userLevel})</p>
          </div>
          <button className="secondary-btn"><Star size={16} /> Favoritos</button>
        </div>
      </header>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={20} color="#a1a1aa" />
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-chips mb-16">
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

      <div className="filter-chips mb-24" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="glow-text">Cargando biblioteca...</p>
        </div>
      ) : (
        <div className="ejercicios-grid">
          {exercises.length === 0 ? (
            <div className="glass-panel p-24" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <p className="text-secondary">No se encontraron ejercicios con estos filtros.</p>
            </div>
          ) : (
            exercises.map((ex) => {
              const stats = getDynamicStats(ex);
              return (
                <div className="ejercicio-card glass-panel p-16" key={ex.id}>
                  <div className="flex-between mb-12">
                    <div className="ejercicio-tags">
                      <span className="tag-sm tag-brand">{ex.grupo_muscular}</span>
                      <span className="tag-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>{ex.dificultad}</span>
                    </div>
                    <Star size={18} color="#a1a1aa" style={{ cursor: 'pointer' }} />
                  </div>

                  <h3 className="mb-4 text-lg">{ex.nombre}</h3>
                  <div className="text-secondary text-xs mb-16 flex-align-center gap-8">
                    <span className="flex-align-center gap-4"><Dumbbell size={12} /> {ex.equipamiento}</span>
                    <span>•</span>
                    <span className="clickable flex-align-center gap-4 text-brand" onClick={() => setSelectedVideo(ex)}>
                      <PlayCircle size={12} /> Ver Video
                    </span>
                  </div>

                  <div className="ejercicio-icon-area" style={{ height: '120px', overflow: 'hidden', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ex.video_url ? (
                      <img
                        src={`https://img.youtube.com/vi/${ex.video_url.split('/embed/')[1]}/hqdefault.jpg`}
                        alt={ex.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, cursor: 'pointer' }}
                        onClick={() => setSelectedVideo(ex)}
                      />
                    ) : (
                      <Dumbbell size={40} color="rgba(255,255,255,0.1)" />
                    )}
                  </div>

                  <div className="flex-between mt-16">
                    <div className="text-sm">
                      <b>{stats.series} series</b> <span className="text-secondary text-xs">x {stats.reps}</span>
                    </div>
                    <button className="link-btn" style={{ padding: 0 }} onClick={() => setSelectedVideo(ex)}>Ficha Técnica <ChevronRight size={14} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Enriched Video/Detail Modal Overlay */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="glass-panel p-24" style={{ maxWidth: '900px', width: '95%', position: 'relative', animation: 'fadeIn 0.3s ease', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            <div className="modal-grid">
              {/* Left side: Video */}
              <div className="modal-video-section">
                <h2 className="mb-16 glow-text">{selectedVideo.nombre}</h2>
                <div className="video-wrapper">
                  <iframe
                    src={selectedVideo.video_url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.nombre}
                  ></iframe>
                </div>
              </div>

              {/* Right side: Ficha Técnica */}
              <div className="modal-info-section">
                <h3 className="section-title mb-16">Ficha Técnica</h3>

                <div className="tech-specs-grid">
                  <div className="tech-card">
                    <Clock size={16} className="text-brand mb-8" />
                    <span className="label">Descanso</span>
                    <span className="value">{getDynamicStats(selectedVideo).rest}s</span>
                  </div>
                  <div className="tech-card">
                    <Activity size={16} className="text-brand mb-8" />
                    <span className="label">Series</span>
                    <span className="value">{getDynamicStats(selectedVideo).series}</span>
                  </div>
                  <div className="tech-card">
                    <Target size={16} className="text-brand mb-8" />
                    <span className="label">Reps</span>
                    <span className="value">{getDynamicStats(selectedVideo).reps}</span>
                  </div>
                  <div className="tech-card">
                    <Dumbbell size={16} className="text-brand mb-8" />
                    <span className="label">Equipo</span>
                    <span className="value" style={{ fontSize: '10px' }}>{selectedVideo.equipamiento}</span>
                  </div>
                </div>

                <div className="muscle-info mt-24">
                  <div className="mb-12">
                    <span className="text-xs text-secondary mb-4 block">Músculo Principal</span>
                    <span className="tag-sm tag-brand">{selectedVideo.grupo_muscular}</span>
                  </div>
                  {selectedVideo.musculos_secundarios && (
                    <div>
                      <span className="text-xs text-secondary mb-4 block">Músculos Secundarios</span>
                      <div className="flex-wrap gap-4">
                        {selectedVideo.musculos_secundarios.split(',').map(m => (
                          <span key={m} className="tag-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>{m.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="description-box mt-24">
                  <span className="text-xs text-secondary mb-8 block">Instrucciones</span>
                  <p className="text-sm text-secondary" style={{ lineHeight: '1.6' }}>
                    {selectedVideo.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .clickable { cursor: pointer; }
        .clickable:hover { text-decoration: underline; }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }
        .modal-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 24px;
        }
        @media (max-width: 768px) {
            .modal-grid { grid-template-columns: 1fr; }
        }
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border-radius: 12px;
            background: #000;
            box-shadow: 0 10px 30px rgba(255, 111, 0, 0.1);
        }
        .video-wrapper iframe {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
        }
        .section-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--brand-orange);
            border-bottom: 1px solid rgba(255, 111, 0, 0.2);
            padding-bottom: 8px;
        }
        .tech-specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        .tech-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 12px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .tech-card .label {
            font-size: 10px;
            color: #a1a1aa;
            margin-bottom: 4px;
        }
        .tech-card .value {
            font-weight: 600;
            font-size: 14px;
            color: white;
        }
        .description-box {
            background: rgba(0,0,0,0.2);
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid var(--brand-orange);
        }
      `}</style>
    </div>
  );
}
