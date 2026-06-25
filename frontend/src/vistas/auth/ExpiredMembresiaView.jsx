import React from 'react';
import { Lock, CreditCard, LogOut, AlertCircle, Clock } from 'lucide-react';

const ExpiredMembresiaView = ({ userData, transaction, onLogout, onGoToShop }) => {
    const userName = userData?.nombre || 'Miembro';

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '500px',
                width: '100%',
                padding: '48px',
                borderRadius: '32px',
                textAlign: 'center',
                animation: 'slideUp 0.6s ease',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {transaction?.estado === 'pendiente' ? (
                    <>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(255, 140, 66, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto',
                            border: '1px solid rgba(255, 140, 66, 0.3)',
                            boxShadow: '0 0 30px rgba(255, 140, 66, 0.2)'
                        }}>
                            <Clock size={40} color="#ff8c42" />
                        </div>

                        <h1 className="glow-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>Pago en Verificación</h1>
                        <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '32px' }}>
                            Hola <span style={{ color: 'white', fontWeight: 'bold' }}>{userName}</span>, hemos registrado tu transferencia. Un administrador verificará tu pago y activará tu membresía pronto.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                className="secondary-btn"
                                onClick={onLogout}
                                style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(255, 77, 77, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto',
                            border: '1px solid rgba(255, 77, 77, 0.3)',
                            boxShadow: '0 0 30px rgba(255, 77, 77, 0.2)'
                        }}>
                            <Lock size={40} color="#ff4d4d" />
                        </div>

                        <h1 className="glow-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>Acceso Restringido</h1>
                        <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '32px' }}>
                            Hola <span style={{ color: 'white', fontWeight: 'bold' }}>{userName}</span>, tu membresía ha vencido. Para seguir disfrutando de las funcionalidades de GymTrack y mantener tus progresos, por favor renueva tu plan.
                        </p>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '20px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            textAlign: 'left',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <AlertCircle color="#ff8c42" size={24} />
                            <div style={{ fontSize: '14px', color: '#ccc' }}>
                                Tus datos y rutinas siguen guardados, pero tu perfil no será visible para los entrenadores hasta que renueves.
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                className="primary-btn pulse-glow"
                                onClick={onGoToShop}
                                style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: '800' }}
                            >
                                <CreditCard size={20} />
                                Renovar Membresía Ahora
                            </button>

                            <button
                                className="secondary-btn"
                                onClick={onLogout}
                                style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .glow-text {
                    background: linear-gradient(to right, #fff, #888);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default ExpiredMembresiaView;
