import React, { useState } from 'react';
import Icons from '../../logica/Icons';

const LoginView = ({ setView, setUserAuth }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            
            if (res.ok) {
                setUserAuth({ token: data.access_token, user: data.user });
                setView('panel_cliente');
            } else {
                setError(data.message || 'Error en las credenciales');
            }
        } catch (err) {
            // BACKEND OFFLINE FALLBACK: Permitir ingreso simulado para poder ver el diseño
            setUserAuth({ 
                token: 'mock-token', 
                user: { 
                    nombre: 'Samir', 
                    apellido: 'Reyes',
                    email: credentials.email || 'samir@gymtrack.com', 
                    cliente: { peso_kg: 75, altura_cm: 180, edad: 25, imc: 23.15, objetivo_principal: "Ganar masa muscular", sexo: 'M' } 
                } 
            });
            setView('panel_cliente');
            // setError('Error conectando al servidor backend. Revisar si la API está corriendo.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="auth-card" style={{ maxWidth: 450 }}>
        <div className="logo-container">
            <div className="logo-box"><Icons.Dumbbell /></div>
            <div className="logo-text">GYM TRACK</div>
        </div>
        <h1 className="main-title" style={{ fontSize: '2.2rem' }}>Binvenido</h1>
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
            <div className="field-group" style={{ marginBottom: 16 }}>
                <label className="field-label">Correo Electrónico</label>
                <div className="input-with-icon">
                    <div className="input-icon"><Icons.Mail /></div>
                    <input className="input-element" placeholder="tu@email.com" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
                </div>
            </div>
            <div className="field-group">
                <label className="field-label">Contraseña</label>
                <div className="input-with-icon">
                    <div className="input-icon"><Icons.Lock /></div>
                    <input className="input-element" type="password" placeholder="••••••••" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                </div>
            </div>
        </div>
        {error && <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>}
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogin} disabled={loading}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</button>
        <div className="footer-link">
            ¿No tienes cuenta? <span onClick={() => setView('register')}>Regístrate aquí</span>
        </div>
    </div>
    );
};

export default LoginView;
