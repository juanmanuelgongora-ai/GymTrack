import React from 'react';
import Icons from '../../logica/Icons';

const LoginView = ({ setView }) => (
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
                    <input className="input-element" placeholder="tu@email.com" />
                </div>
            </div>
            <div className="field-group">
                <label className="field-label">Contraseña</label>
                <div className="input-with-icon">
                    <div className="input-icon"><Icons.Lock /></div>
                    <input className="input-element" type="password" placeholder="••••••••" />
                </div>
            </div>
        </div>
        <button className="btn-primary" style={{ width: '100%' }}>Iniciar Sesión</button>
        <div className="footer-link">
            ¿No tienes cuenta? <span onClick={() => setView('register')}>Regístrate aquí</span>
        </div>
    </div>
);

export default LoginView;
