import React, { useState, useEffect } from 'react';
import { Search, Dumbbell, PlayCircle, Star, ChevronRight, X } from 'lucide-react';
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

    // Goal Logic
    if (userGoal.toLowerCase().includes('perder') || userGoal.toLowerCase().includes('grasa')) {
      reps = "12-15";
      series = 3;
    } else if (userGoal.toLowerCase().includes('volumen') || userGoal.toLowerCase().includes('masa') || userGoal.toLowerCase().includes('muscular')) {
      reps = "8-12";
      series = 4;
    }

    // Level Logic
    if (userLevel === 'Principiante') {
      series = Math.max(2, series - 1);
    } else if (userLevel === 'Avanzado') {
      series = series + 1;
    }

    return { series, reps };
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
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="glass-panel p-24" style={{ maxWidth: '800px', width: '90%', position: 'relative', animation: 'fadeIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 className="mb-16 glow-text">{selectedVideo.nombre}</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
              <iframe
                src={selectedVideo.video_url}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.nombre}
              ></iframe>
            </div>
            <p className="mt-16 text-secondary">{selectedVideo.descripcion}</p>
            <div className="flex-align-center gap-16 mt-16">
              <span className="tag-sm tag-brand">{selectedVideo.grupo_muscular}</span>
              <span className="tag-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>{selectedVideo.dificultad}</span>
              <span className="text-sm"><b>{getDynamicStats(selectedVideo).series} series</b> x {getDynamicStats(selectedVideo).reps}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .clickable { cursor: pointer; }
        .clickable:hover { text-decoration: underline; }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
