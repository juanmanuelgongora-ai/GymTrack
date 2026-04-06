import React, { useState } from 'react';
import Icons from '../../logica/Icons';

const LoginView = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Se logueó correctamente!");
                console.log("Token secreto de sesión:", data.access_token);
                setView('shop');
            } else {
                alert("Error al iniciar sesión: " + (data.message || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error conectando al servidor:", error);
            alert("No se pudo conectar al servidor de Laravel. Revisa que 'php artisan serve' esté activo.");
        }
    };

    return (
        <div className="auth-card" style={{ maxWidth: 450 }}>
            <div className="logo-container">
                <div className="logo-box"><Icons.Dumbbell /></div>
                <div className="logo-text">GYM TRACK</div>
            </div>
            <h1 className="main-title" style={{ fontSize: '2.2rem' }}>Bienvenido</h1>
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <div className="field-group" style={{ marginBottom: 16 }}>
                    <label className="field-label">Correo Electrónico</label>
                    <div className="input-with-icon">
                        <div className="input-icon"><Icons.Mail /></div>
                        <input
                            className="input-element"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogin}>Iniciar Sesión</button>
            <div className="footer-link">
                ¿No tienes cuenta? <span onClick={() => setView('register')}>Regístrate aquí</span>
            </div>
        </div>
    );
};

export default LoginView;
