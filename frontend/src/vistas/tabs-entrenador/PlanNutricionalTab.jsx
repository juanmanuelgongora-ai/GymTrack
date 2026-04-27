import React, { useState } from 'react';
import { Apple, Flame, Droplet, Wheat, CheckCircle2, Search, Target, Utensils } from 'lucide-react';
import '../../estilos/tabs.css'; // Asegurando estilos comunes si los hay o inline styles

const PlanNutricionalTab = () => {
    const [selectedClient, setSelectedClient] = useState(1);

    const clientesMock = [
        { id: 1, name: 'Carlos Mendoza', avatarColor: '#3b82f6' },
        { id: 2, name: 'Laura Gómez', avatarColor: '#a855f7' },
        { id: 3, name: 'Andrés Felipe', avatarColor: '#22c55e' },
        { id: 4, name: 'Valentina Rojas', avatarColor: '#ef4444' }
    ];

    // Diferentes datos simulados por cliente para mostrar reactividad en el plan de comidas
    const nutricionData = {
        1: {
            metaKcal: 2600, consumidasKcal: 1450,
            metaP: 180, consumidasP: 85,
            metaC: 250, consumidasC: 140,
            metaG: 80, consumidasG: 35,
            comidas: [
                { time: '07:00 AM', name: 'Desayuno', kcal: 600, p: 40, c: 50, g: 20, done: true, icon: Flame },
                { time: '10:30 AM', name: 'Media Mañana', kcal: 300, p: 25, c: 35, g: 5, done: true, icon: Apple },
                { time: '01:30 PM', name: 'Almuerzo', kcal: 550, p: 20, c: 55, g: 10, done: true, icon: Droplet },
                { time: '05:00 PM', name: 'Merienda (Post-Entreno)', kcal: 400, p: 50, c: 40, g: 0, done: false, icon: Wheat },
                { time: '08:30 PM', name: 'Cena', kcal: 750, p: 45, c: 70, g: 45, done: false, icon: Utensils }
            ]
        },
        2: {
            metaKcal: 1800, consumidasKcal: 1800,
            metaP: 120, consumidasP: 120,
            metaC: 150, consumidasC: 150,
            metaG: 60, consumidasG: 60,
            comidas: [
                { time: '08:00 AM', name: 'Desayuno', kcal: 400, p: 25, c: 40, g: 15, done: true, icon: Flame },
                { time: '11:00 AM', name: 'Snack', kcal: 150, p: 10, c: 15, g: 5, done: true, icon: Apple },
                { time: '02:00 PM', name: 'Almuerzo', kcal: 650, p: 45, c: 55, g: 20, done: true, icon: Droplet },
                { time: '05:30 PM', name: 'Snack Tarde', kcal: 200, p: 15, c: 20, g: 5, done: true, icon: Wheat },
                { time: '09:00 PM', name: 'Cena', kcal: 400, p: 25, c: 20, g: 15, done: true, icon: Utensils }
            ]
        },
        3: {
            metaKcal: 3200, consumidasKcal: 850,
            metaP: 220, consumidasP: 60,
            metaC: 350, consumidasC: 90,
            metaG: 100, consumidasG: 25,
            comidas: [
                { time: '06:30 AM', name: 'Desayuno Fuerte', kcal: 850, p: 60, c: 90, g: 25, done: true, icon: Flame },
                { time: '10:00 AM', name: 'Batido Voluminizador', kcal: 500, p: 40, c: 60, g: 10, done: false, icon: Apple },
                { time: '01:00 PM', name: 'Almuerzo Carga', kcal: 900, p: 65, c: 100, g: 30, done: false, icon: Droplet },
                { time: '04:30 PM', name: 'Pre-Entreno', kcal: 350, p: 15, c: 60, g: 5, done: false, icon: Wheat },
                { time: '09:30 PM', name: 'Cena Recuperación', kcal: 600, p: 40, c: 40, g: 30, done: false, icon: Utensils }
            ]
        },
        4: {
            metaKcal: 2100, consumidasKcal: 0,
            metaP: 140, consumidasP: 0,
            metaC: 200, consumidasC: 0,
            metaG: 70, consumidasG: 0,
            comidas: [
                { time: '07:30 AM', name: 'Desayuno', kcal: 450, p: 30, c: 45, g: 15, done: false, icon: Flame },
                { time: '11:00 AM', name: 'Almuerzo Ligero', kcal: 250, p: 15, c: 30, g: 8, done: false, icon: Apple },
                { time: '01:30 PM', name: 'Comida Principal', kcal: 700, p: 45, c: 65, g: 25, done: false, icon: Droplet },
                { time: '05:00 PM', name: 'Snack Post-Entreno', kcal: 300, p: 30, c: 30, g: 5, done: false, icon: Wheat },
                { time: '08:30 PM', name: 'Cena', kcal: 400, p: 20, c: 30, g: 17, done: false, icon: Utensils }
            ]
        }
    };

    const data = nutricionData[selectedClient];
    const porcentajeKcal = Math.min(100, Math.round((data.consumidasKcal / data.metaKcal) * 100));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            {/* Header del Tab */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff' }}>Hábito Nutricional</h2>
                    <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Audita la adherencia de la dieta diaria de tus clientes</p>
                </div>
                
                {/* Selector de Cliente */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Search size={16} color="#aaa" />
                    <select 
                        value={selectedClient} 
                        onChange={(e) => setSelectedClient(parseInt(e.target.value))}
                        style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '15px', cursor: 'pointer' }}
                    >
                        {clientesMock.map(c => (
                            <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Layout dividido */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '24px', alignItems: 'start' }}>
                
                {/* Columna Izquierda: Plan de Comidas Diario */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '18px' }}>Plan de Comidas del Día</h3>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 24px 0' }}>Distribución en 5 comidas con horarios sugeridos</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.comidas.map((meal, idx) => {
                            const IconComponent = meal.icon;
                            return (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    gap: '16px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {/* Hora y estado */}
                                    <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '16px' }}>
                                        <b style={{ color: meal.done ? '#22c55e' : '#aaa', fontSize: '13px' }}>{meal.time}</b>
                                        {meal.done ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '11px' }}>
                                                <CheckCircle2 size={12} /> Listo
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontSize: '11px' }}>
                                                Pendiente
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Icono de la comida */}
                                    <div style={{ 
                                        width: '40px', height: '40px', 
                                        borderRadius: '10px', 
                                        background: meal.done ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 107, 53, 0.1)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                    }}>
                                        <IconComponent size={20} color={meal.done ? "#22c55e" : "#ff6b35"} />
                                    </div>
                                    
                                    {/* Detalles (Macros y Cals) */}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 6px 0' }}>{meal.name}</h4>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <span style={{ color: '#ff6b35', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Flame size={12}/> {meal.kcal} kcal
                                            </span>
                                            <div style={{ display: 'flex', gap: '10px', color: '#aaa', fontSize: '12px' }}>
                                                <span><b style={{color:'#ccc'}}>P:</b> {meal.p}g</span>
                                                <span><b style={{color:'#ccc'}}>C:</b> {meal.c}g</span>
                                                <span><b style={{color:'#ccc'}}>G:</b> {meal.g}g</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Columna Derecha: Resumen Diario & Macros */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Resumen Total Calórico */}
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Progreso Diario</h3>
                            <Target size={18} color="#ff6b35"/>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h2 style={{ margin: 0, color: '#fff', fontSize: '32px' }}>{data.consumidasKcal} <span style={{fontSize: '16px', color:'#666'}}>/ {data.metaKcal} kcal</span></h2>
                            <h3 style={{ margin: 0, color: '#ff6b35', fontSize: '20px' }}>{porcentajeKcal}%</h3>
                        </div>
                        
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ width: `${porcentajeKcal}%`, height: '100%', background: 'linear-gradient(90deg, #ff6b35, #ff8c42)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                        </div>
                        
                        <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                            {data.metaKcal - data.consumidasKcal > 0 
                                ? `Faltan ${data.metaKcal - data.consumidasKcal} kcal para la meta diaria.` 
                                : `Meta diaria alcanzada.`}
                        </p>
                    </div>

                    {/* Desglose de Macros */}
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px' }}>Macros Acumulados</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Proteina */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                    <span style={{ color: '#aaa' }}>Proteínas</span>
                                    <span style={{ color: '#fff' }}><b>{data.consumidasP}g</b> / {data.metaP}g</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ width: `${Math.min(100, (data.consumidasP/data.metaP)*100)}%`, height: '100%', background: '#ff6b35', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>
                            
                            {/* Carbos */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                    <span style={{ color: '#aaa' }}>Carbohidratos</span>
                                    <span style={{ color: '#fff' }}><b>{data.consumidasC}g</b> / {data.metaC}g</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ width: `${Math.min(100, (data.consumidasC/data.metaC)*100)}%`, height: '100%', background: '#3b82f6', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>

                            {/* Grasas */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                    <span style={{ color: '#aaa' }}>Grasas</span>
                                    <span style={{ color: '#fff' }}><b>{data.consumidasG}g</b> / {data.metaG}g</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ width: `${Math.min(100, (data.consumidasG/data.metaG)*100)}%`, height: '100%', background: '#eab308', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlanNutricionalTab;
