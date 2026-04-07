import React, { useState } from 'react';
import Icons from '../../logica/Icons';

const LoginView = ({ setView, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'El correo es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Ingrese un correo válido.';
        }
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await onLogin(email, password);
        } catch (error) {
            if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'No se pudo conectar al servidor. Revisa que php artisan serve esté activo.' });
            }
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="auth-card" style={{ maxWidth: 450 }}>
            <div className="logo-container">
                <div className="logo-box"><Icons.Dumbbell /></div>
                <div className="logo-text">GYM TRACK</div>
            </div>
            <h1 className="main-title" style={{ fontSize: '2.2rem' }}>Bienvenido</h1>

            {errors.general && (
                <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                    {errors.general}
                </div>
            )}

            <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <div className="field-group" style={{ marginBottom: 16 }}>
                    <label className="field-label">Correo Electrónico</label>
                    <div className="input-with-icon">
                        <div className="input-icon"><Icons.Mail /></div>
                        <input
                            className="input-element"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined, general: undefined })); }}
                            onKeyDown={handleKeyDown}
                            style={errors.email ? { borderColor: '#ef4444' } : {}}
                        />
                    </div>
                    {errors.email && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.email}</span>}
                </div>
                <div className="field-group">
                    <label className="field-label">Contraseña</label>
                    <div className="input-with-icon">
                        <div className="input-icon"><Icons.Lock /></div>
                        <input
                            className="input-element"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined, general: undefined })); }}
                            onKeyDown={handleKeyDown}
                            style={errors.password ? { borderColor: '#ef4444' } : {}}
                        />
                    </div>
                    {errors.password && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.password}</span>}
                </div>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogin} disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
            <div className="footer-link">
                ¿No tienes cuenta? <span onClick={() => setView('register')}>Regístrate aquí</span>
            </div>
            <div className="footer-link" style={{ marginTop: '10px' }}>
                ¿Eres profesional? <span onClick={() => setView('registerEntrenador')} style={{ color: '#ff6b35', fontWeight: 'bold' }}>Regístrate como Entrenador</span>
            </div>
        </div>
    );
};

export default LoginView;
